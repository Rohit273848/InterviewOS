import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { projectPrepPromptTemplate } from "../prompts/projectPrep.prompt.js";
import { ApiError } from "../utils/ApiError.js";

// ================= ZOD SCHEMA & PARSER =================

const projectPrepOutputSchema = z.object({
    questions: z.array(
        z.object({
            question: z.string().describe("The interview question. Must directly reference specific aspects of this repository. Keep it simple, highly focused on one key concept, and avoid multi-part/compound questions."),
            category: z.enum([
                "Architecture",
                "Database",
                "Security",
                "Performance",
                "Scalability",
                "Deployment",
                "Tradeoffs"
            ]).describe("The category of the question."),
            difficulty: z.enum(["Easy", "Medium", "Hard"]).describe("The difficulty level of the question."),
            hint: z.string().describe("A short, concise hint (1-2 sentences max) outlining the key talking points or terms the candidate should cover.")
        })
    ).describe("A list of customized, project-specific interview questions.")
});

const parser = StructuredOutputParser.fromZodSchema(projectPrepOutputSchema);

// ================= MODEL LOADER HELPER =================

const getGenerativeModel = () => {
    if (!process.env.GOOGLE_API_KEY) {
        console.warn("⚠️ GOOGLE_API_KEY is missing from environment. Using local mock fallbacks.");
        return null;
    }
    const apiKey = process.env.GOOGLE_API_KEY.trim();
    if (!apiKey) {
        console.warn("⚠️ GOOGLE_API_KEY is blank. Using local mock fallbacks.");
        return null;
    }

    if (apiKey.startsWith("AQ.")) {
        console.warn("⚠️ WARNING: GOOGLE_API_KEY starts with 'AQ.'. Standard AI Studio APIs do not support OAuth tokens and will fail with 401. Replace this with a standard key starting with 'AIzaSy' in your Backend/.env file.");
    }

    return new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey,
        temperature: 0.3,
        maxRetries: 3, // Built-in LangChain retry support for network errors
    });
};

// ================= MOCK FALLBACK GENERATOR =================

/**
 * Dynamically constructs a mock interview questions payload tailored to the repository details.
 */
const generateMockQuestionsFallback = (repoName, languages = []) => {
    const mainLang = languages.length > 0 ? languages[0] : "JavaScript/TypeScript";
    
    return {
        questions: [
            {
                question: `Based on your repository '${repoName}', how did you organize the project architecture, and what folder structure did you choose to maintain readability in ${mainLang}?`,
                category: "Architecture",
                difficulty: "Medium",
                hint: "Explain the directory layout (controllers, services, routes, models) and why you separated these concerns."
            },
            {
                question: `In '${repoName}', what database model or data persistence layer did you implement, and how does its schema support the main features of your application?`,
                category: "Database",
                difficulty: "Medium",
                hint: "Detail the choice of database (SQL/NoSQL), how relations or collections are configured, and any indexing choices made."
            },
            {
                question: `How does '${repoName}' handle authorization, authentication, or basic input validation to keep user data secure?`,
                category: "Security",
                difficulty: "Hard",
                hint: "Discuss JWT tokens, password hashing (e.g. bcrypt), CORS policies, or Express validation middleware if applicable."
            },
            {
                question: `What performance considerations did you keep in mind while developing '${repoName}', and how would you optimize database queries or UI rendering times?`,
                category: "Performance",
                difficulty: "Medium",
                hint: "Mention techniques like query pagination, lazy loading, caching (e.g. Redis), or asset bundler optimizations."
            },
            {
                question: `If the traffic to '${repoName}' scaled to 10,000 concurrent users, what would be the primary bottlenecks in your backend, and how would you resolve them?`,
                category: "Scalability",
                difficulty: "Hard",
                hint: "Analyze database connection limits, CPU-intensive tasks, and solutions like horizontal scaling, load balancing, or message queues."
            },
            {
                question: `How is '${repoName}' deployed, and how have you configured the CI/CD pipeline or environment variable configurations?`,
                category: "Deployment",
                difficulty: "Easy",
                hint: "Explain the deployment platform (Render, Heroku, AWS, Vercel), the use of .env files, and containerization like Docker if any."
            },
            {
                question: `What was the most significant architectural tradeoff you had to make in '${repoName}' (e.g., choosing simplicity over scale), and how does it affect the project today?`,
                category: "Tradeoffs",
                difficulty: "Hard",
                hint: "Explain why you chose this stack, why certain features were left out, and how you would design it differently if starting over."
            }
        ]
    };
};

// ================= AI GENERATION SERVICE =================

/**
 * Generates custom project-specific interview questions using Google Gemini and LangChain.
 * Incorporates a retry loop for JSON parsing errors and dynamic mock fallback.
 * 
 * @param {object} params - Repository parameters.
 * @param {string} params.repoName - Name of the repository.
 * @param {string} params.repoDescription - Brief description of the project.
 * @param {Array<string>} params.languages - Programming languages list.
 * @param {Array<string>} params.topics - Topics or tags of the repository.
 * @param {string} params.readmeContent - Decoded README content.
 * @returns {Promise<object>} Generated questions object.
 */
export const generateProjectPrepQuestions = async ({
    repoName,
    repoDescription = "",
    languages = [],
    topics = [],
    readmeContent = ""
}) => {
    // 1. Input Validation
    if (!repoName) {
        throw new ApiError(400, "Repository Name is required to generate interview questions.");
    }

    const model = getGenerativeModel();
    if (!model) {
        console.warn("Using mock question generator due to missing environment configuration.");
        return generateMockQuestionsFallback(repoName, languages);
    }

    const prompt = new PromptTemplate({
        template: projectPrepPromptTemplate,
        inputVariables: ["repoName", "repoDescription", "languages", "topics", "readmeContent"],
        partialVariables: {
            format_instructions: parser.getFormatInstructions()
        }
    });

    const chain = prompt.pipe(model).pipe(parser);

    // 2. Custom Retry Loop for resilience against formatting issues or transient errors
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        attempts++;
        try {
            console.log(`[AI Service] Attempting question generation (Attempt ${attempts}/${maxAttempts})...`);
            
            const result = await chain.invoke({
                repoName,
                repoDescription: repoDescription || "No description provided.",
                languages: languages.length > 0 ? languages.join(", ") : "None specified",
                topics: topics.length > 0 ? topics.join(", ") : "None specified",
                readmeContent: readmeContent || "No README content provided."
            });

            // Verify structure contains questions array
            if (!result || !Array.isArray(result.questions)) {
                throw new Error("Invalid output format: missing 'questions' array.");
            }

            console.log(`[AI Service] Generation succeeded on attempt ${attempts}.`);
            return result;
        } catch (error) {
            console.error(`[AI Service] Error on attempt ${attempts}:`, error.message);
            
            if (attempts >= maxAttempts) {
                console.warn("⚠️ AI generation attempts exhausted. Falling back to structured mock questions.");
                return generateMockQuestionsFallback(repoName, languages);
            }

            // Exponential backoff delay before retry (200ms -> 400ms)
            await new Promise((resolve) => setTimeout(resolve, attempts * 200));
        }
    }
};
