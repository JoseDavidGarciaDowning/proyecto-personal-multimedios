import { computed, ref } from 'vue'
import { useGameStore } from '../stores/gameStore'

export function useResultDetail() {
  const store = useGameStore()

  const expandedExplanations = ref(new Set<number>())

  const questionDetails = computed(() =>
    store.answers.map((answer) => ({
      answer,
      question: store.currentQuestions.find((q) => q.id === answer.questionId),
    })),
  )

  function toggleExplanation(questionId: number) {
    const set = expandedExplanations.value
    if (set.has(questionId)) {
      set.delete(questionId)
    } else {
      set.add(questionId)
    }
  }

  return {
    expandedExplanations,
    questionDetails,
    toggleExplanation,
  }
}
