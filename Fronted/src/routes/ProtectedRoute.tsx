import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../context'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isCheckingAuth } = useSelector((state: RootState) => state.user)

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#B1F82A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
