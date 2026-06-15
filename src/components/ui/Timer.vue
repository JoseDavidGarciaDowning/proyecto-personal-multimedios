<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  timeRemaining: number
  totalTime: number
}>()

const percentage = computed(() => {
  if (props.totalTime === 0) return 0
  return (props.timeRemaining / props.totalTime) * 100
})
</script>

<template>
  <div class="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
    <div
      class="h-full rounded-full transition-all duration-1000 ease-linear"
      :class="{
        'bg-emerald-500': percentage > 60,
        'bg-yellow-500': percentage > 30 && percentage <= 60,
        'bg-red-500': percentage <= 30,
      }"
      :style="{ width: `${percentage}%` }"
    />
  </div>
</template>
