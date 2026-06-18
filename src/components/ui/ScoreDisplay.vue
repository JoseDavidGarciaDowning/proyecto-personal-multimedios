<script setup lang="ts">
defineProps<{
  animatedScore: number
  isScoreAnimating: boolean
  messageText: string
}>()
</script>

<template>
  <section class="mb-10 md:mb-14 text-center">
    <p class="text-sm md:text-base text-slate-500 uppercase tracking-[0.2em] mb-3">
      Puntaje
    </p>

    <div class="relative inline-block">
      <div class="absolute inset-0 blur-3xl bg-emerald-500/10 rounded-full" />
      <p
        class="relative text-6xl md:text-8xl font-black tracking-[-0.04em] tabular-nums"
        style="background: linear-gradient(180deg, #34d399 0%, #10b981 50%, #059669 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 0 40px rgba(16, 185, 129, 0.3));"
      >
        {{ animatedScore }}
      </p>
    </div>

    <Transition name="reveal">
      <p
        v-if="!isScoreAnimating"
        class="mt-6 text-xl md:text-2xl font-bold text-cyan-300"
      >
        {{ messageText }}
      </p>
    </Transition>
  </section>
</template>
