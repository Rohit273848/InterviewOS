import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protectRoute = asyncHandler(async (req, res, next) => {
    try {
        // 1. Get token from cookies
        const token = req.cookies.jwt;

        if (!token) {
            throw new ApiError(401, "Unauthorized - No token provided");
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            throw new ApiError(401, "Unauthorized - Invalid token");
        }

        // 3. Find user by id (excluding password)
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // 4. Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Unauthorized - Token expired");
        }
        throw error;
    }
});
