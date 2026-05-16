import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Sparkles, CheckCircle2, AlertCircle, TrendingUp, FileText } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { setAnalysis, startAnalyzing } from '../store/slices/resumeSlice'
import toast from 'react-hot-toast'

const ResumeXRay = () => {
  const [file, setFile] = useState<File | null>(null)
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
    if (!file) {
      toast.error('Please upload a resume first')
      return
    }

    dispatch(startAnalyzing())
    
    // Simulate AI analysis
    setTimeout(() => {
      dispatch(setAnalysis({
        score: 85,
        strengths: [
          'Strong technical skills section',
          'Quantified achievements',
          'Relevant project experience',
          'Clean formatting and structure'
        ],
        weaknesses: [
          'Missing action verbs in some descriptions',
          'Could add more metrics to projects',
          'Summary section needs improvement'
        ],
        suggestions: [
          'Add specific metrics to your achievements (e.g., "Improved performance by 40%")',
          'Start bullet points with strong action verbs',
          'Include links to GitHub and LinkedIn',
          'Add a compelling professional summary at the top'
        ]
      }))
      toast.success('Analysis complete!')
    }, 2000)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-accent-cyan" />
          <h1 className="text-4xl font-black">Resume X-Ray</h1>
        </div>
        <p className="text-text-secondary text-lg mb-8">
          Get AI-powered insights to make your resume stand out
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="p-8 bg-bg-secondary rounded-2xl border border-border-subtle">
            <h2 className="text-2xl font-bold mb-6">Upload Your Resume</h2>
            
            <label className="block">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-border-subtle rounded-2xl p-12 text-center cursor-pointer hover:border-accent-cyan transition-all group">
                <Upload className="w-16 h-16 mx-auto mb-4 text-text-muted group-hover:text-accent-cyan transition-colors" />
                <p className="text-lg font-semibold mb-2">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-text-muted">
                  PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            </label>

            <button
              onClick={analyzeResume}
              disabled={!file || isAnalyzing}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-accent-cyan/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>

          {analysis && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 rounded-2xl border border-border-accent"
            >
              <div className="text-center">
                <div className="text-6xl font-black gradient-text mb-2">
                  {analysis.score}
                </div>
                <p className="text-text-secondary">Overall Score</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Analysis Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {analysis ? (
            <>
              {/* Strengths */}
              <div className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-accent-green" />
                  <h3 className="text-xl font-bold">Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent-green mt-2" />
                      <span className="text-text-secondary">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-6 h-6 text-accent-yellow" />
                  <h3 className="text-xl font-bold">Areas to Improve</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent-yellow mt-2" />
                      <span className="text-text-secondary">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-accent-cyan" />
                  <h3 className="text-xl font-bold">AI Suggestions</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent-cyan mt-2" />
                      <span className="text-text-secondary">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-12 bg-bg-secondary rounded-2xl border border-border-subtle">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-text-muted" />
                <p className="text-text-secondary">
                  Upload your resume to see AI-powered analysis
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ResumeXRay
