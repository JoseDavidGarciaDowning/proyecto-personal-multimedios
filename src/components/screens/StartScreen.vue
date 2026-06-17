<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { formatRelativeDate } from '../../composables/useRelativeTime'
import QuestionCountSelector from '../ui/QuestionCountSelector.vue'

const store = useGameStore()

const TITLE = 'DevChallenge'
const displayedTitle = ref('')
const isTypingComplete = ref(false)
const isLoading = ref(true)

onMounted(async () => {
  let index = 0
  const intervalId = setInterval(() => {
    if (index < TITLE.length) {
      displayedTitle.value += TITLE[index]
      index++
    } else {
      clearInterval(intervalId)
      isTypingComplete.value = true
    }
  }, 100)

  await store.loadQuestions()
  isLoading.value = false
})
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4 md:px-6">
    <div class="w-full max-w-2xl flex flex-col items-center">
      <svg
        class="mb-4 md:mb-6 h-14 w-14 md:h-16 md:w-16 text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="4" y="8" width="56" height="48" rx="6" stroke="currentColor" stroke-width="3" />
        <path d="M16 28l8 8-8 8" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <line x1="30" y1="44" x2="48" y2="44" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      </svg>
      <h1 class="mb-4 text-3xl md:text-5xl font-bold tracking-tight text-white">
        {{ displayedTitle }}
        <span v-if="isTypingComplete" class="animate-pulse text-emerald-400">|</span>
      </h1>
      <p class="mb-6 md:mb-8 text-sm md:text-base text-slate-500">
        Poné a prueba tus conocimientos de JavaScript y CSS
      </p>
      <QuestionCountSelector class="mb-6 md:mb-8" />
      <div class="mb-6 md:mb-8 w-full">
        <h2 class="mb-3 text-2xl md:text-3xl font-semibold text-cyan-400">
          Historial reciente
        </h2>
        <div v-if="store.history.length === 0" class="text-center text-slate-600">
          Sin partidas anteriores
        </div>
        <ul v-else class="space-y-2">
          <li
            v-for="(entry, index) in store.history.slice(0, 3)"
            :key="index"
            class="flex items-center justify-between rounded-lg bg-white/[0.03] border border-white/[0.05] px-4 py-3"
          >
            <span class="text-slate-300 text-sm">
              {{ entry.correct }}/{{ entry.total }} correctas
            </span>
            <span class="text-xs text-slate-500">
              {{ formatRelativeDate(entry.date) }}
            </span>
          </li>
        </ul>
      </div>
      <button
        @click="store.startGame()"
        :disabled="isLoading"
        :class="[
          'w-full max-w-xs md:max-w-md rounded-lg px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2',
          isLoading
            ? 'cursor-not-allowed bg-white/[0.04] text-slate-600'
            : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400 hover:shadow-[0_0_30px_-8px_rgba(16,185,129,0.4)]',
        ]"
      >
        {{ isLoading ? 'Cargando...' : 'Comenzar' }}
      </button>
      <p class="mt-6 md:mt-8 text-xs text-slate-500">
        Usá las teclas 1-4 para responder · Fácil: 15s · Media: 30s · Difícil: 60s
      </p>
    </div>
  </div>
</template>
