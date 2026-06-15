<script setup lang="ts">
import type { Question } from '../../types/question'

defineProps<{
  question: Question
}>()
</script>

<template>
  <div class="rounded-lg bg-slate-800 border border-slate-700 p-6">
    <p class="text-slate-100 text-lg leading-relaxed mb-5">{{ question.question }}</p>

    <template v-if="question.type === 'code'">
      <pre class="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto border border-slate-700/50"><code>{{ question.codeSnippet }}</code></pre>
    </template>

    <template v-else-if="question.type === 'css'">
      <div class="space-y-3">
        <div>
          <span class="text-xs text-slate-500 uppercase tracking-wider font-medium">CSS</span>
          <pre class="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto mt-1 border border-slate-700/50"><code>{{ question.cssCode }}</code></pre>
        </div>
        <div>
          <span class="text-xs text-slate-500 uppercase tracking-wider font-medium">HTML</span>
          <pre class="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto mt-1 border border-slate-700/50"><code>{{ question.htmlSnippet }}</code></pre>
        </div>
      </div>
    </template>
  </div>
</template>
