import mongoose from "mongoose";

const projectPrepSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },
        githubUrl: {
            type: String,
            required: [true, "GitHub URL is required"],
            trim: true,
        },
        repoName: {
            type: String,
            required: [true, "Repository name is required"],
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        languages: {
            type: [String],
            default: [],
        },
        topics: {
            type: [String],
            default: [],
        },
        readmeContent: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["pending", "fetching", "completed", "failed"],
            default: "pending",
            lowercase: true,
        },
        generatedQuestions: [
            {
                question: { type: String, required: true },
                category: { type: String, required: true },
                difficulty: { type: String, required: true },
                hint: { type: String, default: "" }
            }
        ],
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Compound index for optimizing queries of sessions for a user sorted by creation time
projectPrepSessionSchema.index({ userId: 1, createdAt: -1 });

export const ProjectPrepSession = mongoose.model("ProjectPrepSession", projectPrepSessionSchema);
