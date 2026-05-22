import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Sparkles, CheckCircle2, AlertCircle, TrendingUp, Target, User, Star } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../context'
import { setAnalysis, startAnalyzing } from '../context/slices/resumeSlice'
import { analyzeResumeService } from '../services/resumeService'
import toast from 'react-hot-toast'

const ResumeXRay = () => {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const dispatch = useDispatch()
  const { analysis, isAnalyzing } = useSelector((state: RootState) => state.resume)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      toast.success('Resume uploaded successfully!')
    }
  }

  const analyzeResume = () => {
    if (!jobDescription.trim()) {
      toast.error('Please provide a target job description')
      return
    }

    if (!file && !selfDescription.trim()) {
      toast.error('Please upload a resume or provide a self-description')
      return
    }

    dispatch(startAnalyzing())

    const fetchAnalysis = async () => {
      try {
        const data: any = await analyzeResumeService(file as any)
        dispatch(setAnalysis(data))
        toast.success('Strategy generation complete!')
      } catch (error) {
        toast.error('Failed to generate strategy')
      }
    }

    fetchAnalysis()
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#f8f6f1] rounded-3xl border border-[#e8e6e1] shadow-sm p-6 md:p-10 flex flex-col"
      >
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Panel */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                <Target className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Target Job Description</h2>
              <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-full tracking-wider ml-auto lg:ml-2">
                REQUIRED
              </span>
            </div>

            <div className="relative flex-1 flex flex-col">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="flex-1 w-full min-h-[300px] lg:min-h-full rounded-2xl border border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 bg-white p-6 resize-none outline-none transition-all text-gray-700 placeholder:text-gray-400 shadow-sm"
              />
              <div className="absolute bottom-4 right-4 text-xs font-medium text-gray-400">
                {jobDescription.length} characters
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />

          {/* Right Panel */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                <User className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Your Profile</h2>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-gray-700">Resume / CV</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-md tracking-wide">
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
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${file ? 'border-yellow-400 bg-yellow-50/30' : 'border-gray-300 bg-white hover:border-yellow-400 hover:bg-yellow-50/10'}`}>
                <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${file ? 'text-yellow-500' : 'text-gray-400 group-hover:text-yellow-500'}`} />
                <p className="text-base font-semibold text-gray-700 mb-1">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            </label>

            <div className="flex items-center my-6 text-gray-400 text-xs font-medium uppercase tracking-widest">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-4">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="mb-3">
              <span className="text-sm font-semibold text-gray-700">Self Description</span>
            </div>
            <textarea
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              placeholder="Briefly describe your experience and skills..."
              className="w-full h-32 rounded-2xl border border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 bg-white p-5 resize-none outline-none transition-all text-gray-700 placeholder:text-gray-400 shadow-sm mb-6"
            />

            <div className="bg-[#fff9e6] border border-[#ffe082] rounded-xl p-4 flex gap-3 text-sm text-[#8c6d1f] shadow-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#d4a017]" />
              <p className="leading-relaxed">
                For the most accurate interview strategy, we highly recommend uploading your actual resume rather than typing a description.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 pt-6 border-t border-[#e8e6e1] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            AI-Powered Strategy Generation • Approx 30s
          </div>

          <button
            onClick={analyzeResume}
            disabled={isAnalyzing || (!file && !selfDescription.trim()) || !jobDescription.trim()}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#1a1a1a] text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-black hover:shadow-xl hover:shadow-gray-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate My Interview Strategy
                <Star className="w-4 h-4 fill-current text-yellow-400 group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 space-y-6"
        >
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="col-span-1">
              <div className="p-8 bg-white rounded-3xl border border-gray-200 shadow-sm text-center h-full flex flex-col justify-center">
                <div className="text-7xl font-black text-gray-900 mb-2">
                  {analysis.score}
                </div>
                <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">Match Score</p>
              </div>
            </div>

            <div className="col-span-2 space-y-6">
              {/* Strengths */}
              <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5 flex-shrink-0" />
                      <span className="text-gray-600 leading-relaxed">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Areas to Improve</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.weaknesses.map((weakness: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 flex-shrink-0" />
                      <span className="text-gray-600 leading-relaxed">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">AI Suggestions</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                      <span className="text-gray-600 leading-relaxed">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ResumeXRay
