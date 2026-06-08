import dotenv from "dotenv";
import mongoose from "mongoose";
import { 
    generateProjectQuestions,
    getSession,
    getHistory,
    deleteSession
} from "../src/services/projectPrep.service.js";

// Load environment config
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/interviewos";
const mockUserId = new mongoose.Types.ObjectId();
const testGithubUrl = "https://github.com/octocat/Spoon-Knife";

async function runTest() {
    console.log("Connecting to Database at:", MONGO_URI);
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Database connected successfully.");
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
        process.exit(1);
    }

    let createdSessionId = null;

    try {
        console.log("\n1. Testing: generateProjectQuestions()");
        // We will run this. Even if the Google API Key is leaked/missing, our service handles
        // fallback gracefully and returns the mock questions structure.
        const session = await generateProjectQuestions({
            userId: mockUserId,
            githubUrl: testGithubUrl
        });

        console.log("✅ generateProjectQuestions() Succeeded!");
        console.log(`- Created Session ID: ${session._id}`);
        console.log(`- Repo Name: ${session.repoName}`);
        console.log(`- Status: ${session.status}`);
        console.log(`- Languages: ${session.languages.join(", ")}`);
        console.log(`- Generated Questions Count: ${session.generatedQuestions.length}`);
        
        createdSessionId = session._id;

        console.log("\n2. Testing: getSession()");
        const retrievedSession = await getSession({
            userId: mockUserId,
            sessionId: createdSessionId
        });
        console.log("✅ getSession() Succeeded!");
        console.log(`- Retrieved Repo Name: ${retrievedSession.repoName}`);
        console.log(`- First Question Detail: ${retrievedSession.generatedQuestions[0]?.question}`);

        console.log("\n3. Testing: getHistory()");
        const history = await getHistory({ userId: mockUserId });
        console.log("✅ getHistory() Succeeded!");
        console.log(`- History items count: ${history.length}`);
        console.log(`- Item 1 Repo Name: ${history[0]?.repoName}`);

        console.log("\n4. Testing: deleteSession()");
        const deleteRes = await deleteSession({
            userId: mockUserId,
            sessionId: createdSessionId
        });
        console.log("✅ deleteSession() Succeeded!");
        console.log(`- Deletion message: ${deleteRes.message}`);

        // Verify it was actually deleted
        console.log("\n5. Verifying deletion...");
        try {
            await getSession({
                userId: mockUserId,
                sessionId: createdSessionId
            });
            console.error("❌ Error: Session still exists after deletion!");
        } catch (err) {
            console.log(`✅ Correctly threw error on retrieving deleted session: ${err.message}`);
        }

    } catch (error) {
        console.error("❌ Test Failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("\nDisconnected from Database.");
    }
}

runTest();
