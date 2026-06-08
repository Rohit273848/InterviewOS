import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { 
    startSession, 
    postAnswer, 
    completeSession, 
    getSessionReport, 
    getHistory, 
    getAnalytics 
} from "../controllers/mockInterview.controller.js";

const router = Router();

// Secure all endpoints with authentication middleware
router.use(protectRoute);

// Mock Interview Session Operations
router.post("/start", startSession);
router.post("/session/:id/answer", postAnswer);
router.post("/session/:id/complete", completeSession);

// Reports & Histories Retrieval
router.get("/session/:id/report", getSessionReport);
router.get("/history", getHistory);
router.get("/analytics", getAnalytics);

export default router;
