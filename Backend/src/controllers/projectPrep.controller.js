import { 
    generateProjectQuestions, 
    getSession, 
    getHistory, 
    deleteSession 
} from "../services/projectPrep.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Generate Project Prep Questions
// @route   POST /api/project-prep/generate
// @access  Private
export const generateQuestions = asyncHandler(async (req, res) => {
    const { githubUrl } = req.body;
    // Extract optional token from custom header or request body
    const token = req.headers["x-github-token"] || req.body.token || null;

    if (!githubUrl) {
        throw new ApiError(400, "GitHub repository URL is required");
    }

    const session = await generateProjectQuestions({
        userId: req.user._id,
        githubUrl,
        token
    });

    return res.status(201).json(
        new ApiResponse(201, session, "Project preparation questions generated successfully")
    );
});

// @desc    Get Project Prep History
// @route   GET /api/project-prep/history
// @access  Private
export const getHistoryList = asyncHandler(async (req, res) => {
    const history = await getHistory({
        userId: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, history, "Project preparation history retrieved successfully")
    );
});

// @desc    Get Project Prep Session Detail
// @route   GET /api/project-prep/:sessionId
// @access  Private
export const getSessionDetail = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        throw new ApiError(400, "Session ID is required");
    }

    const session = await getSession({
        userId: req.user._id,
        sessionId
    });

    return res.status(200).json(
        new ApiResponse(200, session, "Project preparation session retrieved successfully")
    );
});

// @desc    Delete Project Prep Session
// @route   DELETE /api/project-prep/:sessionId
// @access  Private
export const deleteSessionRecord = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        throw new ApiError(400, "Session ID is required");
    }

    const result = await deleteSession({
        userId: req.user._id,
        sessionId
    });

    return res.status(200).json(
        new ApiResponse(200, result, "Project preparation session deleted successfully")
    );
});
