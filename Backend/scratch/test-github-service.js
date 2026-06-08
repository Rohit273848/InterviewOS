import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { 
    validateAndExtractGithubUrl, 
    getGithubRepoDetails 
} from "../src/services/github.service.js";

// Load env variables (contains GITHUB_TOKEN if configured)
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testUrlValidation() {
    console.log("=== Testing URL Validation ===");
    const testCases = [
        { url: "https://github.com/octocat/Spoon-Knife", expected: { owner: "octocat", repo: "Spoon-Knife" } },
        { url: "https://github.com/expressjs/express.git", expected: { owner: "expressjs", repo: "express" } },
        { url: "github.com/facebook/react/", expected: { owner: "facebook", repo: "react" } },
        { url: "https://github.com/vuejs/core?tab=readme-ov-file#readme", expected: { owner: "vuejs", repo: "core" } },
        { url: "invalid-url", expected: null },
        { url: "https://github.com/onlyowner", expected: null },
    ];

    for (const { url, expected } of testCases) {
        try {
            const res = validateAndExtractGithubUrl(url);
            console.log(`✅ Input: "${url}" -> Parsed: owner="${res.owner}", repo="${res.repo}"`);
            if (expected && (res.owner !== expected.owner || res.repo !== expected.repo)) {
                console.error(`❌ Mismatch! Expected:`, expected, `Got:`, res);
            }
        } catch (error) {
            if (expected === null) {
                console.log(`✅ Input: "${url}" -> Correctly threw error: ${error.message}`);
            } else {
                console.error(`❌ Input: "${url}" -> Unexpectedly threw error: ${error.message}`);
            }
        }
    }
}

async function testFetchRepoDetails() {
    console.log("\n=== Testing Repo Details Fetching ===");
    const targetUrl = "https://github.com/octocat/Spoon-Knife";
    console.log(`Fetching public repo: ${targetUrl}`);
    try {
        const details = await getGithubRepoDetails(targetUrl);
        console.log("✅ Fetch Succeeded!");
        console.log(`- Repo Name: ${details.repoName}`);
        console.log(`- Description: ${details.description}`);
        console.log(`- Languages: ${details.languages.join(", ")}`);
        console.log(`- Topics: ${details.topics.join(", ")}`);
        console.log(`- README Length: ${details.readmeContent ? details.readmeContent.length : 0} characters`);
        console.log(`- README Preview: ${details.readmeContent ? details.readmeContent.slice(0, 100).replace(/\n/g, " ") : "(none)"}...`);
    } catch (error) {
        console.error(`❌ Fetch Failed: Status ${error.statusCode || 500} - ${error.message}`);
    }
    
    console.log("\n=== Testing Non-existent / Private Repo Fetching ===");
    const badUrl = "https://github.com/octocat/some-non-existent-repo-123456";
    console.log(`Fetching bad repo: ${badUrl}`);
    try {
        await getGithubRepoDetails(badUrl);
        console.error("❌ Unexpected Success: fetched non-existent repo!");
    } catch (error) {
        console.log(`✅ Correctly failed: Status ${error.statusCode || 500} - ${error.message}`);
    }
}

async function run() {
    await testUrlValidation();
    await testFetchRepoDetails();
}

run();
