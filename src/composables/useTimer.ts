import { ref, onUnmounted, type Ref } from 'vue'

export function useTimer() {
  const timeRemaining = ref(0)
  const totalTime = ref(0)
  const isRunning = ref(false)

  let intervalId: ReturnType<typeof setInterval> | null = null
  let timeoutCallback: (() => void) | null = null

  function clearTimer() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function start(seconds: number) {
    clearTimer()
    totalTime.value = seconds
    timeRemaining.value = seconds
    isRunning.value = true

    intervalId = setInterval(() => {
      timeRemaining.value--

      if (timeRemaining.value <= 0) {
        clearTimer()
        isRunning.value = false
        if (timeoutCallback) {
          timeoutCallback()
        }
      }
    }, 1000)
  }

  function stop() {
    clearTimer()
    isRunning.value = false
  }

  function reset() {
    clearTimer()
    timeRemaining.value = totalTime.value
    isRunning.value = false
  }

  function onTimeout(callback: () => void) {
    timeoutCallback = callback
  }

  onUnmounted(() => {
    clearTimer()
  })

  return {
    timeRemaining,
    totalTime,
    isRunning,
    start,
    stop,
    reset,
    onTimeout,
  }
}
