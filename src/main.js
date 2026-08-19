import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { ensureCsrfToken } from './services/api'

const app = createApp(App)

app.use(router)
app.use(i18n)

// Prime the XSRF-TOKEN cookie before anything mutating can fire. Every later
// GET response refreshes it, so this is the only explicit call needed.
ensureCsrfToken()

app.mount('#app')
