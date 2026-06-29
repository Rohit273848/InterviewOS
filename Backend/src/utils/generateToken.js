import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
    // 1. Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // 2. Set token in HTTP-only cookie
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true, // Prevents XSS attacks (Cross-Site Scripting)
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none", // Prevents CSRF attacks (Cross-Site Request Forgery)
        secure: process.env.NODE_ENV !== "development", // Cookie only works on HTTPS in production
    });
};

export default generateToken;
