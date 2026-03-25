import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send session cookie on every request
})

// On 401, session has expired — redirect to login.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url.includes('/auth/login') ||
      error.config?.url.includes('/auth/me')

    if (error.response?.status === 401 && !isAuthEndpoint) {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default client
