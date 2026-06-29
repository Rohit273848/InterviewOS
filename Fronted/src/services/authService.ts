import api from './api'

export const login = async (credentials: { email: string; password?: string }) => {
  const response = await api.post('/auth/login', credentials)
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token)
  }
  return response.data
}

export const register = async (userData: any) => {
  const response = await api.post('/auth/register', userData)
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token)
  }
  return response.data
}

export const logoutUser = async () => {
  await api.post('/auth/logout')
  localStorage.removeItem('token')
  return true
}

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}
