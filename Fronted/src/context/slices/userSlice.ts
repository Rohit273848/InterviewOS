import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  name: string
  email: string
  avatar: string
  isAuthenticated: boolean
  isCheckingAuth: boolean
}

const initialState: UserState = {
  name: '',
  email: '',
  avatar: '',
  isAuthenticated: false,
  isCheckingAuth: true,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload }
    },
    logout: () => {
      return {
        ...initialState,
        isCheckingAuth: false,
      }
    },
    setCheckingAuth: (state, action: PayloadAction<boolean>) => {
      state.isCheckingAuth = action.payload
    },
  },
})

export const { setUser, logout, setCheckingAuth } = userSlice.actions
export default userSlice.reducer
