import { ref } from 'vue'

const notification = ref(null)
let timer = null

export function useNotification() {
  function showNotification({ type = 'success', message = '', duration = 2000 }) {
    if (timer) clearTimeout(timer)

    notification.value = { type, message, visible: true }

    timer = setTimeout(() => {
      closeNotification()
    }, duration)
  }

  function closeNotification() {
    if (notification.value) {
      notification.value.visible = false
      setTimeout(() => {
        notification.value = null
      }, 250) // wait for exit animation
    }
  }

  return {
    notification,
    showNotification,
    closeNotification,
  }
}
