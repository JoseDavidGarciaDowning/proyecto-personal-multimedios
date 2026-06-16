<script setup lang="ts">
import { useGameStore } from '../../stores/gameStore'
import { formatRelativeDate } from '../../composables/useRelativeTime'
import { useResults } from '../../composables/useResults'
import { useResultAnimation } from '../../composables/useResultAnimation'
import { useResultDetail } from '../../composables/useResultDetail'
import { useConfigModal } from '../../composables/useConfigModal'
import { useResultKeyboard } from '../../composables/useResultKeyboard'
import QuestionCountSelector from '../ui/QuestionCountSelector.vue'

const store = useGameStore()
const { correctAnswers, totalQuestions, averageTime, messageText } = useResults()
const { isScoreAnimating, animatedScore } = useResultAnimation()
const { expandedExplanations, questionDetails, toggleExplanation } = useResultDetail()
const { isConfigModalOpen, openConfigModal, closeConfigModal } = useConfigModal()

useResultKeyboard(isScoreAnimating, isConfigModalOpen)
</script>

<template>
  <div class="relative flex min-h-screen flex-col items-center bg-slate-900 px-6 py-8">
    <button
      @click="openConfigModal"
      class="fixed top-4 right-4 z-40 inline-flex items-center rounded-lg bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 md:px-4 md:py-2"
      aria-label="Configuración"
    >
      <span aria-hidden="true" class="mr-0 text-xl leading-none md:mr-1.5">&#9881;</span>
      <span class="hidden md:inline text-sm">Configuración</span>
    </button>

    <div class="w-full max-w-2xl">
      <section class="mb-10 text-center">
        <p class="text-lg text-slate-400">Puntaje</p>
        <p class="text-6xl font-bold text-emerald-400">{{ animatedScore }}</p>
        <Transition name="fade">
          <p v-if="!isScoreAnimating" class="mt-4 text-2xl font-bold text-cyan-300">
            {{ messageText }}
          </p>
        </Transition>
      </section>

      <section class="mb-10">
        <p class="text-lg font-semibold text-cyan-400">Estadísticas</p>
        <div class="mt-3 grid grid-cols-3 gap-4 text-center">
          <div class="rounded-lg bg-slate-800 p-4">
            <p class="text-sm text-slate-500">Aciertos</p>
            <p class="text-xl font-bold text-slate-100">{{ correctAnswers }}/{{ totalQuestions }}</p>
          </div>
          <div class="rounded-lg bg-slate-800 p-4">
            <p class="text-sm text-slate-500">Tiempo promedio</p>
            <p class="text-xl font-bold text-slate-100">{{ averageTime.toFixed(1) }}s</p>
          </div>
          <div class="rounded-lg bg-slate-800 p-4">
            <p class="text-sm text-slate-500">Mejor racha</p>
            <p class="text-xl font-bold text-slate-100">{{ store.bestStreak }}</p>
          </div>
        </div>
      </section>

      <section class="mb-10">
        <p class="text-lg font-semibold text-cyan-400">Detalle de preguntas</p>
        <div class="mt-3 max-h-96 space-y-2 overflow-y-auto scrollbar-custom">
          <div
            v-for="(detail, index) in questionDetails"
            :key="index"
            class="rounded-lg bg-slate-800 p-4"
          >
            <div class="flex items-start gap-3">
              <span
                :class="[
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  detail.answer.correct ? 'bg-emerald-500 text-slate-900' : 'bg-red-500 text-white',
                ]"
              >
                {{ detail.answer.correct ? '✓' : '✗' }}
              </span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm text-slate-200">
                  {{ index + 1 }}. {{ detail.question?.question ?? 'Pregunta no encontrada' }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  Tu respuesta: {{ detail.answer.selectedOption !== null ? detail.question?.options[detail.answer.selectedOption] : 'Sin responder' }} ·
                  Correcta: {{ detail.question?.options[detail.question.correctAnswer] }}
                </p>
              </div>
            </div>
            <button
              @click="toggleExplanation(detail.answer.questionId)"
              class="mt-2 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
            >
              {{ expandedExplanations.has(detail.answer.questionId) ? 'Ocultar explicación' : 'Ver explicación' }}
            </button>
            <Transition name="expand">
              <p
                v-if="expandedExplanations.has(detail.answer.questionId)"
                class="mt-2 text-sm leading-relaxed text-slate-400"
              >
                {{ detail.question?.explanation }}
              </p>
            </Transition>
          </div>
          <p v-if="store.answers.length === 0" class="text-slate-500">Sin respuestas</p>
        </div>
      </section>

      <section class="mb-10">
        <p class="text-lg font-semibold text-cyan-400">Historial</p>
        <ul v-if="store.history.length" class="mt-3 space-y-2">
          <li
            v-for="(entry, index) in store.history.slice(0, 3)"
            :key="index"
            class="flex items-center justify-between rounded-lg bg-slate-800 px-4 py-3"
          >
            <span class="text-slate-300">
              {{ entry.correct }}/{{ entry.total }} correctas
            </span>
            <span class="text-sm text-slate-500">
              {{ formatRelativeDate(entry.date) }}
            </span>
          </li>
        </ul>
        <p v-else class="mt-3 text-slate-500">Sin partidas anteriores</p>
      </section>

      <section v-if="!isScoreAnimating" class="flex flex-col gap-3">
        <button
          @click="store.startGame()"
          class="rounded-lg bg-emerald-500 px-8 py-4 text-lg font-semibold text-slate-900 transition hover:bg-emerald-400"
        >
          Jugar de nuevo
        </button>
        <button
          @click="store.navigateTo('start')"
          class="rounded-lg border border-slate-600 px-8 py-4 text-lg font-semibold text-slate-300 transition hover:bg-slate-800"
        >
          Volver al inicio
        </button>
      </section>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isConfigModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80"
          @click.self="closeConfigModal"
        >
          <div class="w-full max-w-sm rounded-xl bg-slate-800 p-6 shadow-2xl">
            <h2 class="mb-6 text-center text-lg font-semibold text-slate-100">
              Preguntas por partida
            </h2>
            <QuestionCountSelector class="mb-4 justify-center" />
            <p class="mb-6 text-center text-sm text-slate-400">
              {{ store.questionCount }} preguntas por partida
            </p>
            <button
              @click="closeConfigModal"
              class="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400"
            >
              Listo
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 200px;
  overflow: hidden;
}

.scrollbar-custom {
  scrollbar-width: thin;
  scrollbar-color: #475569 #1e293b;
}
</style>
