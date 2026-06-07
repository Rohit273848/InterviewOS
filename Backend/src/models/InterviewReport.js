import mongoose from "mongoose";

const interviewReportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        jobDescription: {
            type: String,
            required: true,
        },
        selfDescription: {
            type: String,
            required: true,
        },
        candidateWeaknesses: {
            type: String,
            default: "",
        },
        resumeText: {
            type: String,
            required: true,
        },
        resumeUrl: {
            type: String,
            required: true,
        },
        matchScore: {
            type: Number,
            required: true,
        },
        atsScore: {
            type: Number,
        },
        candidateFitScore: {
            type: Number,
        },
        strengths: [String],
        weaknesses: [String],
        missingSkills: [
            {
                skill: String,
                importance: String,
                reason: String,
            },
        ],
        atsKeywordAnalysis: {
            matchedKeywords: [String],
            missingKeywords: [String],
            keywordCoveragePercentage: Number,
        },
        additions: [
            {
                item: String,
                reason: String,
                example: String,
            },
        ],
        removals: [
            {
                item: String,
                reason: String,
            },
        ],
        recommendedProjects: [
            {
                projectName: String,
                reason: String,
                skillsCovered: [String],
            },
        ],
        atsImprovementPlan: [String],
        roadmap: {
            immediate: [String],
            shortTerm: [String],
            mediumTerm: [String],
            longTerm: [String],
        },
        // Old fields for backward compatibility
        technicalQuestions: [
            {
                question: String,
                intention: String,
                answer: String,
            },
        ],
        behavioralQuestions: [
            {
                question: String,
                intention: String,
                answer: String,
            },
        ],
        preparationPlan: [
            {
                day: Number,
                focus: String,
                tasks: [String],
            },
        ],
        skillGaps: [
            {
                skill: String,
                severity: String,
            },
        ],
    },
    { timestamps: true }
);

export const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema);
