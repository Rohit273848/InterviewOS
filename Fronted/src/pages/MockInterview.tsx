import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Square, 
  Send, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  Settings as SettingsIcon,
  AlertTriangle,
  TrendingUp,
  Award,
  ChevronDown,
  BookOpen,
  Code2,
  XCircle,
  History,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useMockInterview } from '../hooks/useMockInterview';
import { SessionReportResponse } from '../services/mockInterview.service';

const MockInterview = () => {
  const navigate = useNavigate();
  const {
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
  } = useMockInterview();

  // Mode state: 'setup', 'interview', 'report', 'history'
  const [viewMode, setViewMode] = useState<'setup' | 'interview' | 'report' | 'history'>('setup');
  
  // Setup form states
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [candidateWeaknesses, setCandidateWeaknesses] = useState('');
  
  // Parameter settings
  const [interviewType, setInterviewType] = useState('behavioral');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);

  // Chat interface answer state
  const [userAnswer, setUserAnswer] = useState('');

  // Finished report state
  const [reportData] = useState<SessionReportResponse | null>(null);
  const [fetchingReport] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Load history and analytics on mount
  useEffect(() => {
    loadHistory();
    loadAnalytics();
  }, []);

  const triggerEvaluation = async () => {
    if (completingSession) return;
    try {
      const result = await finishSession();
      if (result) {
        navigate(`/mock-interview/report/${result.sessionId}`);
      }
    } catch (error) {
      // Handled in custom hook
    }
  };

  const handleEndInterview = async () => {
    if (window.confirm('Are you sure you want to end the interview now? Your answers so far will be evaluated.')) {
      triggerEvaluation();
    }
  };

  // Monitor active session status and transition view modes
  useEffect(() => {
    if (activeSession) {
      setViewMode('interview');
      // Automatically trigger evaluation if session is complete (all questions answered)
      if (activeSession.currentQuestionIndex >= activeSession.questionCount && !completingSession) {
        triggerEvaluation();
      }
    } else {
      setViewMode('setup');
    }
  }, [activeSession, completingSession]);

  const handleStartInterview = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please provide the target Job Description');
      return;
    }
    if (!resumeText.trim()) {
      toast.error('Please paste your Resume content');
      return;
    }

    try {
      await startNewSession({
        jobDescription,
        resumeText,
        selfDescription,
        candidateWeaknesses,
        interviewType,
        difficulty,
        questionCount
      });
      setUserAnswer('');
    } catch (error) {
      // Handled in custom hook
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please enter your response');
      return;
    }

    if (userAnswer.trim().length < 20) {
      toast.error('Answer is too short. Please provide a more detailed answer.');
      return;
    }

    try {
      await submitResponse(userAnswer, false);
      setUserAnswer('');
    } catch (error) {
      // Handled in custom hook
    }
  };

  const handleSkipQuestion = async () => {
    try {
      await submitResponse('', true);
      setUserAnswer('');
    } catch (error) {
      // Handled in custom hook
    }
  };

  const viewPastReport = (sessionId: string) => {
    navigate(`/mock-interview/report/${sessionId}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent-green border-accent-green/20 bg-accent-green/10';
    if (score >= 60) return 'text-accent-cyan border-accent-cyan/20 bg-accent-cyan/10';
    if (score >= 40) return 'text-accent-yellow border-accent-yellow/20 bg-accent-yellow/10';
    return 'text-accent-pink border-accent-pink/20 bg-accent-pink/10';
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Title Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-8 h-8 text-accent-green" />
              <h1 className="text-4xl font-black bg-gradient-to-r from-accent-green to-accent-cyan bg-clip-text text-transparent">
                AI Mock Interview
              </h1>
            </div>
            <p className="text-text-secondary text-sm dark:text-slate-400">
              Interactive, profile-aware mock interviews with instant evaluation scorecard reports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeSession) {
                  if (window.confirm('You have an active interview session. Are you sure you want to abandon it and start a new one?')) {
                    cancelActiveSession();
                    setViewMode('setup');
                    navigate('/mock-interview');
                  }
                } else {
                  setViewMode('setup');
                  navigate('/mock-interview');
                }
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${viewMode === 'setup' ? 'bg-accent-green/10 border-accent-green/30 text-accent-green' : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
              disabled={loading}
            >
              Start New
            </button>
            <button
              onClick={() => navigate('/mock-interview/history')}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all border bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              disabled={!!activeSession}
            >
              <History className="w-4 h-4 inline mr-1" />
              History
            </button>
            <button
              onClick={() => navigate('/mock-interview/analytics')}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all border bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              disabled={!!activeSession}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Analytics
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Container Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* ======================================================== */}
        {/* SETUP SCREEN */}
        {/* ======================================================== */}
        {viewMode === 'setup' && (
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 md:p-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-850 rounded-3xl space-y-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-accent-green" />
                <h2 className="text-2xl font-bold">Configure Your Profile Context</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 flex items-center justify-between">
                    <span>Target Job Description *</span>
                    <span className="text-xs text-slate-400 font-normal">Details of the target role</span>
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the target job description details here..."
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 transition-all text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 flex items-center justify-between">
                    <span>Resume Content *</span>
                    <span className="text-xs text-slate-400 font-normal">Paste your raw resume text</span>
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume content, projects, achievements, and work experience here..."
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 transition-all text-sm resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Self Description (Optional)</label>
                    <textarea
                      value={selfDescription}
                      onChange={(e) => setSelfDescription(e.target.value)}
                      placeholder="e.g. 3 years exp, looking to switch to React frameworks..."
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 transition-all text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Stated Weaknesses (Optional)</label>
                    <textarea
                      value={candidateWeaknesses}
                      onChange={(e) => setCandidateWeaknesses(e.target.value)}
                      placeholder="e.g. Weak in testing, lack of AWS sharding knowledge..."
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 transition-all text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartInterview}
                disabled={loading || !jobDescription.trim() || !resumeText.trim()}
                className="w-full py-4 bg-gradient-to-r from-accent-green to-accent-cyan text-white font-bold rounded-2xl shadow-lg shadow-accent-green/10 hover:shadow-accent-green/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    AI Generating Custom Interview questions...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Generate Session & Start Interview
                  </>
                )}
              </button>
            </motion.div>
          </div>
        )}

        {/* ======================================================== */}
        {/* INTERVIEW CHAT SCREEN */}
        {/* ======================================================== */}
        {viewMode === 'interview' && activeSession && (
          <div className="lg:col-span-2 space-y-6">
            {completingSession || activeSession.currentQuestionIndex >= activeSession.questionCount ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 md:p-12 text-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-850 rounded-3xl flex flex-col items-center justify-center gap-6 shadow-sm min-h-[400px]"
              >
                {completingSession ? (
                  <>
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-accent-green border-t-transparent rounded-full animate-spin" />
                      <Sparkles className="w-6 h-6 text-accent-cyan absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-accent-green to-accent-cyan bg-clip-text text-transparent animate-pulse">
                        Evaluating Your Performance
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                        Our AI interviewer is grading your responses, building category matrices, and compiling your action roadmap. This will only take a moment...
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-12 h-12 text-accent-pink animate-bounce" />
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        Evaluation Failed / Interrupted
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                        All questions have been answered, but the evaluation report generation was interrupted or failed.
                      </p>
                    </div>
                    <button
                      onClick={triggerEvaluation}
                      className="px-6 py-3 bg-accent-green hover:bg-accent-green/90 text-white font-bold rounded-xl shadow-lg transition-all"
                    >
                      Retry Report Generation
                    </button>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 md:p-8 bg-gradient-to-br from-accent-green/10 to-accent-cyan/10 dark:from-slate-900 dark:to-slate-950 border border-accent-green/20 dark:border-slate-850 rounded-3xl relative overflow-hidden shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-accent-green animate-pulse" />
                    <span className="font-bold text-sm text-accent-green uppercase tracking-wide">Live Mock Interview</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Question {activeSession.currentQuestionIndex + 1} of {activeSession.questionCount}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((activeSession.currentQuestionIndex + 1) / activeSession.questionCount) * 100}%` }}
                    className="h-full bg-gradient-to-r from-accent-green to-accent-cyan"
                    transition={{ duration: 0.4 }}
                  />
                </div>

                {/* Question Panel */}
                <div className="mb-6 p-5 bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-green flex items-center justify-center flex-shrink-0 text-white font-bold shadow-md">
                    AI
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase text-accent-cyan tracking-wider">Interviewer Prompt</div>
                    <p className="text-base md:text-lg leading-relaxed font-semibold">
                      {activeSession.currentQuestion.questionText}
                    </p>
                    {activeSession.currentQuestion.hint && (
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-accent-yellow">💡</span>
                        <span>{activeSession.currentQuestion.hint}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input Area */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Write Your Answer</label>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Provide a detailed answer. Incorporate specific projects, metrics, or technologies where appropriate..."
                      rows={6}
                      disabled={submittingAnswer || completingSession}
                      className="w-full px-4 py-3 bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all text-sm resize-none"
                    />
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-400 font-medium">
                      <span>{userAnswer.length} characters</span>
                      <span>Aim for 200+ characters for accurate evaluation</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {activeSession.currentQuestionIndex < activeSession.questionCount - 1 ? (
                      <>
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={submittingAnswer || !userAnswer.trim()}
                          className="flex-1 py-3 px-6 bg-accent-cyan text-slate-950 font-bold rounded-xl shadow-lg shadow-accent-cyan/10 hover:shadow-accent-cyan/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {submittingAnswer ? (
                            <>
                              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Submit Answer
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={handleSkipQuestion}
                          disabled={submittingAnswer}
                          className="py-3 px-6 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold rounded-xl transition-all"
                        >
                          Skip Question
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={submittingAnswer || completingSession || !userAnswer.trim()}
                        className="flex-1 py-3 px-6 bg-accent-green text-white font-bold rounded-xl shadow-lg shadow-accent-green/10 hover:shadow-accent-green/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingAnswer ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Submit Final Answer & Grade
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={handleEndInterview}
                      disabled={completingSession || submittingAnswer}
                      className="py-3 px-6 bg-accent-pink/15 text-accent-pink border border-accent-pink/20 hover:bg-accent-pink/20 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      End Session
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* REPORT SCREEN */}
        {/* ======================================================== */}
        {viewMode === 'report' && (
          <div className="lg:col-span-2 space-y-6">
            {fetchingReport ? (
              <div className="p-12 text-center bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-accent-green border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">Fetching evaluation scorecard from server...</p>
              </div>
            ) : reportData ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Score Summary */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Circle Score */}
                  <div className="p-6 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent-green/5 rounded-full blur-2xl" />
                    <div className="flex items-center gap-1.5 self-start text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                      <Award className="w-4 h-4 text-accent-green" />
                      <span>Mock Interview Score</span>
                    </div>

                    <div className="relative flex items-center justify-center w-28 h-28 my-2">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="46" className="stroke-slate-100 dark:stroke-slate-800 fill-none" strokeWidth="6" />
                        <circle
                          cx="56"
                          cy="56"
                          r="46"
                          className="stroke-accent-green fill-none transition-all duration-1000"
                          strokeWidth="6"
                          strokeDasharray="289"
                          strokeDashoffset={289 - (289 * reportData.overallScore) / 100}
                        />
                      </svg>
                      <span className="absolute text-2xl font-black">{reportData.overallScore}%</span>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-sm font-bold">
                        {reportData.overallScore >= 80 ? 'Excellent Prep Match!' : reportData.overallScore >= 60 ? 'Good Match, minor gaps' : 'Requires optimization'}
                      </h3>
                    </div>
                  </div>

                  {/* Dimensions scores */}
                  <div className="p-6 md:col-span-2 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm space-y-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-accent-cyan" />
                      <span>Competency Matrix Breakdowns</span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3 text-xs">
                      {Object.entries(reportData.categoryScores).map(([key, val]) => (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between font-semibold">
                            <span className="capitalize text-slate-500">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="font-bold">{val}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent-cyan" 
                              style={{ width: `${val}%` }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Improvements and Actions Plan */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Improvements Areas */}
                  <div className="p-6 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-accent-pink flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Key Improvement Areas
                    </h3>
                    {reportData.keyImprovementAreas.length > 0 ? (
                      <ul className="space-y-2.5 text-xs md:text-sm text-slate-500 dark:text-slate-450 leading-relaxed">
                        {reportData.keyImprovementAreas.map((item, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className="text-accent-pink font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-400">Excellent responses! No major weaknesses flagged.</p>
                    )}
                  </div>

                  {/* Actions Timeline */}
                  <div className="p-6 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-accent-green flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Action Preparation Plan
                    </h3>
                    <div className="space-y-3.5">
                      {reportData.actionPlan.map((action, idx) => (
                        <div key={idx} className="flex gap-3 text-xs">
                          <div className="w-5 h-5 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green flex items-center justify-center font-bold flex-shrink-0">
                            {action.step}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200">{action.topic}</h4>
                            <p className="text-slate-500 leading-normal">{action.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Q&A Accordion Reviews */}
                <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent-cyan" />
                    Question-by-Question Evaluation Logs
                  </h3>

                  <div className="space-y-4">
                    {reportData.questionsAndAnswers.map((qa, idx) => {
                      const isExpanded = expandedQuestion === idx;
                      return (
                        <div key={idx} className="border border-slate-150 dark:border-slate-850 rounded-2xl bg-white/40 dark:bg-slate-950/20 overflow-hidden">
                          <button
                            onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                            className="w-full flex items-center justify-between p-4 text-left group"
                          >
                            <div className="flex-1 pr-4">
                              <div className="flex items-center gap-3 mb-1.5">
                                <span className="text-xs font-bold text-accent-cyan uppercase">Question {qa.questionNumber}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${getScoreColor(qa.score)}`}>
                                  Score: {qa.score}%
                                </span>
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full capitalize">
                                  {qa.source.replace(/([A-Z])/g, ' $1')}
                                </span>
                              </div>
                              <h4 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-accent-cyan transition-colors">
                                {qa.questionText}
                              </h4>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-slate-150 dark:border-slate-850 p-4 bg-slate-50/50 dark:bg-slate-950/40 text-xs md:text-sm space-y-4"
                              >
                                {/* Response Text */}
                                <div>
                                  <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Your Answer:</div>
                                  <p className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl leading-relaxed italic">
                                    {qa.isSkipped ? '[No Answer Submitted / Skipped]' : `"${qa.answerText}"`}
                                  </p>
                                </div>

                                {/* Strengths / Weaknesses list */}
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <div className="font-bold text-accent-green uppercase tracking-wider text-[10px]">Strengths:</div>
                                    {qa.strengths.length > 0 ? (
                                      <ul className="list-disc pl-4 space-y-1 text-slate-500 leading-normal">
                                        {qa.strengths.map((s, sIdx) => <li key={sIdx}>{s}</li>)}
                                      </ul>
                                    ) : <p className="text-slate-400 italic">No specific strengths listed.</p>}
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="font-bold text-accent-pink uppercase tracking-wider text-[10px]">Weaknesses:</div>
                                    {qa.weaknesses.length > 0 ? (
                                      <ul className="list-disc pl-4 space-y-1 text-slate-500 leading-normal">
                                        {qa.weaknesses.map((w, wIdx) => <li key={wIdx}>{w}</li>)}
                                      </ul>
                                    ) : <p className="text-slate-400 italic">No weaknesses found.</p>}
                                  </div>
                                </div>

                                {/* Better answer suggestions */}
                                {qa.betterAnswer && (
                                  <div className="space-y-1.5 pt-2 border-t border-slate-150 dark:border-slate-850">
                                    <div className="font-bold text-accent-cyan uppercase tracking-wider text-[10px] flex items-center gap-1">
                                      <Code2 className="w-3.5 h-3.5" />
                                      AI Model Answer Suggestion:
                                    </div>
                                    <p className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl leading-relaxed text-slate-600 dark:text-slate-350">
                                      {qa.betterAnswer}
                                    </p>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-8 text-center text-slate-400">Report details missing. Try refreshing the session.</div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* HISTORY SCREEN */}
        {/* ======================================================== */}
        {viewMode === 'history' && (
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm space-y-6"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <History className="w-6 h-6 text-accent-cyan" />
                Mock Interview Logs
              </h2>

              {loading ? (
                <div className="py-12 text-center text-slate-400">Loading history logs...</div>
              ) : history.length === 0 ? (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-3">
                  <XCircle className="w-8 h-8 text-slate-350" />
                  <p>No completed interviews found. Start your first session to receive evaluations.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-1">
                  {history.map((item) => (
                    <div 
                      key={item._id || item.sessionId} 
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group hover:bg-slate-50/50 dark:hover:bg-slate-950/20 px-2 rounded-xl transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-accent-cyan uppercase">{item.interviewType}</span>
                          <span className="text-slate-400">•</span>
                          <span className="capitalize text-slate-400">{item.difficulty}</span>
                        </div>
                        <h4 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200">
                          {item.questionCount} Questions Mock Prep
                        </h4>
                        <p className="text-xs text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            dateStyle: 'medium'
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`text-sm font-extrabold px-3 py-1 border rounded-lg ${getScoreColor(item.overallScore)}`}>
                          {item.overallScore}%
                        </div>
                        <button
                          onClick={() => viewPastReport(item._id || item.sessionId)}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-all"
                        >
                          View Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SIDEBAR */}
        {/* ======================================================== */}
        <div className="space-y-6">
          
          {/* Active session cancel indicator */}
          {activeSession && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-5 bg-accent-pink/10 border border-accent-pink/20 rounded-2xl space-y-3"
            >
              <h3 className="font-bold text-sm text-accent-pink flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
                Active Session Detected
              </h3>
              <p className="text-xs text-slate-500 leading-normal">
                You are currently in an active mock interview. Exiting or reloading does not lose your state, but to start a new configuration, you must abandon this.
              </p>
              <button
                onClick={cancelActiveSession}
                className="w-full py-2 bg-accent-pink text-white font-bold text-xs rounded-lg shadow-md hover:bg-accent-pink/90 transition-all"
              >
                Abandon Active Session
              </button>
            </motion.div>
          )}

          {/* Configuration Settings Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm space-y-4"
          >
            <h3 className="text-lg font-bold flex items-center gap-2">
              <SettingsIcon className="w-4 h-4 text-slate-400" />
              Session Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Interview Type</label>
                <select 
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  disabled={!!activeSession}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-accent-green disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="behavioral">Behavioral</option>
                  <option value="technical">Technical</option>
                  <option value="system-design">System Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Difficulty</label>
                <select 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  disabled={!!activeSession}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-accent-green disabled:opacity-50"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Question Count</label>
                <select 
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  disabled={!!activeSession}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-accent-green disabled:opacity-50"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Quick Analytics Summary Panel */}
          {analytics && analytics.totalInterviews > 0 && !activeSession && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm space-y-4"
            >
              <h3 className="font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent-cyan" />
                Aggregated Stats
              </h3>
              <div className="space-y-3 text-xs md:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Interviews</span>
                  <span className="font-bold">{analytics.totalInterviews}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Average Score</span>
                  <span className="font-bold text-accent-green">{analytics.averageOverallScore}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-normal">Type Breakdown:</span>
                </div>
                <div className="pl-3 space-y-1.5 text-xs text-slate-450">
                  <div className="flex justify-between">
                    <span>Technical</span>
                    <span>{analytics.typeDistribution.technical} sessions</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Behavioral</span>
                    <span>{analytics.typeDistribution.behavioral} sessions</span>
                  </div>
                  <div className="flex justify-between">
                    <span>System Design</span>
                    <span>{analytics.typeDistribution['system-design']} sessions</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};

export default MockInterview;
