import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { questionGenerationPromptTemplate, evaluationPromptTemplate } from "../prompts/aiInterview.prompt.js";

// ================= ZOD SCHEMAS & PARSERS =================

// Schema for Question Generation
const questionsOutputSchema = z.object({
    questions: z.array(
        z.object({
            questionNumber: z.number().describe("The 1-indexed sequence number of the question"),
            questionText: z.string().describe("The actual text of the interview question"),
            hint: z.string().describe("A helpful hint to guide the user's answer structure"),
            source: z.enum(["jobDescription", "resume", "weaknesses", "selfDescription", "general"])
                .describe("The context source that triggered this question")
        })
    ).describe("List of generated questions matching parameters")
});

const questionsParser = StructuredOutputParser.fromZodSchema(questionsOutputSchema);

// Schema for Answer Evaluation
const evaluationOutputSchema = z.object({
    overallScore: z.number().describe("Overall score representing aggregate candidate performance (0-100)"),
    categoryScores: z.object({
        relevance: z.number().describe("Relevance score from 0 to 100"),
        technicalAccuracy: z.number().describe("Technical accuracy score from 0 to 100"),
        communication: z.number().describe("Communication clarity score from 0 to 100"),
        confidence: z.number().describe("Candidate confidence score from 0 to 100"),
        structure: z.number().describe("Response structural score from 0 to 100"),
        problemSolving: z.number().describe("Problem solving and trade-off evaluation score from 0 to 100"),
    }).describe("Granular dimension scores"),
    keyImprovementAreas: z.array(z.string()).describe("Core improvement themes observed in the candidate's answers"),
    actionPlan: z.array(
        z.object({
            step: z.number().describe("Plan step ordering starting from 1"),
            topic: z.string().describe("Core topic of study"),
            details: z.string().describe("Actionable instructions on how to bridge the gap")
        })
    ).describe("3-step prioritized learning roadmap"),
    answersEvaluation: z.array(
        z.object({
            questionId: z.string().describe("The raw ID string matching the question"),
            score: z.number().describe("Individual question score (0-100)"),
            strengths: z.array(z.string()).describe("Key strengths in the answer"),
            weaknesses: z.array(z.string()).describe("Key gaps or mistakes in the answer"),
            betterAnswer: z.string().describe("Refined model answer suggestion using STAR/structural templates"),
            categoryScores: z.object({
                relevance: z.number(),
                technicalAccuracy: z.number(),
                communication: z.number(),
                confidence: z.number(),
                structure: z.number(),
                problemSolving: z.number(),
            })
        })
    ).describe("Individual evaluation blocks for each question and response pair")
});

const evaluationParser = StructuredOutputParser.fromZodSchema(evaluationOutputSchema);

// ================= MODEL CONFLICT HELPER =================

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
        console.warn("⚠️ WARNING: GOOGLE_API_KEY starts with 'AQ.'. This represents a Google Cloud OAuth Access Token (typically from 'gcloud auth print-access-token' or Vertex AI), NOT a standard Google AI Studio developer key. Standard AI Studio APIs do not support OAuth tokens in the apiKey field and will fail with 401 Unauthorized [ACCESS_TOKEN_TYPE_UNSUPPORTED]. Please replace this with a standard AI Studio key starting with 'AIzaSy' in your Backend/.env file.");
    }

    return new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey,
        temperature: 0.3,
        maxRetries: 3, // Built-in LangChain retry support for transient errors
    });
};

// ================= MOCK FALLBACKS FOR TESTING =================

const mockQuestionsFallback = (interviewType, difficulty, count) => ({
    questions: Array.from({ length: count }, (_, i) => ({
        questionNumber: i + 1,
        questionText: `Mock Question ${i + 1} for ${interviewType} (${difficulty}): Can you explain how you design and manage systems in production?`,
        hint: "Detail your structural framework, trade-offs, and metrics validation.",
        source: i % 2 === 0 ? "jobDescription" : "resume"
    }))
});

const mockEvaluationFallback = (questionsAndAnswers, interviewType, difficulty) => {
    const listAnswers = Array.isArray(questionsAndAnswers) ? questionsAndAnswers : [];
    return {
        overallScore: 78,
        categoryScores: {
            relevance: 80,
            technicalAccuracy: 75,
            communication: 82,
            confidence: 70,
            structure: 80,
            problemSolving: 72
        },
        keyImprovementAreas: [
            "Lacks specific performance metrics in behavioral examples.",
            "Explain system design elements with dynamic trade-offs."
        ],
        actionPlan: [
            {
                step: 1,
                topic: "The STAR Method",
                details: "Reframe behavioral answers prioritizing Situation, Task, Action (50% of the speech), and quantitative Results."
            },
            {
                step: 2,
                topic: "Distributed Caching Strategies",
                details: "Review cache invalidation strategies (Write-through vs. Cache-aside) and Redis cluster configurations."
            },
            {
                step: 3,
                topic: "Performance Profiling",
                details: "Incorporate benchmarks and resource monitoring keywords (latency, memory footprint, throughput) into your technical explanations."
            }
        ],
        answersEvaluation: listAnswers.map((item) => ({
            questionId: item.questionId || "mock_id",
            score: 75,
            strengths: ["Clear intro outline.", "Answer is relevant to target question."],
            weaknesses: ["Lacked details on implementation errors.", "Missed explaining fallback scenarios."],
            betterAnswer: "To answer this effectively, structure it as follows: State the primary design, review the engineering trade-offs, and details of performance metrics...",
            categoryScores: {
                relevance: 80,
                technicalAccuracy: 70,
                communication: 80,
                confidence: 70,
                structure: 75,
                problemSolving: 70
            }
        }))
    };
};

// ================= SERVICE EXPORTS =================

/**
 * Generates dynamic mock interview questions based on job and candidate profile inputs.
 */
export const generateInterviewQuestions = async ({
    jobDescription,
    resumeText,
    selfDescription = "",
    candidateWeaknesses = "",
    interviewType,
    difficulty,
    questionCount = 5
}) => {
    try {
        const model = getGenerativeModel();
        if (!model) {
            return mockQuestionsFallback(interviewType, difficulty, questionCount);
        }

        const prompt = new PromptTemplate({
            template: questionGenerationPromptTemplate,
            inputVariables: [
                "jobDescription",
                "resumeText",
                "selfDescription",
                "candidateWeaknesses",
                "interviewType",
                "difficulty",
                "questionCount"
            ],
            partialVariables: {
                format_instructions: questionsParser.getFormatInstructions()
            }
        });

        const chain = prompt.pipe(model).pipe(questionsParser);

        const result = await chain.invoke({
            jobDescription,
            resumeText,
            selfDescription: selfDescription || "None provided",
            candidateWeaknesses: candidateWeaknesses || "None provided",
            interviewType,
            difficulty,
            questionCount: questionCount.toString()
        });

        return result;
    } catch (error) {
        console.error("AI Question Generation Failed:", error);
        console.warn("⚠️ AI Call failed. Falling back to structured mock questions.");
        return mockQuestionsFallback(interviewType, difficulty, questionCount);
    }
};

/**
 * Evaluates candidate responses to a completed mock interview session.
 */
export const evaluateMockInterviewSession = async ({
    interviewType,
    difficulty,
    questionsAndAnswers // Array of { questionId, questionText, answerText, isSkipped }
}) => {
    try {
        const model = getGenerativeModel();
        if (!model) {
            return mockEvaluationFallback(questionsAndAnswers, interviewType, difficulty);
        }

        const formattedQAs = questionsAndAnswers.map((qa, index) => {
            return `---
Question ${index + 1} ID: ${qa.questionId}
Question Text: ${qa.questionText}
Answer Text: ${qa.isSkipped ? "[SKIPPED BY USER]" : (qa.answerText || "[NO ANSWER SUBMITTED]")}
`;
        }).join("\n");

        const prompt = new PromptTemplate({
            template: evaluationPromptTemplate,
            inputVariables: ["interviewType", "difficulty", "questionsAndAnswers"],
            partialVariables: {
                format_instructions: evaluationParser.getFormatInstructions()
            }
        });

        const chain = prompt.pipe(model).pipe(evaluationParser);

        const result = await chain.invoke({
            interviewType,
            difficulty,
            questionsAndAnswers: formattedQAs
        });

        return result;
    } catch (error) {
        console.error("AI Answer Evaluation Failed:", error);
        console.warn("⚠️ AI Call failed. Falling back to structured mock evaluation report.");
        return mockEvaluationFallback(questionsAndAnswers, interviewType, difficulty);
    }
};
