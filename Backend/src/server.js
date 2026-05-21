import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.error("Express App Error: ", error);
            throw error;
        });

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed !!! ", err);
    });
