import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected route - requires user to be logged in
router.get("/me", protectRoute, getCurrentUser);

export default router;
