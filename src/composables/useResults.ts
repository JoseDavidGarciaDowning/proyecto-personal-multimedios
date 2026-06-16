import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

export function useResults() {
  const store = useGameStore()

  const correctAnswers = computed(() => store.answers.filter((a) => a.correct).length)
  const totalQuestions = computed(() => store.currentQuestions.length)

  const percentCorrect = computed(() =>
    totalQuestions.value ? (correctAnswers.value / totalQuestions.value) * 100 : 0,
  )

  const averageTime = computed(() => {
    const correct = store.answers.filter((a) => a.correct)
    if (!correct.length) return 0

    const totalTaken = correct.reduce((sum, answer) => {
      return sum + (store.getDifficultyByQuestionId(answer.questionId) - answer.timeRemaining)
    }, 0)

    return totalTaken / correct.length
  })

  const messageText = computed(() => {
    if (percentCorrect.value >= 80) return '¡Excelente!'
    if (percentCorrect.value >= 50) return '¡Bien hecho!'
    return 'Seguí practicando'
  })

  return {
    correctAnswers,
    totalQuestions,
    percentCorrect,
    averageTime,
    messageText,
  }
}
