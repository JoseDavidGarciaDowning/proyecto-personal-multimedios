<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from './stores/gameStore'
import { useSound } from './composables/useSound'
import StartScreen from './components/screens/StartScreen.vue'
import GameScreen from './components/screens/GameScreen.vue'
import ResultScreen from './components/screens/ResultScreen.vue'

const store = useGameStore()
const sound = useSound()

onMounted(() => {
  sound.preload()
})
</script>

<template>
  <div class="min-h-screen">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-slate-900 focus:rounded-lg focus:outline-none">Saltar al contenido</a>
    <main id="main-content">
      <StartScreen v-if="store.currentScreen === 'start'" />
      <GameScreen v-else-if="store.currentScreen === 'game'" />
      <ResultScreen v-else-if="store.currentScreen === 'result'" />
    </main>

    <div class="fixed bottom-4 right-4 z-30 flex gap-2 p-2 bg-white/[0.04] backdrop-blur-sm rounded-lg border border-white/[0.06]">
      <button
        @click="store.navigateTo('start')"
        class="px-3 py-1 text-sm rounded bg-emerald-600 hover:bg-emerald-500 transition focus-visible:outline-2 focus-visible:outline-cyan-400"
      >
        Start
      </button>
      <button
        @click="store.navigateTo('game')"
        class="px-3 py-1 text-sm rounded bg-cyan-600 hover:bg-cyan-500 transition focus-visible:outline-2 focus-visible:outline-cyan-400"
      >
        Game
      </button>
      <button
        @click="store.navigateTo('result')"
        class="px-3 py-1 text-sm rounded bg-purple-600 hover:bg-purple-500 transition focus-visible:outline-2 focus-visible:outline-cyan-400"
      >
        Result
      </button>
    </div>
  </div>
</template>
