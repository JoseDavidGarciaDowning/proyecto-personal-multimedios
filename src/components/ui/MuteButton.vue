<script setup lang="ts">
withDefaults(defineProps<{
  isMuted: boolean
  size?: number
}>(), {
  size: 18,
})

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <button
    @click="emit('toggle')"
    class="rounded-lg bg-white/[0.04] p-1.5 opacity-50 hover:opacity-100 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2"
    aria-label="Silenciar sonidos"
  >
    <svg v-if="isMuted" :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
      <line x1="23" y1="9" x2="17" y2="15"/>
      <line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
    <svg v-else :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
      <path d="M19.07 4.93a10 10 0 010 14.14"/>
      <path d="M15.54 8.46a5 5 0 010 7.07"/>
    </svg>
  </button>
</template>
