import mongoose from "mongoose";

const mockInterviewAnswerSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MockInterviewSession",
            required: true,
            index: true, // Crucial for querying all answers for a specific session
        },
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MockInterviewQuestion",
            required: true,
            unique: true, // Prevents duplicate answers from being recorded for the same question
        },
        answerText: {
            type: String,
            default: "",
            trim: true,
        },
        isSkipped: {
            type: Boolean,
            default: false,
            required: true,
        },
        score: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        strengths: {
            type: [String],
            default: [],
        },
        weaknesses: {
            type: [String],
            default: [],
        },
        betterAnswer: {
            type: String,
            trim: true,
            default: "",
        },
        categoryScores: {
            relevance: { type: Number, min: 0, max: 100, default: 0 },
            technicalAccuracy: { type: Number, min: 0, max: 100, default: 0 },
            communication: { type: Number, min: 0, max: 100, default: 0 },
            confidence: { type: Number, min: 0, max: 100, default: 0 },
            structure: { type: Number, min: 0, max: 100, default: 0 },
            problemSolving: { type: Number, min: 0, max: 100, default: 0 },
        }
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Compound index to optimize querying answers per session
mockInterviewAnswerSchema.index({ sessionId: 1, createdAt: 1 });

export const MockInterviewAnswer = mongoose.model("MockInterviewAnswer", mockInterviewAnswerSchema);
