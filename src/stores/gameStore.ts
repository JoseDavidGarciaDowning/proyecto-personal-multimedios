import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Screen = 'start' | 'game' | 'result'

export const useGameStore = defineStore('game', () => {
  const currentScreen = ref<Screen>('start')

  function navigateTo(screen: Screen) {
    currentScreen.value = screen
  }

  return { currentScreen, navigateTo }
})
