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
  <div class="min-h-screen bg-slate-900 text-slate-100">
    <StartScreen v-if="store.currentScreen === 'start'" />
    <GameScreen v-else-if="store.currentScreen === 'game'" />
    <ResultScreen v-else-if="store.currentScreen === 'result'" />

    <div class="fixed bottom-4 right-4 flex gap-2 p-2 bg-slate-800 rounded-lg border border-slate-700">
      <button
        @click="store.navigateTo('start')"
        class="px-3 py-1 text-sm rounded bg-emerald-600 hover:bg-emerald-500 transition"
      >
        Start
      </button>
      <button
        @click="store.navigateTo('game')"
        class="px-3 py-1 text-sm rounded bg-cyan-600 hover:bg-cyan-500 transition"
      >
        Game
      </button>
      <button
        @click="store.navigateTo('result')"
        class="px-3 py-1 text-sm rounded bg-purple-600 hover:bg-purple-500 transition"
      >
        Result
      </button>
    </div>
  </div>
</template>
