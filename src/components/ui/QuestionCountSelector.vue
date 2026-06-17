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
        'rounded-full min-w-[44px] min-h-[44px] px-5 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2',
        store.questionCount === count
          ? 'bg-emerald-500 text-slate-900'
          : 'bg-slate-700 text-slate-300 hover:ring-1 hover:ring-cyan-400',
      ]"
    >
      {{ count }}
    </button>
  </div>
</template>
