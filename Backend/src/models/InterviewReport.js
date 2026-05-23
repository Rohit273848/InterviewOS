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
