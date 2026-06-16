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
      return 'bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600 hover:border-slate-500'
    case 'correct':
      return 'bg-emerald-600 border-emerald-500 text-white'
    case 'incorrect':
      return 'bg-red-600 border-red-500 text-white'
    case 'revealed':
      return 'bg-slate-700/40 border-slate-700/50 text-slate-500'
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
      return 'bg-slate-600 text-slate-300'
    case 'correct':
      return 'bg-emerald-500 text-slate-900'
    case 'incorrect':
      return 'bg-red-500 text-white'
    case 'revealed':
      return 'bg-slate-600/50 text-slate-500'
  }
})
</script>

<template>
  <button
    :disabled="!isClickable"
    @click="handleClick"
    class="relative w-full rounded-lg p-4 text-left font-medium transition-all duration-200 border disabled:opacity-100"
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
