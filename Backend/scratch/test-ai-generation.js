import dotenv from "dotenv";
import { generateProjectPrepQuestions } from "../src/services/projectPrepAI.service.js";

// Load environment variables (.env file)
dotenv.config();

const sampleRepo = {
    repoName: "interviewos",
    repoDescription: "AI-powered technical interview preparation system.",
    languages: ["JavaScript", "HTML", "CSS"],
    topics: ["nextjs", "react", "gemini-api", "langchain"],
    readmeContent: `# InterviewOS\n\nAn app designed to help engineering candidates practice real-world coding, resume evaluations, and mock technical interviews with interactive AI feedback.\n\n## Stack\n- Backend: Node.js, Express, MongoDB/Mongoose\n- AI: Google Gemini 2.5, LangChain\n- Security: bcrypt password hashing, JSON Web Tokens (JWT) for authentication\n- Deployment: Containerized using multi-stage Dockerfiles and hosted on Render.`
};

function validateQuestionsSchema(result) {
    if (!result || typeof result !== "object") {
        throw new Error("Result is not an object.");
    }
    if (!Array.isArray(result.questions)) {
        throw new Error("Result does not contain 'questions' array.");
    }
    
    const validCategories = ["Architecture", "Database", "Security", "Performance", "Scalability", "Deployment", "Tradeoffs"];
    const validDifficulties = ["Easy", "Medium", "Hard"];
    
    result.questions.forEach((q, index) => {
        console.log(`Checking question ${index + 1}:`);
        console.log(`  Question: "${q.question}"`);
        console.log(`  Category: ${q.category}`);
        console.log(`  Difficulty: ${q.difficulty}`);
        console.log(`  Hint: "${q.hint}"`);
        
        if (typeof q.question !== "string" || q.question.trim().length === 0) {
            throw new Error(`Question ${index + 1} has an empty or invalid question string.`);
        }
        if (!validCategories.includes(q.category)) {
            throw new Error(`Question ${index + 1} has invalid category: ${q.category}`);
        }
        if (!validDifficulties.includes(q.difficulty)) {
            throw new Error(`Question ${index + 1} has invalid difficulty: ${q.difficulty}`);
        }
        if (typeof q.hint !== "string" || q.hint.trim().length === 0) {
            throw new Error(`Question ${index + 1} has an empty or invalid hint.`);
        }
    });
    console.log("✅ Schema Validation: Passed!");
}

async function testMockFallback() {
    console.log("=== Testing Mock Fallback ===");
    // Backup actual key and clear it to force fallback
    const originalKey = process.env.GOOGLE_API_KEY;
    process.env.GOOGLE_API_KEY = "";
    
    try {
        const result = await generateProjectPrepQuestions(sampleRepo);
        validateQuestionsSchema(result);
    } catch (err) {
        console.error("❌ Mock Fallback Test Failed:", err);
    } finally {
        // Restore key
        process.env.GOOGLE_API_KEY = originalKey;
    }
}

async function testLiveGeneration() {
    console.log("\n=== Testing Live AI Question Generation ===");
    if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_API_KEY.trim()) {
        console.log("⚠️ Skipping live generation because GOOGLE_API_KEY is not configured in .env");
        return;
    }
    
    try {
        const result = await generateProjectPrepQuestions(sampleRepo);
        console.log("✅ Live API Succeeded!");
        validateQuestionsSchema(result);
    } catch (err) {
        console.error("❌ Live AI Question Generation Failed:", err);
    }
}

async function run() {
    await testMockFallback();
    await testLiveGeneration();
}

run();
