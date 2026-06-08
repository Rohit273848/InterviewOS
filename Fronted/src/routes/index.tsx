import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../context'

import Layout from '../layouts/Layout'
import ProtectedRoute from './ProtectedRoute'

import LandingPage from '../pages/LandingPage'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Dashboard from '../pages/Dashboard'
import ResumeXRay from '../pages/ResumeXRay'
import QuestionBank from '../pages/QuestionBank'
import ProjectPrep from '../pages/ProjectPrep'
import MockInterview from '../pages/MockInterview'
import MockInterviewReport from '../pages/MockInterviewReport'
import InterviewHistory from '../pages/InterviewHistory'
import InterviewAnalytics from '../pages/InterviewAnalytics'
import PeerReview from '../pages/PeerReview'
import Admin from '../pages/Admin'

import InterviewResult from '../pages/InterviewResult'

const AppRoutes = () => {
  const { isAuthenticated, isCheckingAuth } = useSelector((state: RootState) => state.user)

  const renderPublicRoute = (Component: React.ReactNode) => {
    if (isCheckingAuth) {
      return (
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#B1F82A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )
    }
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : Component
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/signin" 
        element={renderPublicRoute(<SignIn />)} 
      />
      <Route 
        path="/signup" 
        element={renderPublicRoute(<SignUp />)} 
      />
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume-xray" element={<ResumeXRay />} />
        <Route path="/interview/:id" element={<InterviewResult />} />
        <Route path="/question-bank" element={<QuestionBank />} />
        <Route path="/project-prep" element={<ProjectPrep />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/mock-interview/report/:id" element={<MockInterviewReport />} />
        <Route path="/mock-interview/history" element={<InterviewHistory />} />
        <Route path="/mock-interview/analytics" element={<InterviewAnalytics />} />
        <Route path="/peer-review" element={<PeerReview />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
