import axios from 'axios'

// Create a centralized axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For sending HTTP-only cookies
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Modify config here if needed (e.g., adding dynamic headers)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Centralized error handling
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login, clear local storage)
      // window.location.href = '/signin';
    }
    return Promise.reject(error)
  }
)

export default api
