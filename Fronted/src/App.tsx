import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import ResumeXRay from './pages/ResumeXRay'
import QuestionBank from './pages/QuestionBank'
import ProjectPrep from './pages/ProjectPrep'
import MockInterview from './pages/MockInterview'
import PeerReview from './pages/PeerReview'
import Admin from './pages/Admin'

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.user)

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/signin" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignIn />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />} 
      />
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume-xray" element={<ResumeXRay />} />
        <Route path="/question-bank" element={<QuestionBank />} />
        <Route path="/project-prep" element={<ProjectPrep />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/peer-review" element={<PeerReview />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  )
}

export default App
