import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));

// Middleware4
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes
import authRoutes from "./routes/auth.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import mockInterviewRoutes from "./routes/mockInterview.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/mock-interview", mockInterviewRoutes);

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
