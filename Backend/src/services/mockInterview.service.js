import mongoose from "mongoose";
import { MockInterviewSession } from "../models/MockInterviewSession.js";
import { MockInterviewQuestion } from "../models/MockInterviewQuestion.js";
import { MockInterviewAnswer } from "../models/MockInterviewAnswer.js";
import { generateInterviewQuestions, evaluateMockInterviewSession } from "./aiInterview.service.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Business logic service managing the Mock Interview lifecycle, state machine,
 * transactional rollbacks, answer progress, evaluations, and metrics aggregation.
 */

/**
 * Initializes a mock interview session and generates questions batch.
 */
export const createSession = async ({
    userId,
    jobDescription,
    resumeText,
    selfDescription = "",
    candidateWeaknesses = "",
    interviewType,
    difficulty,
    questionCount = 5
}) => {
    // 1. Validate parameters
    if (!jobDescription || !resumeText || !interviewType || !difficulty) {
        throw new ApiError(400, "Missing required parameters for session initialization");
    }

    let sessionDoc = null;

    try {
        // 2. Initialize Session Doc in DB
        sessionDoc = await MockInterviewSession.create({
            userId,
            jobDescription,
            resumeText,
            selfDescription,
            candidateWeaknesses,
            interviewType,
            difficulty,
            questionCount,
            status: "started",
            currentQuestionIndex: 0
        });

        // 3. Call AI Service to generate question set
        const aiResponse = await generateInterviewQuestions({
            jobDescription,
            resumeText,
            selfDescription,
            candidateWeaknesses,
            interviewType,
            difficulty,
            questionCount
        });

        if (!aiResponse || !aiResponse.questions || aiResponse.questions.length === 0) {
            throw new Error("AI service returned empty or invalid questions structure");
        }

        // 4. Map questions to DB format and batch insert
        const questionDocs = aiResponse.questions.map((q, idx) => ({
            sessionId: sessionDoc._id,
            questionNumber: q.questionNumber || (idx + 1),
            questionText: q.questionText,
            hint: q.hint || "",
            source: q.source || "jobDescription"
        }));

        const insertedQuestions = await MockInterviewQuestion.insertMany(questionDocs);

        // 5. Transition state to active
        sessionDoc.status = "active";
        await sessionDoc.save();

        // 6. Return session details and the first question
        const firstQuestion = insertedQuestions.find(q => q.questionNumber === 1) || insertedQuestions[0];

        return {
            sessionId: sessionDoc._id,
            status: sessionDoc.status,
            questionCount: sessionDoc.questionCount,
            currentQuestionIndex: 0,
            firstQuestion: {
                id: firstQuestion._id.toString(),
                questionNumber: firstQuestion.questionNumber,
                questionText: firstQuestion.questionText,
                hint: firstQuestion.hint
            }
        };

    } catch (error) {
        // Rollback created session if question generation or insert fails
        if (sessionDoc) {
            console.error(`Rolling back session ${sessionDoc._id} due to initialization error.`);
            await MockInterviewSession.deleteOne({ _id: sessionDoc._id });
            await MockInterviewQuestion.deleteMany({ sessionId: sessionDoc._id });
        }
        throw new ApiError(500, `Failed to initialize mock interview: ${error.message}`);
    }
};

/**
 * Submits the candidate's response for the current question and progresses the session state.
 */
export const submitAnswer = async ({
    userId,
    sessionId,
    questionId,
    answerText = "",
    isSkipped = false
}) => {
    // 1. Find and validate session ownership and state
    const sessionDoc = await MockInterviewSession.findOne({ _id: sessionId, userId });
    if (!sessionDoc) {
        throw new ApiError(404, "Mock interview session not found or access denied");
    }

    if (sessionDoc.status !== "active") {
        throw new ApiError(400, `Cannot submit answer. Session is currently in status: ${sessionDoc.status}`);
    }

    // 2. Validate question belongs to this session
    const questionDoc = await MockInterviewQuestion.findOne({ _id: questionId, sessionId });
    if (!questionDoc) {
        throw new ApiError(404, "Target interview question not found in this session");
    }

    // 3. Upsert answer document
    await MockInterviewAnswer.findOneAndUpdate(
        { sessionId, questionId },
        {
            answerText: isSkipped ? "" : answerText,
            isSkipped,
            // Initialize empty evaluation variables to overwrite any older iterations
            score: 0,
            strengths: [],
            weaknesses: [],
            betterAnswer: "",
            categoryScores: {
                relevance: 0,
                technicalAccuracy: 0,
                communication: 0,
                confidence: 0,
                structure: 0,
                problemSolving: 0
            }
        },
        { upsert: true, new: true }
    );

    // 4. Update index index trackers
    const nextQuestionNumber = questionDoc.questionNumber + 1;
    const hasMoreQuestions = nextQuestionNumber <= sessionDoc.questionCount;

    if (hasMoreQuestions) {
        sessionDoc.currentQuestionIndex = questionDoc.questionNumber; // increment (0-indexed logic)
        await sessionDoc.save();

        const nextQuestionDoc = await MockInterviewQuestion.findOne({
            sessionId,
            questionNumber: nextQuestionNumber
        });

        if (!nextQuestionDoc) {
            throw new ApiError(500, `Next question (Q#${nextQuestionNumber}) missing from database`);
        }

        return {
            currentQuestionIndex: sessionDoc.currentQuestionIndex,
            hasMoreQuestions: true,
            nextQuestion: {
                id: nextQuestionDoc._id.toString(),
                questionNumber: nextQuestionDoc.questionNumber,
                questionText: nextQuestionDoc.questionText,
                hint: nextQuestionDoc.hint
            }
        };
    } else {
        // Last question answered - set status to evaluating
        sessionDoc.status = "evaluating";
        await sessionDoc.save();

        return {
            currentQuestionIndex: sessionDoc.currentQuestionIndex,
            hasMoreQuestions: false,
            message: "All questions answered. Ready to generate report."
        };
    }
};

/**
 * Triggers AI evaluation runs and builds the final consolidated feedback report.
 */
export const completeSession = async ({ userId, sessionId }) => {
    // 1. Fetch and validate session state
    const sessionDoc = await MockInterviewSession.findOne({ _id: sessionId, userId });
    if (!sessionDoc) {
        throw new ApiError(404, "Mock interview session not found or access denied");
    }

    // Allow completion if status is active (user ends early) or evaluating (final question submitted)
    if (sessionDoc.status !== "active" && sessionDoc.status !== "evaluating") {
        throw new ApiError(400, `Interview cannot be completed. Current status: ${sessionDoc.status}`);
    }

    // Force transition to evaluating status to lock further modifications
    sessionDoc.status = "evaluating";
    await sessionDoc.save();

    try {
        // 2. Fetch all questions and submitted answers
        const questions = await MockInterviewQuestion.find({ sessionId }).sort({ questionNumber: 1 });
        const answers = await MockInterviewAnswer.find({ sessionId });

        // Map answers lookup
        const answerMap = new Map(answers.map(ans => [ans.questionId.toString(), ans]));

        // Compile questions list and map associated user inputs (handling skipped/unanswered)
        const questionsAndAnswersData = questions.map(q => {
            const associatedAns = answerMap.get(q._id.toString());
            return {
                questionId: q._id.toString(),
                questionText: q.questionText,
                answerText: associatedAns ? associatedAns.answerText : "",
                isSkipped: associatedAns ? associatedAns.isSkipped : true
            };
        });

        // 3. Request evaluation report from AI service
        const aiEvaluation = await evaluateMockInterviewSession({
            interviewType: sessionDoc.interviewType,
            difficulty: sessionDoc.difficulty,
            questionsAndAnswers: questionsAndAnswersData
        });

        // 4. Batch update individual answers with detailed evaluations
        if (aiEvaluation.answersEvaluation && aiEvaluation.answersEvaluation.length > 0) {
            const answerUpdates = aiEvaluation.answersEvaluation.map(ansEval => {
                return MockInterviewAnswer.updateOne(
                    { sessionId, questionId: ansEval.questionId },
                    {
                        score: ansEval.score || 0,
                        strengths: ansEval.strengths || [],
                        weaknesses: ansEval.weaknesses || [],
                        betterAnswer: ansEval.betterAnswer || "",
                        categoryScores: ansEval.categoryScores || {
                            relevance: 0,
                            technicalAccuracy: 0,
                            communication: 0,
                            confidence: 0,
                            structure: 0,
                            problemSolving: 0
                        }
                    }
                );
            });
            await Promise.all(answerUpdates);
        }

        // 5. Update parent session with aggregated score matrices and action plan
        sessionDoc.overallScore = aiEvaluation.overallScore || 0;
        sessionDoc.categoryScores = aiEvaluation.categoryScores || {
            relevance: 0,
            technicalAccuracy: 0,
            communication: 0,
            confidence: 0,
            structure: 0,
            problemSolving: 0
        };
        sessionDoc.keyImprovementAreas = aiEvaluation.keyImprovementAreas || [];
        sessionDoc.actionPlan = aiEvaluation.actionPlan || [];
        sessionDoc.status = "completed";

        await sessionDoc.save();

        return {
            sessionId: sessionDoc._id,
            status: sessionDoc.status,
            overallScore: sessionDoc.overallScore
        };

    } catch (error) {
        console.error(`AI Evaluation failed for session ${sessionId}:`, error);
        sessionDoc.status = "failed";
        await sessionDoc.save();
        throw new ApiError(500, `AI evaluation failed: ${error.message}`);
    }
};

/**
 * Retrieves full report details including populated questions and answers logs.
 */
export const getSessionReport = async ({ userId, sessionId }) => {
    // 1. Find parent session
    const session = await MockInterviewSession.findOne({ _id: sessionId, userId });
    if (!session) {
        throw new ApiError(404, "Interview report not found or access denied");
    }

    if (session.status !== "completed") {
        throw new ApiError(400, `Evaluation report not ready. Session status: ${session.status}`);
    }

    // 2. Fetch related questions and answers
    const questions = await MockInterviewQuestion.find({ sessionId }).sort({ questionNumber: 1 }).lean();
    const answers = await MockInterviewAnswer.find({ sessionId }).lean();

    // Map answers by question reference
    const answersMap = new Map(answers.map(ans => [ans.questionId.toString(), ans]));

    // 3. Build joint structure
    const questionsAndAnswers = questions.map(q => {
        const answer = answersMap.get(q._id.toString());
        return {
            questionId: q._id,
            questionNumber: q.questionNumber,
            questionText: q.questionText,
            hint: q.hint,
            source: q.source,
            answerText: answer ? answer.answerText : "",
            isSkipped: answer ? answer.isSkipped : true,
            score: answer ? answer.score : 0,
            strengths: answer ? answer.strengths : [],
            weaknesses: answer ? answer.weaknesses : [],
            betterAnswer: answer ? answer.betterAnswer : "",
            categoryScores: answer ? answer.categoryScores : null
        };
    });

    return {
        sessionId: session._id,
        interviewType: session.interviewType,
        difficulty: session.difficulty,
        questionCount: session.questionCount,
        status: session.status,
        overallScore: session.overallScore,
        categoryScores: session.categoryScores,
        keyImprovementAreas: session.keyImprovementAreas,
        actionPlan: session.actionPlan,
        createdAt: session.createdAt,
        questionsAndAnswers
    };
};

/**
 * Fetches completed interview histories for a user.
 */
export const getHistory = async ({ userId }) => {
    return await MockInterviewSession.find(
        { userId, status: "completed" },
        "interviewType difficulty questionCount overallScore createdAt"
    ).sort({ createdAt: -1 });
};

/**
 * Aggregates statistics and trends tracking mock interview performance.
 */
export const getAnalytics = async ({ userId }) => {
    const sessions = await MockInterviewSession.find({ userId, status: "completed" }).sort({ createdAt: 1 });

    if (sessions.length === 0) {
        return {
            averageOverallScore: 0,
            totalInterviews: 0,
            scoresProgress: [],
            typeDistribution: { behavioral: 0, technical: 0, "system-design": 0 },
            averageCategoryScores: {
                relevance: 0,
                technicalAccuracy: 0,
                communication: 0,
                confidence: 0,
                structure: 0,
                problemSolving: 0
            }
        };
    }

    let overallScoreSum = 0;
    const typeDistribution = { behavioral: 0, technical: 0, "system-design": 0 };
    const categorySums = {
        relevance: 0,
        technicalAccuracy: 0,
        communication: 0,
        confidence: 0,
        structure: 0,
        problemSolving: 0
    };

    const scoresProgress = sessions.map(s => {
        overallScoreSum += s.overallScore;
        typeDistribution[s.interviewType] = (typeDistribution[s.interviewType] || 0) + 1;

        // Accumulate dimension scores
        if (s.categoryScores) {
            categorySums.relevance += s.categoryScores.relevance || 0;
            categorySums.technicalAccuracy += s.categoryScores.technicalAccuracy || 0;
            categorySums.communication += s.categoryScores.communication || 0;
            categorySums.confidence += s.categoryScores.confidence || 0;
            categorySums.structure += s.categoryScores.structure || 0;
            categorySums.problemSolving += s.categoryScores.problemSolving || 0;
        }

        return {
            sessionId: s._id,
            date: s.createdAt.toISOString().split("T")[0],
            score: s.overallScore,
            type: s.interviewType
        };
    });

    const totalCount = sessions.length;

    return {
        averageOverallScore: Math.round(overallScoreSum / totalCount),
        totalInterviews: totalCount,
        scoresProgress,
        typeDistribution,
        averageCategoryScores: {
            relevance: Math.round(categorySums.relevance / totalCount),
            technicalAccuracy: Math.round(categorySums.technicalAccuracy / totalCount),
            communication: Math.round(categorySums.communication / totalCount),
            confidence: Math.round(categorySums.confidence / totalCount),
            structure: Math.round(categorySums.structure / totalCount),
            problemSolving: Math.round(categorySums.problemSolving / totalCount)
        }
    };
};
