import { InterviewReport } from "../models/InterviewReport.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { extractTextFromPDF } from "../services/pdf.service.js";
import { generateInterviewStrategy } from "../services/ai.service.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

// @desc    Generate Interview Strategy
// @route   POST /api/interview/generate
// @access  Private
export const generateStrategy = asyncHandler(async (req, res) => {
    const { jobDescription, selfDescription } = req.body;
    
    if (!jobDescription || !selfDescription) {
        throw new ApiError(400, "Job description and self description are required");
    }

    if (!req.file) {
        throw new ApiError(400, "Resume PDF file is required");
    }

    const resumeLocalPath = req.file.path;

    // 1. Extract Text from PDF
    const resumeText = await extractTextFromPDF(resumeLocalPath);

    // 2. Upload PDF to Cloudinary (optional but good for /resume endpoint)
    const resumeCloudinary = await uploadOnCloudinary(resumeLocalPath);
    
    // Provide a fallback URL if cloudinary upload fails (e.g. missing credentials)
    const resumeUrl = resumeCloudinary ? resumeCloudinary.secure_url : "https://res.cloudinary.com/demo/image/upload/sample.pdf";

    // 3. Generate AI Report
    const aiReport = await generateInterviewStrategy(jobDescription, resumeText, selfDescription);

    // 4. Save Report in Database
    const report = await InterviewReport.create({
        userId: req.user._id,
        jobDescription,
        selfDescription,
        resumeText,
        resumeUrl,
        matchScore: aiReport.matchScore,
        technicalQuestions: aiReport.technicalQuestions,
        behavioralQuestions: aiReport.behavioralQuestions,
        preparationPlan: aiReport.preparationPlan,
        skillGaps: aiReport.skillGaps,
    });

    return res.status(201).json(
        new ApiResponse(201, report, "Interview strategy generated successfully")
    );
});

// @desc    Get Interview Report by ID
// @route   GET /api/interview/:id
// @access  Private
export const getReportById = asyncHandler(async (req, res) => {
    const report = await InterviewReport.findOne({
        _id: req.params.id,
        userId: req.user._id,
    });

    if (!report) {
        throw new ApiError(404, "Interview report not found");
    }

    return res.status(200).json(
        new ApiResponse(200, report, "Interview report retrieved successfully")
    );
});

// @desc    Get Resume URL by Interview ID
// @route   GET /api/interview/:id/resume
// @access  Private
export const getResumePdf = asyncHandler(async (req, res) => {
    const report = await InterviewReport.findOne({
        _id: req.params.id,
        userId: req.user._id,
    });

    if (!report) {
        throw new ApiError(404, "Interview report not found");
    }

    return res.status(200).json(
        new ApiResponse(200, { resumeUrl: report.resumeUrl }, "Resume URL retrieved successfully")
    );
});
