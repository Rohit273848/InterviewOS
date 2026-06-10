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
    <div className="mt-3 space-y-1">
      <label className="text-[10px] font-bold text-accent-cyan flex items-center gap-1.5 uppercase tracking-wider">
        <FileText className="w-3.5 h-3.5" /> My Study Notes (Auto-saved)
      </label>
      <textarea
        value={note}
        onChange={handleChange}
        placeholder="Outline your response. Mention folder paths, configuration files, specific tools used, or tradeoffs you made..."
        className="w-full min-h-[95px] p-3 text-xs bg-white/50 dark:bg-bg-primary/50 border border-slate-200 dark:border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan/60 text-slate-700 dark:text-text-secondary placeholder-slate-400 dark:placeholder-text-muted transition-colors resize-y leading-relaxed"
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200 dark:border-border-subtle"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-accent-yellow/20 to-accent-pink/20 rounded-xl border border-accent-yellow/25 dark:border-accent-yellow/20">
              <FolderGit2 className="w-7 h-7 text-accent-yellow" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-text-primary">Project Prep</h1>
              <p className="text-slate-500 dark:text-text-muted text-xs md:text-sm mt-0.5 font-medium">
                Ingest repositories and use generative intelligence to build technical interview preparation sets.
              </p>
            </div>
          </div>
        </div>

        {/* Global actions: new button when session active */}
        {activeSession && (
          <button
            onClick={() => setSelectedSessionId(undefined)}
            className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-bg-secondary border border-slate-200 dark:border-border-subtle rounded-xl hover:bg-slate-50 dark:hover:bg-bg-tertiary transition-all text-xs font-bold text-slate-600 dark:text-text-secondary shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
            Analyze New Repository
          </button>
        )}
      </motion.div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPONENT (Dashboard & Questions OR Initial landing) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SNEAK-PEEK LOADING TERMINAL (WebSocket progress simulator - stays dark for visual contrast) */}
          <AnimatePresence mode="wait">
            {visualLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl shadow-accent-cyan/5 space-y-4 text-slate-100"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-accent-cyan animate-pulse" />
                    <span className="text-sm font-bold text-white">AI Repository Scan Terminal</span>
                  </div>
                  <span className="text-xs font-mono text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded">
                    {progress}%
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>

                {/* Log Output Area */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-slate-300 h-44 overflow-y-auto space-y-1.5 scrollbar-thin">
                  {progressLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-slate-500 select-none">{log.timestamp}</span>
                      <span className={
                        log.type === 'success' ? 'text-accent-green' :
                        log.type === 'ws' ? 'text-accent-cyan' :
                        log.type === 'ai' ? 'text-accent-pink' :
                        'text-slate-350'
                      }>
                        {log.msg}
                      </span>
                    </div>
                  ))}
                  <div className="w-1.5 h-3.5 bg-accent-cyan animate-pulse inline-block ml-1" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTIVE VIEW (Details & Question Bank) */}
          {isLoadingSession ? (
            <div className="p-12 bg-white/60 dark:bg-bg-secondary rounded-2xl border border-slate-200 dark:border-border-subtle h-80 flex flex-col items-center justify-center gap-4 shadow-sm">
              <div className="w-10 h-10 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 dark:text-text-secondary text-sm font-medium animate-pulse">Retrieving preparation details...</p>
            </div>
          ) : activeSession && !visualLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              
              {/* Premium Dashboard Metrics Panel (Insights & Readiness) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Readiness Circular Indicator Card */}
                <div className="p-4 bg-white/60 dark:bg-bg-secondary/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-border-subtle/80 flex items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-accent-pink tracking-wider uppercase flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> Interview Readiness
                    </span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-text-primary">{readinessPercentage}%</h3>
                    <p className="text-[10px] text-slate-500 dark:text-text-muted font-medium">
                      {masteredCount} of {totalQuestions} concepts mastered
                    </p>
                  </div>
                  
                  {/* Radial Progress Ring SVG */}
                  <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r={radius}
                        className="stroke-slate-100 dark:stroke-bg-tertiary"
                        strokeWidth="4"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="28"
                        cy="28"
                        r={radius}
                        className="stroke-accent-pink"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transition={{ duration: 0.5 }}
                      />
                    </svg>
                    <span className="absolute text-[10px] font-mono font-bold text-slate-700 dark:text-text-secondary">
                      {masteredCount}/{totalQuestions}
                    </span>
                  </div>
                </div>

                {/* 2. Repository Complexity Card */}
                <div className="p-4 bg-white/60 dark:bg-bg-secondary/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-border-subtle/80 space-y-1.5 shadow-sm">
                  <span className="text-[10px] font-bold text-accent-yellow tracking-wider uppercase flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> Complexity Rating
                  </span>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-text-primary">{complexityScore}<span className="text-xs text-slate-500 dark:text-text-muted font-medium">/100</span></h3>
                    <span className="text-[10px] font-bold text-accent-yellow bg-accent-yellow/10 px-2 py-0.5 rounded">
                      {complexityTier}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-bg-tertiary h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-yellow" style={{ width: `${complexityScore}%` }} />
                  </div>
                </div>

                {/* 3. Repository Health Snapshot Card */}
                <div className="p-4 bg-white/60 dark:bg-bg-secondary/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-border-subtle/80 space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold text-accent-green tracking-wider uppercase flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Health Snapshot
                  </span>
                  
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px] text-slate-600 dark:text-text-secondary font-medium">
                    <div className="flex justify-between border-b border-slate-200/50 dark:border-border-subtle/50 pb-1">
                      <span className="text-slate-400 dark:text-text-muted">Documentation:</span>
                      <span className="font-bold text-accent-cyan">{healthIndicators.readme}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 dark:border-border-subtle/50 pb-1">
                      <span className="text-slate-400 dark:text-text-muted">Context:</span>
                      <span className="font-bold text-accent-pink">{healthIndicators.meta}</span>
                    </div>
                    <div className="flex justify-between pb-0.5">
                      <span className="text-slate-400 dark:text-text-muted">Composition:</span>
                      <span className="font-bold text-accent-green">{healthIndicators.composition}</span>
                    </div>
                    <div className="flex justify-between pb-0.5">
                      <span className="text-slate-400 dark:text-text-muted">Ingestion Health:</span>
                      <span className="font-bold text-slate-800 dark:text-text-primary">{healthIndicators.score}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Categories Distribution Dashboard Row */}
              <div className="p-4 bg-white/60 dark:bg-bg-secondary/60 rounded-2xl border border-slate-200 dark:border-border-subtle shadow-sm space-y-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-text-muted tracking-wider uppercase">
                  Ingested Category Density
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categoryStats).map(([cat, count]) => (
                    <span 
                      key={cat} 
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-50 dark:bg-bg-tertiary border border-slate-200 dark:border-border-subtle text-slate-600 dark:text-text-secondary flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                      {cat}: <span className="text-slate-800 dark:text-text-primary font-black">{count}</span>
                    </span>
                  ))}
                  {Object.keys(categoryStats).length === 0 && (
                    <span className="text-xs text-slate-500 dark:text-text-muted font-medium">No category metadata available.</span>
                  )}
                </div>
              </div>

              {/* Questions List Module Header */}
              <div className="p-6 bg-white/60 dark:bg-bg-secondary rounded-2xl border border-slate-200 dark:border-border-subtle shadow-sm space-y-6">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-text-primary">AI Interview Guide</h2>
                    <p className="text-xs text-slate-500 dark:text-text-muted font-medium">Filter questions by tags or search matching text guidelines.</p>
                  </div>

                  {/* Search query box for questions */}
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={questionSearch}
                      onChange={(e) => setQuestionSearch(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 bg-slate-50 dark:bg-bg-tertiary border border-slate-200 dark:border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan/60 text-xs text-slate-850 dark:text-text-primary"
                    />
                  </div>
                </div>

                {/* Categories Tab selector bar including ★ Bookmarked */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin border-b border-slate-200/50 dark:border-border-subtle/50">
                  {['All', '★ Bookmarked', ...CATEGORIES.slice(1)].map((category) => {
                    const isSelected = selectedCategory.toLowerCase() === category.toLowerCase()
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category)
                          setExpandedQuestionIdx(null)
                        }}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors whitespace-nowrap border ${
                          isSelected
                            ? 'bg-accent-cyan/10 dark:bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30 dark:border-accent-cyan/35 font-black'
                            : 'bg-slate-100 dark:bg-bg-tertiary/60 border-slate-200 dark:border-border-subtle text-slate-500 dark:text-text-muted hover:text-slate-800 dark:hover:text-text-secondary hover:bg-slate-200 dark:hover:bg-bg-tertiary'
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
                          className={`bg-slate-50/50 dark:bg-bg-tertiary/40 rounded-xl border transition-all overflow-hidden ${
                            isMastered 
                              ? 'border-slate-200/50 dark:border-border-subtle/40 opacity-70 hover:opacity-100' 
                              : 'border-slate-200 dark:border-border-subtle hover:border-accent-cyan/25'
                          }`}
                        >
                          <div className="p-4 flex items-start gap-4">
                            
                            {/* Mastery Status Checkbox */}
                            <button
                              onClick={() => toggleMastered(originalIdx)}
                              className="mt-1 flex-shrink-0 p-1 hover:text-accent-green transition-colors"
                              title={isMastered ? 'Mark incomplete' : 'Mark mastered'}
                            >
                              <CheckCircle className={`w-5 h-5 ${
                                isMastered ? 'text-accent-green fill-accent-green/10' : 'text-slate-400 dark:text-text-muted'
                              }`} />
                            </button>

                            <div 
                              onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                              className="flex-grow min-w-0 cursor-pointer space-y-2 select-none"
                            >
                              <p className={`text-sm font-semibold leading-relaxed ${
                                isMastered ? 'text-slate-400 dark:text-text-muted line-through font-medium' : 'text-slate-700 dark:text-text-secondary'
                              }`}>
                                {q.question}
                              </p>

                              <div className="flex flex-wrap items-center gap-2">
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
                              className="mt-1 p-1 hover:text-accent-yellow transition-colors text-slate-400 dark:text-text-muted"
                              title="Bookmark question"
                            >
                              <Star className={`w-4 h-4 ${
                                isBookmarked ? 'text-accent-yellow fill-accent-yellow/20' : 'text-slate-400 dark:text-text-muted'
                              }`} />
                            </button>

                            {/* Accordion toggle button */}
                            <button 
                              onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                              className="mt-1 p-1 text-slate-400 dark:text-text-muted hover:text-slate-700 dark:hover:text-text-secondary"
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
                                className="border-t border-slate-200 dark:border-border-subtle/50 bg-slate-100/20 dark:bg-bg-primary/20"
                              >
                                <div className="p-4 space-y-4">
                                  
                                  {/* Answer Guidelines Hint */}
                                  <div className="text-xs text-slate-650 dark:text-text-secondary">
                                    <span className="font-bold text-accent-cyan mb-1 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                                      <Lock className="w-3.5 h-3.5" /> Response Guideline & Rubric
                                    </span>
                                    <p className="bg-slate-100/70 dark:bg-bg-tertiary/60 p-3.5 rounded-xl border border-slate-200 dark:border-border-subtle/40 text-slate-550 dark:text-text-muted leading-relaxed font-medium">
                                      {q.hint || 'No conceptual talking points specified for this item.'}
                                    </p>
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
                    <div className="text-center py-12 text-xs text-slate-400 dark:text-text-muted border border-dashed border-slate-200 dark:border-border-subtle rounded-2xl bg-slate-100/10 dark:bg-bg-tertiary/10 font-medium">
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
              className="bg-white/60 dark:bg-bg-secondary/40 backdrop-blur-md border border-slate-200 dark:border-border-subtle rounded-3xl p-8 space-y-8 relative overflow-hidden shadow-sm"
            >
              {/* Background ambient light */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-pink/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="space-y-3 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-bold rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Ingestion Pipeline Active
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-text-primary leading-tight">
                  Import repository, <br className="hidden md:inline" />
                  reverse-engineer your preparation.
                </h2>
                <p className="text-sm text-slate-500 dark:text-text-secondary max-w-xl leading-relaxed font-medium">
                  Provide a public or private GitHub repository link. Our system maps out directories, analyzes documents, and returns domain interview questions.
                </p>
              </div>

              {/* Generation Configuration Input Block */}
              <div className="p-6 bg-slate-50 dark:bg-bg-secondary border border-slate-200 dark:border-border-subtle rounded-2xl space-y-4 shadow-inner">
                <div className="space-y-4">
                  
                  {/* Repo URL Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500 dark:text-text-secondary">
                      Repository URL
                    </label>
                    <div className="relative">
                      <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-text-muted" />
                      <input
                        type="text"
                        placeholder="https://github.com/username/repo"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-bg-primary border border-slate-200 dark:border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan/60 text-slate-850 dark:text-text-primary transition-all text-xs"
                      />
                    </div>
                  </div>

                  {/* Private Repository Tokens Panel */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowTokenInput(!showTokenInput)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-text-muted hover:text-accent-cyan transition-colors"
                    >
                      <Key className="w-3.5 h-3.5" />
                      {showTokenInput ? 'Hide GitHub Access Token' : 'Add GitHub Access Token (for Private Repos)'}
                    </button>
                    
                    <AnimatePresence>
                      {showTokenInput && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-2"
                        >
                          <input
                            type="password"
                            placeholder="ghp_yourPersonalAccessToken"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-bg-primary border border-slate-200 dark:border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan/60 transition-colors text-xs font-mono text-slate-800 dark:text-text-primary"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit Ingestion */}
                  <button
                    onClick={() => handleGenerate()}
                    disabled={isGenerating}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink text-white dark:text-bg-primary font-extrabold rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                  >
                    <Sparkles className="w-4 h-4" />
                    Build Interview Rubric
                  </button>
                </div>
              </div>

              {/* Grid of demo repositories */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 dark:text-text-muted uppercase tracking-wider block">
                  Quick Start Sandbox Demo Repositories
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {DEMO_REPOSITORIES.map((repo) => (
                    <div
                      key={repo.name}
                      onClick={() => {
                        setGithubUrl(repo.url)
                        handleGenerate(repo.url)
                      }}
                      className="p-3 bg-white dark:bg-bg-secondary border border-slate-200 dark:border-border-subtle rounded-xl cursor-pointer hover:border-accent-cyan/30 hover:bg-slate-50 dark:hover:bg-bg-tertiary/40 transition-all text-left space-y-1 group shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-text-secondary group-hover:text-accent-cyan transition-colors">
                          {repo.name}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-text-muted truncate font-medium">{repo.desc}</p>
                    </div>
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 bg-white/60 dark:bg-bg-secondary rounded-2xl border border-slate-200 dark:border-border-subtle shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-border-subtle/50">
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-accent-cyan" />
                    <span className="text-[10px] font-bold text-slate-450 dark:text-text-muted uppercase tracking-wider">
                      Active Repository
                    </span>
                  </div>
                  <a
                    href={activeSession.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 hover:bg-slate-100 dark:hover:bg-bg-tertiary rounded-lg text-slate-450 hover:text-accent-cyan dark:hover:text-accent-cyan transition-colors"
                    title="View on GitHub"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-base text-slate-800 dark:text-text-primary truncate">{activeSession.repoName}</h3>
                  {activeSession.description && (
                    <p className="text-xs text-slate-500 dark:text-text-muted leading-relaxed font-medium">
                      {activeSession.description}
                    </p>
                  )}
                </div>

                {/* GitHub Languages bar */}
                {activeSession.languages.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-slate-450 dark:text-text-muted flex items-center gap-1">
                      <Code className="w-3 h-3" /> Stack composition
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeSession.languages.map((lang) => (
                        <span key={lang} className="px-2 py-0.5 text-[10px] rounded bg-slate-50 dark:bg-bg-tertiary border border-slate-200 dark:border-border-subtle text-slate-650 dark:text-text-secondary font-medium">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topics section */}
                {activeSession.topics.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-slate-450 dark:text-text-muted flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Primary Tags
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {activeSession.topics.map((topic) => (
                        <span key={topic} className="px-1.5 py-0.5 text-[9px] rounded-md bg-accent-cyan/5 text-accent-cyan border border-accent-cyan/15 font-semibold">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Context indicators summary */}
                <div className="p-3 bg-slate-50 dark:bg-bg-primary/50 rounded-xl border border-slate-200 dark:border-border-subtle/50 text-[10px] text-slate-400 dark:text-text-muted space-y-1 font-medium">
                  <div className="flex justify-between">
                    <span>README Data size:</span>
                    <span className="font-bold text-slate-600 dark:text-text-secondary">{(readmeLength / 1024).toFixed(2)} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parsed file metrics:</span>
                    <span className="font-bold text-slate-600 dark:text-text-secondary">{languageCount} Techs / {topicCount} Tags</span>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* SESSIONS HISTORY PANEL CARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-white/60 dark:bg-bg-secondary rounded-2xl border border-slate-200 dark:border-border-subtle shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200/50 dark:border-border-subtle/50">
              <History className="w-4 h-4 text-accent-cyan" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-text-primary uppercase tracking-wider">Runs History</h2>
            </div>

            {/* History Search & Filters input block */}
            {history.length > 0 && (
              <div className="space-y-2">
                {/* Search query field */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search history..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-bg-tertiary border border-slate-200 dark:border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan/60 text-xs text-slate-800 dark:text-text-primary"
                  />
                </div>

                {/* Language list filters */}
                {allLanguagesInHistory.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-text-muted font-medium">
                    <Filter className="w-3 h-3" />
                    <select
                      value={historyLangFilter}
                      onChange={(e) => setHistoryLangFilter(e.target.value)}
                      className="bg-slate-50 dark:bg-bg-tertiary border border-slate-200 dark:border-border-subtle rounded px-2 py-0.5 text-[11px] focus:outline-none focus:border-accent-cyan text-slate-600 dark:text-text-secondary font-medium"
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
                <div className="w-5 h-5 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] text-slate-400 dark:text-text-muted font-medium">Syncing database history...</span>
              </div>
            ) : filteredHistory.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
                {filteredHistory.map((item) => {
                  const isActive = item._id === selectedSessionId
                  return (
                    <div
                      key={item._id}
                      onClick={() => handleSelectHistory(item._id)}
                      className={`group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border text-left ${
                        isActive 
                          ? 'bg-accent-cyan/5 dark:bg-accent-cyan/5 border-accent-cyan/40 dark:border-accent-cyan/40 text-accent-cyan shadow-[0_0_12px_rgba(34,211,238,0.06)] font-bold' 
                          : 'bg-slate-50/50 dark:bg-bg-tertiary/60 border-slate-200 dark:border-border-subtle text-slate-600 dark:text-text-secondary hover:bg-slate-100 dark:hover:bg-bg-tertiary hover:border-slate-350 dark:hover:border-text-muted'
                      }`}
                    >
                      <div className="flex flex-col min-w-0 mr-2 space-y-1">
                        <span className="font-bold text-xs truncate text-slate-700 dark:text-text-secondary group-hover:text-slate-900 dark:group-hover:text-text-primary transition-colors">
                          {item.repoName}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-400 dark:text-text-muted font-medium">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          
                          {/* Mini language circles */}
                          {item.languages.slice(0, 2).map((lang) => (
                            <span key={lang} className="text-[8px] bg-white dark:bg-bg-primary border border-slate-200 dark:border-border-subtle px-1 rounded text-slate-400 dark:text-text-muted font-semibold">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => handleDeleteHistory(e, item._id)}
                        className="p-1.5 rounded-lg text-slate-400 dark:text-text-muted hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400 dark:text-text-muted border border-dashed border-slate-200 dark:border-border-subtle rounded-xl font-medium">
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
