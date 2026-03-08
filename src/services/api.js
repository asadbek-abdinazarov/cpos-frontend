import axios from 'axios'
import { useNotification } from '@/composables/useNotification'
import i18n from '@/i18n'
import router from '@/router'

const { showNotification } = useNotification()
const t = i18n.global.t

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1/'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Try token refresh on any 401 Unauthorized (unless it's from the auth/login or auth/refresh themselves)
    const isAuthUrl = originalRequest.url && (originalRequest.url.includes('web/auth/login') || originalRequest.url.includes('web/auth/refresh'))
    const isUnauthorized = error.response && (error.response.status === 401 || (error.response.data && error.response.data.status === 401))

    if (isUnauthorized && !isAuthUrl && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject })
        }).then(() => {
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        forceLogout()
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}web/auth/refresh`, {
          refreshToken: refreshToken
        }, {
          withCredentials: true // needed if backend sets new cookies
        })

        if (data.success) {
          if (data.data && data.data.refreshToken) {
            localStorage.setItem('refreshToken', data.data.refreshToken)
          }
        }

        processQueue(null)
        
        // Retry original request (the cookie will automatically be sent by browser)
        return api(originalRequest)
        
      } catch (refreshError) {
        processQueue(refreshError, null)
        forceLogout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Global Error Message Extraction
    // Avoid showing the error message if it's the 401 we just handled transparently
    if (!(isUnauthorized && !isAuthUrl)) {
      if (error.response && error.response.data) {
        const data = error.response.data
        if (data.message && data.message !== 'Validation Failed') {
           showNotification({ type: 'error', message: data.message })
        }
        if (data.errors && typeof data.errors === 'object') {
          Object.values(data.errors).forEach(errText => {
            showNotification({ type: 'error', message: errText })
          })
        }
      } else {
        // Fallback generic error
        showNotification({ type: 'error', message: error.message || 'An unexpected error occurred' })
      }
    }

    return Promise.reject(error)
  }
)

function forceLogout() {
  // Show notification
  showNotification({ type: 'error', message: t('auth.session_expired') })

  // Call the logout endpoint on best-effort basis
  axios.post(`${API_BASE_URL}web/auth/logout`, {}, { withCredentials: true }).catch(() => {})
  
  // Clear frontend state
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('username')
  localStorage.removeItem('userId')
  
  // Redirect to login page using Vue Router to preserve notification
  router.push('/login')
}

export function register(data) {
  return api.post('web/auth/register', {
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    password: data.password,
    email: data.email,
    phone: data.phone,
    organizationName: data.organizationName,
    organizationStir: data.organizationStir,
    organizationAddress: data.organizationAddress,
    organizationPhone: data.organizationPhone,
  })
}

export function login(data) {
  return api.post('web/auth/login', {
    username: data.username,
    password: data.password,
    deviceMac: data.deviceMac,
  })
}

export function logout() {
  return api.post('web/auth/logout')
}

let profileRequestPromise = null

export function getUserProfile() {
  if (!profileRequestPromise) {
    profileRequestPromise = api.get('web/users/me').finally(() => {
      profileRequestPromise = null
    })
  }
  return profileRequestPromise
}

export function getProducts(params) {
  return api.get('web/products', { params })
}

export function deleteProduct(id) {
  return api.delete(`web/products/${id}`)
}

export function deleteProductsBatch(ids) {
  return api.delete('web/products/batch', {
    data: ids
  })
}

export function getCategories() {
  return api.get('web/categories')
}

export function createProduct(data) {
  return api.post('web/products', data)
}

export function updateProduct(id, data) {
  return api.patch(`web/products/${id}`, data)
}

export function getScales() {
  return api.get('web/scale/my')
}

export function getScaleHistories(id, params) {
  return api.get(`web/scale/my/${id}/histories`, { params })
}

export function getSalesHistories(params) {
  return api.get('web/sale/my/histories', { params })
}

export function getStatistics(params) {
  return api.get('web/statistics/my', { params })
}

export default api
