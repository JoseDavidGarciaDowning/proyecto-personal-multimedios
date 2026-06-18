<script setup lang="ts">
import type { HistoryEntry } from '../../types/question'

defineProps<{
  history: HistoryEntry[]
  formatRelativeDate: (date: string) => string
}>()
</script>

<template>
  <div class="flex items-center gap-2 mb-4">
    <div class="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
    <h2 class="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400/80">
      Historial
    </h2>
  </div>

  <ul v-if="history.length" class="space-y-2">
    <li
      v-for="(entry, index) in history.slice(0, 5)"
      :key="index"
      class="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-3 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.08]"
    >
      <span class="text-sm text-slate-300">
        {{ entry.correct }}/{{ entry.total }} correctas
      </span>
      <span class="text-xs text-slate-500">
        {{ formatRelativeDate(entry.date) }}
      </span>
    </li>
  </ul>
  <p v-else class="text-slate-500 text-center py-8">
    Sin partidas anteriores
  </p>
</template>
