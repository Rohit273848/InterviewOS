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

      return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 select-none text-slate-800 dark:text-slate-100 min-h-screen flex flex-col">
      
      {/* Sleek Minimal Header Panel when active */}
      <AnimatePresence>
        {activeSession && !visualLoading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200 dark:border-border-subtle"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedSessionId(undefined)}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-bg-secondary dark:hover:bg-bg-tertiary rounded-xl transition-all text-slate-500 dark:text-text-muted hover:text-slate-800 dark:hover:text-text-primary"
                title="Back to Dashboard"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-text-primary flex items-center gap-2">
                  <Github className="w-6 h-6 text-accent-cyan" />
                  {activeSession.repoName}
                </h1>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-text-muted font-medium">
                  <a href={activeSession.githubUrl} target="_blank" rel="noreferrer" className="hover:text-accent-cyan flex items-center gap-1 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> View Original Repo
                  </a>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span>{(readmeLength / 1024).toFixed(1)} KB Parsed</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedSessionId(undefined)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink text-white font-bold rounded-xl text-xs hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4" />
              New Analysis
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow flex flex-col">
        {/* Loading Terminal */}
        <AnimatePresence mode="wait">
          {visualLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto w-full p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-accent-cyan/10 space-y-4 text-slate-100 my-auto"
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

              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                <motion.div 
                  className="h-full bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-slate-300 h-48 overflow-y-auto space-y-1.5 scrollbar-thin">
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

        {isLoadingSession ? (
          <div className="p-12 my-auto flex flex-col items-center justify-center gap-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-500 dark:text-text-secondary text-sm font-bold animate-pulse uppercase tracking-widest">Compiling details...</p>
          </div>
        ) : activeSession && !visualLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-12"
          >
            {/* Sleek Metrics Banner (Single Row) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Readiness Card */}
              <div className="p-5 bg-white dark:bg-bg-secondary rounded-2xl border border-slate-200 dark:border-border-subtle shadow-sm flex items-center justify-between group hover:border-accent-pink/30 transition-colors">
                <div>
                  <span className="text-[10px] font-bold text-accent-pink tracking-widest uppercase flex items-center gap-1.5 mb-1.5">
                    <Trophy className="w-3.5 h-3.5" /> Readiness Score
                  </span>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-slate-800 dark:text-text-primary">{readinessPercentage}%</h3>
                    <span className="text-xs font-medium text-slate-400 dark:text-text-muted">{masteredCount}/{totalQuestions} Mastered</span>
                  </div>
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="20" className="stroke-slate-100 dark:stroke-bg-tertiary" strokeWidth="4" fill="transparent" />
                    <motion.circle cx="24" cy="24" r="20" className="stroke-accent-pink" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 - (readinessPercentage / 100) * 125.6} strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Complexity Card */}
              <div className="p-5 bg-white dark:bg-bg-secondary rounded-2xl border border-slate-200 dark:border-border-subtle shadow-sm flex items-center justify-between group hover:border-accent-yellow/30 transition-colors">
                <div>
                  <span className="text-[10px] font-bold text-accent-yellow tracking-widest uppercase flex items-center gap-1.5 mb-1.5">
                    <Activity className="w-3.5 h-3.5" /> Complexity Rating
                  </span>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-slate-800 dark:text-text-primary">{complexityScore}</h3>
                    <span className="text-xs font-medium text-slate-400 dark:text-text-muted">/ 100</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-accent-yellow bg-accent-yellow/10 px-2.5 py-1 rounded-md border border-accent-yellow/20">
                  {complexityTier}
                </span>
              </div>

              {/* Stack Card */}
              <div className="p-5 bg-white dark:bg-bg-secondary rounded-2xl border border-slate-200 dark:border-border-subtle shadow-sm flex flex-col justify-center group hover:border-accent-cyan/30 transition-colors overflow-hidden">
                <span className="text-[10px] font-bold text-accent-cyan tracking-widest uppercase flex items-center gap-1.5 mb-2.5">
                  <Code className="w-3.5 h-3.5" /> Tech Stack Context
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeSession.languages.slice(0, 4).map(lang => (
                    <span key={lang} className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-bg-tertiary text-slate-700 dark:text-text-secondary border border-slate-200 dark:border-border-subtle">
                      {lang}
                    </span>
                  ))}
                  {activeSession.topics.slice(0, 2).map(topic => (
                    <span key={topic} className="px-2 py-0.5 text-[10px] font-bold rounded bg-accent-cyan/5 text-accent-cyan border border-accent-cyan/15">
                      {topic}
                    </span>
                  ))}
                  {(activeSession.languages.length > 4 || activeSession.topics.length > 2) && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded text-slate-400 dark:text-text-muted">...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Questions Bank Module */}
            <div className="bg-white dark:bg-bg-secondary rounded-3xl border border-slate-200 dark:border-border-subtle shadow-sm overflow-hidden flex flex-col">
              
              {/* Controls Header */}
              <div className="p-5 border-b border-slate-200 dark:border-border-subtle bg-slate-50/50 dark:bg-bg-primary/20 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-lg font-black text-slate-800 dark:text-text-primary flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-accent-cyan" /> Interactive Interview Guide
                  </h2>

                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search questions or keywords..."
                      value={questionSearch}
                      onChange={(e) => setQuestionSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-bg-primary border border-slate-200 dark:border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan/60 focus:ring-2 focus:ring-accent-cyan/10 text-xs text-slate-800 dark:text-text-primary transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Categories Tab Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {['All', '★ Bookmarked', ...CATEGORIES.slice(1)].map((category) => {
                    const isSelected = selectedCategory.toLowerCase() === category.toLowerCase()
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category)
                          setExpandedQuestionIdx(null)
                        }}
                        className={`px-4 py-1.5 text-[11px] font-bold rounded-full transition-all whitespace-nowrap ${
                          isSelected
                            ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md scale-[1.02]'
                            : 'bg-white dark:bg-bg-tertiary/60 border border-slate-200 dark:border-border-subtle text-slate-500 dark:text-text-muted hover:text-slate-800 dark:hover:text-text-secondary hover:bg-slate-50 dark:hover:bg-bg-tertiary hover:scale-[1.02]'
                        }`}
                      >
                        {category}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Questions List */}
              <div className="p-4 space-y-3 bg-slate-50/30 dark:bg-bg-primary/30 min-h-[400px]">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q, idx) => {
                    const originalIdx = activeSession.generatedQuestions.findIndex(orig => orig.question === q.question)
                    const isExpanded = expandedQuestionIdx === idx
                    const isBookmarked = bookmarks[originalIdx] || false
                    const isMastered = mastered[originalIdx] || false

                    return (
                      <div
                        key={idx}
                        className={`bg-white dark:bg-bg-secondary rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm ${
                          isMastered 
                            ? 'border-slate-200/50 dark:border-border-subtle/40 opacity-75 hover:opacity-100' 
                            : isExpanded ? 'border-accent-cyan/40 shadow-md ring-1 ring-accent-cyan/10' : 'border-slate-200 dark:border-border-subtle hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
                        }`}
                      >
                        <div className="p-4 flex items-start gap-4 cursor-pointer" onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}>
                          {/* Mastery Checkbox */}
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleMastered(originalIdx); }}
                            className={`mt-0.5 flex-shrink-0 p-1.5 rounded-full transition-all ${
                              isMastered ? 'text-accent-green bg-accent-green/10' : 'text-slate-300 dark:text-slate-600 hover:text-accent-green hover:bg-slate-100 dark:hover:bg-bg-tertiary'
                            }`}
                            title={isMastered ? 'Mark incomplete' : 'Mark mastered'}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>

                          <div className="flex-grow min-w-0 space-y-2.5 pt-1">
                            <p className={`text-[15px] leading-relaxed ${
                              isMastered ? 'text-slate-400 dark:text-text-muted line-through decoration-slate-300 dark:decoration-slate-600 font-medium' : 'text-slate-800 dark:text-text-primary font-bold'
                            }`}>
                              {q.question}
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-1 text-[9px] font-bold rounded-md bg-slate-100 dark:bg-bg-tertiary text-slate-500 dark:text-text-muted uppercase tracking-wider">
                                {q.category}
                              </span>
                              <span className={`px-2.5 py-1 text-[9px] font-bold rounded-md uppercase tracking-wider ${getDifficultyColor(q.difficulty)}`}>
                                {q.difficulty}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 pt-0.5">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleBookmark(originalIdx); }}
                              className="p-2 rounded-lg text-slate-400 dark:text-text-muted hover:bg-slate-100 dark:hover:bg-bg-tertiary hover:text-accent-yellow transition-all"
                              title="Bookmark question"
                            >
                              <Star className={`w-4 h-4 ${isBookmarked ? 'text-accent-yellow fill-accent-yellow' : ''}`} />
                            </button>
                            <div className="p-2 text-slate-400 dark:text-text-muted">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </div>
                        </div>

                        {/* Expandable Panel */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border-t border-slate-100 dark:border-border-subtle/50 bg-slate-50/50 dark:bg-bg-primary/20"
                            >
                              <div className="p-6 space-y-5">
                                {/* Hint / Rubric */}
                                <div className="space-y-2">
                                  <span className="font-bold text-accent-cyan flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                                    <Sparkles className="w-3.5 h-3.5" /> Conceptual Rubric
                                  </span>
                                  <div className="bg-white dark:bg-bg-secondary p-4 rounded-xl border border-slate-200 dark:border-border-subtle/60 text-slate-600 dark:text-text-secondary text-sm leading-relaxed shadow-sm">
                                    {q.hint || 'No conceptual talking points specified for this item.'}
                                  </div>
                                </div>

                                <AnswerNotes sessionId={activeSession._id} questionIdx={originalIdx} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-bg-tertiary rounded-full flex items-center justify-center mb-2">
                      <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-text-primary">No matching questions</h3>
                      <p className="text-xs text-slate-500 dark:text-text-muted mt-1">Try adjusting your category filter or search query.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : !visualLoading ? (
          /* HERO Landing & History State */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-grow flex flex-col"
          >
            {/* Hero Section */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto pt-16 md:pt-24 pb-12 px-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[10px] font-black rounded-full mb-8 uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Codebase Ingestion
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-6 leading-[1.1]">
                Master any codebase. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink">Ace the interview.</span>
              </h1>
              
              <p className="text-slate-500 dark:text-text-secondary text-sm md:text-base mb-12 max-w-xl leading-relaxed font-medium">
                Paste a GitHub repository link below. Our engine analyzes the architecture, dependencies, and patterns to generate a personalized, rigorous technical interview prep guide.
              </p>

              {/* Central Input Form */}
              <div className="w-full max-w-2xl space-y-4">
                <div className="p-2 bg-white dark:bg-bg-secondary border border-slate-200 dark:border-border-subtle rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col md:flex-row gap-2 transition-all hover:shadow-2xl hover:border-accent-cyan/30">
                  <div className="relative flex-grow">
                    <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="https://github.com/facebook/react"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-transparent focus:outline-none text-slate-800 dark:text-text-primary text-sm font-medium"
                    />
                  </div>
                  <button
                    onClick={() => handleGenerate()}
                    disabled={isGenerating || !githubUrl.trim()}
                    className="px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    Generate Guide <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Private Repo Toggle */}
                <div className="text-left px-2">
                  <button
                    type="button"
                    onClick={() => setShowTokenInput(!showTokenInput)}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-text-muted hover:text-accent-cyan transition-colors uppercase tracking-wider"
                  >
                    <Key className="w-3 h-3" />
                    {showTokenInput ? 'Hide Token Input' : 'Add Token for Private Repos'}
                  </button>
                  
                  <AnimatePresence>
                    {showTokenInput && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-3"
                      >
                        <input
                          type="password"
                          placeholder="ghp_yourPersonalAccessToken"
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-bg-tertiary/50 border border-slate-200 dark:border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan/60 transition-colors text-xs font-mono text-slate-800 dark:text-text-primary"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Sandbox Demos Row */}
            <div className="max-w-4xl mx-auto w-full mt-8 mb-16">
               <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400 dark:text-text-muted uppercase tracking-widest mb-6">
                  <div className="h-px bg-slate-200 dark:bg-border-subtle flex-grow max-w-[100px]"></div>
                  Try a Demo Repository
                  <div className="h-px bg-slate-200 dark:bg-border-subtle flex-grow max-w-[100px]"></div>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4">
                  {DEMO_REPOSITORIES.map((repo) => (
                    <div
                      key={repo.name}
                      onClick={() => {
                        setGithubUrl(repo.url)
                        handleGenerate(repo.url)
                      }}
                      className="p-4 bg-white dark:bg-bg-secondary border border-slate-200 dark:border-border-subtle rounded-2xl cursor-pointer hover:border-accent-cyan/40 hover:shadow-lg transition-all text-center group"
                    >
                      <h4 className="text-sm font-black text-slate-800 dark:text-text-primary group-hover:text-accent-cyan transition-colors mb-1">{repo.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-text-muted font-medium">{repo.desc}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* History Section (Bottom) */}
            {history.length > 0 && (
              <div className="max-w-4xl mx-auto w-full mt-auto pt-12 pb-8 border-t border-slate-200 dark:border-border-subtle px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-100 dark:bg-bg-tertiary rounded-lg">
                      <History className="w-4 h-4 text-slate-600 dark:text-text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-800 dark:text-text-primary">Recent Analyses</h2>
                      <p className="text-xs text-slate-500 dark:text-text-muted font-medium">Resume your previous preparation sessions</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {allLanguagesInHistory.length > 0 && (
                      <select
                        value={historyLangFilter}
                        onChange={(e) => setHistoryLangFilter(e.target.value)}
                        className="bg-white dark:bg-bg-secondary border border-slate-200 dark:border-border-subtle rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent-cyan text-slate-600 dark:text-text-secondary font-bold cursor-pointer"
                      >
                        <option value="All">All Languages</option>
                        {allLanguagesInHistory.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    )}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search repos..."
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        className="w-40 md:w-56 pl-9 pr-3 py-2 bg-white dark:bg-bg-secondary border border-slate-200 dark:border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan/60 text-xs text-slate-800 dark:text-text-primary"
                      />
                    </div>
                  </div>
                </div>

                {isLoadingHistory ? (
                  <div className="py-12 flex justify-center">
                    <div className="w-6 h-6 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredHistory.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredHistory.slice(0, 6).map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleSelectHistory(item._id)}
                        className="group p-5 bg-white dark:bg-bg-secondary border border-slate-200 dark:border-border-subtle rounded-2xl cursor-pointer hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md transition-all flex flex-col relative"
                      >
                        <button
                          onClick={(e) => handleDeleteHistory(e, item._id)}
                          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all z-10"
                          title="Delete Session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="flex items-start gap-3 mb-3 pr-8">
                          <div className="p-2 bg-slate-50 dark:bg-bg-tertiary rounded-lg shrink-0">
                            <Github className="w-4 h-4 text-slate-600 dark:text-text-secondary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-800 dark:text-text-primary truncate" title={item.repoName}>
                              {item.repoName}
                            </h3>
                            <span className="text-[10px] text-slate-400 dark:text-text-muted font-medium">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-auto flex flex-wrap gap-1.5">
                          {item.languages.slice(0, 3).map((lang) => (
                            <span key={lang} className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-slate-50 dark:bg-bg-tertiary text-slate-500 dark:text-text-muted border border-slate-200 dark:border-border-subtle">
                              {lang}
                            </span>
                          ))}
                          {item.languages.length > 3 && (
                             <span className="px-2 py-0.5 text-[9px] font-bold rounded-md text-slate-400 dark:text-text-muted">
                              +{item.languages.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-sm text-slate-500 dark:text-text-muted font-medium border border-dashed border-slate-200 dark:border-border-subtle rounded-2xl">
                    No matching history found.
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : null}
      </main>
    </div>
  )
}

export default ProjectPrep
