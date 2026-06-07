import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Sparkles, AlertCircle, Target, User, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useInterview } from '../hooks/useInterview'

const ResumeXRay = () => {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [candidateWeaknesses, setCandidateWeaknesses] = useState('')
  const navigate = useNavigate()
  const { generateStrategy, loading: isAnalyzing } = useInterview()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) {
      if (uploadedFile.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed')
        return
      }
      if (uploadedFile.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB')
        return
      }
      setFile(uploadedFile)
      toast.success('Resume uploaded successfully!')
    }
  }

  const analyzeResume = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please provide a target job description')
      return
    }

    if (!file && !selfDescription.trim()) {
      toast.error('Please upload a resume or provide a self-description')
      return
    }

    if (!file) {
      toast.error('Please upload a resume PDF file')
      return
    }

    try {
      const data = await generateStrategy(jobDescription, selfDescription, candidateWeaknesses, file)
      navigate(`/interview/${data._id}`)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen text-gray-800 dark:text-gray-200 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#f8f6f1] dark:bg-bg-secondary rounded-3xl border border-[#e8e6e1] dark:border-border-subtle shadow-sm p-6 md:p-10 flex flex-col transition-colors"
      >
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Panel */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-bg-tertiary flex items-center justify-center shadow-sm border border-gray-100 dark:border-border-subtle transition-colors">
                <Target className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Target Job Description</h2>
              <span className="px-2.5 py-1 bg-yellow-100 dark:bg-accent-yellow/20 text-yellow-800 dark:text-accent-yellow text-[10px] font-bold rounded-full tracking-wider ml-auto lg:ml-2 transition-colors">
                REQUIRED
              </span>
            </div>

            <div className="relative flex-1 flex flex-col">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="flex-1 w-full min-h-[300px] lg:min-h-full rounded-2xl border border-gray-200 dark:border-border-subtle focus:border-yellow-400 dark:focus:border-accent-yellow focus:ring-4 focus:ring-yellow-400/20 dark:focus:ring-accent-yellow/20 bg-white dark:bg-bg-tertiary p-6 resize-none outline-none transition-all text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
              />
              <div className="absolute bottom-4 right-4 text-xs font-medium text-gray-400 dark:text-gray-500">
                {jobDescription.length} characters
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-gray-200 dark:via-border-subtle to-transparent" />

          {/* Right Panel */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-bg-tertiary flex items-center justify-center shadow-sm border border-gray-100 dark:border-border-subtle transition-colors">
                <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Profile</h2>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Resume / CV</span>
              <span className="px-2 py-0.5 bg-green-100 dark:bg-accent-green/20 text-green-800 dark:text-accent-green text-[10px] font-bold rounded-md tracking-wide transition-colors">
                BEST RESULTS
              </span>
            </div>

            <label className="block group">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${file ? 'border-yellow-400 dark:border-accent-yellow bg-yellow-50/30 dark:bg-accent-yellow/10' : 'border-gray-300 dark:border-border-subtle bg-white dark:bg-bg-tertiary hover:border-yellow-400 dark:hover:border-accent-yellow hover:bg-yellow-50/10 dark:hover:bg-accent-yellow/5'}`}>
                <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${file ? 'text-yellow-500 dark:text-accent-yellow' : 'text-gray-400 dark:text-gray-500 group-hover:text-yellow-500 dark:group-hover:text-accent-yellow'}`} />
                <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            </label>

            <div className="flex items-center my-6 text-gray-400 dark:text-gray-500 text-xs font-medium uppercase tracking-widest">
              <div className="flex-1 h-px bg-gray-200 dark:bg-border-subtle"></div>
              <span className="px-4">OR</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-border-subtle"></div>
            </div>

            <div className="mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Self Description</span>
            </div>
            <textarea
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              placeholder="Briefly describe your experience and skills..."
              className="w-full h-24 rounded-2xl border border-gray-200 dark:border-border-subtle focus:border-yellow-400 dark:focus:border-accent-yellow focus:ring-4 focus:ring-yellow-400/20 dark:focus:ring-accent-yellow/20 bg-white dark:bg-bg-tertiary p-4 resize-none outline-none transition-all text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm mb-4"
            />

            <div className="mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Candidate Weaknesses (Optional)</span>
            </div>
            <textarea
              value={candidateWeaknesses}
              onChange={(e) => setCandidateWeaknesses(e.target.value)}
              placeholder="List any known weaknesses, gaps, or areas you want to highlight for ATS analysis..."
              className="w-full h-24 rounded-2xl border border-gray-200 dark:border-border-subtle focus:border-yellow-400 dark:focus:border-accent-yellow focus:ring-4 focus:ring-yellow-400/20 dark:focus:ring-accent-yellow/20 bg-white dark:bg-bg-tertiary p-4 resize-none outline-none transition-all text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm mb-4"
            />

            <div className="bg-[#fff9e6] dark:bg-accent-yellow/10 border border-[#ffe082] dark:border-accent-yellow/20 rounded-xl p-4 flex gap-3 text-sm text-[#8c6d1f] dark:text-accent-yellow shadow-sm transition-colors">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#d4a017] dark:text-accent-yellow" />
              <p className="leading-relaxed">
                For the most accurate interview strategy, we highly recommend uploading your actual resume rather than typing a description.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 pt-6 border-t border-[#e8e6e1] dark:border-border-subtle flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            <Sparkles className="w-4 h-4 text-yellow-500 dark:text-accent-yellow" />
            AI-Powered Strategy Generation • Approx 30s
          </div>

          <button
            onClick={analyzeResume}
            disabled={isAnalyzing || (!file && !selfDescription.trim()) || !jobDescription.trim()}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#1a1a1a] dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-semibold text-base hover:bg-black dark:hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-900/20 dark:hover:shadow-white/10 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate My Interview Strategy
                <Star className="w-4 h-4 fill-current text-yellow-400 dark:text-accent-yellow group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
        </div>
      </motion.div>

    </div>
  )
}

export default ResumeXRay
