import { useState } from 'react'
import { motion } from 'framer-motion'
import { FolderGit2, Github, Link as LinkIcon, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const ProjectPrep = () => {
  const [githubUrl, setGithubUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<string[]>([])

  const generateQuestions = () => {
    if (!githubUrl) {
      toast.error('Please enter a GitHub URL')
      return
    }

    setIsGenerating(true)
    
    setTimeout(() => {
      setQuestions([
        'Explain the architecture of your project and why you chose this approach?',
        'What was the most challenging technical problem you faced and how did you solve it?',
        'How did you handle state management in this application?',
        'What testing strategies did you implement?',
        'How would you scale this application to handle 1 million users?',
        'What security measures did you implement?',
        'How did you optimize the performance of your application?',
        'What would you do differently if you were to rebuild this project?'
      ])
      setIsGenerating(false)
      toast.success('Questions generated successfully!')
    }, 2000)
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
          AI generates interview questions from your GitHub projects
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="p-8 bg-bg-secondary rounded-2xl border border-border-subtle">
            <h2 className="text-2xl font-bold mb-6">Enter GitHub Repository</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Repository URL</label>
                <div className="relative">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="https://github.com/username/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-bg-tertiary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={generateQuestions}
                disabled={isGenerating}
                className="w-full px-6 py-4 bg-gradient-to-r from-accent-yellow to-accent-pink text-bg-primary font-bold rounded-xl hover:shadow-2xl hover:shadow-accent-yellow/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
                    Generating Questions...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate Questions
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-accent-yellow/20 to-accent-pink/20 rounded-2xl border border-accent-yellow/30">
            <h3 className="font-bold mb-2">💡 Pro Tip</h3>
            <p className="text-sm text-text-secondary">
              Make sure your repository has a detailed README and well-documented code for better question generation.
            </p>
          </div>
        </motion.div>

        {/* Questions Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 bg-bg-secondary rounded-2xl border border-border-subtle"
        >
          <h2 className="text-2xl font-bold mb-6">Generated Questions</h2>
          
          {questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-bg-tertiary rounded-xl hover:bg-bg-tertiary/70 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-yellow/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-accent-yellow">{index + 1}</span>
                    </div>
                    <p className="text-text-secondary">{question}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center py-12">
              <div>
                <LinkIcon className="w-16 h-16 mx-auto mb-4 text-text-muted" />
                <p className="text-text-secondary">
                  Enter a GitHub repository URL to generate interview questions
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ProjectPrep
