import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true, // Allow cookies to be sent
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes
import authRoutes from "./routes/auth.routes.js";
app.use("/api/auth", authRoutes);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
    });
});

export { app };
