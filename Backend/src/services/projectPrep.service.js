import { ProjectPrepSession } from "../models/ProjectPrepSession.js";
import { getGithubRepoDetails, validateAndExtractGithubUrl } from "./github.service.js";
import { generateProjectPrepQuestions } from "./projectPrepAI.service.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Validates the GitHub URL, fetches repository details and README,
 * calls the AI service to generate interview questions, and saves the session.
 * 
 * @param {object} params
 * @param {string} params.userId - Owner of the session.
 * @param {string} params.githubUrl - GitHub repository URL.
 * @param {string|null} params.token - Optional GitHub Personal Access Token.
 * @returns {Promise<object>} The completed Project Prep Session document.
 * @throws {ApiError} Appropriate error message and status code.
 */
export const generateProjectQuestions = async ({ userId, githubUrl, token = null }) => {
    if (!userId || !githubUrl) {
        throw new ApiError(400, "Missing required parameters: userId and githubUrl are required");
    }

    let sessionDoc = null;

    try {
        // Pre-validate the URL format and extract repository details to ensure URL is valid before DB write
        const { owner, repo } = validateAndExtractGithubUrl(githubUrl);

        // 1. Initialize a pending session document in the database
        sessionDoc = await ProjectPrepSession.create({
            userId,
            githubUrl,
            repoName: repo,
            status: "pending"
        });

        // Update status to fetching metadata
        sessionDoc.status = "fetching";
        await sessionDoc.save();

        // 2. Fetch Repository Metadata & README Content
        const repoDetails = await getGithubRepoDetails(githubUrl, token);

        // 3. Generate AI interview questions using the repository details
        const aiResult = await generateProjectPrepQuestions({
            repoName: repoDetails.repoName,
            repoDescription: repoDetails.description,
            languages: repoDetails.languages,
            topics: repoDetails.topics,
            readmeContent: repoDetails.readmeContent
        });

        if (!aiResult || !aiResult.questions || aiResult.questions.length === 0) {
            throw new Error("AI service returned empty or invalid questions structure");
        }

        // 4. Populate details and transition status to completed
        sessionDoc.repoName = repoDetails.repoName;
        sessionDoc.description = repoDetails.description;
        sessionDoc.languages = repoDetails.languages;
        sessionDoc.topics = repoDetails.topics;
        sessionDoc.readmeContent = repoDetails.readmeContent;
        sessionDoc.generatedQuestions = aiResult.questions;
        sessionDoc.status = "completed";

        await sessionDoc.save();

        return sessionDoc;
    } catch (error) {
        // Update session status to failed if initialized
        if (sessionDoc) {
            console.error(`Updating session ${sessionDoc._id} status to failed due to error.`);
            sessionDoc.status = "failed";
            await sessionDoc.save();
        }

        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to generate project questions: ${error.message}`);
    }
};

/**
 * Retrieves a single project preparation session by ID.
 * 
 * @param {object} params
 * @param {string} params.userId - Owner of the session.
 * @param {string} params.sessionId - The ID of the session.
 * @returns {Promise<object>} The Project Prep Session document.
 * @throws {ApiError} 404 if not found or unauthorized.
 */
export const getSession = async ({ userId, sessionId }) => {
    if (!userId || !sessionId) {
        throw new ApiError(400, "Missing required parameters: userId and sessionId are required");
    }

    const session = await ProjectPrepSession.findOne({ _id: sessionId, userId });
    if (!session) {
        throw new ApiError(404, "Project preparation session not found or access denied");
    }

    return session;
};

/**
 * Fetches completed project prep histories for a user.
 * 
 * @param {object} params
 * @param {string} params.userId - Owner of the sessions.
 * @returns {Promise<Array<object>>} List of completed session documents.
 */
export const getHistory = async ({ userId }) => {
    if (!userId) {
        throw new ApiError(400, "userId is required to fetch history");
    }

    return await ProjectPrepSession.find(
        { userId, status: "completed" },
        "repoName githubUrl description languages topics status createdAt"
    ).sort({ createdAt: -1 });
};

/**
 * Deletes a project preparation session.
 * 
 * @param {object} params
 * @param {string} params.userId - Owner of the session.
 * @param {string} params.sessionId - The ID of the session to delete.
 * @returns {Promise<object>} Deletion confirmation status.
 * @throws {ApiError} 404 if session not found or unauthorized.
 */
export const deleteSession = async ({ userId, sessionId }) => {
    if (!userId || !sessionId) {
        throw new ApiError(400, "Missing required parameters: userId and sessionId are required");
    }

    const session = await ProjectPrepSession.findOneAndDelete({ _id: sessionId, userId });
    if (!session) {
        throw new ApiError(404, "Project preparation session not found or access denied");
    }

    return {
        success: true,
        message: "Project preparation session deleted successfully",
        deletedSessionId: sessionId
    };
};
