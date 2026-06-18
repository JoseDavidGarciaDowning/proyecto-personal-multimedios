<script setup lang="ts">
import MuteButton from './MuteButton.vue'

defineProps<{
  isMuted: boolean
}>()

const emit = defineEmits<{
  'toggle-mute': []
  'open-config': []
}>()
</script>

<template>
  <div class="fixed top-4 right-4 z-40 flex items-center gap-2">
    <MuteButton
      :is-muted="isMuted"
      @toggle="emit('toggle-mute')"
    />
    <button
      @click="emit('open-config')"
      class="inline-flex items-center rounded-lg bg-white/[0.04] p-2 text-slate-300 transition-all duration-300 hover:bg-white/[0.08] md:px-4 md:py-2 focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2"
      aria-label="Configuracion"
    >
      <span aria-hidden="true" class="mr-0 text-xl leading-none md:mr-1.5">&#9881;</span>
      <span class="hidden md:inline text-sm">Configuracion</span>
    </button>
  </div>
</template>
