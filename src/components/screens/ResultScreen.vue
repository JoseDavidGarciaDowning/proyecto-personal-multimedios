<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { useSound } from '../../composables/useSound'
import { formatRelativeDate } from '../../composables/useRelativeTime'
import { useResults } from '../../composables/useResults'
import { useResultAnimation } from '../../composables/useResultAnimation'
import { useResultDetail } from '../../composables/useResultDetail'
import { useConfigModal } from '../../composables/useConfigModal'
import { useResultKeyboard } from '../../composables/useResultKeyboard'
import QuestionCountSelector from '../ui/QuestionCountSelector.vue'

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
    <div class="fixed top-4 right-4 z-40 flex items-center gap-2">
      <button
        @click="sound.toggleMute()"
        class="rounded-lg bg-white/[0.04] p-2 opacity-50 hover:opacity-100 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2"
        aria-label="Silenciar sonidos"
      >
        <svg v-if="sound.isMuted.value" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <path d="M19.07 4.93a10 10 0 010 14.14"/>
          <path d="M15.54 8.46a5 5 0 010 7.07"/>
        </svg>
      </button>
      <button
        @click="openConfigModal"
        class="inline-flex items-center rounded-lg bg-white/[0.04] p-2 text-slate-300 transition-all duration-300 hover:bg-white/[0.08] md:px-4 md:py-2 focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2"
        aria-label="Configuracion"
      >
        <span aria-hidden="true" class="mr-0 text-xl leading-none md:mr-1.5">&#9881;</span>
        <span class="hidden md:inline text-sm">Configuracion</span>
      </button>
    </div>

    <div class="w-full max-w-2xl">
      <section class="mb-10 md:mb-14 text-center">
        <p class="text-sm md:text-base text-slate-500 uppercase tracking-[0.2em] mb-3">
          Puntaje
        </p>

        <div class="relative inline-block">
          <div class="absolute inset-0 blur-3xl bg-emerald-500/10 rounded-full" />
          <p
            class="relative text-6xl md:text-8xl font-black tracking-[-0.04em] tabular-nums"
            style="background: linear-gradient(180deg, #34d399 0%, #10b981 50%, #059669 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 0 40px rgba(16, 185, 129, 0.3));"
          >
            {{ animatedScore }}
          </p>
        </div>

        <Transition name="reveal">
          <p
            v-if="!isScoreAnimating"
            class="mt-6 text-xl md:text-2xl font-bold text-cyan-300"
          >
            {{ messageText }}
          </p>
        </Transition>
      </section>

      <section class="mb-10 md:mb-14">
        <div class="flex items-center gap-2 mb-4">
          <div class="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
          <h2 class="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
            Estadisticas
          </h2>
        </div>

        <div class="grid gap-3 md:grid-cols-3 md:gap-4">
          <div class="relative rounded-xl bg-white/[0.02] border border-white/[0.06] p-5 overflow-hidden group transition-all duration-500 hover:bg-white/[0.03] hover:border-white/[0.08]">
            <div class="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />
            <p class="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Aciertos</p>
            <p class="text-2xl md:text-3xl font-bold text-slate-100 tabular-nums">
              <span class="text-emerald-400">{{ correctAnswers }}</span>
              <span class="text-slate-600">/{{ totalQuestions }}</span>
            </p>
          </div>

          <div class="relative rounded-xl bg-white/[0.02] border border-white/[0.06] p-5 overflow-hidden group transition-all duration-500 hover:bg-white/[0.03] hover:border-white/[0.08]">
            <div class="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
            <p class="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Tiempo promedio</p>
            <p class="text-2xl md:text-3xl font-bold text-slate-100 tabular-nums">
              {{ averageTime.toFixed(1) }}<span class="text-slate-500 text-lg">s</span>
            </p>
          </div>

          <div class="relative rounded-xl bg-white/[0.02] border border-white/[0.06] p-5 overflow-hidden group transition-all duration-500 hover:bg-white/[0.03] hover:border-white/[0.08]">
            <div class="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
            <p class="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Mejor racha</p>
            <p class="text-2xl md:text-3xl font-bold text-slate-100 tabular-nums">
              {{ store.bestStreak }}
            </p>
          </div>
        </div>
      </section>

      <section class="mb-10 md:mb-14">
        <div class="flex items-center gap-2 mb-4">
          <div class="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <h2 class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
            Detalle
          </h2>
        </div>

        <div class="max-h-[50vh] space-y-2.5 overflow-y-auto pr-1">
          <div
            v-for="(detail, index) in questionDetails"
            :key="index"
            class="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 md:p-5 transition-all duration-300 hover:border-white/[0.08]"
          >
            <div class="flex items-start gap-3">
              <span
                :class="[
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                  detail.answer.correct
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/15 text-red-300 border border-red-500/30',
                ]"
              >
                {{ detail.answer.correct ? '&#10003;' : '&#10007;' }}
              </span>
              <div class="min-w-0 flex-1">
                <p class="text-sm text-slate-200 leading-relaxed">
                  {{ index + 1 }}. {{ detail.question?.question ?? 'Pregunta no encontrada' }}
                </p>
                <p class="mt-1.5 text-xs text-slate-500">
                  Respondiste:
                  <span :class="detail.answer.correct ? 'text-emerald-400' : 'text-red-400'">
                    {{ detail.answer.selectedOption !== null ? detail.question?.options[detail.answer.selectedOption] : 'Sin responder' }}
                  </span>
                  <span class="mx-1.5 text-slate-600">&middot;</span>
                  Correcta:
                  <span class="text-emerald-400">{{ detail.question?.options[detail.question.correctAnswer] }}</span>
                </p>
              </div>
            </div>

            <button
              @click="toggleExplanation(detail.answer.questionId)"
              class="mt-3 text-sm font-medium text-cyan-400 transition-all duration-300 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2 rounded"
            >
              {{ expandedExplanations.has(detail.answer.questionId) ? 'Ocultar explicacion' : 'Ver explicacion' }}
            </button>

            <Transition name="expand">
              <p
                v-if="expandedExplanations.has(detail.answer.questionId)"
                class="mt-3 text-sm leading-relaxed text-slate-400 border-l-2 border-cyan-500/20 pl-4"
              >
                {{ detail.question?.explanation }}
              </p>
            </Transition>
          </div>

          <p v-if="store.answers.length === 0" class="text-slate-500 text-center py-8">
            Sin respuestas
          </p>
        </div>
      </section>

      <section class="mb-10 md:mb-14">
        <div class="flex items-center gap-2 mb-4">
          <div class="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
          <h2 class="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400/80">
            Historial
          </h2>
        </div>

        <ul v-if="store.history.length" class="space-y-2">
          <li
            v-for="(entry, index) in store.history.slice(0, 5)"
            :key="index"
            class="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-3 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.08]"
          >
            <span class="text-sm text-slate-300">
              {{ entry.correct }}/{{ entry.total }} correctas
            </span>
            <span class="text-xs text-slate-500">
              {{ formatRelativeDate(entry.date) }}
            </span>
          </li>
        </ul>
        <p v-else class="text-slate-500 text-center py-8">
          Sin partidas anteriores
        </p>
      </section>

      <section v-if="!isScoreAnimating" class="flex flex-col gap-3 md:flex-row md:gap-4">
        <button
          @click="store.startGame()"
          class="group relative flex-1 overflow-hidden rounded-2xl px-6 py-4 md:px-8 md:py-5 text-base md:text-lg font-bold transition-all duration-500 focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2"
        >
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 group-hover:from-emerald-400 group-hover:to-cyan-400" />
          <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_60px_-12px_rgba(16,185,129,0.5),0_0_120px_-24px_rgba(34,211,238,0.3)]" />
          <span class="relative z-10 text-slate-900">Jugar de nuevo</span>
        </button>

        <button
          @click="store.navigateTo('start')"
          class="group relative flex-1 overflow-hidden rounded-2xl border border-white/[0.08] px-6 py-4 md:px-8 md:py-5 text-base md:text-lg font-bold text-slate-300 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.14] hover:shadow-[0_0_40px_-12px_rgba(255,255,255,0.05)] focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2"
        >
          <span class="relative z-10">Volver al inicio</span>
        </button>
      </section>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="isConfigModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          @click.self="closeConfigModal"
        >
          <div class="w-[90vw] md:w-96 rounded-2xl bg-[#0a0f1e] border border-white/[0.08] p-6 shadow-2xl shadow-black/50">
            <div class="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

            <h2 class="mb-6 text-center text-lg font-bold text-slate-100">
              Preguntas por partida
            </h2>
            <QuestionCountSelector class="mb-4 justify-center" />
            <p class="mb-6 text-center text-sm text-slate-400">
              {{ store.questionCount }} preguntas por partida
            </p>
            <button
              @click="closeConfigModal"
              class="group relative w-full overflow-hidden rounded-2xl py-3 text-sm font-bold transition-all duration-500 focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2"
            >
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 group-hover:from-emerald-400 group-hover:to-cyan-400" />
              <span class="relative z-10 text-slate-900">Listo</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.reveal-enter-active {
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.expand-enter-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.expand-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 400px;
}

.modal-enter-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-active > div {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-leave-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-leave-active > div {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from > div {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to > div {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}
</style>
