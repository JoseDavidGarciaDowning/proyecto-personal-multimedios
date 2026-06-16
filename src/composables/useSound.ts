import { ref } from 'vue'

const isMuted = ref(false)

const sounds: Record<string, HTMLAudioElement> = {}

function preload() {
  sounds.correct = new Audio('/sounds/correct.mp3')
  sounds.error = new Audio('/sounds/error.mp3')
  sounds.resultExcellent = new Audio('/sounds/result-excellent.mp3')
  sounds.resultGood = new Audio('/sounds/result-good.mp3')
  sounds.resultPractice = new Audio('/sounds/result-practice.mp3')
}

function play(name: string) {
  if (isMuted.value) return
  const audio = sounds[name]
  if (!audio) return
  audio.currentTime = 0
  audio.play().catch(() => {})
}

function playCorrect() {
  play('correct')
}

function playError() {
  play('error')
}

function playResult(scorePercent: number) {
  if (scorePercent >= 80) play('resultExcellent')
  else if (scorePercent >= 50) play('resultGood')
  else play('resultPractice')
}

function toggleMute() {
  isMuted.value = !isMuted.value
}

export function useSound() {
  return {
    isMuted,
    preload,
    playCorrect,
    playError,
    playResult,
    toggleMute,
  }
}
