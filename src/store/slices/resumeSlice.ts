import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ResumeAnalysis {
  score: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
}

interface ResumeState {
  analysis: ResumeAnalysis | null
  isAnalyzing: boolean
}

const initialState: ResumeState = {
  analysis: null,
  isAnalyzing: false,
}

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setAnalysis: (state, action: PayloadAction<ResumeAnalysis>) => {
      state.analysis = action.payload
      state.isAnalyzing = false
    },
    startAnalyzing: (state) => {
      state.isAnalyzing = true
    },
    clearAnalysis: (state) => {
      state.analysis = null
      state.isAnalyzing = false
    },
  },
})

export const { setAnalysis, startAnalyzing, clearAnalysis } = resumeSlice.actions
export default resumeSlice.reducer
