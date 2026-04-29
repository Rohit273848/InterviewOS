import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import resumeReducer from './slices/resumeSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    resume: resumeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
