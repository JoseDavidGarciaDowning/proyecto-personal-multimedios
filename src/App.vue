<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from './stores/gameStore'
import { useSound } from './composables/useSound'
import StartScreen from './components/screens/StartScreen.vue'
import GameScreen from './components/screens/GameScreen.vue'
import ResultScreen from './components/screens/ResultScreen.vue'

const store = useGameStore()
const sound = useSound()

onMounted(async () => {
  sound.preload()
  await store.loadQuestions()
  store.tryResume()
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

  </div>
</template>
