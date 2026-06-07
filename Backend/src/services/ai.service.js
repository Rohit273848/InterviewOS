import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { interviewStrategyPromptTemplate } from "../prompts/interview.prompt.js";
import { ApiError } from "../utils/ApiError.js";

// Define the expected output structure using Zod
const outputSchema = z.object({
    atsScore: z.number().describe("Match score from 0 to 100 based on Job Description requirements"),
    candidateFitScore: z.number().describe("Overall candidate fit score from 0 to 100"),
    strengths: z.array(z.string()).describe("Key strengths of the candidate"),
    weaknesses: z.array(z.string()).describe("Key weaknesses of the candidate"),
    missingSkills: z.array(
        z.object({
            skill: z.string().describe("Name of the missing skill"),
            importance: z.string().describe("Importance level: Low, Medium, or High"),
            reason: z.string().describe("Reason why this skill is important for this job")
        })
    ),
    atsKeywordAnalysis: z.object({
        matchedKeywords: z.array(z.string()).describe("Important keywords found in JD and present in resume"),
        missingKeywords: z.array(z.string()).describe("Important keywords found in JD but missing in resume"),
        keywordCoveragePercentage: z.number().describe("Keyword coverage percentage from 0 to 100")
    }),
    additions: z.array(
        z.object({
            item: z.string().describe("Content/section to add to resume"),
            reason: z.string().describe("Why this addition is helpful"),
            example: z.string().describe("Example content to put in resume")
        })
    ),
    removals: z.array(
        z.object({
            item: z.string().describe("Content/section to remove from resume"),
            reason: z.string().describe("Why this removal is helpful")
        })
    ),
    recommendedProjects: z.array(
        z.object({
            projectName: z.string().describe("Proposed project name"),
            reason: z.string().describe("Why this project helps candidate fit"),
            skillsCovered: z.array(z.string()).describe("Skills demonstrated by the project")
        })
    ),
    atsImprovementPlan: z.array(z.string()).describe("Step-by-step plan to improve ATS score"),
    roadmap: z.object({
        immediate: z.array(z.string()).describe("Immediate fixes (1 day)"),
        shortTerm: z.array(z.string()).describe("Short-term improvements (1 week)"),
        mediumTerm: z.array(z.string()).describe("Medium-term improvements (1 month)"),
        longTerm: z.array(z.string()).describe("Long-term improvements (3 months)")
    })
});

const parser = StructuredOutputParser.fromZodSchema(outputSchema);

const mockResponse = {
    atsScore: 85,
    candidateFitScore: 80,
    strengths: [
        "Strong background in Node.js, Express, and MongoDB backend development.",
        "Excellent project experience building full-stack web applications.",
        "Proactive learning ability as demonstrated by self-started projects.",
        "Clear communication skills in explaining technical contributions."
    ],
    weaknesses: [
        "Lacks experience with microservices architectures mentioned in Job Description.",
        "Missing AWS deployment keywords and cloud certifications.",
        "Does not demonstrate automated testing (Jest/Cypress) in the projects section."
    ],
    missingSkills: [
        {
            skill: "Docker",
            importance: "High",
            reason: "Used for development and deployment environments in this role."
        },
        {
            skill: "AWS (S3/EC2)",
            importance: "Medium",
            reason: "The JD lists AWS cloud infrastructure management as a key responsibility."
        },
        {
            skill: "Jest",
            importance: "Medium",
            reason: "Unit testing backend routes is a core requirement for their engineering team."
        }
    ],
    atsKeywordAnalysis: {
        matchedKeywords: ["Node.js", "Express", "MongoDB", "REST APIs", "React", "JavaScript"],
        missingKeywords: ["Docker", "Kubernetes", "AWS", "CI/CD", "Jest", "TypeScript"],
        keywordCoveragePercentage: 50
    },
    additions: [
        {
            item: "Docker containerization details",
            reason: "To show familiarity with containerized deployments standard in the hiring team.",
            example: "Containerized application microservices using Docker and orchestrated multi-container setup via Docker Compose."
        },
        {
            item: "Unit Testing experience description",
            reason: "JD emphasizes robust code testing and continuous integration.",
            example: "Authored comprehensive unit and integration tests using Jest, boosting test coverage from 60% to 92%."
        }
    ],
    removals: [
        {
            item: "High school education details and GPA",
            reason: "Takes up valuable space; professional experience and college degree are sufficient."
        },
        {
            item: "Repetitive lists of basic soft skills like 'team player' and 'fast learner'",
            reason: "Use action verbs inside project descriptions to demonstrate these traits instead."
        }
    ],
    recommendedProjects: [
        {
            projectName: "Cloud-Native Task Manager Microservice",
            reason: "Demonstrates containerization, testing, and cloud hosting skills required for this role.",
            skillsCovered: ["Docker", "AWS", "Jest", "CI/CD Pipelines", "TypeScript"]
        }
    ],
    atsImprovementPlan: [
        "Add Docker Compose setups to existing projects and update their READMEs.",
        "Write Jest tests for the authentication and transaction API endpoints.",
        "Reformulate resume bullet points to follow the Google X-Y-Z formula."
    ],
    roadmap: {
        immediate: [
            "Remove the high school education section.",
            "Remove generic soft-skills list from the sidebar."
        ],
        shortTerm: [
            "Add Jest unit tests to the backend project.",
            "Containerize the backend using a Dockerfile."
        ],
        mediumTerm: [
            "Deploy the containerized project to AWS ECS or EC2 and list it.",
            "Refactor React components to TypeScript."
        ],
        longTerm: [
            "Earn the AWS Certified Developer Associate certification.",
            "Contribute to open-source libraries matching the stack."
        ]
    }
};

export const generateInterviewStrategy = async (jobDescription, resumeText, selfDescription, candidateWeaknesses) => {
    try {
        if (!process.env.GOOGLE_API_KEY) {
            console.warn("⚠️ GOOGLE_API_KEY is missing. Returning mocked AI response.");
            return mockResponse;
        }
        const apiKey = process.env.GOOGLE_API_KEY?.trim();

        if (!apiKey) {
            console.warn("⚠️ GOOGLE_API_KEY is blank. Returning mocked AI response.");
            return mockResponse;
        }

        const model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            apiKey,
            temperature: 0.3,
        });
        const prompt = new PromptTemplate({
            template: interviewStrategyPromptTemplate,
            inputVariables: ["jobDescription", "resumeText", "selfDescription", "candidateWeaknesses"],
            partialVariables: {
                format_instructions: parser.getFormatInstructions()
            }
        });

        // Use modern RunnableSequence (chaining)
        const chain = prompt.pipe(model).pipe(parser);

        const result = await chain.invoke({
            jobDescription,
            resumeText,
            selfDescription,
            candidateWeaknesses: candidateWeaknesses || "None provided"
        });

        return result;
    } catch (error) {
        console.error("AI Generation Error:", error);
        console.warn("⚠️ Google Gemini API call failed (e.g. key expired/invalid or quota reached). Falling back to mocked AI response.");
        return mockResponse;
    }
};
