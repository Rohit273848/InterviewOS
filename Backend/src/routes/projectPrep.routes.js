import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { 
    generateQuestions, 
    getHistoryList, 
    getSessionDetail, 
    deleteSessionRecord 
} from "../controllers/projectPrep.controller.js";

const router = Router();

// Apply auth middleware to protect all routes under /api/project-prep
router.use(protectRoute);

// Generate interview questions from GitHub URL
router.post("/generate", generateQuestions);

// Fetch all historical project prep runs
router.get("/history", getHistoryList);

// Fetch details for a specific project prep session
router.get("/:sessionId", getSessionDetail);

// Delete a project prep session
router.delete("/:sessionId", deleteSessionRecord);

export default router;
