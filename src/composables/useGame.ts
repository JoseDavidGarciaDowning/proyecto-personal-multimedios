import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useTimer } from './useTimer'
import { useSound } from './useSound'
import type { Question } from '../types/question'

type ButtonState = 'default' | 'correct' | 'incorrect' | 'revealed'

const KEY_MAP: Record<string, number> = {
  Digit1: 0,
  Digit2: 1,
  Digit3: 2,
  Digit4: 3,
}

const FEEDBACK_DURATION = 1500

export function useGame() {
  const store = useGameStore()
  const timer = useTimer()
  const sound = useSound()

  const isShowingFeedback = ref(false)
  const selectedOption = ref<number | null>(null)
  let feedbackTimer: ReturnType<typeof setTimeout> | null = null

  const currentQuestion = computed<Question | undefined>(
    () => store.currentQuestions[store.currentQuestionIndex],
  )

  const totalQuestions = computed(() => store.currentQuestions.length)

  function startTimer() {
    const q = currentQuestion.value
    if (!q) return
    timer.start(store.getDifficultyByQuestionId(q.id))
  }

  function clearFeedbackTimer() {
    if (feedbackTimer !== null) {
      clearTimeout(feedbackTimer)
      feedbackTimer = null
    }
  }

  function advance() {
    store.nextQuestion()
    if (store.currentScreen === 'game') {
      startTimer()
    }
  }

  function scheduleAdvance() {
    clearFeedbackTimer()
    feedbackTimer = setTimeout(() => {
      isShowingFeedback.value = false
      selectedOption.value = null
      advance()
      feedbackTimer = null
    }, FEEDBACK_DURATION)
  }

  function selectAnswer(optionIndex: number) {
    if (isShowingFeedback.value || !timer.isRunning.value) return

    selectedOption.value = optionIndex
    isShowingFeedback.value = true

    timer.stop()
    store.selectAnswer(optionIndex, timer.timeRemaining.value, timer.totalTime.value)

    const correct = optionIndex === currentQuestion.value?.correctAnswer
    if (correct) {
      sound.playCorrect()
    } else {
      sound.playError()
    }

    scheduleAdvance()
  }

  function handleTimeout() {
    if (isShowingFeedback.value) return

    isShowingFeedback.value = true
    store.selectAnswer(null, 0, timer.totalTime.value)
    sound.playError()

    scheduleAdvance()
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.repeat) return
    if (isShowingFeedback.value || !timer.isRunning.value) return

    const optionIndex = KEY_MAP[event.code]
    if (optionIndex !== undefined && optionIndex < (currentQuestion.value?.options.length ?? 0)) {
      selectAnswer(optionIndex)
    }
  }

  function getButtonState(optionIndex: number): ButtonState {
    if (!isShowingFeedback.value) return 'default'

    const question = currentQuestion.value
    if (!question) return 'revealed'

    if (optionIndex === question.correctAnswer) return 'correct'
    if (optionIndex === selectedOption.value) return 'incorrect'
    return 'revealed'
  }

  timer.onTimeout(handleTimeout)

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
    startTimer()
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    clearFeedbackTimer()
  })

  return {
    currentQuestion,
    totalQuestions,
    isShowingFeedback,
    selectedOption,
    getButtonState,
    selectAnswer,
    timer,
    store,
    sound,
  }
}
