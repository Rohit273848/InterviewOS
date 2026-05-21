import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        throw new ApiError(400, "Please provide all required fields");
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(409, "User with this email already exists");
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        // Generate JWT and set cookie
        generateToken(user._id, res);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } else {
        throw new ApiError(500, "Invalid user data received");
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please provide email and password");
    }

    // Find user (we need to explicitly select password because it's set to select: false in schema)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Check if password is correct
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Generate JWT and set cookie
    generateToken(user._id, res);

    // Remove password before sending response
    user.password = undefined;

    res.status(200).json({
        success: true,
        message: "Logged in successfully",
        data: user,
    });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res) => {
    // Clear the cookie by setting maxAge to 0
    res.cookie("jwt", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = asyncHandler(async (req, res) => {
    // req.user is set by the protectRoute middleware
    res.status(200).json({
        success: true,
        data: req.user,
    });
});
