import { ApiError } from "../utils/ApiError.js";

/**
 * Validates a GitHub repository URL and extracts the owner and repository name.
 * Supports standard URLs, trailing slashes, .git extensions, query params, and anchors.
 * 
 * @param {string} url - The GitHub repository URL.
 * @returns {object} { owner, repo }
 * @throws {ApiError} 400 if validation fails.
 */
export const validateAndExtractGithubUrl = (url) => {
    if (!url || typeof url !== "string") {
        throw new ApiError(400, "Invalid URL: GitHub URL must be a non-empty string");
    }

    // Clean query parameters and hash anchors, then trim trailing slashes
    let cleanUrl = url.split("?")[0].split("#")[0].trim().replace(/\/$/, "");

    // Regular expression for matching github.com/owner/repo
    const regex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/]+)$/i;
    const match = cleanUrl.match(regex);

    if (!match) {
        throw new ApiError(400, "Invalid GitHub repository URL format. Use format: https://github.com/owner/repo");
    }

    const owner = match[1];
    let repo = match[2];

    // Strip .git extension if present
    if (repo.endsWith(".git")) {
        repo = repo.slice(0, -4);
    }

    if (!owner || !repo) {
        throw new ApiError(400, "Could not extract owner or repository name from URL");
    }

    return { owner, repo };
};

/**
 * Builds HTTP headers for GitHub API requests.
 * Attaches token if provided explicitly or in the environment variables.
 * Note: A User-Agent is strictly required by the GitHub API.
 * 
 * @param {string|null} token - Optional Personal Access Token.
 * @returns {object} Headers object.
 */
const getHeaders = (token) => {
    const headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "InterviewOS-Backend",
    };

    const githubToken = token || process.env.GITHUB_TOKEN;
    if (githubToken) {
        headers["Authorization"] = `Bearer ${githubToken}`;
    }

    return headers;
};

/**
 * Helper to inspect response, extract rate limits, and throw standardized ApiError if appropriate.
 * 
 * @param {Response} response - The fetch Response object.
 * @throws {ApiError} Appropriate API error status and message.
 */
const checkResponseErrors = async (response) => {
    if (response.ok) return;

    const limitRemaining = response.headers.get("x-ratelimit-remaining");
    const limitReset = response.headers.get("x-ratelimit-reset");

    if (response.status === 403) {
        // Check if rate limited
        if (limitRemaining === "0") {
            const resetTime = new Date(parseInt(limitReset) * 1000).toLocaleTimeString();
            throw new ApiError(
                429,
                `GitHub API rate limit exceeded. Try again after ${resetTime}.`
            );
        }
        throw new ApiError(403, "Access to GitHub API is forbidden. You might be rate-limited or require a token.");
    }

    if (response.status === 404) {
        throw new ApiError(
            404,
            "GitHub repository not found. If this is a private repository, please check your credentials and token."
        );
    }

    if (response.status === 401) {
        throw new ApiError(401, "GitHub Personal Access Token is unauthorized or expired.");
    }

    let errorMsg = `GitHub API Error: ${response.statusText}`;
    try {
        const body = await response.json();
        if (body.message) {
            errorMsg = body.message;
        }
    } catch (_) {
        // Keep statusText if JSON parsing fails
    }

    throw new ApiError(response.status, errorMsg);
};

/**
 * Fetches basic repository metadata from the GitHub API.
 * 
 * @param {string} owner - Repo owner.
 * @param {string} repo - Repo name.
 * @param {string|null} token - Optional PAT token.
 * @returns {Promise<object>} Repository metadata object.
 */
export const fetchRepoMetadata = async (owner, repo, token = null) => {
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    const headers = getHeaders(token);

    try {
        const response = await fetch(url, { headers });
        await checkResponseErrors(response);
        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to fetch repository metadata: ${error.message}`);
    }
};

/**
 * Fetches repository README content and decodes it from base64.
 * Gracefully returns an empty string if README is not found.
 * 
 * @param {string} owner - Repo owner.
 * @param {string} repo - Repo name.
 * @param {string|null} token - Optional PAT token.
 * @returns {Promise<string>} README text content.
 */
export const fetchReadmeContent = async (owner, repo, token = null) => {
    const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const headers = getHeaders(token);

    try {
        const response = await fetch(url, { headers });

        if (response.status === 404) {
            // A repository without a README returns 404 on the readme endpoint
            return "";
        }

        await checkResponseErrors(response);
        const data = await response.json();

        if (data.content && data.encoding === "base64") {
            // Clean newlines/whitespaces from base64 string
            const cleanBase64 = data.content.replace(/\s/g, "");
            return Buffer.from(cleanBase64, "base64").toString("utf-8");
        }

        return "";
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to fetch repository README: ${error.message}`);
    }
};

/**
 * Fetches repository languages.
 * Gracefully returns an empty object if endpoint returns 404.
 * 
 * @param {string} owner - Repo owner.
 * @param {string} repo - Repo name.
 * @param {string|null} token - Optional PAT token.
 * @returns {Promise<object>} Map of language name to bytes written.
 */
export const fetchLanguages = async (owner, repo, token = null) => {
    const url = `https://api.github.com/repos/${owner}/${repo}/languages`;
    const headers = getHeaders(token);

    try {
        const response = await fetch(url, { headers });

        if (response.status === 404) {
            return {};
        }

        await checkResponseErrors(response);
        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to fetch languages: ${error.message}`);
    }
};

/**
 * Orchestrator function to validate URL, fetch metadata, README, and languages concurrently,
 * and format the final project prep data.
 * 
 * @param {string} url - GitHub repository URL.
 * @param {string|null} token - Optional Personal Access Token.
 * @returns {Promise<object>} Formatted project prep data.
 */
export const getGithubRepoDetails = async (url, token = null) => {
    const { owner, repo } = validateAndExtractGithubUrl(url);

    try {
        const [metadata, readme, languagesMap] = await Promise.all([
            fetchRepoMetadata(owner, repo, token),
            fetchReadmeContent(owner, repo, token),
            fetchLanguages(owner, repo, token),
        ]);

        const languages = Object.keys(languagesMap || {});

        return {
            repoName: metadata.name,
            description: metadata.description || "",
            languages,
            topics: metadata.topics || [],
            readmeContent: readme,
        };
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Error gathering repository details: ${error.message}`);
    }
};
