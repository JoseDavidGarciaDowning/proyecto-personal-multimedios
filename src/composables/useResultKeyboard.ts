import { onMounted, onUnmounted, type Ref } from 'vue'
import { useGameStore } from '../stores/gameStore'

export function useResultKeyboard(
  isScoreAnimating: Ref<boolean>,
  isConfigModalOpen: Ref<boolean>,
) {
  const store = useGameStore()

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !isScoreAnimating.value && !isConfigModalOpen.value) {
      store.startGame()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {}
}
