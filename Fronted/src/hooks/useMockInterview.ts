import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  startSession,
  submitAnswer,
  completeSession,
  getHistory,
  getAnalytics,
  StartSessionParams,
  QuestionSummary,
  HistoryItem,
  AnalyticsResponse
} from '../services/mockInterview.service';

const SESSION_STORAGE_KEY = 'interviewos_active_session';

export interface ActiveSessionState {
  sessionId: string;
  questionCount: number;
  currentQuestionIndex: number;
  currentQuestion: QuestionSummary;
  interviewType: string;
  difficulty: string;
}

export const useMockInterview = () => {
  const [loading, setLoading] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [completingSession, setCompletingSession] = useState(false);
  
  const [activeSession, setActiveSession] = useState<ActiveSessionState | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);

  // Restore session from Session Storage on mount
  useEffect(() => {
    const savedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setActiveSession(parsed);
      } catch (e) {
        console.error('Failed to parse saved session storage', e);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
  }, []);

  const startNewSession = async (params: StartSessionParams) => {
    try {
      setLoading(true);
      const data = await startSession(params);
      
      const newState: ActiveSessionState = {
        sessionId: data.sessionId,
        questionCount: data.questionCount,
        currentQuestionIndex: data.currentQuestionIndex,
        currentQuestion: data.firstQuestion,
        interviewType: params.interviewType,
        difficulty: params.difficulty
      };

      setActiveSession(newState);
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newState));
      toast.success(`Mock interview session started! ${data.questionCount} questions total.`);
      return data;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to start interview session';
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async (answerText: string, isSkipped: boolean = false) => {
    if (!activeSession) {
      toast.error('No active interview session found');
      return;
    }

    try {
      setSubmittingAnswer(true);
      const data = await submitAnswer({
        sessionId: activeSession.sessionId,
        questionId: activeSession.currentQuestion.id,
        answerText,
        isSkipped
      });

      if (data.hasMoreQuestions && data.nextQuestion) {
        const updatedState: ActiveSessionState = {
          ...activeSession,
          currentQuestionIndex: data.currentQuestionIndex,
          currentQuestion: data.nextQuestion
        };
        setActiveSession(updatedState);
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedState));
        toast.success(isSkipped ? 'Question skipped.' : 'Answer submitted successfully!');
      } else {
        // Last question submitted - update index index, and session state remains, but hasMoreQuestions false
        const updatedState: ActiveSessionState = {
          ...activeSession,
          currentQuestionIndex: activeSession.questionCount // finished
        };
        setActiveSession(updatedState);
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedState));
        toast.success('All questions answered! Preparing evaluation report...');
      }
      return data;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to submit answer';
      toast.error(msg);
      throw error;
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const finishSession = async () => {
    if (!activeSession) {
      toast.error('No active session to complete');
      return;
    }

    try {
      setCompletingSession(true);
      const result = await completeSession(activeSession.sessionId);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      setActiveSession(null);
      toast.success('Mock interview completed and report generated successfully!');
      return result;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to compile report';
      toast.error(msg);
      throw error;
    } finally {
      setCompletingSession(false);
    }
  };

  const cancelActiveSession = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setActiveSession(null);
    toast('Session abandoned.');
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submittingAnswer,
    completingSession,
    activeSession,
    history,
    analytics,
    startNewSession,
    submitResponse,
    finishSession,
    cancelActiveSession,
    loadHistory,
    loadAnalytics
  };
};
