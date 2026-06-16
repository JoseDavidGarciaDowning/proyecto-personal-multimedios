import { ref, onMounted, onUnmounted } from 'vue'

export function useConfigModal() {
  const isConfigModalOpen = ref(false)

  function open() {
    isConfigModalOpen.value = true
  }

  function close() {
    isConfigModalOpen.value = false
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isConfigModalOpen.value) {
      close()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    isConfigModalOpen,
    openConfigModal: open,
    closeConfigModal: close,
  }
}
