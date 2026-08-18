import axios from 'axios'
import { useNotification } from '@/composables/useNotification'
import i18n from '@/i18n'
import router from '@/router'
import { getApiLocaleTag } from '@/utils/localeApi'

const { showNotification } = useNotification()
const t = i18n.global.t

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1/'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const lang = getApiLocaleTag()
  config.headers = config.headers || {}
  if (config.headers['Accept-Language'] == null) {
    config.headers['Accept-Language'] = lang
  }
  if (config.headers['X-Locale'] == null) {
    config.headers['X-Locale'] = lang
  }
  config.params = { ...config.params }
  if (config.params.lang == null) {
    config.params.lang = lang
  }
  return config
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

function isAuthEndpoint(url) {
  if (!url) return false
  return (
    url.includes('web/auth/login') ||
    url.includes('web/auth/refresh') ||
    url.includes('web/auth/logout')
  )
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {}
    const isUnauthorized =
      error.response &&
      (error.response.status === 401 ||
        (error.response.data && error.response.data.status === 401))

    if (isUnauthorized && !isAuthEndpoint(originalRequest.url) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await api.post('web/auth/refresh')
        processQueue(null)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        forceLogout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    if (!(isUnauthorized && !isAuthEndpoint(originalRequest.url))) {
      if (error.response && error.response.data) {
        const data = error.response.data
        if (data.message && data.message !== 'Validation Failed') {
          const translated = t(data.message)
          showNotification({ type: 'error', message: translated })
        }
        if (data.errors && typeof data.errors === 'object') {
          Object.values(data.errors).forEach((errText) => {
            showNotification({ type: 'error', message: errText })
          })
        }
      } else {
        showNotification({
          type: 'error',
          message: error.message || 'An unexpected error occurred',
        })
      }
    }

    return Promise.reject(error)
  },
)

function forceLogout() {
  showNotification({ type: 'error', message: t('auth.session_expired') })

  api.post('web/auth/logout').catch(() => {})

  localStorage.removeItem('username')
  localStorage.removeItem('userId')

  router.push('/login')
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

export function getProduct(id) {
  return api.get(`web/products/${id}`)
}

export function deleteProduct(id) {
  return api.delete(`web/products/${id}`)
}

export function deleteProductsBatch(ids) {
  return api.delete('web/products/batch', {
    data: ids,
  })
}

export function getCategories() {
  return api.get('web/categories')
}

export function createCategory(data) {
  return api.post('web/categories', data)
}

export function updateCategory(id, data) {
  return api.patch(`web/categories/${id}`, data)
}

export function deleteCategory(id) {
  return api.delete(`web/categories/${id}`)
}

export function createProduct(data) {
  return api.post('web/products', data)
}

export function updateProduct(id, data) {
  return api.patch(`web/products/${id}`, data)
}

export function getSalesHistories(params) {
  return api.get('web/sale/my/histories', { params })
}

export function getStatistics(params) {
  return api.get('web/statistics/my', { params })
}

export function getSalesTrend(params) {
  return api.get('web/statistics/sales-trend', { params })
}

export function getSalesByCategory(params) {
  return api.get('web/statistics/sales-by-category', { params })
}

export function getHourlySales(params) {
  return api.get('web/statistics/hourly-sales', { params })
}

export function getPaymentMethods(params) {
  return api.get('web/statistics/payment-methods', { params })
}

export function getTopProducts(params) {
  return api.get('web/statistics/top-products', { params })
}

export function exportStatistics(params, signal) {
  return api.get('web/statistics/export', {
    params,
    responseType: 'blob',
    signal,
  })
}

export function updatePassword(data) {
  return api.put('web/users/password', data)
}

export function getUnreadNotificationCount() {
  return api.get('web/notifications/unread-count')
}

export function getNotifications(params) {
  return api.get('web/notifications', { params })
}

export function markNotificationAsRead(id) {
  return api.post(`web/notifications/${id}/read`)
}

export function getSubscriptionPlans() {
  return api.get('web/subscription/plans')
}

export function generateBarcode() {
  return api.get('web/products/generate-barcode')
}

export function generateSku() {
  return api.get('web/products/generate-sku')
}

export function getCashiers(params) {
  return api.get('web/cashiers', { params })
}

export function createCashier(data) {
  return api.post('web/cashiers', data)
}

export function toggleCashierStatus(id) {
  return api.patch(`web/cashiers/${id}/toggle-status`)
}

export function sendPublicContactRequest(payload) {
  return api.post('public/contact', payload)
}

export function getLatestAiAdvice() {
  return api.get('web/ai-advice/latest')
}

export function getAiAdviceHistory(params) {
  return api.get('web/ai-advice/history', { params })
}

export default api
