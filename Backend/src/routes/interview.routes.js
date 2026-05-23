import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
    generateStrategy,
    getReportById,
    getResumePdf,
} from "../controllers/interview.controller.js";

const router = Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// Generate Strategy
router.post("/generate", upload.single("resume"), generateStrategy);

// Get Report by ID
router.get("/:id", getReportById);

// Get Resume PDF URL by Report ID
router.get("/:id/resume", getResumePdf);

export default router;
