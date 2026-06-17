<script setup lang="ts">
import { useGameStore } from '../../stores/gameStore'

const store = useGameStore()
</script>

<template>
  <div class="flex gap-2 md:gap-3">
    <button
      v-for="count in ([5, 10, 15] as const)"
      :key="count"
      @click="store.questionCount = count"
        :class="[
          'rounded-full min-w-[44px] min-h-[44px] px-5 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2',
          store.questionCount === count
            ? 'bg-emerald-500 text-slate-900 shadow-[0_0_16px_-4px_rgba(16,185,129,0.3)]'
            : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200',
        ]"
    >
      {{ count }}
    </button>
  </div>
</template>
