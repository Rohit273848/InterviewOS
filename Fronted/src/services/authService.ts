import api from './api'

export const login = async (credentials: { email: string; password?: string }) => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export const register = async (userData: any) => {
  const response = await api.post('/auth/register', userData)
  return response.data
}

export const logoutUser = async () => {
  await api.post('/auth/logout')
  return true
}

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}
