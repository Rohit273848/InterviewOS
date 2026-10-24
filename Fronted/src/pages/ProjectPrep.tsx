import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Github,
  Sparkles,
  Trash2,
  History,
  BookOpen,
  Key,
  Search,
  FileText,
  CheckCircle2,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Layers,
  ShieldCheck,
  Cpu,
  Database,
  Activity,
  Video,
  Trophy,
  Loader2,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useProjectPrep } from '../hooks/useProjectPrep';
import { useConfirm } from '../context/ConfirmContext';

const CATEGORIES = [
  'All',
  '★ Bookmarked',
  'Architecture',
  'Database',
  'Security',
  'Performance',
  'Scalability',
  'Deployment',
  'Tradeoffs'
];

const DEMO_REPOSITORIES = [
  { name: 'React', url: 'https://github.com/facebook/react', desc: 'UI component library' },
  { name: 'Next.js', url: 'https://github.com/vercel/next.js', desc: 'Full-stack React framework' },
  { name: 'Express', url: 'https://github.com/expressjs/express', desc: 'Node.js server framework' },
  { name: 'Tailwind CSS', url: 'https://github.com/tailwindlabs/tailwindcss', desc: 'Utility-first CSS framework' }
];

// Helper to render category icon
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'architecture':
      return <Layers className="w-3.5 h-3.5" />;
    case 'database':
      return <Database className="w-3.5 h-3.5" />;
    case 'security':
      return <ShieldCheck className="w-3.5 h-3.5" />;
    case 'performance':
      return <Activity className="w-3.5 h-3.5" />;
    case 'scalability':
      return <Cpu className="w-3.5 h-3.5" />;
    default:
      return <BookOpen className="w-3.5 h-3.5" />;
  }
};

// Difficulty badge styling
const getDifficultyBadge = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30';
    case 'hard':
      return 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30';
    case 'medium':
    default:
      return 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30';
  }
};

// Study Notes component with isolated local state to prevent whole-page re-renders
const AnswerNotes = ({ sessionId, questionIdx }: { sessionId: string; questionIdx: number }) => {
  const localStorageKey = `prep_notes_${sessionId}_${questionIdx}`;
  const [note, setNote] = useState(() => localStorage.getItem(localStorageKey) || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNote(val);
    localStorage.setItem(localStorageKey, val);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="mt-4 pt-3.5 border-t border-slate-200/60 dark:border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5 text-teal-500" />
          My Interview Talking Points & Notes
        </label>
        {isSaved && (
          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1 transition-opacity">
            <Check className="w-3 h-3" /> Auto-saved
          </span>
        )}
      </div>
      <textarea
        value={note}
        onChange={handleChange}
        placeholder="Outline your response here: mention specific file structures, trade-offs, DB schemas, or challenges you solved..."
        rows={3}
        className="w-full p-3 text-xs bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all resize-y"
      />
    </div>
  );
};

const ProjectPrep = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  // Form states
  const [githubUrl, setGithubUrl] = useState('');
  const [token, setToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(undefined);
  const [showNewRepoForm, setShowNewRepoForm] = useState(false);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(null);
  const [showPitch, setShowPitch] = useState(true);
  const [copiedPitch, setCopiedPitch] = useState(false);

  // History search configurations
  const [historySearch, setHistorySearch] = useState('');

  // Bookmarks & Mastered tracking
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const [mastered, setMastered] = useState<Record<number, boolean>>({});

  // Hook mappings
  const {
    history,
    activeSession,
    isLoadingSession,
    generateQuestions,
    isGenerating,
    deleteSessionRecord
  } = useProjectPrep(selectedSessionId);

  // Sync Bookmarks & Mastered states when activeSession changes
  useEffect(() => {
    if (activeSession) {
      const savedBookmarks = localStorage.getItem(`prep_bookmarks_${activeSession._id}`);
      if (savedBookmarks) {
        try { setBookmarks(JSON.parse(savedBookmarks)); } catch { setBookmarks({}); }
      } else {
        setBookmarks({});
      }

      const savedMastered = localStorage.getItem(`prep_mastered_${activeSession._id}`);
      if (savedMastered) {
        try { setMastered(JSON.parse(savedMastered)); } catch { setMastered({}); }
      } else {
        setMastered({});
      }
      // Collapse questions on session switch
      setExpandedQuestionIdx(null);
      setSelectedCategory('All');
      setSearchQuery('');
    }
  }, [activeSession]);

  // Load first history item automatically if user hasn't selected a session and history exists
  useEffect(() => {
    if (!selectedSessionId && history.length > 0 && !showNewRepoForm) {
      setSelectedSessionId(history[0]._id);
    }
  }, [history, selectedSessionId, showNewRepoForm]);

  const toggleBookmark = (idx: number) => {
    if (!activeSession) return;
    const newBookmarks = { ...bookmarks, [idx]: !bookmarks[idx] };
    setBookmarks(newBookmarks);
    localStorage.setItem(`prep_bookmarks_${activeSession._id}`, JSON.stringify(newBookmarks));
    toast.success(newBookmarks[idx] ? 'Question bookmarked' : 'Bookmark removed');
  };

  const toggleMastered = (idx: number) => {
    if (!activeSession) return;
    const newMastered = { ...mastered, [idx]: !mastered[idx] };
    setMastered(newMastered);
    localStorage.setItem(`prep_mastered_${activeSession._id}`, JSON.stringify(newMastered));
    toast.success(newMastered[idx] ? 'Marked as mastered!' : 'Marked incomplete');
  };

  const handleGenerate = async (targetUrl?: string) => {
    const url = targetUrl || githubUrl;
    if (!url.trim()) {
      toast.error('Please enter a valid GitHub repository URL');
      return;
    }

    try {
      const session = await generateQuestions({
        githubUrl: url.trim(),
        token: token.trim() ? token.trim() : null
      });
      setSelectedSessionId(session._id);
      setGithubUrl('');
      setToken('');
      setShowTokenInput(false);
      setShowNewRepoForm(false);
    } catch {
      // Error handled by hook
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const isConfirmed = await confirm('Are you sure you want to delete this project prep session?', {
      title: 'Delete Project Prep',
      confirmText: 'Delete',
      variant: 'danger'
    });

    if (isConfirmed) {
      try {
        await deleteSessionRecord(id);
        if (selectedSessionId === id) {
          const remaining = history.filter(item => item._id !== id);
          if (remaining.length > 0) {
            setSelectedSessionId(remaining[0]._id);
          } else {
            setSelectedSessionId(undefined);
            setShowNewRepoForm(true);
          }
        }
      } catch {
        // Error handled by hook
      }
    }
  };

  // Filtered history list
  const filteredHistory = history.filter((item) =>
    item.repoName.toLowerCase().includes(historySearch.toLowerCase()) ||
    (item.description || '').toLowerCase().includes(historySearch.toLowerCase())
  );

  // Filtered questions list
  const filteredQuestions = useMemo(() => {
    if (!activeSession?.generatedQuestions) return [];
    return activeSession.generatedQuestions
      .map((q, idx) => ({ ...q, originalIdx: idx }))
      .filter((q) => {
        // Category filter
        if (selectedCategory === '★ Bookmarked' && !bookmarks[q.originalIdx]) {
          return false;
        }
        if (
          selectedCategory !== 'All' &&
          selectedCategory !== '★ Bookmarked' &&
          q.category.toLowerCase() !== selectedCategory.toLowerCase()
        ) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          return (
            q.question.toLowerCase().includes(query) ||
            q.hint.toLowerCase().includes(query) ||
            q.category.toLowerCase().includes(query)
          );
        }

        return true;
      });
  }, [activeSession, selectedCategory, searchQuery, bookmarks]);

  // Statistics
  const totalQuestions = activeSession?.generatedQuestions?.length || 0;
  const masteredCount = activeSession
    ? activeSession.generatedQuestions.filter((_, i) => mastered[i]).length
    : 0;
  const readinessPercentage =
    totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0;

  // Generate 60-Second Elevator Pitch
  const elevatorPitch = useMemo(() => {
    if (!activeSession) return '';
    const langs = activeSession.languages?.length > 0 ? activeSession.languages.join(', ') : 'modern web technologies';
    const desc = activeSession.description && activeSession.description.trim().length > 0
      ? activeSession.description.replace(/\.$/, '')
      : 'a software application designed to solve key user and engineering requirements';

    return `"${activeSession.repoName} is ${desc}. Built with ${langs}, it utilizes a modular architecture designed for performance, maintainability, and clean separation of concerns. During development, I focused on data persistence, robust error handling, and scalable patterns to ensure a seamless developer and user experience."`;
  }, [activeSession]);

  const copyPitchToClipboard = () => {
    if (!elevatorPitch) return;
    navigator.clipboard.writeText(elevatorPitch);
    setCopiedPitch(true);
    toast.success('Elevator pitch copied to clipboard!');
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl text-white shadow-sm">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                Project Prep
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Reverse-engineer your GitHub projects into technical interview questions and architecture talking points.
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          {history.length > 0 && (
            <button
              onClick={() => setShowNewRepoForm(!showNewRepoForm)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-sm cursor-pointer ${
                showNewRepoForm
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white'
              }`}
            >
              {showNewRepoForm ? (
                <>
                  <BookOpen className="w-4 h-4" />
                  View Active Prep
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Analyze New Project
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* REPOSITORY INPUT CARD (Shows when no active session, or user clicks "Analyze New Project") */}
      <AnimatePresence>
        {(showNewRepoForm || (!activeSession && !isLoadingSession)) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-[24px] p-6 md:p-8 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold rounded-full mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> AI Project Interview Engine
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Import GitHub Repository
                </h2>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Enter any public or private GitHub repository URL. We inspect the code layout, dependencies, and README to formulate targeted interview questions.
                </p>
              </div>

              {/* Input Form */}
              <div className="space-y-3">
                <div className="relative">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="https://github.com/username/repository"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleGenerate()}
                    disabled={isGenerating}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                  />
                </div>

                {/* Token Toggle for Private Repos */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowTokenInput(!showTokenInput)}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    {showTokenInput ? 'Hide GitHub Token' : 'Add GitHub Personal Access Token (for Private Repos)'}
                  </button>

                  {showTokenInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2"
                    >
                      <input
                        type="password"
                        placeholder="ghp_PersonalAccessToken"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Generate Button & Progress */}
                <button
                  onClick={() => handleGenerate()}
                  disabled={isGenerating || !githubUrl.trim()}
                  className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Codebase & Formulating Questions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Project Interview Prep
                    </>
                  )}
                </button>
              </div>

              {/* Demo Repositories */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/50">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Or test with sample repositories:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {DEMO_REPOSITORIES.map((repo) => (
                    <button
                      key={repo.name}
                      onClick={() => {
                        setGithubUrl(repo.url);
                        handleGenerate(repo.url);
                      }}
                      disabled={isGenerating}
                      className="p-3 bg-white/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl text-left transition-all hover:border-teal-500/30 group cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        <span>{repo.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{repo.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GENERATING INLINE LOADER */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-teal-500/30 rounded-[24px] p-8 shadow-sm text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Analyzing Repository Architecture
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Scanning file structures, identifying frameworks, and generating project-specific questions across architecture, performance, database, and scalability.
            </p>
          </div>
        </motion.div>
      )}

      {/* ACTIVE PROJECT WORKSPACE */}
      {isLoadingSession ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">
            Loading Project Preparation...
          </p>
        </div>
      ) : activeSession ? (
        <div className="space-y-6">

          {/* PROJECT OVERVIEW & READINESS CARD */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-[24px] p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

              {/* Left: Project Details & Tech Stack */}
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    {activeSession.repoName}
                  </h2>
                  <a
                    href={activeSession.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Repo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                  {activeSession.description || 'No description provided in repository manifest.'}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {activeSession.languages?.map((lang) => (
                    <span
                      key={lang}
                      className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20"
                    >
                      {lang}
                    </span>
                  ))}
                  {activeSession.topics?.slice(0, 4).map((topic) => (
                    <span
                      key={topic}
                      className="px-2.5 py-0.5 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Readiness Scorecard & Session Switcher */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-200/60 dark:border-slate-700/50 pt-4 lg:pt-0 lg:pl-6">
                
                {/* Readiness Percentage */}
                <div className="flex items-center gap-4 bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/40 p-4 rounded-2xl min-w-[200px]">
                  <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r="22"
                        className="stroke-slate-200 dark:stroke-slate-700 fill-none"
                        strokeWidth="4.5"
                      />
                      <motion.circle
                        cx="28"
                        cy="28"
                        r="22"
                        className="stroke-teal-500 fill-none transition-all duration-500"
                        strokeWidth="4.5"
                        strokeDasharray={138.2}
                        strokeDashoffset={138.2 - (138.2 * readinessPercentage) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-xs font-black text-slate-800 dark:text-slate-100">
                      {readinessPercentage}%
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <Trophy className="w-3.5 h-3.5 text-teal-500" />
                      Readiness Score
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {masteredCount} of {totalQuestions} Mastered
                    </p>
                  </div>
                </div>

                {/* Session Switcher Dropdown */}
                {history.length > 1 && (
                  <div className="flex flex-col justify-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Switch Project:
                    </label>
                    <select
                      value={activeSession._id}
                      onChange={(e) => setSelectedSessionId(e.target.value)}
                      className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
                    >
                      {history.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.repoName} ({item.generatedQuestions?.length || 0} Qs)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* PROJECT ELEVATOR PITCH SECTION */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-[24px] p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowPitch(!showPitch)}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    60-Second Interview Elevator Pitch
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                      Answer to "Tell me about this project"
                    </span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyPitchToClipboard();
                  }}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPitch ? 'Copied' : 'Copy Pitch'}</span>
                </button>
                {showPitch ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </div>

            {showPitch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3.5 pt-3.5 border-t border-slate-200/60 dark:border-slate-700/50 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic bg-teal-500/5 p-4 rounded-xl border border-teal-500/10"
              >
                {elevatorPitch}
              </motion.div>
            )}
          </div>

          {/* QUESTIONS SECTION */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-[24px] p-6 shadow-sm space-y-6">
            
            {/* Controls Bar: Search & Category Tabs */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-500" />
                    Technical Interview Questions ({filteredQuestions.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Prepare your answers for architectural decisions, security practices, and scalability trade-offs.
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search questions or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setExpandedQuestionIdx(null);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3.5">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((q, displayIdx) => {
                  const isExpanded = expandedQuestionIdx === displayIdx;
                  const isMastered = mastered[q.originalIdx] || false;
                  const isBookmarked = bookmarks[q.originalIdx] || false;

                  return (
                    <div
                      key={q.originalIdx}
                      className={`rounded-2xl border transition-all duration-300 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-sm ${
                        isMastered
                          ? 'border-emerald-200/60 dark:border-emerald-500/20 bg-emerald-50/10'
                          : isExpanded
                          ? 'border-teal-500/40 ring-1 ring-teal-500/10'
                          : 'border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {/* Question Header Card */}
                      <div
                        onClick={() => setExpandedQuestionIdx(isExpanded ? null : displayIdx)}
                        className="p-4 sm:p-5 flex items-start gap-3.5 cursor-pointer select-none"
                      >
                        {/* Checkbox for Mastery */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMastered(q.originalIdx);
                          }}
                          title={isMastered ? 'Mark as incomplete' : 'Mark as mastered'}
                          className={`mt-0.5 p-1 rounded-lg transition-colors flex-shrink-0 cursor-pointer ${
                            isMastered
                              ? 'text-emerald-500 bg-emerald-500/10'
                              : 'text-slate-300 dark:text-slate-600 hover:text-emerald-500'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>

                        {/* Question Text & Meta Badges */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <p
                            className={`text-sm md:text-[15px] leading-relaxed transition-all ${
                              isMastered
                                ? 'line-through text-slate-400 dark:text-slate-500 font-medium'
                                : 'text-slate-800 dark:text-slate-100 font-semibold'
                            }`}
                          >
                            {q.question}
                          </p>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Category Badge */}
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                              {getCategoryIcon(q.category)}
                              {q.category}
                            </span>

                            {/* Difficulty Badge */}
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getDifficultyBadge(
                                q.difficulty
                              )}`}
                            >
                              {q.difficulty}
                            </span>

                            {isMastered && (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                ✓ Mastered
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right Action Icons: Bookmark & Expand */}
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(q.originalIdx);
                            }}
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isBookmarked
                                ? 'text-amber-500 bg-amber-500/10'
                                : 'text-slate-300 dark:text-slate-600 hover:text-amber-500'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                          </button>

                          <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Content: Hint, Notes & Actions */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-4 sm:px-5 pb-5 border-t border-slate-150 dark:border-slate-800/80 pt-4 space-y-4"
                          >
                            {/* Key Concepts & Interviewer Hint */}
                            {q.hint && (
                              <div className="bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20 rounded-xl p-3.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 flex items-center gap-1.5 mb-1">
                                  <Sparkles className="w-3.5 h-3.5" /> Key Evaluation Points / Interviewer Hint:
                                </span>
                                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                  {q.hint}
                                </p>
                              </div>
                            )}

                            {/* Study Notes Component */}
                            <AnswerNotes sessionId={activeSession._id} questionIdx={q.originalIdx} />

                            {/* Action Bar */}
                            <div className="flex items-center justify-between pt-2">
                              <button
                                onClick={() => toggleMastered(q.originalIdx)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isMastered
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {isMastered ? 'Mark Incomplete' : 'Mark as Mastered'}
                              </button>

                              <button
                                onClick={() => navigate('/mock-interview')}
                                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Video className="w-3.5 h-3.5" />
                                Practice in Mock Interview
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl space-y-2">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    No questions found matching your filter criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                    }}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* RECENT ANALYZED PROJECTS LIST */}
          {history.length > 0 && (
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-[24px] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-teal-500" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    My Analyzed Projects ({history.length})
                  </h3>
                </div>

                {history.length > 3 && (
                  <div className="relative w-48">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter history..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1 bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredHistory.map((item) => {
                  const isCurrent = activeSession._id === item._id;
                  return (
                    <div
                      key={item._id}
                      onClick={() => {
                        setSelectedSessionId(item._id);
                        setShowNewRepoForm(false);
                      }}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                        isCurrent
                          ? 'bg-teal-500/10 border-teal-500/30'
                          : 'bg-white/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 border-slate-200 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {item.repoName}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-700 dark:text-teal-300">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {item.generatedQuestions?.length || 0} Questions •{' '}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleDeleteSession(e, item._id)}
                        title="Delete project"
                        className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ml-2 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Empty state when no history exists */
        !isGenerating && (
          <div className="text-center py-16 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-[24px] p-8 shadow-sm max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              No Projects Prepared Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Enter any GitHub repository URL above to get customized interview questions, architecture tips, and elevator pitches.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default ProjectPrep;
