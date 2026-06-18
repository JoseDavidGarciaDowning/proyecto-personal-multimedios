<script setup lang="ts">
import { useGameStore } from '../../stores/gameStore'
import QuestionCountSelector from './QuestionCountSelector.vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const store = useGameStore()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div class="w-[90vw] md:w-96 rounded-2xl bg-[#0a0f1e] border border-white/[0.08] p-6 shadow-2xl shadow-black/50">
          <div class="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

          <h2 class="mb-6 text-center text-lg font-bold text-slate-100">
            Preguntas por partida
          </h2>
          <QuestionCountSelector class="mb-4 justify-center" />
          <p class="mb-6 text-center text-sm text-slate-400">
            {{ store.questionCount }} preguntas por partida
          </p>
          <button
            @click="emit('close')"
            class="group relative w-full overflow-hidden rounded-2xl py-3 text-sm font-bold transition-all duration-500 focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2"
          >
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 group-hover:from-emerald-400 group-hover:to-cyan-400" />
            <span class="relative z-10 text-slate-900">Listo</span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
