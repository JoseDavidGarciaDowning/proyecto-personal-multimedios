<script setup lang="ts">
defineProps<{
  correctAnswers: number
  totalQuestions: number
  averageTime: number
  bestStreak: number
}>()
</script>

<template>
  <div class="flex items-center gap-2 mb-4">
    <div class="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
    <h2 class="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
      Estadísticas
    </h2>
  </div>

  <div class="grid gap-3 md:grid-cols-3 md:gap-4">
    <div class="relative rounded-xl bg-white/[0.02] border border-white/[0.06] p-5 overflow-hidden group transition-all duration-500 hover:bg-white/[0.03] hover:border-white/[0.08]">
      <div class="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />
      <p class="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Aciertos</p>
      <p class="text-2xl md:text-3xl font-bold text-slate-100 tabular-nums">
        <span class="text-emerald-400">{{ correctAnswers }}</span>
        <span class="text-slate-600">/{{ totalQuestions }}</span>
      </p>
    </div>

    <div class="relative rounded-xl bg-white/[0.02] border border-white/[0.06] p-5 overflow-hidden group transition-all duration-500 hover:bg-white/[0.03] hover:border-white/[0.08]">
      <div class="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
      <p class="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Tiempo promedio</p>
      <p class="text-2xl md:text-3xl font-bold text-slate-100 tabular-nums">
        {{ averageTime.toFixed(1) }}<span class="text-slate-500 text-lg">s</span>
      </p>
    </div>

    <div class="relative rounded-xl bg-white/[0.02] border border-white/[0.06] p-5 overflow-hidden group transition-all duration-500 hover:bg-white/[0.03] hover:border-white/[0.08]">
      <div class="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
      <p class="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Mejor racha</p>
      <p class="text-2xl md:text-3xl font-bold text-slate-100 tabular-nums">
        {{ bestStreak }}
      </p>
    </div>
  </div>
</template>
