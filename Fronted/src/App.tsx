import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser, setCheckingAuth } from './context/slices/userSlice'
import { getCurrentUser } from './services/authService'
import AppRoutes from './routes'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await getCurrentUser()
        if (response && response.success && response.data) {
          dispatch(setUser({
            name: response.data.name,
            email: response.data.email,
            avatar: response.data.avatar || '',
            isAuthenticated: true,
            isCheckingAuth: false,
          }))
        } else {
          dispatch(setCheckingAuth(false))
        }
      } catch (error) {
        dispatch(setCheckingAuth(false))
      }
    }

    initAuth()
  }, [dispatch])

  return <AppRoutes />
}

export default App
