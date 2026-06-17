<script setup lang="ts">
import { computed } from 'vue'

type ButtonState = 'default' | 'correct' | 'incorrect' | 'revealed'

const props = defineProps<{
  text: string
  index: number
  state: ButtonState
  disabled: boolean
}>()

const emit = defineEmits<{
  select: []
}>()

const isClickable = computed(() => props.state === 'default' && !props.disabled)

function handleClick() {
  if (isClickable.value) {
    emit('select')
  }
}

const buttonClasses = computed(() => {
  switch (props.state) {
    case 'default':
      return 'bg-white/[0.04] border-white/[0.06] text-slate-100 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.15)]'
    case 'correct':
      return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200 shadow-[0_0_24px_-6px_rgba(16,185,129,0.25)]'
    case 'incorrect':
      return 'bg-red-500/15 border-red-500/40 text-red-200 shadow-[0_0_24px_-6px_rgba(239,68,68,0.2)]'
    case 'revealed':
      return 'bg-white/[0.02] border-white/[0.03] text-slate-600'
  }
})

const animationClass = computed(() => {
  if (props.state === 'correct') return 'animate-scale-up'
  if (props.state === 'incorrect') return 'animate-shake'
  return ''
})

const badgeClasses = computed(() => {
  switch (props.state) {
    case 'default':
      return 'bg-white/[0.06] text-slate-400'
    case 'correct':
      return 'bg-emerald-500 text-slate-900'
    case 'incorrect':
      return 'bg-red-500 text-white'
    case 'revealed':
      return 'bg-white/[0.03] text-slate-600'
  }
})
</script>

<template>
  <button
    :disabled="!isClickable"
    @click="handleClick"
    class="relative w-full rounded-lg px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-left font-medium transition-all duration-200 border disabled:opacity-100 focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2"
    :class="[buttonClasses, animationClass]"
  >
    <span
      class="absolute top-2 left-2 flex items-center justify-center w-6 h-6 rounded text-xs font-bold"
      :class="badgeClasses"
    >
      {{ index + 1 }}
    </span>
    <span class="block text-center">{{ text }}</span>
  </button>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

@keyframes scale-up {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}

.animate-scale-up {
  animation: scale-up 0.3s ease-in-out;
}
</style>
