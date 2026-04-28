import { ref } from 'vue'

export function useDelayedLoading(delay = 250) {
  const loading = ref(false)
  const showSkeleton = ref(false)
  let timer = null

  const startLoading = () => {
    loading.value = true
    timer = setTimeout(() => {
      if (loading.value) showSkeleton.value = true
    }, delay)
  }

  const stopLoading = () => {
    clearTimeout(timer)
    loading.value = false
    showSkeleton.value = false
  }

  return { loading, showSkeleton, startLoading, stopLoading }
}
