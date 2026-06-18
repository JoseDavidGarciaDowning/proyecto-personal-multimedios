<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { useSound } from '../../composables/useSound'
import { useResults } from '../../composables/useResults'
import { useResultAnimation } from '../../composables/useResultAnimation'
import { useResultDetail } from '../../composables/useResultDetail'
import { useConfigModal } from '../../composables/useConfigModal'
import { useResultKeyboard } from '../../composables/useResultKeyboard'
import { formatRelativeDate } from '../../composables/useRelativeTime'
import ScreenHeader from '../ui/ScreenHeader.vue'
import ConfigModal from '../ui/ConfigModal.vue'
import ActionButton from '../ui/ActionButton.vue'
import ResultStats from '../ui/ResultStats.vue'
import ResultDetail from '../ui/ResultDetail.vue'
import ResultHistory from '../ui/ResultHistory.vue'
import ScoreDisplay from '../ui/ScoreDisplay.vue'
import '../ui/transitions.css'

const store = useGameStore()
const sound = useSound()
const { correctAnswers, totalQuestions, averageTime, messageText, percentCorrect } = useResults()
const { isScoreAnimating, animatedScore } = useResultAnimation()
const { expandedExplanations, questionDetails, toggleExplanation } = useResultDetail()
const { isConfigModalOpen, openConfigModal, closeConfigModal } = useConfigModal()

useResultKeyboard(isScoreAnimating, isConfigModalOpen)

onMounted(() => {
  sound.playResult(percentCorrect.value)
})
</script>

<template>
  <div class="relative flex min-h-screen flex-col items-center px-4 md:px-8 py-8 md:py-12">
    <ScreenHeader
      :is-muted="sound.isMuted.value"
      @toggle-mute="sound.toggleMute()"
      @open-config="openConfigModal"
    />

    <div class="w-full max-w-2xl">
      <ScoreDisplay
        :animated-score="animatedScore"
        :is-score-animating="isScoreAnimating"
        :message-text="messageText"
      />

      <section class="mb-10 md:mb-14">
        <ResultStats
          :correct-answers="correctAnswers"
          :total-questions="totalQuestions"
          :average-time="averageTime"
          :best-streak="store.bestStreak"
        />
      </section>

      <section class="mb-10 md:mb-14">
        <ResultDetail
          :question-details="questionDetails"
          :expanded-explanations="expandedExplanations"
          :has-answers="store.answers.length > 0"
          @toggle-explanation="toggleExplanation"
        />
      </section>

      <section class="mb-10 md:mb-14">
        <ResultHistory
          :history="store.history"
          :format-relative-date="formatRelativeDate"
        />
      </section>

      <section v-if="!isScoreAnimating" class="flex flex-col gap-3 md:flex-row md:gap-4">
        <ActionButton
          variant="primary"
          label="Jugar de nuevo"
          @click="store.startGame()"
        />
        <ActionButton
          variant="secondary"
          label="Volver al inicio"
          @click="store.navigateTo('start')"
        />
      </section>
    </div>

    <ConfigModal
      :is-open="isConfigModalOpen"
      @close="closeConfigModal"
    />
  </div>
</template>
