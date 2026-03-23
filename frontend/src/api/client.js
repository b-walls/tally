import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send httpOnly cookies on every request
})

// ---------------------------------------------------------------------------
// Response interceptor — silently refresh the access token on 401 and retry
// the original request once. If the refresh also fails, redirect to /login.
// ---------------------------------------------------------------------------
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Only attempt a refresh once and only for 401s that aren't from the
    // refresh or login endpoints themselves (avoids infinite loops).
    const isAuthEndpoint =
      original.url.includes('/auth/refresh') ||
      original.url.includes('/auth/login') ||
      original.url.includes('/auth/me')

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true

      try {
        await client.post('/auth/refresh')
        return client(original)
      } catch {
        // Refresh failed — session is gone, send the user to login.
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default client
