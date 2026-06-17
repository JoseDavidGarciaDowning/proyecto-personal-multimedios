import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useIsMobile(): { isMobile: Ref<boolean> } {
  const isMobile = ref(false)

  let query: MediaQueryList | null = null

  function onChange(e: MediaQueryListEvent) {
    isMobile.value = e.matches
  }

  onMounted(() => {
    query = window.matchMedia('(max-width: 767px)')
    isMobile.value = query.matches
    query.addEventListener('change', onChange)
  })

  onUnmounted(() => {
    if (query) {
      query.removeEventListener('change', onChange)
    }
  })

  return { isMobile }
}
