import { ref } from 'vue'
import { getUserProfile } from '@/services/api'

export const isLoading = ref(false)

export async function enterDashboard(navigate) {
  isLoading.value = true
  await Promise.all([
    getUserProfile().catch(() => {}),
    new Promise((r) => setTimeout(r, 1000)),
  ])
  await navigate()
  isLoading.value = false
}

export function useAppLoader() {
  return { isLoading, enterDashboard }
}
