<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { useTimer } from '../../composables/useTimer'
import ProgressBar from '../ui/ProgressBar.vue'
import TimerBar from '../ui/Timer.vue'
import QuestionCard from '../ui/QuestionCard.vue'
import AnswerButton from '../ui/AnswerButton.vue'
import { useSound } from '../../composables/useSound'
import type { Question } from '../../types/question'

type ButtonState = 'default' | 'correct' | 'incorrect' | 'revealed'

const store = useGameStore()
const timer = useTimer()
const sound = useSound()

const isAnswering = ref(false)
const selectedOptionIndex = ref<number | null>(null)
let feedbackTimeoutId: ReturnType<typeof setTimeout> | null = null

const currentQuestion = computed(() => {
  return store.currentQuestions[store.currentIndex] as Question | undefined
})

const totalQuestions = computed(() => store.currentQuestions.length)

function advanceAfterFeedback() {
  store.nextQuestion()

  if (store.currentScreen === 'game') {
    startTimerForCurrentQuestion()
  }
}

function startTimerForCurrentQuestion() {
  const time = store.getDifficultyTime(store.currentIndex)
  timer.start(time)
}

function getButtonState(optionIndex: number): ButtonState {
  if (!isAnswering.value) return 'default'

  const question = currentQuestion.value
  if (!question) return 'revealed'

  if (optionIndex === question.correctAnswer) {
    return 'correct'
  }

  if (optionIndex === selectedOptionIndex.value) {
    return 'incorrect'
  }

  return 'revealed'
}

function handleSelect(optionIndex: number) {
  if (isAnswering.value || !timer.isRunning.value) return

  selectedOptionIndex.value = optionIndex
  isAnswering.value = true

  timer.stop()
  store.selectAnswer(optionIndex, timer.timeRemaining.value, timer.totalTime.value)

  if (currentQuestion.value && optionIndex === currentQuestion.value.correctAnswer) {
    sound.playCorrect()
  } else {
    sound.playError()
  }

  feedbackTimeoutId = setTimeout(() => {
    isAnswering.value = false
    selectedOptionIndex.value = null
    advanceAfterFeedback()
    feedbackTimeoutId = null
  }, 1500)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.repeat) return
  if (isAnswering.value || !timer.isRunning.value) return

  const keyMap: Record<string, number> = {
    Digit1: 0,
    Digit2: 1,
    Digit3: 2,
    Digit4: 3,
  }

  const optionIndex = keyMap[event.code]
  if (optionIndex !== undefined && optionIndex < (currentQuestion.value?.options.length ?? 0)) {
    handleSelect(optionIndex)
  }
}

timer.onTimeout(() => {
  if (isAnswering.value) return

  isAnswering.value = true

  store.selectAnswer(null, 0, timer.totalTime.value)
  sound.playError()

  feedbackTimeoutId = setTimeout(() => {
    isAnswering.value = false
    advanceAfterFeedback()
    feedbackTimeoutId = null
  }, 1500)
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  startTimerForCurrentQuestion()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (feedbackTimeoutId !== null) {
    clearTimeout(feedbackTimeoutId)
  }
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex items-center justify-between px-6 pt-4 pb-2">
      <ProgressBar :current="store.currentIndex + 1" :total="totalQuestions" />
      <span class="text-sm font-semibold text-cyan-400 ml-4 whitespace-nowrap">
        {{ store.score }} pts
      </span>
      <button
        @click="sound.toggleMute()"
        class="ml-4 p-1 opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Silenciar sonidos"
      >
        <svg v-if="sound.isMuted.value" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <path d="M19.07 4.93a10 10 0 010 14.14"/>
          <path d="M15.54 8.46a5 5 0 010 7.07"/>
        </svg>
      </button>
    </header>

    <div class="px-6 pb-2">
      <TimerBar
        :time-remaining="timer.timeRemaining.value"
        :total-time="timer.totalTime.value"
      />
    </div>

    <div v-if="currentQuestion" class="flex-1 flex flex-col items-center justify-center px-6 pb-6">
      <Transition name="fade" mode="out-in">
        <div :key="store.currentIndex" class="w-full max-w-2xl">
          <QuestionCard :question="currentQuestion" />

          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <AnswerButton
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              :text="option"
              :index="index"
              :state="getButtonState(index)"
              :disabled="isAnswering"
              @select="handleSelect(index)"
            />
          </div>
        </div>
      </Transition>
    </div>

    <div v-else class="flex-1 flex items-center justify-center">
      <p class="text-slate-500">No hay preguntas disponibles.</p>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
