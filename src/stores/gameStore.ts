import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { Question, Answer, HistoryEntry } from '../types/question'
import { useHistory } from '../composables/useHistory'

export type Screen = 'start' | 'game' | 'result' | 'error'

const SESSION_KEY = 'devchallenge:game-state'
const PREFS_KEY = 'devchallenge:prefs'

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
    if (questions.value.length > 0) return
    try {
      const res = await fetch(import.meta.env.BASE_URL + 'questions.json')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) throw new Error('Empty or invalid data')
      questions.value = data
    } catch {
      currentScreen.value = 'error'
    }
  }

  function startGame() {
    sessionStorage.removeItem(SESSION_KEY)
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

  function saveToSession() {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      currentQuestions: currentQuestions.value,
      answers: answers.value,
      score: score.value,
      questionCount: questionCount.value,
    }))
  }

  function tryResume() {
    const raw = sessionStorage.getItem(SESSION_KEY)
    const prefs = sessionStorage.getItem(PREFS_KEY)

    if (prefs) {
      try {
        const p = JSON.parse(prefs)
        if (p.questionCount) questionCount.value = p.questionCount
      } catch { sessionStorage.removeItem(PREFS_KEY) }
    }

    if (!raw) return false
    try {
      const state = JSON.parse(raw)
      if (!state.currentQuestions?.length || !state.answers?.length) return false
      currentQuestions.value = state.currentQuestions
      answers.value = state.answers
      score.value = state.score ?? 0
      questionCount.value = state.questionCount ?? 10
      currentScreen.value = 'result'
      sessionStorage.removeItem(SESSION_KEY)
      return true
    } catch {
      sessionStorage.removeItem(SESSION_KEY)
      return false
    }
  }

  watch(currentScreen, (screen) => {
    if (screen === 'result') saveToSession()
  })

  watch(questionCount, (val) => {
    sessionStorage.setItem(PREFS_KEY, JSON.stringify({ questionCount: val }))
  })

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
    tryResume,
  }
})
