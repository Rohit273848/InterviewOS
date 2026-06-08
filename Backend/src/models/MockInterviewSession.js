import mongoose from "mongoose";

const mockInterviewSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true, // Crucial for querying all sessions belonging to a specific user
        },
        jobDescription: {
            type: String,
            required: true,
            trim: true,
        },
        resumeText: {
            type: String,
            required: true,
            trim: true,
        },
        selfDescription: {
            type: String,
            default: "",
            trim: true,
        },
        candidateWeaknesses: {
            type: String,
            default: "",
            trim: true,
        },
        interviewType: {
            type: String,
            enum: ["behavioral", "technical", "system-design"],
            required: true,
            lowercase: true,
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
            lowercase: true,
        },
        questionCount: {
            type: Number,
            required: true,
            min: [1, "An interview must have at least 1 question"],
            max: [20, "An interview can have at most 20 questions"],
            default: 5,
        },
        currentQuestionIndex: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        status: {
            type: String,
            enum: ["started", "active", "evaluating", "completed", "failed"],
            required: true,
            default: "started",
            lowercase: true,
        },
        overallScore: {
            type: Number,
            min: 0,
            max: 100,
            default: null,
        },
        categoryScores: {
            relevance: { type: Number, min: 0, max: 100, default: null },
            technicalAccuracy: { type: Number, min: 0, max: 100, default: null },
            communication: { type: Number, min: 0, max: 100, default: null },
            confidence: { type: Number, min: 0, max: 100, default: null },
            structure: { type: Number, min: 0, max: 100, default: null },
            problemSolving: { type: Number, min: 0, max: 100, default: null },
        },
        keyImprovementAreas: {
            type: [String],
            default: [],
        },
        actionPlan: [
            {
                step: { type: Number, required: true },
                topic: { type: String, required: true, trim: true },
                details: { type: String, required: true, trim: true },
            }
        ]
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for fetching questions directly from a session
mockInterviewSessionSchema.virtual("questions", {
    ref: "MockInterviewQuestion",
    localField: "_id",
    foreignField: "sessionId",
});

// Virtual for fetching answers directly from a session
mockInterviewSessionSchema.virtual("answers", {
    ref: "MockInterviewAnswer",
    localField: "_id",
    foreignField: "sessionId",
});

// Compound Index for analytics and history fetching
// Optimizes fetching sessions of a particular status (e.g., completed) for a user, sorted by date
mockInterviewSessionSchema.index({ userId: 1, status: 1, createdAt: -1 });

// Optimizes checking progress trends (overall score over time) for a user
mockInterviewSessionSchema.index({ userId: 1, createdAt: -1, overallScore: 1 });

export const MockInterviewSession = mongoose.model("MockInterviewSession", mockInterviewSessionSchema);
