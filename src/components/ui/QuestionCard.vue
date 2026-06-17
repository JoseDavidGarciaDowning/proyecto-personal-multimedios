<script setup lang="ts">
import type { Question } from '../../types/question'

defineProps<{
  question: Question
}>()
</script>

<template>
  <div class="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 md:p-6 shadow-[0_0_40px_-12px_rgba(0,0,0,0.3)]">
    <p class="text-slate-100 text-sm md:text-base leading-relaxed mb-4 md:mb-5">{{ question.question }}</p>

    <template v-if="question.type === 'code'">
      <pre class="bg-black/30 rounded-lg p-3 md:p-4 font-mono text-xs md:text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap break-words border border-white/[0.04]"><code>{{ question.codeSnippet }}</code></pre>
    </template>

    <template v-else-if="question.type === 'css'">
      <div class="space-y-3">
        <div>
          <span class="text-xs text-slate-500 uppercase tracking-wider font-medium">CSS</span>
          <pre class="bg-black/30 rounded-lg p-3 md:p-4 font-mono text-xs md:text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap break-words mt-1 border border-white/[0.04]"><code>{{ question.cssCode }}</code></pre>
        </div>
        <div>
          <span class="text-xs text-slate-500 uppercase tracking-wider font-medium">HTML</span>
          <pre class="bg-black/30 rounded-lg p-3 md:p-4 font-mono text-xs md:text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap break-words mt-1 border border-white/[0.04]"><code>{{ question.htmlSnippet }}</code></pre>
        </div>
      </div>
    </template>
  </div>
</template>
