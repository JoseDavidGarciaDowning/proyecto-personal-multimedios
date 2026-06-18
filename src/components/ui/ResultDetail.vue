<script setup lang="ts">
import type { Question, Answer } from '../../types/question'

defineProps<{
  questionDetails: Array<{ answer: Answer; question: Question | undefined }>
  expandedExplanations: Set<number>
  hasAnswers: boolean
}>()

const emit = defineEmits<{
  'toggle-explanation': [questionId: number]
}>()
</script>

<template>
  <div class="flex items-center gap-2 mb-4">
    <div class="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
    <h2 class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
      Detalle
    </h2>
  </div>

  <div class="detail-scroll max-h-[50vh] space-y-2.5 overflow-y-auto pr-1">
    <div
      v-for="(detail, index) in questionDetails"
      :key="index"
      class="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 md:p-5 transition-all duration-300 hover:border-white/[0.08]"
    >
      <div class="flex items-start gap-3">
        <span
          :class="[
            'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
            detail.answer.correct
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-red-500/15 text-red-300 border border-red-500/30',
          ]"
        >
          {{ detail.answer.correct ? '&#10003;' : '&#10007;' }}
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-sm text-slate-200 leading-relaxed">
            {{ index + 1 }}. {{ detail.question?.question ?? 'Pregunta no encontrada' }}
          </p>
          <p class="mt-1.5 text-xs text-slate-500">
            Respondiste:
            <span :class="detail.answer.correct ? 'text-emerald-400' : 'text-red-400'">
              {{ detail.answer.selectedOption !== null ? detail.question?.options[detail.answer.selectedOption] : 'Sin responder' }}
            </span>
            <span class="mx-1.5 text-slate-600">&middot;</span>
            Correcta:
            <span class="text-emerald-400">{{ detail.question?.options[detail.question.correctAnswer] }}</span>
          </p>
        </div>
      </div>

      <button
        @click="emit('toggle-explanation', detail.answer.questionId)"
        class="mt-3 text-sm font-medium text-cyan-400 transition-all duration-300 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2 rounded"
      >
        {{ expandedExplanations.has(detail.answer.questionId) ? 'Ocultar explicacion' : 'Ver explicacion' }}
      </button>

      <Transition name="expand">
        <p
          v-if="expandedExplanations.has(detail.answer.questionId)"
          class="mt-3 text-sm leading-relaxed text-slate-400 border-l-2 border-cyan-500/20 pl-4"
        >
          {{ detail.question?.explanation }}
        </p>
      </Transition>
    </div>

    <p v-if="!hasAnswers" class="text-slate-500 text-center py-8">
      Sin respuestas
    </p>
  </div>
</template>

<style scoped>
.detail-scroll {
  scrollbar-width: thin;
  scrollbar-color: #475569 #1e293b;
}

.detail-scroll::-webkit-scrollbar {
  width: 6px;
}

.detail-scroll::-webkit-scrollbar-track {
  background: #1e293b;
  border-radius: 8px;
}

.detail-scroll::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 8px;
}

.detail-scroll::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
