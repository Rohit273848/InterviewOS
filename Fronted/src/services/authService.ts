import api from './api'

export const login = async (credentials: { email: string; password?: string }) => {
  // Replace with actual API endpoint when backend is integrated
  // const response = await api.post('/auth/login', credentials)
  // return response.data

  // Mocking the API logic for now to preserve current functionality
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          name: credentials.email.split('@')[0],
          email: credentials.email,
          avatar: '',
        }
      })
    }, 1500)
  })
}

export const register = async (userData: any) => {
  // const response = await api.post('/auth/register', userData)
  // return response.data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          name: userData.email.split('@')[0],
          email: userData.email,
        }
      })
    }, 1500)
  })
}

export const logoutUser = async () => {
  // await api.post('/auth/logout')
  return Promise.resolve(true)
}
