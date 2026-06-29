import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderGit2,
  Github,
  Sparkles,
  Trash2,
  History,
  Lock,
  ChevronDown,
  ChevronUp,
  Code,
  BookOpen,
  Key,
  Search,
  Star,
  CheckCircle,
  FileText,
  Activity,
  Terminal,
  Trophy,
  ArrowRight,
  Filter,
  ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useProjectPrep } from '../hooks/useProjectPrep'
import { useConfirm } from '../context/ConfirmContext'


const CATEGORIES = [
  'All',
  'Architecture',
  'Database',
  'Security',
  'Performance',
  'Scalability',
  'Deployment',
  'Tradeoffs'
]

const DEMO_REPOSITORIES = [
  { name: 'React', url: 'https://github.com/facebook/react', desc: 'UI library' },
  { name: 'Next.js', url: 'https://github.com/vercel/next.js', desc: 'React Framework' },
  { name: 'Express', url: 'https://github.com/expressjs/express', desc: 'Node.js server framework' },
  { name: 'Tailwind CSS', url: 'https://github.com/tailwindlabs/tailwindcss', desc: 'Utility CSS engine' }
]

// Separate performant component for answers and study notes to avoid whole-page re-renders
const AnswerNotes = ({ sessionId, questionIdx }: { sessionId: string; questionIdx: number }) => {
  const localStorageKey = `prep_notes_${sessionId}_${questionIdx}`
  const [note, setNote] = useState(() => localStorage.getItem(localStorageKey) || '')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setNote(value)
    localStorage.setItem(localStorageKey, value)
  }

  return (
    <div className="mt-4 space-y-2 select-text">
      <div className="flex justify-between items-center select-none">
        <label className="text-[10px] font-extrabold text-accent-cyan flex items-center gap-1.5 uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5 text-accent-cyan" /> My Study Notes (Auto-saved)
        </label>
        <span className="text-[9px] font-bold text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          Cloud Saved
        </span>
      </div>
      <textarea
        value={note}
        onChange={handleChange}
        placeholder="Outline your response. Note down key files, folder paths, specific APIs/tools used, or system tradeoffs you would discuss..."
        className="w-full min-h-[110px] p-3.5 text-xs bg-white dark:bg-bg-secondary border border-slate-200/85 dark:border-border-subtle/85 rounded-xl focus:outline-none focus:border-accent-cyan/50 focus:ring-2 focus:ring-accent-cyan/10 text-slate-800 dark:text-text-secondary placeholder-slate-400 dark:placeholder-text-muted transition-all resize-y leading-relaxed font-mono shadow-sm"
      />
    </div>
  )
}

const ProjectPrep = () => {
  const confirm = useConfirm()
  const [githubUrl, setGithubUrl] = useState('')

  const [token, setToken] = useState('')
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(undefined)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(null)

  // Question lists text search
  const [questionSearch, setQuestionSearch] = useState('')

  // History search and language filter
  const [historySearch, setHistorySearch] = useState('')
  const [historyLangFilter, setHistoryLangFilter] = useState('All')

  // Local storage lists for Bookmarked & Mastered questions
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({})
  const [mastered, setMastered] = useState<Record<number, boolean>>({})

  // Simulated WebSocket logs stream and progress tracker
  const [progress, setProgress] = useState(0)
  const [progressLogs, setProgressLogs] = useState<{ msg: string; type: string; timestamp: string }[]>([])
  const [visualLoading, setVisualLoading] = useState(false)

  // Use project prep hook
  const {
    history,
    isLoadingHistory,
    activeSession,
    isLoadingSession,
    generateQuestions,
    isGenerating,
    deleteSessionRecord
  } = useProjectPrep(selectedSessionId)

  // Sync Bookmarks & Mastered states when activeSession changes
  useEffect(() => {
    if (activeSession) {
      // Load bookmarks
      const savedBookmarks = localStorage.getItem(`prep_bookmarks_${activeSession._id}`)
      if (savedBookmarks) {
        try { setBookmarks(JSON.parse(savedBookmarks)) } catch { setBookmarks({}) }
      } else {
        setBookmarks({})
      }

      // Load mastered
      const savedMastered = localStorage.getItem(`prep_mastered_${activeSession._id}`)
      if (savedMastered) {
        try { setMastered(JSON.parse(savedMastered)) } catch { setMastered({}) }
      } else {
        setMastered({})
      }
    }
  }, [activeSession])

  // Bookmarking toggle function
  const toggleBookmark = (idx: number) => {
    if (!activeSession) return
    const newBookmarks = { ...bookmarks, [idx]: !bookmarks[idx] }
    setBookmarks(newBookmarks)
    localStorage.setItem(`prep_bookmarks_${activeSession._id}`, JSON.stringify(newBookmarks))
    toast.success(newBookmarks[idx] ? 'Question bookmarked!' : 'Bookmark removed.')
  }

  // Mastered toggle function
  const toggleMastered = (idx: number) => {
    if (!activeSession) return
    const newMastered = { ...mastered, [idx]: !mastered[idx] }
    setMastered(newMastered)
    localStorage.setItem(`prep_mastered_${activeSession._id}`, JSON.stringify(newMastered))
    toast.success(newMastered[idx] ? 'Marked as mastered!' : 'Unmarked question.')
  }

  // Simulated SSE / WebSocket progress stream
  useEffect(() => {
    if (isGenerating) {
      setVisualLoading(true)
      setProgress(5)
      setProgressLogs([
        { msg: 'Establishing WebSocket connection to system stream...', type: 'ws', timestamp: '00:00.02' }
      ])

      const startTime = Date.now()
      const getElapsed = () => {
        const ms = Date.now() - startTime
        const s = Math.floor(ms / 1000)
        const centi = Math.floor((ms % 1000) / 10)
        return `${s.toString().padStart(2, '0')}:${centi.toString().padStart(2, '0')}`
      }

      const logsSequence = [
        { trigger: 15, msg: '[WS] Authenticated. Codebase analysis session initialized.', type: 'ws' },
        { trigger: 30, msg: '[GIT] Pulling repository hierarchy, branches and config manifest...', type: 'git' },
        { trigger: 48, msg: '[PARSE] Mapping file structures & dependency tree schemas...', type: 'parse' },
        { trigger: 65, msg: '[ANALYSIS] Scanning README.md for deployment trade-offs & details...', type: 'analysis' },
        { trigger: 82, msg: '[AI] Dispatching repository payload metadata to Gemini-2.5-flash...', type: 'ai' },
        { trigger: 94, msg: '[AI] Formulating questions, answer hints, and conceptual rubrics...', type: 'ai' },
      ]

      const interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return 95 // Hold at 95% until query finishes
          const next = prev + Math.floor(Math.random() * 4) + 2

          // Print logs matching triggers
          logsSequence.forEach((item) => {
            if (next >= item.trigger) {
              setProgressLogs((prevLogs) => {
                if (prevLogs.some((l) => l.msg === item.msg)) return prevLogs
                return [...prevLogs, { msg: item.msg, type: item.type, timestamp: getElapsed() }]
              })
            }
          })

          return next > 95 ? 95 : next
        })
      }, 350)

      return () => clearInterval(interval)
    } else {
      if (progress > 0) {
        setProgress(100)
        setProgressLogs((prev) => [
          ...prev,
          { msg: '[DONE] Context parsed! System prep questions synthesized successfully.', type: 'success', timestamp: 'Done' }
        ])

        const transition = window.setTimeout(() => {
          setVisualLoading(false)
          setProgress(0)
          setProgressLogs([])
        }, 900)

        return () => clearTimeout(transition)
      }
    }
  }, [isGenerating])

  // Trigger question generation from URL
  const handleGenerate = async (targetUrl?: string) => {
    const url = targetUrl || githubUrl
    if (!url) {
      toast.error('Please enter a GitHub URL')
      return
    }

    try {
      const session = await generateQuestions({
        githubUrl: url,
        token: token ? token.trim() : null
      })
      setSelectedSessionId(session._id)
      setGithubUrl('')
      setToken('')
      setShowTokenInput(false)
    } catch (error) {
      // Handled inside react-query mutation defaults
    }
  }

  // Handle session selection from history
  const handleSelectHistory = (id: string) => {
    setSelectedSessionId(id)
    setSelectedCategory('All')
    setExpandedQuestionIdx(null)
  }

  // Handle history item deletion
  const handleDeleteHistory = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const isConfirmed = await confirm('Are you sure you want to delete this session?', {
      title: 'Delete Session',
      confirmText: 'Delete',
      variant: 'danger'
    })
    if (isConfirmed) {
      try {
        await deleteSessionRecord(id)
        if (selectedSessionId === id) {
          setSelectedSessionId(undefined)
        }
      } catch (error) {
        // Handled in mutation
      }
    }
  }

  // Calculate distinct languages found across all history items for filters
  const allLanguagesInHistory = Array.from(
    new Set(history.flatMap((item) => item.languages || []))
  )

  // Filter session history
  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.repoName.toLowerCase().includes(historySearch.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(historySearch.toLowerCase())
    const matchesLang = historyLangFilter === 'All' ||
      item.languages.some((lang) => lang.toLowerCase() === historyLangFilter.toLowerCase())
    return matchesSearch && matchesLang
  })

  // Heuristics for Active Session metadata:
  const totalQuestions = activeSession?.generatedQuestions?.length || 0
  const masteredCount = activeSession ? activeSession.generatedQuestions.filter((_, i) => mastered[i]).length : 0
  const readinessPercentage = totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0

  const readmeLength = activeSession?.readmeContent?.length || 0
  const languageCount = activeSession?.languages?.length || 0
  const topicCount = activeSession?.topics?.length || 0

  // 1. Dynamic Complexity Rating (calculated from metadata details)
  const complexityScore = Math.min(
    Math.round(45 + (readmeLength > 0 ? 15 : 0) + Math.min(readmeLength / 180, 20) + Math.min(languageCount * 4, 12) + Math.min(topicCount * 4, 12)),
    98
  )
  const complexityTier = complexityScore > 80 ? 'High Complexity' : complexityScore > 60 ? 'Medium Complexity' : 'Basic Scale'

  // 2. Health Snapshot breakdown
  const healthIndicators = {
    readme: readmeLength > 5000 ? 'Comprehensive' : readmeLength > 1500 ? 'Good' : readmeLength > 0 ? 'Minimal' : 'Missing',
    meta: topicCount >= 5 ? 'High' : topicCount >= 2 ? 'Moderate' : 'Low',
    composition: languageCount >= 4 ? 'Diverse' : languageCount >= 2 ? 'Standard' : 'Focused',
    score: Math.min(Math.round((readmeLength > 0 ? 40 : 0) + Math.min(readmeLength / 220, 20) + Math.min(topicCount * 8, 20) + Math.min(languageCount * 10, 20)), 100)
  }

  // 3. Question Categories stats breakdown
  const categoryStats = activeSession?.generatedQuestions.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // Filter questions matching category & search queries
  const filteredQuestions = activeSession?.generatedQuestions.filter((q, idx) => {
    // 1. Category / Bookmarks filters
    if (selectedCategory === '★ Bookmarked') {
      if (!bookmarks[idx]) return false
    } else if (selectedCategory !== 'All') {
      if (q.category.toLowerCase() !== selectedCategory.toLowerCase()) return false
    }

    // 2. Search box matching
    if (questionSearch.trim()) {
      const query = questionSearch.toLowerCase()
      return q.question.toLowerCase().includes(query) || q.hint.toLowerCase().includes(query)
    }

    return true
  }) || []

  // Difficulty badge styling helpers
  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
      case 'hard':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
      case 'medium':
      default:
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    }
  }

  // SVG Radial Ring variables
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (readinessPercentage / 100) * circumference
  return (
    <div className="p-1 md:p-4 max-w-7xl mx-auto space-y-6 select-none text-slate-800 dark:text-slate-100">

      {/* Header Panel */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200/60 dark:border-border-subtle/80"
      >
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
            <div className="relative p-3 bg-white dark:bg-bg-secondary rounded-2xl border border-slate-200 dark:border-border-subtle shadow-sm flex items-center justify-center">
              <FolderGit2 className="w-8 h-8 text-accent-cyan dark:text-accent-cyan" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-text-primary flex items-center gap-2">
              Project Prep
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 uppercase tracking-widest animate-pulse">
                v2.0
              </span>
            </h1>
            <p className="text-slate-500 dark:text-text-muted text-xs md:text-sm mt-1 font-medium leading-relaxed max-w-xl">
              Reverse-engineer your repositories using AI to automatically extract critical system architectural patterns and generate customized interview rubrics.
            </p>
          </div>
        </div>

        {/* Global actions: new button when session active */}
        {activeSession && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedSessionId(undefined)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-bg-secondary border border-slate-200 dark:border-border-subtle rounded-xl hover:border-accent-cyan/30 hover:bg-slate-55 dark:hover:bg-bg-tertiary transition-all text-xs font-bold text-slate-700 dark:text-text-secondary shadow-sm hover:shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-accent-cyan animate-pulse" />
            Analyze New Repository
          </motion.button>
        )}
      </motion.div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COMPONENT (Dashboard & Questions OR Initial landing) */}
        <div className="lg:col-span-8 space-y-6">

          {/* SNEAK-PEEK LOADING TERMINAL (WebSocket progress simulator) */}
          <AnimatePresence mode="wait">
            {visualLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-6 bg-slate-955 border border-slate-800 rounded-2xl shadow-xl shadow-accent-cyan/5 space-y-4 text-slate-100 relative overflow-hidden"
              >
                {/* Visual Glassmorphic glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent-cyan/5 rounded-full blur-[60px] pointer-events-none" />

                {/* macOS Style Window controls */}
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                    <div className="flex items-center gap-2 ml-4">
                      <Terminal className="w-4 h-4 text-accent-cyan animate-pulse" />
                      <span className="text-xs font-semibold text-slate-400 font-mono">IngestionTerminal (~/agent-stream)</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-accent-cyan bg-accent-cyan/10 px-2.5 py-0.5 rounded border border-accent-cyan/20">
                    {progress}% Complete
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Task progress:</span>
                    <span>{progress === 100 ? 'SUCCESS' : 'RUNNING'}</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <motion.div
                      className="h-full bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Log Output Area */}
                <div className="bg-black/40 border border-slate-850 rounded-xl p-4 font-mono text-[11px] text-slate-350 h-52 overflow-y-auto space-y-2.5 scrollbar-thin select-text">
                  {progressLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-slate-500 font-bold select-none text-[10px] min-w-[45px] text-right">{log.timestamp}</span>
                      <span className="text-slate-500 select-none">|</span>
                      <span className={`leading-relaxed ${
                        log.type === 'success' ? 'text-accent-green font-semibold' :
                          log.type === 'ws' ? 'text-accent-cyan' :
                            log.type === 'ai' ? 'text-accent-pink' :
                              log.type === 'git' ? 'text-accent-yellow' :
                                'text-slate-300'
                      }`}>
                        {log.msg}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 pl-[64px]">
                    <span className="w-2 h-3.5 bg-accent-cyan animate-pulse inline-block" />
                    <span className="text-[10px] text-slate-600 select-none">listening for event stream...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTIVE VIEW (Details & Question Bank) */}
          {isLoadingSession ? (
            <div className="p-12 bg-white/40 dark:bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-border-subtle h-80 flex flex-col items-center justify-center gap-4 shadow-sm">
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent-cyan/25 border-t-accent-cyan rounded-full animate-spin" />
                <div className="absolute w-6 h-6 border-4 border-accent-purple/25 border-t-accent-purple rounded-full animate-spin animate-reverse" />
              </div>
              <div className="text-center space-y-1 mt-2">
                <p className="text-slate-800 dark:text-text-primary text-sm font-bold animate-pulse">Retrieving preparation details...</p>
                <p className="text-slate-400 dark:text-text-muted text-[11px]">Connecting to the Knowledge Graph</p>
              </div>
            </div>
          ) : activeSession && !visualLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >

              {/* Premium Dashboard Metrics Panel (Insights & Readiness) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* 1. Readiness Circular Indicator Card */}
                <div className="p-5 bg-white dark:bg-bg-secondary rounded-2xl border border-slate-200/80 dark:border-border-subtle shadow-sm flex items-center justify-between gap-4 relative overflow-hidden group hover:border-slate-350 dark:hover:border-slate-750 transition-colors">
                  <div className="space-y-1.5 z-10">
                    <span className="text-[10px] font-bold text-accent-pink tracking-wider uppercase flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-accent-pink" /> Readiness Score
                    </span>
                    <div className="flex items-baseline gap-1">
                      <h3 className="text-3xl font-extrabold text-slate-900 dark:text-text-primary">{readinessPercentage}%</h3>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-text-muted font-semibold">
                      {masteredCount} of {totalQuestions} concepts mastered
                    </p>
                  </div>

                  {/* Radial Progress Ring SVG */}
                  <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0 z-10">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        className="stroke-slate-100 dark:stroke-bg-tertiary"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r={radius}
                        className="stroke-accent-pink"
                        strokeWidth="5"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                      />
                    </svg>
                    <span className="absolute text-[10px] font-mono font-bold text-slate-800 dark:text-text-secondary">
                      {masteredCount}/{totalQuestions}
                    </span>
                  </div>
                </div>

                {/* 2. Repository Complexity Card */}
                <div className="p-5 bg-white dark:bg-bg-secondary rounded-2xl border border-slate-200/80 dark:border-border-subtle shadow-sm space-y-3 hover:border-slate-350 dark:hover:border-slate-750 transition-colors">
                  <span className="text-[10px] font-bold text-accent-yellow tracking-wider uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-accent-yellow" /> Complexity Tier
                  </span>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-text-primary">{complexityScore}<span className="text-xs text-slate-400 dark:text-text-muted font-medium">/100</span></h3>
                    <span className="text-[9px] font-extrabold text-accent-yellow bg-accent-yellow/10 border border-accent-yellow/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {complexityTier}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 dark:bg-bg-tertiary h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-yellow rounded-full transition-all duration-500" style={{ width: `${complexityScore}%` }} />
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-400 dark:text-text-muted font-bold">
                      <span>SIMPLE</span>
                      <span>ENTERPRISE</span>
                    </div>
                  </div>
                </div>

                {/* 3. Repository Health Snapshot Card */}
                <div className="p-5 bg-white dark:bg-bg-secondary rounded-2xl border border-slate-200/80 dark:border-border-subtle shadow-sm space-y-3 hover:border-slate-350 dark:hover:border-slate-750 transition-colors">
                  <span className="text-[10px] font-bold text-accent-green tracking-wider uppercase flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-accent-green" /> Ingestion Health
                  </span>

                  <div className="space-y-1.5 text-[10px] text-slate-650 dark:text-text-secondary font-semibold">
                    <div className="flex justify-between border-b border-slate-100 dark:border-border-subtle/50 pb-1">
                      <span className="text-slate-400 dark:text-text-muted">Docs Quality:</span>
                      <span className="font-bold text-accent-cyan">{healthIndicators.readme}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 dark:border-border-subtle/50 pb-1">
                      <span className="text-slate-400 dark:text-text-muted">Metadata density:</span>
                      <span className="font-bold text-accent-pink">{healthIndicators.meta}</span>
                    </div>
                    <div className="flex justify-between pb-0.5">
                      <span className="text-slate-400 dark:text-text-muted">Ingestion Health:</span>
                      <span className="font-bold text-accent-green">{healthIndicators.score}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingested Category Density Dashboard Row */}
              <div className="p-5 bg-white dark:bg-bg-secondary rounded-2xl border border-slate-200/80 dark:border-border-subtle shadow-sm space-y-3">
                <span className="text-[10px] font-bold text-slate-400 dark:text-text-muted tracking-wider uppercase block">
                  Conceptual Category Distribution
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categoryStats).map(([cat, count]) => (
                    <span
                      key={cat}
                      className="px-3 py-1 text-[11px] font-bold rounded-xl bg-slate-50 dark:bg-bg-tertiary border border-slate-200/60 dark:border-border-subtle text-slate-655 dark:text-text-secondary flex items-center gap-2 hover:scale-[1.02] hover:bg-slate-100 dark:hover:bg-bg-tertiary/80 transition-all"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_6px_#22D3EE]" />
                      <span>{cat}</span>
                      <span className="px-1.5 py-0.2 text-[9px] bg-slate-200 dark:bg-bg-primary rounded text-slate-800 dark:text-text-primary font-black">{count}</span>
                    </span>
                  ))}
                  {Object.keys(categoryStats).length === 0 && (
                    <span className="text-xs text-slate-400 dark:text-text-muted font-medium py-1">No category metadata available.</span>
                  )}
                </div>
              </div>

              {/* Questions List Module Header */}
              <div className="p-6 bg-white dark:bg-bg-secondary rounded-3xl border border-slate-200/80 dark:border-border-subtle shadow-sm space-y-6">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-text-primary flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-accent-cyan" />
                      AI Interview Guide
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-text-muted font-medium">Interactive study guide derived directly from files and structure.</p>
                  </div>

                  {/* Search query box for questions */}
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search questions or rubrics..."
                      value={questionSearch}
                      onChange={(e) => setQuestionSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-bg-tertiary border border-slate-200 dark:border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan/60 text-xs text-slate-800 dark:text-text-primary focus:ring-2 focus:ring-accent-cyan/10 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Categories Tab selector bar including ★ Bookmarked */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2.5 scrollbar-thin border-b border-slate-100 dark:border-border-subtle/50">
                  {['All', '★ Bookmarked', ...CATEGORIES.slice(1)].map((category) => {
                    const isSelected = selectedCategory.toLowerCase() === category.toLowerCase()
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category)
                          setExpandedQuestionIdx(null)
                        }}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap border cursor-pointer ${isSelected
                            ? 'bg-accent-cyan/10 dark:bg-accent-cyan/15 text-accent-cyan border-accent-cyan/35 dark:border-accent-cyan/30 shadow-[0_2px_10px_rgba(34,211,238,0.06)]'
                            : 'bg-slate-50 dark:bg-bg-tertiary/40 border-slate-200/80 dark:border-border-subtle/80 text-slate-500 dark:text-text-muted hover:text-slate-800 dark:hover:text-text-secondary hover:bg-slate-100 dark:hover:bg-bg-tertiary'
                          }`}
                      >
                        {category}
                      </button>
                    )
                  })}
                </div>

                {/* Questions list */}
                <div className="space-y-3">
                  {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((q, idx) => {
                      // Retrieve structural question index from the overall array to reference correctly
                      const originalIdx = activeSession.generatedQuestions.findIndex(
                        (orig) => orig.question === q.question
                      )
                      const isExpanded = expandedQuestionIdx === idx
                      const isBookmarked = bookmarks[originalIdx] || false
                      const isMastered = mastered[originalIdx] || false

                      return (
                        <div
                          key={idx}
                          className={`bg-slate-50/40 dark:bg-bg-tertiary/20 rounded-2xl border transition-all overflow-hidden ${isMastered
                              ? 'border-slate-200/40 dark:border-border-subtle/30 opacity-60 hover:opacity-100'
                              : isExpanded 
                                ? 'border-accent-cyan/50 dark:border-accent-cyan/30 shadow-md shadow-accent-cyan/5 bg-slate-50/80 dark:bg-bg-tertiary/30' 
                                : 'border-slate-200/80 dark:border-border-subtle/80 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                        >
                          <div className="p-4 flex items-start gap-4">

                            {/* Mastery Status Checkbox */}
                            <button
                              onClick={() => toggleMastered(originalIdx)}
                              className={`mt-1 flex-shrink-0 p-0.5 rounded-full transition-all border cursor-pointer hover:scale-105 ${
                                isMastered 
                                  ? 'bg-accent-green/10 text-accent-green border-accent-green/30' 
                                  : 'text-slate-350 dark:text-slate-600 border-slate-250 dark:border-slate-700 hover:text-accent-green hover:border-accent-green/40'
                              }`}
                              title={isMastered ? 'Mark incomplete' : 'Mark mastered'}
                            >
                              <CheckCircle className={`w-5 h-5 ${isMastered ? 'fill-accent-green/10' : ''}`} />
                            </button>

                            <div
                              onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                              className="flex-grow min-w-0 cursor-pointer space-y-2 select-text"
                            >
                              <p className={`text-[14px] leading-relaxed font-bold tracking-tight ${isMastered ? 'text-slate-400 dark:text-text-muted line-through font-medium' : 'text-slate-800 dark:text-text-primary'
                                }`}>
                                {q.question}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 select-none">
                                <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-100 dark:bg-bg-secondary border border-slate-200 dark:border-border-subtle text-slate-500 dark:text-text-muted uppercase tracking-wider">
                                  {q.category}
                                </span>
                                <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-wider ${getDifficultyColor(q.difficulty)}`}>
                                  {q.difficulty}
                                </span>
                              </div>
                            </div>

                            {/* Bookmark Toggle Icon */}
                            <button
                              onClick={() => toggleBookmark(originalIdx)}
                              className={`mt-1 p-1.5 rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-bg-tertiary cursor-pointer hover:text-accent-yellow ${
                                isBookmarked ? 'text-accent-yellow' : 'text-slate-400 dark:text-text-muted'
                              }`}
                              title="Bookmark question"
                            >
                              <Star className={`w-4.5 h-4.5 ${isBookmarked ? 'fill-accent-yellow' : ''}`} />
                            </button>

                            {/* Accordion toggle button */}
                            <button
                              onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                              className="mt-1 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-bg-tertiary transition-all text-slate-400 dark:text-text-muted hover:text-slate-700 dark:hover:text-text-secondary cursor-pointer"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                          </div>

                          {/* Expandable Panel */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-t border-slate-200/60 dark:border-border-subtle/50 bg-white/40 dark:bg-bg-primary/30"
                              >
                                <div className="p-5 space-y-5 select-text">

                                  {/* Answer Guidelines Hint */}
                                  <div className="text-xs space-y-1.5">
                                    <span className="font-extrabold text-accent-cyan flex items-center gap-1.5 uppercase tracking-wider text-[10px] select-none">
                                      <Lock className="w-3.5 h-3.5 text-accent-cyan" /> Core Talking Points & Evaluation Rubric
                                    </span>
                                    <div className="bg-slate-50 dark:bg-bg-secondary p-4 rounded-xl border border-slate-200/80 dark:border-border-subtle text-slate-600 dark:text-text-secondary leading-relaxed font-medium shadow-sm">
                                      {q.hint || 'No conceptual talking points specified for this item.'}
                                    </div>
                                  </div>

                                  {/* Auto-saved draft answer text container */}
                                  <AnswerNotes sessionId={activeSession._id} questionIdx={originalIdx} />

                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-16 text-slate-400 dark:text-text-muted border border-dashed border-slate-200/80 dark:border-border-subtle rounded-2xl bg-slate-50/20 dark:bg-bg-tertiary/10 font-medium">
                      No questions found matching your category filter or search terms.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* HERO CONFIGURATION LANDING STATE */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-bg-secondary rounded-3xl border border-slate-200/80 dark:border-border-subtle shadow-sm p-8 md:p-10 space-y-8 relative overflow-hidden"
            >
              {/* Sleek background radial glow elements */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-pink/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-bold rounded-full uppercase tracking-wider select-none">
                  <Sparkles className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
                  AI Ingestion Pipeline Active
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-text-primary leading-tight">
                  Import repository, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink">
                    reverse-engineer your preparation.
                  </span>
                </h2>
                <p className="text-sm text-slate-550 dark:text-text-secondary max-w-2xl leading-relaxed font-medium">
                  Provide any public or private GitHub repository URL. Our system maps the architecture, profiles files, crawls documentation, and synthesizes target system design & architecture questions.
                </p>
              </div>

              {/* Generation Configuration Input Block */}
              <div className="p-6 bg-slate-50 dark:bg-bg-tertiary/30 border border-slate-200/80 dark:border-border-subtle rounded-2xl space-y-4 shadow-sm relative z-10">
                <div className="space-y-4">

                  {/* Repo URL Input */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-text-secondary select-none">
                      Repository URL
                    </label>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-300" />
                      <div className="relative">
                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-text-muted" />
                        <input
                          type="text"
                          placeholder="https://github.com/username/repository"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-bg-primary border border-slate-200 dark:border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan/50 focus:ring-2 focus:ring-accent-cyan/10 text-slate-800 dark:text-text-primary text-xs font-semibold shadow-inner"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Private Repository Tokens Panel */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowTokenInput(!showTokenInput)}
                      className="flex items-center gap-2 text-xs font-bold text-slate-550 dark:text-text-muted hover:text-accent-cyan transition-colors cursor-pointer select-none"
                    >
                      <Key className="w-3.5 h-3.5 text-accent-cyan" />
                      <span>{showTokenInput ? 'Hide GitHub Access Token' : 'Add GitHub Access Token (for Private Repos)'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTokenInput ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showTokenInput && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-2.5"
                        >
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="password"
                              placeholder="ghp_yourPersonalAccessToken"
                              value={token}
                              onChange={(e) => setToken(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-bg-primary border border-slate-200 dark:border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan/50 focus:ring-2 focus:ring-accent-cyan/10 transition-all text-xs font-mono text-slate-800 dark:text-text-primary"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
                            Your token is sent directly to GitHub and is never stored on our servers.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit Ingestion */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleGenerate()}
                    disabled={isGenerating || !githubUrl}
                    className="w-full px-6 py-4 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink text-white dark:text-bg-primary font-bold rounded-xl hover:shadow-lg hover:shadow-accent-cyan/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer z-10 relative"
                  >
                    <Sparkles className="w-4 h-4 text-white dark:text-bg-primary" />
                    Build Interview Rubric
                  </motion.button>
                </div>
              </div>

              {/* Grid of demo repositories */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 select-none">
                  <span className="text-[10px] font-extrabold text-slate-400 dark:text-text-muted uppercase tracking-wider block">
                    Quick Start Sandbox Repositories
                  </span>
                  <div className="h-px bg-slate-200 dark:bg-border-subtle flex-grow" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {DEMO_REPOSITORIES.map((repo) => (
                    <motion.div
                      key={repo.name}
                      whileHover={{ y: -3, border: '1px solid rgba(34, 211, 238, 0.4)' }}
                      onClick={() => {
                        setGithubUrl(repo.url)
                        handleGenerate(repo.url)
                      }}
                      className="p-4 bg-slate-50 dark:bg-bg-tertiary/20 border border-slate-200/80 dark:border-border-subtle/80 rounded-xl cursor-pointer hover:bg-slate-100/40 dark:hover:bg-bg-tertiary/30 transition-all text-left space-y-1 group shadow-sm flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-text-secondary group-hover:text-accent-cyan transition-colors">
                          {repo.name}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-text-muted truncate font-medium">{repo.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </div>

        {/* RIGHT COMPONENT (Sidebar for Active Repository Meta & Session History) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Active Repository Preview Card */}
          <AnimatePresence>
            {activeSession && !visualLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-6 bg-white dark:bg-bg-secondary rounded-2xl border border-slate-200/80 dark:border-border-subtle shadow-sm space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-border-subtle/50">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-accent-cyan/10 rounded-lg">
                      <Github className="w-4 h-4 text-accent-cyan" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-450 dark:text-text-muted uppercase tracking-wider">
                      Active Repository
                    </span>
                  </div>
                  <a
                    href={activeSession.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-bg-tertiary rounded-lg text-slate-400 hover:text-accent-cyan dark:hover:text-accent-cyan transition-all"
                    title="View on GitHub"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-text-primary truncate" title={activeSession.repoName}>
                    {activeSession.repoName}
                  </h3>
                  {activeSession.description && (
                    <p className="text-xs text-slate-500 dark:text-text-secondary leading-relaxed font-semibold">
                      {activeSession.description}
                    </p>
                  )}
                </div>

                {/* GitHub Languages bar */}
                {activeSession.languages.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-slate-450 dark:text-text-muted flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-accent-cyan" /> Stack composition
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeSession.languages.map((lang) => (
                        <span key={lang} className="px-2.5 py-1 text-[10px] rounded-lg bg-slate-55 dark:bg-bg-tertiary border border-slate-200/60 dark:border-border-subtle text-slate-650 dark:text-text-secondary font-bold">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topics section */}
                {activeSession.topics.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-slate-450 dark:text-text-muted flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-accent-pink" /> Primary Topics
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeSession.topics.map((topic) => (
                        <span key={topic} className="px-2 py-0.5 text-[9px] rounded-md bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/15 font-bold">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Context indicators summary */}
                <div className="p-4 bg-slate-50 dark:bg-bg-primary/40 rounded-xl border border-slate-200/60 dark:border-border-subtle/50 text-[10px] text-slate-400 dark:text-text-muted space-y-1.5 font-bold">
                  <div className="flex justify-between">
                    <span>README footprint:</span>
                    <span className="text-slate-750 dark:text-text-secondary">{(readmeLength / 1024).toFixed(2)} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repository complexity metrics:</span>
                    <span className="text-slate-750 dark:text-text-secondary">{languageCount} Langs / {topicCount} Tags</span>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* SESSIONS HISTORY PANEL CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white dark:bg-bg-secondary rounded-2xl border border-slate-200/80 dark:border-border-subtle shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-100 dark:border-border-subtle/50">
              <div className="p-1.5 bg-accent-cyan/10 rounded-lg">
                <History className="w-4 h-4 text-accent-cyan" />
              </div>
              <h2 className="text-xs font-bold text-slate-800 dark:text-text-primary uppercase tracking-wider">Runs History</h2>
            </div>

            {/* History Search & Filters input block */}
            {history.length > 0 && (
              <div className="space-y-2.5">
                {/* Search query field */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search history..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-bg-tertiary border border-slate-200/80 dark:border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan/50 text-xs text-slate-800 dark:text-text-primary font-medium"
                  />
                </div>

                {/* Language list filters */}
                {allLanguagesInHistory.length > 0 && (
                  <div className="flex items-center justify-between text-xs text-slate-450 dark:text-text-muted font-bold">
                    <span className="flex items-center gap-1.5"><Filter className="w-3.5 h-3.5 text-accent-cyan" /> Filter by:</span>
                    <select
                      value={historyLangFilter}
                      onChange={(e) => setHistoryLangFilter(e.target.value)}
                      className="bg-slate-50 dark:bg-bg-tertiary border border-slate-200 dark:border-border-subtle rounded-lg px-2.5 py-1 text-[11px] focus:outline-none focus:border-accent-cyan text-slate-655 dark:text-text-secondary font-bold cursor-pointer"
                    >
                      <option value="All">All Languages</option>
                      {allLanguagesInHistory.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* List entries */}
            {isLoadingHistory ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <div className="w-6 h-6 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
                <span className="text-[10px] text-slate-450 dark:text-text-muted font-medium">Syncing database history...</span>
              </div>
            ) : filteredHistory.length > 0 ? (
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredHistory.map((item) => {
                  const isActive = item._id === selectedSessionId
                  return (
                    <div
                      key={item._id}
                      onClick={() => handleSelectHistory(item._id)}
                      className={`group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border text-left ${isActive
                          ? 'bg-accent-cyan/5 dark:bg-accent-cyan/5 border-accent-cyan/50 dark:border-accent-cyan/45 text-accent-cyan shadow-[0_2px_12px_rgba(34,211,238,0.04)] font-bold'
                          : 'bg-slate-50/50 dark:bg-bg-tertiary/30 border-slate-200/80 dark:border-border-subtle text-slate-600 dark:text-text-secondary hover:bg-slate-100 dark:hover:bg-bg-tertiary hover:border-slate-350 dark:hover:border-text-muted'
                        }`}
                    >
                      <div className="flex flex-col min-w-0 mr-2 space-y-1">
                        <span className="font-extrabold text-xs truncate text-slate-800 dark:text-text-secondary group-hover:text-slate-955 dark:group-hover:text-text-primary transition-colors">
                          {item.repoName}
                        </span>

                        <div className="flex items-center gap-2 select-none">
                          <span className="text-[9px] text-slate-400 dark:text-text-muted font-semibold">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>

                          {/* Mini language circles */}
                          {item.languages.slice(0, 2).map((lang) => (
                            <span key={lang} className="text-[8px] bg-white dark:bg-bg-primary border border-slate-250 dark:border-slate-700 px-1 rounded text-slate-550 dark:text-text-muted font-bold uppercase">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteHistory(e, item._id)}
                        className="p-1.5 rounded-lg text-slate-400 dark:text-text-muted hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        title="Delete Session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-slate-450 dark:text-text-muted border border-dashed border-slate-200/80 dark:border-border-subtle rounded-xl font-semibold">
                No past run histories found.
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  )
}

export default ProjectPrep

