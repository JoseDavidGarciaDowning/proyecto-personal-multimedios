import { ref, watch } from 'vue'

const MUTE_KEY = 'devchallenge:muted'

const isMuted = ref(false)

watch(isMuted, (val) => {
  sessionStorage.setItem(MUTE_KEY, String(val))
})

function restoreMute() {
  const saved = sessionStorage.getItem(MUTE_KEY)
  if (saved !== null) isMuted.value = saved === 'true'
}

const sounds: Record<string, HTMLAudioElement> = {}

function preload() {
  restoreMute()
  const base = import.meta.env.BASE_URL
  sounds.correct = new Audio(base + 'sounds/correct.mp3')
  sounds.error = new Audio(base + 'sounds/error.mp3')
  sounds.resultExcellent = new Audio(base + 'sounds/result-excellent.mp3')
  sounds.resultGood = new Audio(base + 'sounds/result-good.mp3')
  sounds.resultPractice = new Audio(base + 'sounds/result-practice.mp3')
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
