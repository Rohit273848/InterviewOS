import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Sparkles, AlertCircle, Target, User, Star, FileText, Award, Calendar, ArrowRight, ArrowLeft, Loader2, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useInterview } from '../hooks/useInterview'

const ResumeXRay = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [candidateWeaknesses, setCandidateWeaknesses] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const navigate = useNavigate()
  const { generateStrategy, loading: isAnalyzing, latestReport, fetchingLatest, fetchLatestReport } = useInterview()

  useEffect(() => {
    const checkLatest = async () => {
      const data = await fetchLatestReport()
      if (!data) {
        setShowUploadForm(true)
      } else {
        setShowUploadForm(false)
      }
    }
    checkLatest()
  }, [])

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
      
      setIsUploading(true)
      // Simulate file upload parsing and loading duration of 1.5 seconds
      setTimeout(() => {
        setFile(uploadedFile)
        setIsUploading(false)
        toast.success('Resume uploaded successfully!')
      }, 1500)
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

  const fillDemoData = () => {
    setJobDescription(`Senior Frontend Engineer (React/TypeScript)
Role Overview:
We are looking for a Senior Frontend Engineer to join our product team. You will lead the development of modern web applications using React, TypeScript, and Tailwind CSS.

Requirements:
- 5+ years of software development experience.
- Strong proficiency in React, hooks, state management, and modern Web APIs.
- Experience with testing libraries (Jest, React Testing Library).
- Familiarity with CI/CD and cloud deployment.`)

    setSelfDescription(`Frontend Engineer with 3.5 years of experience specialized in building responsive, accessible, and high-performance web applications using React, TypeScript, and modern JavaScript. Strong in React state management, Redux Toolkit, and UI engineering.`)
    setCandidateWeaknesses(`Unit testing complex stateful hooks, WebGL rendering optimization, basic Docker infrastructure templates.`)
    toast.success('Loaded premium demo profile context!')
  }

  const clearForm = () => {
    setJobDescription('')
    setSelfDescription('')
    setCandidateWeaknesses('')
    setFile(null)
    setIsUploading(false)
    toast.success('Form cleared!')
  }

  if (fetchingLatest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 bg-transparent">
        <Loader2 className="w-10 h-10 text-yellow-500 dark:text-accent-yellow animate-spin" />
        <p className="text-gray-650 dark:text-gray-400 font-medium text-lg animate-pulse">
          Retrieving your latest resume profile...
        </p>
      </div>
    )
  }

  if (latestReport && !showUploadForm) {
    const atsScore = latestReport.atsScore !== undefined ? latestReport.atsScore : (latestReport.matchScore || 0)
    const candidateFitScore = latestReport.candidateFitScore !== undefined ? latestReport.candidateFitScore : (latestReport.matchScore || 0)

    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen text-gray-800 dark:text-gray-200 transition-colors">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#f8f6f1] dark:bg-bg-secondary rounded-3xl border border-[#e8e6e1] dark:border-border-subtle shadow-sm p-6 md:p-10 flex flex-col transition-colors relative overflow-hidden"
        >
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e8e6e1] dark:border-border-subtle pb-6 mb-8 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-bg-tertiary flex items-center justify-center shadow-sm border border-gray-100 dark:border-border-subtle">
                <FileText className="w-6 h-6 text-yellow-500 dark:text-accent-yellow" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">Active Resume Profile</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Latest ATS scorecard and optimization strategy details
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowUploadForm(true)}
              className="flex items-center justify-center gap-2 bg-[#1a1a1a] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-200 px-5 py-3 rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-[0.98]"
            >
              <Upload className="w-4 h-4" />
              Analyze New Resume
            </button>
          </div>

          {/* Metrics Panel */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            
            {/* Score 1 */}
            <div className="bg-white dark:bg-bg-tertiary border border-gray-200 dark:border-border-subtle rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-yellow-500 dark:text-accent-yellow" />
                ATS Score
              </span>
              <div className="relative flex items-center justify-center w-28 h-28 my-1">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="46" className="stroke-gray-100 dark:stroke-slate-800 fill-none" strokeWidth="6" />
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    className="stroke-yellow-500 dark:stroke-accent-yellow fill-none transition-all duration-1000 ease-out"
                    strokeWidth="6"
                    strokeDasharray="289"
                    strokeDashoffset={289 - (289 * atsScore) / 100}
                  />
                </svg>
                <span className="absolute text-2xl font-black text-gray-900 dark:text-white">
                  {atsScore}%
                </span>
              </div>
            </div>

            {/* Score 2 */}
            <div className="bg-white dark:bg-bg-tertiary border border-gray-200 dark:border-border-subtle rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                Candidate Fit
              </span>
              <div className="relative flex items-center justify-center w-28 h-28 my-1">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="46" className="stroke-gray-100 dark:stroke-slate-800 fill-none" strokeWidth="6" />
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out"
                    strokeWidth="6"
                    strokeDasharray="289"
                    strokeDashoffset={289 - (289 * candidateFitScore) / 100}
                  />
                </svg>
                <span className="absolute text-2xl font-black text-gray-900 dark:text-white">
                  {candidateFitScore}%
                </span>
              </div>
            </div>

            {/* Summary Details */}
            <div className="bg-white dark:bg-bg-tertiary border border-gray-200 dark:border-border-subtle rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1">
                    Analysis Date
                  </span>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(latestReport.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1">
                    Key Highlights
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-bold">
                    <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {latestReport.strengths?.length || 0} Strengths
                    </span>
                    <span className="text-rose-700 dark:text-rose-455 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                      {latestReport.weaknesses?.length || 0} Gaps
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Job Details Card */}
          <div className="bg-white dark:bg-bg-tertiary border border-gray-200 dark:border-border-subtle rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2.5 flex items-center gap-2">
              <Target className="w-4 h-4 text-yellow-500 dark:text-accent-yellow" />
              Target Job Description Snippet
            </h3>
            <p className="text-xs text-gray-650 dark:text-gray-400 leading-relaxed line-clamp-3 whitespace-pre-line">
              {latestReport.jobDescription}
            </p>
          </div>

          {/* Action Footer */}
          <button
            onClick={() => navigate(`/interview/${latestReport._id}`)}
            className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] dark:bg-white text-white dark:text-black py-4 rounded-2xl font-semibold text-base hover:bg-black dark:hover:bg-gray-150 shadow-md hover:shadow-xl hover:shadow-gray-900/20 dark:hover:shadow-white/10 active:scale-[0.99] transition-all group"
          >
            View Full ATS Strategy & Roadmap
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    )
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-bg-tertiary flex items-center justify-center shadow-sm border border-gray-100 dark:border-border-subtle transition-colors">
                  <Target className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Target Job Description</h2>
                <span className="px-2.5 py-1 bg-yellow-100 dark:bg-accent-yellow/20 text-yellow-800 dark:text-accent-yellow text-[10px] font-bold rounded-full tracking-wider transition-colors">
                  REQUIRED
                </span>
              </div>
              
              {latestReport && (
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white hover:bg-gray-100 dark:bg-bg-tertiary dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-border-subtle rounded-xl shadow-sm transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Show Active Profile
                </button>
              )}
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-bg-tertiary flex items-center justify-center shadow-sm border border-gray-100 dark:border-border-subtle transition-colors">
                  <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Profile</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fillDemoData}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 dark:text-accent-yellow border border-yellow-500/20 rounded-xl transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Try Demo Profile
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl transition-all"
                >
                  Clear
                </button>
              </div>
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
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading || isAnalyzing}
              />
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isUploading 
                  ? 'border-yellow-400 dark:border-accent-yellow bg-yellow-50/10 dark:bg-accent-yellow/5 pointer-events-none' 
                  : file 
                    ? 'border-yellow-400 dark:border-accent-yellow bg-yellow-50/30 dark:bg-accent-yellow/10' 
                    : 'border-gray-300 dark:border-border-subtle bg-white dark:bg-bg-tertiary hover:border-yellow-400 dark:hover:border-accent-yellow hover:bg-yellow-50/10 dark:hover:bg-accent-yellow/5'
              }`}>
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center py-2">
                    <Loader2 className="w-10 h-10 text-yellow-500 dark:text-accent-yellow animate-spin mb-3" />
                    <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Uploading resume...
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 animate-pulse">
                      Analyzing PDF layout and content
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${file ? 'text-yellow-500 dark:text-accent-yellow' : 'text-gray-400 dark:text-gray-500 group-hover:text-yellow-500 dark:group-hover:text-accent-yellow'}`} />
                    <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PDF (Max 5MB)
                    </p>
                  </>
                )}
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
              className="w-full h-24 rounded-2xl border border-gray-200 dark:border-border-subtle focus:border-yellow-450 dark:focus:border-accent-yellow focus:ring-4 focus:ring-yellow-450/20 dark:focus:ring-accent-yellow/20 bg-white dark:bg-bg-tertiary p-4 resize-none outline-none transition-all text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm mb-4"
            />

            <div className="mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Candidate Weaknesses (Optional)</span>
            </div>
            <textarea
              value={candidateWeaknesses}
              onChange={(e) => setCandidateWeaknesses(e.target.value)}
              placeholder="List any known weaknesses, gaps, or areas you want to highlight for ATS analysis..."
              className="w-full h-24 rounded-2xl border border-gray-200 dark:border-border-subtle focus:border-yellow-450 dark:focus:border-accent-yellow focus:ring-4 focus:ring-yellow-450/20 dark:focus:ring-accent-yellow/20 bg-white dark:bg-bg-tertiary p-4 resize-none outline-none transition-all text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm mb-4"
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
            disabled={isAnalyzing || isUploading || (!file && !selfDescription.trim()) || !jobDescription.trim()}
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
