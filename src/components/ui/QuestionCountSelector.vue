<script setup lang="ts">
import { useGameStore } from '../../stores/gameStore'

const store = useGameStore()
</script>

<template>
  <div class="flex gap-3">
    <button
      v-for="count in ([5, 10, 15] as const)"
      :key="count"
      @click="store.questionCount = count"
      :class="[
        'rounded-full px-5 py-2 text-sm font-medium transition',
        store.questionCount === count
          ? 'bg-emerald-500 text-slate-900'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
      ]"
    >
      {{ count }}
    </button>
  </div>
</template>
