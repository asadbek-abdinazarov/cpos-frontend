import axios from 'axios'
import { useNotification } from '@/composables/useNotification'
import i18n from '@/i18n'
import router from '@/router'
import { getApiLocaleTag } from '@/utils/localeApi'

const { showNotification } = useNotification()
const t = i18n.global.t

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1/'
//https://cpos-backend-uf77.onrender.com/api/v1/

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

/** Backend JSON: access_token / refresh_token (snake) yoki accessToken / refreshToken (camel) */
export function persistAuthTokensFromResponse(apiResponseData) {
  if (!apiResponseData || typeof apiResponseData !== 'object') return
  const nested = apiResponseData.data
  const inner = nested && typeof nested === 'object' ? nested : null
  const access =
    apiResponseData.access_token ||
    apiResponseData.accessToken ||
    (inner && (inner.access_token || inner.accessToken))
  const refresh =
    apiResponseData.refresh_token ||
    apiResponseData.refreshToken ||
    (inner && (inner.refresh_token || inner.refreshToken))
  if (access) localStorage.setItem('accessToken', access)
  if (refresh) localStorage.setItem('refreshToken', refresh)
}

function shouldAttachBearer(url) {
  if (!url || typeof url !== 'string') return false
  if (!url.startsWith('web/')) return false
  const publicAuth = ['web/auth/login', 'web/auth/register', 'web/auth/refresh']
  return !publicAuth.some((p) => url.includes(p))
}

/** `api` instance interceptoridan tashqari `axios.post` chaqiruvlari uchun */
function buildLocaleAxiosConfig(extra = {}) {
  const lang = getApiLocaleTag()
  return {
    ...extra,
    params: { lang, ...extra.params },
    headers: {
      'Accept-Language': lang,
      'X-Locale': lang,
      ...extra.headers,
    },
  }
}

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

  const url = config.url || ''
  if (shouldAttachBearer(url)) {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
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
    const isAuthUrl =
      originalRequest.url &&
      (originalRequest.url.includes('web/auth/login') ||
        originalRequest.url.includes('web/auth/refresh'))
    const isUnauthorized =
      error.response &&
      (error.response.status === 401 || (error.response.data && error.response.data.status === 401))

    if (isUnauthorized && !isAuthUrl && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return api(originalRequest)
          })
          .catch((err) => {
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
        const { data } = await axios.post(
          `${API_BASE_URL}web/auth/refresh`,
          {
            refreshToken: refreshToken,
          },
          buildLocaleAxiosConfig({
            withCredentials: true, // needed if backend sets new cookies
          }),
        )

        if (data.success) {
          persistAuthTokensFromResponse(data)
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

  axios
    .post(`${API_BASE_URL}web/auth/logout`, {}, buildLocaleAxiosConfig({ withCredentials: true }))
    .catch(() => {})

  localStorage.removeItem('refreshToken')
  localStorage.removeItem('accessToken')
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

export default api
