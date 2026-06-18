<script setup lang="ts">
defineProps<{
  variant: 'primary' | 'secondary' | 'start'
  label: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    @click="emit('click')"
    :disabled="disabled"
    :class="[
      'font-bold transition-all duration-500 focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2',
      variant === 'start'
        ? [
            'w-full max-w-xs md:max-w-md rounded-lg px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold duration-200',
            disabled
              ? 'cursor-not-allowed bg-white/[0.04] text-slate-600'
              : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400 hover:shadow-[0_0_30px_-8px_rgba(16,185,129,0.4)]',
          ]
        : [
            'group relative flex-1 overflow-hidden rounded-2xl px-6 py-4 md:px-8 md:py-5 text-base md:text-lg',
            variant === 'primary'
              ? 'text-slate-900'
              : 'border border-white/[0.08] text-slate-300 hover:bg-white/[0.04] hover:border-white/[0.14]',
          ],
    ]"
  >
    <template v-if="variant === 'primary'">
      <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 group-hover:from-emerald-400 group-hover:to-cyan-400" />
      <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_60px_-12px_rgba(16,185,129,0.5),0_0_120px_-24px_rgba(34,211,238,0.3)]" />
    </template>
    <template v-if="variant === 'secondary'">
      <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_40px_-12px_rgba(255,255,255,0.05)]" />
    </template>
    <span :class="variant !== 'start' && 'relative z-10'">{{ label }}</span>
  </button>
</template>
