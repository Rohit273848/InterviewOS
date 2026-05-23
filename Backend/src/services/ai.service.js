import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { interviewStrategyPromptTemplate } from "../prompts/interview.prompt.js";
import { ApiError } from "../utils/ApiError.js";

// Define the expected output structure using Zod
const outputSchema = z.object({
    matchScore: z.number().describe("Match score from 0 to 100"),
    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),
    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),
    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string())
        })
    ),
    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.string().describe("Severity should be low, medium, or high")
        })
    )
});

const parser = StructuredOutputParser.fromZodSchema(outputSchema);

export const generateInterviewStrategy = async (jobDescription, resumeText, selfDescription) => {
    try {
        if (!process.env.GOOGLE_API_KEY) {
            console.warn("⚠️ GOOGLE_API_KEY is missing. Returning mocked AI response.");
            return {
                matchScore: 85,
                technicalQuestions: [
                    { question: "Mocked Tech Q1", intention: "Test basic knowledge", answer: "Mocked Answer" }
                ],
                behavioralQuestions: [
                    { question: "Mocked Behavior Q1", intention: "Test soft skills", answer: "Mocked Answer" }
                ],
                preparationPlan: [
                    { day: 1, focus: "Mocked Focus", tasks: ["Mocked Task 1", "Mocked Task 2"] }
                ],
                skillGaps: [
                    { skill: "Mocked Skill", severity: "medium" }
                ]
            };
        }
        const model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            apiKey: process.env.GOOGLE_API_KEY,
            temperature: 0.3,
        });

        const prompt = new PromptTemplate({
            template: interviewStrategyPromptTemplate,
            inputVariables: ["jobDescription", "resumeText", "selfDescription"],
            partialVariables: {
                format_instructions: parser.getFormatInstructions()
            }
        });

        // Use modern RunnableSequence (chaining)
        const chain = prompt.pipe(model).pipe(parser);

        const result = await chain.invoke({
            jobDescription,
            resumeText,
            selfDescription
        });

        return result;
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new ApiError(500, "Failed to generate interview strategy: " + error.message);
    }
};
