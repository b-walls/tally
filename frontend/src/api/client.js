import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send session cookie on every request
})

client.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken')
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken
  }
  return config
})

// On 401, session has expired — redirect to login.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url.includes('/_allauth/browser/v1/auth/login') ||
      error.config?.url.includes('/_allauth/browser/v1/auth/session')

    if (error.response?.status === 401 && !isAuthEndpoint) {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default client
