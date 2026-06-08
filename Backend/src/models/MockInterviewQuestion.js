import mongoose from "mongoose";

const mockInterviewQuestionSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MockInterviewSession",
            required: true,
            index: true, // Crucial for fetching all questions associated with an interview session
        },
        questionNumber: {
            type: Number,
            required: true,
            min: 1,
        },
        questionText: {
            type: String,
            required: true,
            trim: true,
        },
        hint: {
            type: String,
            default: "",
            trim: true,
        },
        source: {
            type: String,
            enum: ["jobDescription", "resume", "weaknesses", "selfDescription", "general"],
            required: true,
        }
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for linking to the answer of this question (if submitted)
mockInterviewQuestionSchema.virtual("answer", {
    ref: "MockInterviewAnswer",
    localField: "_id",
    foreignField: "questionId",
    justOne: true,
});

// Compound index to ensure question ordering is fast and unique per session
mockInterviewQuestionSchema.index({ sessionId: 1, questionNumber: 1 }, { unique: true });

export const MockInterviewQuestion = mongoose.model("MockInterviewQuestion", mockInterviewQuestionSchema);
