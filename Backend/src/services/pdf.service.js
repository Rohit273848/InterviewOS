import fs from "fs";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { ApiError } from "../utils/ApiError.js";

export const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);

        // Extract the text and remove excessive whitespace
        const text = data.text.replace(/\s+/g, " ").trim();

        if (!text) {
            throw new ApiError(400, "Could not extract text from the provided PDF");
        }

        return text;
    } catch (error) {
        throw new ApiError(500, `PDF Processing Error: ${error.message}`);
    }
};
