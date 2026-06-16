import { ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../stores/gameStore'

const DURATION = 1500

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function useResultAnimation() {
  const store = useGameStore()

  const isScoreAnimating = ref(true)
  const animatedScore = ref(0)

  let animationFrameId: number | null = null

  function start() {
    const startTime = performance.now()
    const targetScore = store.score

    function frame(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / DURATION, 1)
      const easedProgress = easeOutCubic(progress)

      animatedScore.value = Math.round(easedProgress * targetScore)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(frame)
      } else {
        animatedScore.value = targetScore
        isScoreAnimating.value = false
      }
    }

    animationFrameId = requestAnimationFrame(frame)
  }

  onMounted(() => {
    start()
  })

  onUnmounted(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
  })

  return {
    isScoreAnimating,
    animatedScore,
  }
}
