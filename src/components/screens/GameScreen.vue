<script setup lang="ts">
import { useGame } from '../../composables/useGame'
import ProgressBar from '../ui/ProgressBar.vue'
import TimerBar from '../ui/Timer.vue'
import QuestionCard from '../ui/QuestionCard.vue'
import AnswerButton from '../ui/AnswerButton.vue'

const {
  currentQuestion,
  totalQuestions,
  isShowingFeedback,
  getButtonState,
  selectAnswer,
  store,
  timer,
  sound,
} = useGame()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex items-center justify-between px-6 pt-4 pb-2">
      <ProgressBar :current="store.currentQuestionIndex + 1" :total="totalQuestions" />
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
        <div :key="store.currentQuestionIndex" class="w-full max-w-2xl">
          <QuestionCard :question="currentQuestion" />

          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <AnswerButton
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              :text="option"
              :index="index"
              :state="getButtonState(index)"
              :disabled="isShowingFeedback"
              @select="selectAnswer(index)"
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
