import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as mockInterviewService from "../services/mockInterview.service.js";

/**
 * Controller managing HTTP mappings, input validations, and ApiResponse formatting.
 */

// @desc    Start mock interview session and batch generate questions
// @route   POST /api/mock-interview/start
// @access  Private
export const startSession = asyncHandler(async (req, res) => {
    const {
        jobDescription,
        resumeText,
        selfDescription,
        candidateWeaknesses,
        interviewType,
        difficulty,
        questionCount
    } = req.body;

    // Validate essential parameters
    if (!jobDescription || !jobDescription.trim()) {
        throw new ApiError(400, "Job Description is required");
    }
    if (!resumeText || !resumeText.trim()) {
        throw new ApiError(400, "Resume Text is required");
    }
    if (!interviewType) {
        throw new ApiError(400, "Interview Type is required");
    }
    if (!difficulty) {
        throw new ApiError(400, "Difficulty level is required");
    }

    // Set count constraints
    const parsedCount = parseInt(questionCount, 10) || 5;

    const sessionData = await mockInterviewService.createSession({
        userId: req.user._id,
        jobDescription: jobDescription.trim(),
        resumeText: resumeText.trim(),
        selfDescription: selfDescription ? selfDescription.trim() : "",
        candidateWeaknesses: candidateWeaknesses ? candidateWeaknesses.trim() : "",
        interviewType,
        difficulty,
        questionCount: parsedCount
    });

    return res.status(201).json(
        new ApiResponse(201, sessionData, "Mock interview session initialized successfully")
    );
});

// @desc    Submit user answer for a specific question
// @route   POST /api/mock-interview/session/:id/answer
// @access  Private
export const postAnswer = asyncHandler(async (req, res) => {
    const sessionId = req.params.id;
    const { questionId, answerText, isSkipped } = req.body;

    if (!questionId) {
        throw new ApiError(400, "Question ID is required to match answer");
    }

    const submissionResult = await mockInterviewService.submitAnswer({
        userId: req.user._id,
        sessionId,
        questionId,
        answerText: answerText ? answerText.trim() : "",
        isSkipped: !!isSkipped
    });

    return res.status(200).json(
        new ApiResponse(200, submissionResult, "Answer submitted successfully")
    );
});

// @desc    Trigger AI evaluation on completed session and aggregate scores
// @route   POST /api/mock-interview/session/:id/complete
// @access  Private
export const completeSession = asyncHandler(async (req, res) => {
    const sessionId = req.params.id;

    const evaluationResult = await mockInterviewService.completeSession({
        userId: req.user._id,
        sessionId
    });

    return res.status(200).json(
        new ApiResponse(200, evaluationResult, "Mock interview session compiled successfully")
    );
});

// @desc    Get populated evaluation report
// @route   GET /api/mock-interview/session/:id/report
// @access  Private
export const getSessionReport = asyncHandler(async (req, res) => {
    const sessionId = req.params.id;

    const reportData = await mockInterviewService.getSessionReport({
        userId: req.user._id,
        sessionId
    });

    return res.status(200).json(
        new ApiResponse(200, reportData, "Mock interview report retrieved successfully")
    );
});

// @desc    Get user's past completed mock sessions list
// @route   GET /api/mock-interview/history
// @access  Private
export const getHistory = asyncHandler(async (req, res) => {
    const historyList = await mockInterviewService.getHistory({
        userId: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, historyList, "Mock interview history retrieved successfully")
    );
});

// @desc    Get aggregated analytics profile
// @route   GET /api/mock-interview/analytics
// @access  Private
export const getAnalytics = asyncHandler(async (req, res) => {
    const analyticsProfile = await mockInterviewService.getAnalytics({
        userId: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, analyticsProfile, "Mock interview analytics retrieved successfully")
    );
});
