import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Question, Answer, HistoryEntry } from '../types/question'
import { useHistory } from '../composables/useHistory'

export type Screen = 'start' | 'game' | 'result' | 'error'

const DIFFICULTY_TIME: Record<string, number> = {
  easy: 15,
  medium: 30,
  hard: 60,
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const useGameStore = defineStore('game', () => {
  const { loadHistory, saveEntry } = useHistory()

  const currentScreen = ref<Screen>('start')
  const questions = ref<Question[]>([])
  const currentQuestions = ref<Question[]>([])
  const currentQuestionIndex = ref(0)
  const score = ref(0)
  const answers = ref<Answer[]>([])
  const questionCount = ref<5 | 10 | 15>(10)
  const history = ref<HistoryEntry[]>(loadHistory())

  const bestStreak = computed(() => {
    let max = 0
    let current = 0
    for (const a of answers.value) {
      if (a.correct) {
        current++
        max = Math.max(max, current)
      } else {
        current = 0
      }
    }
    return max
  })

  function navigateTo(screen: Screen) {
    currentScreen.value = screen
  }

  async function loadQuestions() {
    try {
      const res = await fetch('/questions.json')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) throw new Error('Empty or invalid data')
      questions.value = data
    } catch {
      currentScreen.value = 'error'
    }
  }

  function startGame() {
    const selected = shuffle(questions.value).slice(0, questionCount.value)
    currentQuestions.value = selected
    currentQuestionIndex.value = 0
    score.value = 0
    answers.value = []
    currentScreen.value = 'game'
  }

  function getDifficultyByQuestionId(questionId: number): number {
    const question = currentQuestions.value.find((q) => q.id === questionId)
    if (!question) return 30
    return DIFFICULTY_TIME[question.difficulty] ?? 30
  }

  function selectAnswer(optionIndex: number | null, timeRemaining: number, totalTime: number) {
    const question = currentQuestions.value[currentQuestionIndex.value]
    if (!question) return

    const correct = optionIndex === question.correctAnswer
    let pointsEarned = 0

    if (correct) {
      pointsEarned = 10 + Math.round((timeRemaining / totalTime) * 5)
      score.value += pointsEarned
    }

    answers.value.push({
      questionId: question.id,
      selectedOption: optionIndex,
      correct,
      timeRemaining,
      pointsEarned,
    })
  }

  function nextQuestion() {
    if (currentQuestionIndex.value >= currentQuestions.value.length - 1) {
      saveToHistory()
      currentScreen.value = 'result'
    } else {
      currentQuestionIndex.value++
    }
  }

  function saveToHistory() {
    const entry: HistoryEntry = {
      date: new Date().toISOString(),
      score: score.value,
      total: currentQuestions.value.length,
      correct: answers.value.filter((a) => a.correct).length,
    }

    history.value = saveEntry(entry)
  }

  function setError() {
    currentScreen.value = 'error'
  }

  function clearError() {
    currentScreen.value = 'start'
  }

  return {
    currentScreen,
    questions,
    currentQuestions,
    currentQuestionIndex,
    score,
    answers,
    questionCount,
    history,
    bestStreak,
    navigateTo,
    loadQuestions,
    startGame,
    getDifficultyByQuestionId,
    selectAnswer,
    nextQuestion,
    saveToHistory,
    setError,
    clearError,
  }
})
