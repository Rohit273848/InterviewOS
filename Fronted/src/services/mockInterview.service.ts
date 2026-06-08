import api from './api';

export interface StartSessionParams {
  jobDescription: string;
  resumeText: string;
  selfDescription?: string;
  candidateWeaknesses?: string;
  interviewType: string;
  difficulty: string;
  questionCount: number;
}

export interface QuestionSummary {
  id: string;
  questionNumber: number;
  questionText: string;
  hint: string;
}

export interface StartSessionResponse {
  sessionId: string;
  status: string;
  questionCount: number;
  currentQuestionIndex: number;
  firstQuestion: QuestionSummary;
}

export interface SubmitAnswerParams {
  sessionId: string;
  questionId: string;
  answerText: string;
  isSkipped: boolean;
}

export interface SubmitAnswerResponse {
  currentQuestionIndex: number;
  hasMoreQuestions: boolean;
  nextQuestion?: QuestionSummary;
  message?: string;
}

export interface CompleteSessionResponse {
  sessionId: string;
  status: string;
  overallScore: number;
}

export interface QuestionAndAnswerDetails {
  questionId: string;
  questionNumber: number;
  questionText: string;
  hint: string;
  source: string;
  answerText: string;
  isSkipped: boolean;
  score: number;
  strengths: string[];
  weaknesses: string[];
  betterAnswer: string;
  categoryScores?: {
    relevance: number;
    technicalAccuracy: number;
    communication: number;
    confidence: number;
    structure: number;
    problemSolving: number;
  } | null;
}

export interface SessionReportResponse {
  sessionId: string;
  interviewType: string;
  difficulty: string;
  questionCount: number;
  status: string;
  overallScore: number;
  categoryScores: {
    relevance: number;
    technicalAccuracy: number;
    communication: number;
    confidence: number;
    structure: number;
    problemSolving: number;
  };
  keyImprovementAreas: string[];
  actionPlan: Array<{
    step: number;
    topic: string;
    details: string;
  }>;
  createdAt: string;
  questionsAndAnswers: QuestionAndAnswerDetails[];
}

export interface HistoryItem {
  _id: string;
  sessionId: string;
  interviewType: string;
  difficulty: string;
  questionCount: number;
  overallScore: number;
  createdAt: string;
}

export interface AnalyticsResponse {
  averageOverallScore: number;
  totalInterviews: number;
  scoresProgress: Array<{
    sessionId: string;
    date: string;
    score: number;
    type: string;
  }>;
  typeDistribution: {
    behavioral: number;
    technical: number;
    'system-design': number;
  };
  averageCategoryScores: {
    relevance: number;
    technicalAccuracy: number;
    communication: number;
    confidence: number;
    structure: number;
    problemSolving: number;
  };
}

/**
 * Frontend Axios wrapper service linking React components to Express Mock Interview API.
 */
export const startSession = async (params: StartSessionParams): Promise<StartSessionResponse> => {
  const response = await api.post('/mock-interview/start', params);
  return response.data.data;
};

export const submitAnswer = async ({
  sessionId,
  questionId,
  answerText,
  isSkipped,
}: SubmitAnswerParams): Promise<SubmitAnswerResponse> => {
  const response = await api.post(`/mock-interview/session/${sessionId}/answer`, {
    questionId,
    answerText,
    isSkipped,
  });
  return response.data.data;
};

export const completeSession = async (sessionId: string): Promise<CompleteSessionResponse> => {
  const response = await api.post(`/mock-interview/session/${sessionId}/complete`);
  return response.data.data;
};

export const getSessionReport = async (sessionId: string): Promise<SessionReportResponse> => {
  const response = await api.get(`/mock-interview/session/${sessionId}/report`);
  return response.data.data;
};

export const getHistory = async (): Promise<HistoryItem[]> => {
  const response = await api.get('/mock-interview/history');
  return response.data.data;
};

export const getAnalytics = async (): Promise<AnalyticsResponse> => {
  const response = await api.get('/mock-interview/analytics');
  return response.data.data;
};
