<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  total: number
}>()

const percentage = computed(() => (props.current / props.total) * 100)
</script>

<template>
  <div class="flex items-center gap-2 md:gap-4">
    <span class="text-xs md:text-sm text-slate-400 whitespace-nowrap">
      Pregunta {{ current }} de {{ total }}
    </span>
    <div class="flex-1 h-1.5 md:h-2 bg-white/[0.06] rounded-full overflow-hidden">
      <div
        class="h-full bg-emerald-500 rounded-full transition-all duration-300"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>
