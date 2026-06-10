import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  BookOpen,
  Code2,
  XCircle,
  History,
  Bot,
  User,
  CornerDownLeft,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useMockInterview } from '../hooks/useMockInterview';
import { useConfirm } from '../context/ConfirmContext';


interface ChatMessage {
  type: 'ai' | 'user';
  text: string;
  isSkipped?: boolean;
}

const MockInterview = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const {
    loading,
    submittingAnswer,
    completingSession,
    activeSession,
    analytics,
    startNewSession,
    submitResponse,
    finishSession,
    cancelActiveSession,
    loadHistory,
    loadAnalytics
  } = useMockInterview();

  // Mode state: 'setup' | 'interview'
  const [viewMode, setViewMode] = useState<'setup' | 'interview'>('setup');
  
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

  // Conversation history log
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Ref to scroll to bottom of chat
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Load history and analytics on mount
  useEffect(() => {
    loadHistory();
    loadAnalytics();
  }, []);

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

  // Restore chat history from Session Storage on activeSession change
  useEffect(() => {
    if (activeSession) {
      const savedChat = sessionStorage.getItem(`interviewos_chat_history_${activeSession.sessionId}`);
      if (savedChat) {
        try {
          setChatHistory(JSON.parse(savedChat));
        } catch (e) {
          console.error('Failed to parse saved chat history', e);
          setChatHistory([{ type: 'ai', text: activeSession.currentQuestion.questionText }]);
        }
      } else {
        setChatHistory([{ type: 'ai', text: activeSession.currentQuestion.questionText }]);
      }
    } else {
      setChatHistory([]);
    }
  }, [activeSession?.sessionId]);

  // Auto scroll to bottom of chat log when new items are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, submittingAnswer]);

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
    const isConfirmed = await confirm('Are you sure you want to end the interview now? Your answers so far will be evaluated.', {
      title: 'End Interview',
      confirmText: 'End & Evaluate',
      variant: 'warning'
    });
    if (isConfirmed) {
      triggerEvaluation();
    }
  };


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
      const session = await startNewSession({
        jobDescription,
        resumeText,
        selfDescription,
        candidateWeaknesses,
        interviewType,
        difficulty,
        questionCount
      });
      setUserAnswer('');
      if (session) {
        const initialChat: ChatMessage[] = [{ type: 'ai', text: session.firstQuestion.questionText }];
        setChatHistory(initialChat);
        sessionStorage.setItem(`interviewos_chat_history_${session.sessionId}`, JSON.stringify(initialChat));
      }
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
      const currentAnswer = userAnswer;
      setUserAnswer(''); // Clear input early for high responsiveness
      const data = await submitResponse(currentAnswer, false);
      if (data && activeSession) {
        const newHistory: ChatMessage[] = [
          ...chatHistory,
          { type: 'user', text: currentAnswer }
        ];
        if (data.hasMoreQuestions && data.nextQuestion) {
          newHistory.push({ type: 'ai', text: data.nextQuestion.questionText });
        }
        setChatHistory(newHistory);
        sessionStorage.setItem(`interviewos_chat_history_${activeSession.sessionId}`, JSON.stringify(newHistory));
      }
    } catch (error) {
      // Handled in custom hook
    }
  };

  const handleSkipQuestion = async () => {
    try {
      const data = await submitResponse('', true);
      if (data && activeSession) {
        const newHistory: ChatMessage[] = [
          ...chatHistory,
          { type: 'user', text: '[Skipped Question]', isSkipped: true }
        ];
        if (data.hasMoreQuestions && data.nextQuestion) {
          newHistory.push({ type: 'ai', text: data.nextQuestion.questionText });
        }
        setChatHistory(newHistory);
        sessionStorage.setItem(`interviewos_chat_history_${activeSession.sessionId}`, JSON.stringify(newHistory));
      }
    } catch (error) {
      // Handled in custom hook
    }
  };

  const handleCancelSession = async () => {
    const isConfirmed = await confirm('Are you sure you want to abandon this session? All progress will be lost.', {
      title: 'Abandon Session',
      confirmText: 'Abandon',
      variant: 'danger'
    });
    if (isConfirmed) {
      if (activeSession) {
        sessionStorage.removeItem(`interviewos_chat_history_${activeSession.sessionId}`);
      }
      cancelActiveSession();
      setViewMode('setup');
    }
  };

  const fillDemoData = () => {
    setJobDescription(`Senior Frontend Engineer (React/TypeScript)
Role Overview:
We are looking for a Senior Frontend Engineer to join our product team. You will lead the development of modern web applications using React, TypeScript, and Tailwind CSS.

Requirements:
- 5+ years of software development experience.
- Strong proficiency in React, hooks, state management, and modern Web APIs.
- Experience with testing libraries (Jest, React Testing Library).
- Familiarity with CI/CD and cloud deployment.`);

    setResumeText(`Rohit Kumar
frontend-engineer-rohit@example.com | Bengaluru, India

Summary:
Frontend Engineer with 3.5 years of experience specialized in building responsive, accessible, and high-performance web applications using React, TypeScript, and modern JavaScript.

Technical Skills:
- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3
- Frameworks & Libraries: React, Redux Toolkit, Tailwind CSS, Next.js
- Tools & Testing: Git, Webpack, Jest, React Testing Library, Docker

Work Experience:
Software Engineer at DevTech Solutions (2023 - Present)
- Architected and built a new dashboard service using React and Tailwind CSS, improving page load speeds by 25%.
- Maintained 90%+ test coverage across critical client pathways.
- Mentored junior engineers on frontend best practices.`);

    setSelfDescription(`3.5 years of frontend experience. Strong in React state management but looking to demonstrate system design capability and advance into senior roles.`);
    setCandidateWeaknesses(`Testing complex stateful components; deployment pipelines/Docker.`);
    
    toast.success('Loaded premium demo profile context!');
  };

  const clearForm = () => {
    setJobDescription('');
    setResumeText('');
    setSelfDescription('');
    setCandidateWeaknesses('');
    toast.success('Form cleared!');
  };

  // Keyboard listener to support Ctrl+Enter submission shortcut
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Title Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-8 h-8 text-teal-500" />
              <h1 className="text-4xl font-black bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                AI Mock Interview
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Interactive, profile-aware mock interviews with instant evaluation scorecard reports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (activeSession) {
                  const isConfirmed = await confirm('You have an active interview session. Are you sure you want to abandon it and start a new one?', {
                    title: 'Abandon Session',
                    confirmText: 'Abandon & Start New',
                    variant: 'danger'
                  });
                  if (isConfirmed) {
                    sessionStorage.removeItem(`interviewos_chat_history_${activeSession.sessionId}`);
                    cancelActiveSession();
                    setViewMode('setup');
                    navigate('/mock-interview');
                  }
                } else {
                  setViewMode('setup');
                  navigate('/mock-interview');
                }
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                viewMode === 'setup' 
                  ? 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400' 
                  : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-250'
              }`}
              disabled={loading}
            >
              Start New
            </button>
            <button
              onClick={() => navigate('/mock-interview/history')}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all border bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-250"
              disabled={!!activeSession}
            >
              <History className="w-4 h-4 inline mr-1" />
              History
            </button>
            <button
              onClick={() => navigate('/mock-interview/analytics')}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all border bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-250"
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
        {/* LEFT COLUMN: SETUP OR INTERVIEW CONTAINER */}
        {/* ======================================================== */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SETUP SCREEN */}
          {viewMode === 'setup' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 md:p-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/50 rounded-3xl space-y-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-teal-500" />
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Configure Your Profile Context</h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fillDemoData}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/20 dark:border-teal-400/20 rounded-xl transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Try Demo Profile
                  </button>
                  <button
                    type="button"
                    onClick={clearForm}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl transition-all"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300">Target Job Description *</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">Details of the target role</span>
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the target job description details here..."
                    rows={5}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all text-sm resize-none custom-scrollbar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300">Resume Content *</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">Paste your raw resume text</span>
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume content, projects, achievements, and work experience here..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all text-sm resize-none custom-scrollbar"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Self Description (Optional)</label>
                    <textarea
                      value={selfDescription}
                      onChange={(e) => setSelfDescription(e.target.value)}
                      placeholder="e.g. 3 years exp, looking to switch to React frameworks..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all text-sm resize-none custom-scrollbar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Stated Weaknesses (Optional)</label>
                    <textarea
                      value={candidateWeaknesses}
                      onChange={(e) => setCandidateWeaknesses(e.target.value)}
                      placeholder="e.g. Weak in testing, lack of AWS sharding knowledge..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all text-sm resize-none custom-scrollbar"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartInterview}
                disabled={loading || !jobDescription.trim() || !resumeText.trim()}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 transition-all hover:scale-[1.005] active:scale-[0.995] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    AI Generating Custom Interview Questions...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Generate Session & Start Interview
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* INTERVIEW CHAT SCREEN */}
          {viewMode === 'interview' && activeSession && (
            <div className="space-y-6">
              {completingSession || activeSession.currentQuestionIndex >= activeSession.questionCount ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 md:p-12 text-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/50 rounded-3xl flex flex-col items-center justify-center gap-6 shadow-sm min-h-[500px]"
                >
                  {completingSession ? (
                    <>
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                        <Sparkles className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent animate-pulse">
                          Evaluating Your Performance
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                          Our AI interviewer is grading your responses, building category matrices, and compiling your action roadmap. This will only take a moment...
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-12 h-12 text-pink-500 animate-bounce" />
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                          Evaluation Interrupted
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                          All questions have been answered, but the evaluation report generation failed or was interrupted.
                        </p>
                      </div>
                      <button
                        onClick={triggerEvaluation}
                        className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-2xl shadow-lg transition-all"
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
                  className="p-5 md:p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/50 rounded-3xl relative overflow-hidden shadow-sm flex flex-col gap-5"
                >
                  {/* Status header banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-extrabold text-sm text-teal-600 dark:text-teal-400 uppercase tracking-wider">Live Mock Interview Session</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl">
                      <Clock className="w-3.5 h-3.5 text-teal-500" />
                      <span>Question {activeSession.currentQuestionIndex + 1} of {activeSession.questionCount}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="-mt-2 space-y-1">
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((activeSession.currentQuestionIndex + 1) / activeSession.questionCount) * 100}%` }}
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>

                  {/* Chat Conversation Thread */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-1 p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 h-[480px] custom-scrollbar flex flex-col gap-4">
                    {chatHistory.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 max-w-[85%] ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm font-bold text-xs ${
                          msg.type === 'user'
                            ? 'bg-gradient-to-br from-teal-500 to-cyan-500'
                            : 'bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800'
                        }`}>
                          {msg.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-teal-400" />}
                        </div>
                        
                        <div className={`p-4 rounded-2xl leading-relaxed text-sm ${
                          msg.type === 'user'
                            ? 'bg-teal-500 text-white rounded-tr-none shadow-sm shadow-teal-500/10'
                            : 'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm'
                        }`}>
                          {msg.isSkipped ? (
                            <span className="italic opacity-85 flex items-center gap-1.5 text-xs font-semibold">
                              <XCircle className="w-3.5 h-3.5 text-rose-300" />
                              [Question Skipped]
                            </span>
                          ) : (
                            <p className="whitespace-pre-line text-sm md:text-[14.5px]">{msg.text}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Typing/Thinking indicator */}
                    {submittingAnswer && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 max-w-[85%]"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white bg-gradient-to-br from-slate-600 to-slate-700 text-xs shadow-sm font-bold">
                          <Bot className="w-4 h-4 text-teal-400" />
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </motion.div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Hints box if the active question has one */}
                  {activeSession.currentQuestion.hint && !submittingAnswer && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2"
                    >
                      <span className="text-amber-500">💡</span>
                      <span className="leading-relaxed"><strong className="font-semibold">Hint:</strong> {activeSession.currentQuestion.hint}</span>
                    </motion.div>
                  )}

                  {/* Input Response Box */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Your Answer Response</label>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{userAnswer.length} characters</span>
                      </div>
                      <textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your structured answer here. Include specific metrics, STAR framework, or technologies where appropriate..."
                        rows={4}
                        disabled={submittingAnswer || completingSession}
                        className="w-full px-4 py-3 bg-white/60 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all text-sm resize-none custom-scrollbar"
                      />
                      <div className="flex items-center justify-between mt-1 text-[10.5px] text-slate-400 dark:text-slate-500 font-medium">
                        <span>Aim for 200+ characters for high accuracy feedback metrics.</span>
                        <span className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                          <CornerDownLeft className="w-3 h-3 text-slate-400" /> Ctrl+Enter to submit
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {activeSession.currentQuestionIndex < activeSession.questionCount - 1 ? (
                        <>
                          <button
                            onClick={handleSubmitAnswer}
                            disabled={submittingAnswer || !userAnswer.trim()}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold rounded-2xl shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submittingAnswer ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Submitting Response...
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
                            className="py-3 px-5 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-500 dark:text-slate-400 font-bold rounded-2xl transition-all text-sm bg-white/40 dark:bg-slate-900/40"
                          >
                            Skip
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={submittingAnswer || completingSession || !userAnswer.trim()}
                          className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submittingAnswer ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Submitting Final Response...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Submit & Generate Scorecard Report
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={handleEndInterview}
                        disabled={completingSession || submittingAnswer}
                        className="py-3 px-5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 border border-rose-500/20 text-sm"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        End Early
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: SIDEBAR */}
        {/* ======================================================== */}
        <div className="space-y-6">
          
          {/* Active session warning card */}
          {activeSession && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-3xl space-y-3"
            >
              <h3 className="font-bold text-sm text-rose-500 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
                Active Session Detected
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You are currently in an active mock interview. Exiting or reloading does not lose your state, but to start a new configuration, you must abandon this.
              </p>
              <button
                onClick={handleCancelSession}
                className="w-full py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md hover:bg-rose-600 transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Abandon Active Session
              </button>
            </motion.div>
          )}

          {/* Session Settings Configurator Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/50 rounded-3xl shadow-sm space-y-5"
          >
            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <SettingsIcon className="w-4.5 h-4.5 text-teal-500" />
              <span className="text-slate-800 dark:text-slate-200">Session Settings</span>
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">Interview Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'behavioral', label: 'Behavioral', icon: MessageSquare },
                    { id: 'technical', label: 'Technical', icon: Code2 },
                    { id: 'system-design', label: 'System Design', icon: BookOpen },
                  ].map((type) => {
                    const Icon = type.icon;
                    const isSelected = interviewType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        disabled={!!activeSession}
                        onClick={() => setInterviewType(type.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? 'bg-teal-500/10 border-teal-500 text-teal-600 dark:text-teal-400 font-semibold shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-teal-500' : 'text-slate-450'}`} />
                        <span className="text-[10px] md:text-xs leading-none">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'easy', label: 'Easy', colorClass: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5' },
                    { id: 'medium', label: 'Medium', colorClass: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5' },
                    { id: 'hard', label: 'Hard', colorClass: 'border-pink-500/40 text-pink-600 dark:text-pink-400 bg-pink-500/5' },
                  ].map((lvl) => {
                    const isSelected = difficulty === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        disabled={!!activeSession}
                        onClick={() => setDifficulty(lvl.id)}
                        className={`py-2 rounded-2xl border text-center text-xs transition-all ${
                          isSelected
                            ? `${lvl.colorClass} font-bold ring-2 ring-teal-500/15`
                            : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                        } disabled:opacity-50`}
                      >
                        {lvl.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">Question Count</label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((count) => {
                    const isSelected = questionCount === count;
                    return (
                      <button
                        key={count}
                        type="button"
                        disabled={!!activeSession}
                        onClick={() => setQuestionCount(count)}
                        className={`py-2.5 rounded-2xl border text-center text-xs transition-all ${
                          isSelected
                            ? 'bg-teal-500/10 border-teal-500 text-teal-600 dark:text-teal-400 font-bold shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                        } disabled:opacity-50`}
                      >
                        {count} Questions
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Analytics Summary Panel */}
          {analytics && analytics.totalInterviews > 0 && !activeSession && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/50 rounded-3xl shadow-sm space-y-4"
            >
              <h3 className="font-bold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <TrendingUp className="w-4 h-4 text-teal-500" />
                <span className="text-slate-800 dark:text-slate-100">Aggregated Stats</span>
              </h3>
              <div className="space-y-3 text-xs md:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 dark:text-slate-400">Total Interviews</span>
                  <span className="font-extrabold">{analytics.totalInterviews}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 dark:text-slate-400">Average Score</span>
                  <span className="font-extrabold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-lg border border-teal-500/20">{analytics.averageOverallScore}%</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400 dark:text-slate-400 font-semibold">Type Breakdown:</span>
                </div>
                <div className="pl-3 space-y-2 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Technical</span>
                    <span className="font-semibold">{analytics.typeDistribution.technical} sessions</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Behavioral</span>
                    <span className="font-semibold">{analytics.typeDistribution.behavioral} sessions</span>
                  </div>
                  <div className="flex justify-between">
                    <span>System Design</span>
                    <span className="font-semibold">{analytics.typeDistribution['system-design']} sessions</span>
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
