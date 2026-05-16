import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  name: string
  email: string
  avatar: string
  isAuthenticated: boolean
}

// Load persisted auth state from localStorage
const loadState = (): UserState => {
  try {
    const serialized = localStorage.getItem('interviewos_user')
    if (serialized) return JSON.parse(serialized)
  } catch (_) { /* ignore */ }
  return {
    name: 'Student',
    email: 'student@example.com',
    avatar: '',
    isAuthenticated: false,
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState: loadState(),
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      const newState = { ...state, ...action.payload }
      localStorage.setItem('interviewos_user', JSON.stringify(newState))
      return newState
    },
    logout: () => {
      localStorage.removeItem('interviewos_user')
      return {
        name: 'Student',
        email: 'student@example.com',
        avatar: '',
        isAuthenticated: false,
      }
    },
  },
})

export const { setUser, logout } = userSlice.actions
export default userSlice.reducer
