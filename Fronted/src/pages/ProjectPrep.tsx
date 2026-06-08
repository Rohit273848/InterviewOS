import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FolderGit2, 
  Github, 
  Link as LinkIcon, 
  Sparkles, 
  Trash2, 
  History, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  Code,
  BookOpen,
  Key
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useProjectPrep } from '../hooks/useProjectPrep'

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

const ProjectPrep = () => {
  const [githubUrl, setGithubUrl] = useState('')
  const [token, setToken] = useState('')
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(undefined)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(null)

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

  // Trigger question generation from URL
  const handleGenerate = async () => {
    if (!githubUrl) {
      toast.error('Please enter a GitHub URL')
      return
    }

    try {
      const session = await generateQuestions({ 
        githubUrl, 
        token: token ? token.trim() : null 
      })
      setSelectedSessionId(session._id)
      setGithubUrl('')
      setToken('')
      setShowTokenInput(false)
    } catch (error) {
      // Errors are handled inside hook mutations
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
    if (confirm('Are you sure you want to delete this session?')) {
      try {
        await deleteSessionRecord(id)
        if (selectedSessionId === id) {
          setSelectedSessionId(undefined)
        }
      } catch (error) {
        // Errors handled in hook
      }
    }
  }

  // Filter questions based on category tab
  const filteredQuestions = activeSession?.generatedQuestions.filter(q => {
    if (selectedCategory === 'All') return true
    return q.category.toLowerCase() === selectedCategory.toLowerCase()
  }) || []

  // Difficulty badge coloring helper
  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'hard':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'medium':
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <FolderGit2 className="w-8 h-8 text-accent-yellow" />
          <h1 className="text-4xl font-black">Project Prep</h1>
        </div>
        <p className="text-text-secondary text-lg mb-8">
          Analyze codebase architecture, metadata, and READMEs to generate project-specific interview questions.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Columns - Input & History */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle space-y-4"
          >
            <h2 className="text-xl font-bold">New Repository</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-text-secondary">Repository URL</label>
                <div className="relative">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="https://github.com/username/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-bg-tertiary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Private Repository Token Panel */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowTokenInput(!showTokenInput)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-accent-cyan transition-colors"
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
                        className="w-full px-4 py-2.5 bg-bg-tertiary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan transition-colors text-xs"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full px-6 py-3.5 bg-gradient-to-r from-accent-yellow to-accent-pink text-bg-primary font-bold rounded-xl hover:shadow-lg hover:shadow-accent-yellow/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
                    Generating questions...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Questions
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* History Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
          >
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-accent-cyan" />
              <h2 className="text-xl font-bold">Session History</h2>
            </div>

            {isLoadingHistory ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <div className="w-6 h-6 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-text-muted">Loading history...</span>
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {history.map((item) => {
                  const isActive = item._id === selectedSessionId
                  return (
                    <div
                      key={item._id}
                      onClick={() => handleSelectHistory(item._id)}
                      className={`group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border ${
                        isActive 
                          ? 'bg-accent-cyan/10 border-accent-cyan/40 text-accent-cyan' 
                          : 'bg-bg-tertiary border-border-subtle text-text-secondary hover:bg-bg-tertiary/75 hover:border-text-muted/40'
                      }`}
                    >
                      <div className="flex flex-col min-w-0 mr-2">
                        <span className="font-bold text-sm truncate">{item.repoName}</span>
                        <span className="text-[10px] text-text-muted">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteHistory(e, item._id)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center py-6 text-sm text-text-muted">
                No past sessions found.
              </p>
            )}
          </motion.div>
        </div>

        {/* Right Columns - Details & Questions */}
        <div className="lg:col-span-2 space-y-6">
          {isLoadingSession ? (
            <div className="p-8 bg-bg-secondary rounded-2xl border border-border-subtle h-64 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-accent-pink border-t-transparent rounded-full animate-spin" />
              <p className="text-text-secondary font-medium">Fetching session details...</p>
            </div>
          ) : activeSession ? (
            <>
              {/* Repository Preview Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Github className="w-5 h-5 text-text-secondary" />
                  <a 
                    href={activeSession.githubUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-lg font-bold hover:text-accent-cyan hover:underline transition-colors flex items-center gap-1"
                  >
                    {activeSession.repoName}
                  </a>
                </div>
                
                {activeSession.description && (
                  <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                    {activeSession.description}
                  </p>
                )}

                {/* Badges for Languages & Topics */}
                <div className="space-y-3">
                  {activeSession.languages.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1">
                        <Code className="w-3.5 h-3.5" /> Languages:
                      </span>
                      {activeSession.languages.map(lang => (
                        <span key={lang} className="px-2 py-0.5 text-xs rounded-full bg-bg-tertiary border border-border-subtle text-text-secondary">
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}

                  {activeSession.topics.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> Topics:
                      </span>
                      {activeSession.topics.map(topic => (
                        <span key={topic} className="px-2 py-0.5 text-xs rounded-full bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Categorized Questions Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Interview Questions</h2>
                  <span className="px-3 py-1 bg-accent-pink/10 border border-accent-pink/20 text-accent-pink text-xs font-bold rounded-lg">
                    {activeSession.generatedQuestions.length} Questions
                  </span>
                </div>

                {/* Horizontal Category Tab Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin border-b border-border-subtle/50">
                  {CATEGORIES.map(category => {
                    const isSelected = selectedCategory.toLowerCase() === category.toLowerCase()
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category)
                          setExpandedQuestionIdx(null)
                        }}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap border ${
                          isSelected
                            ? 'bg-accent-yellow text-bg-primary border-accent-yellow'
                            : 'bg-bg-tertiary border-border-subtle text-text-muted hover:text-text-secondary hover:bg-bg-tertiary/60'
                        }`}
                      >
                        {category}
                      </button>
                    )
                  })}
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((q, idx) => {
                      const isExpanded = expandedQuestionIdx === idx
                      return (
                        <div
                          key={idx}
                          className="bg-bg-tertiary rounded-xl border border-border-subtle/80 overflow-hidden hover:border-border-subtle transition-all"
                        >
                          {/* Question header click to expand hint */}
                          <div 
                            onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                            className="p-4 flex items-start justify-between gap-4 cursor-pointer select-none"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="w-6 h-6 rounded-full bg-accent-yellow/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-black text-accent-yellow">{idx + 1}</span>
                              </div>
                              <div className="space-y-1.5 min-w-0">
                                <p className="text-text-secondary text-sm font-semibold leading-relaxed">
                                  {q.question}
                                </p>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-bg-secondary border border-border-subtle text-text-muted">
                                    {q.category}
                                  </span>
                                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getDifficultyColor(q.difficulty)}`}>
                                    {q.difficulty}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-text-muted group-hover:text-text-secondary flex-shrink-0 mt-1">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </div>

                          {/* Expandable Hint Container */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-t border-border-subtle/50 bg-bg-secondary/40"
                              >
                                <div className="p-4 text-xs text-text-secondary leading-relaxed">
                                  <div className="font-bold text-accent-cyan mb-1 flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5" /> Answer Hint & Guidelines:
                                  </div>
                                  <p className="bg-bg-tertiary/30 p-3 rounded-lg border border-border-subtle/30 text-text-muted">
                                    {q.hint || 'No specific answer guidelines provided.'}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-12 text-sm text-text-muted border border-dashed border-border-subtle rounded-xl bg-bg-tertiary/25">
                      No questions found matching the "{selectedCategory}" category.
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          ) : (
            /* Active Session Empty State */
            <div className="h-96 flex items-center justify-center text-center p-8 bg-bg-secondary rounded-2xl border border-border-subtle">
              <div className="max-w-md">
                <LinkIcon className="w-16 h-16 mx-auto mb-4 text-text-muted animate-pulse" />
                <h3 className="text-lg font-bold mb-2">No Active Session</h3>
                <p className="text-text-secondary text-sm">
                  Enter a GitHub URL in the form or click on a completed run in the session history to view your customized preparation questions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectPrep
