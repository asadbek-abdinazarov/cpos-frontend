import './assets/main.css'
import 'aos/dist/aos.css' // Import AOS styles

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import AOS from 'aos' // Import AOS

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')

// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'slide',
  once: true
})
