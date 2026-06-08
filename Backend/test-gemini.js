import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
console.log("TEST FILE STARTED");
async function testGemini() {
    try {

        console.log("Key starts with:", process.env.GOOGLE_API_KEY);

        const genAI = new GoogleGenerativeAI(
            process.env.GOOGLE_API_KEY
        );

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
        });

        const result = await model.generateContent(
            "Explain how AI works in one sentence."
        );

        console.log("\nSUCCESS:");
        console.log(result.response.text());

    } catch (error) {
        console.error("\nFAILED:");
        console.error(error);
    }
}

testGemini();