<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { formatRelativeDate } from '../../composables/useRelativeTime'
import { useSound } from '../../composables/useSound'
import { useConfigModal } from '../../composables/useConfigModal'
import QuestionCountSelector from '../ui/QuestionCountSelector.vue'

const store = useGameStore()
const sound = useSound()
const { isConfigModalOpen, openConfigModal, closeConfigModal } = useConfigModal()

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
