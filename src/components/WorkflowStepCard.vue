<script setup>
import { RouterLink } from 'vue-router'
import MathText from '@/components/MathText.vue'
import HistogramChart from '@/components/HistogramChart.vue'

defineProps({
  step: { type: Object, required: true },
  branchLabels: { type: Object, default: () => ({}) },
  histogram: { type: Object, default: null },
  showHistogram: { type: Boolean, default: false },
})
</script>

<template>
  <article class="card flex flex-col gap-4 p-5">
    <h2 class="text-lg font-bold text-slate-900"><MathText :text="step.title" /></h2>
    <p class="text-sm leading-relaxed text-slate-700">
      <MathText :text="step.content" />
    </p>

    <div v-if="step.whatWeCheck" class="rounded-xl border border-brand-200 bg-brand-50/50 p-4">
      <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">Что проверяем</p>
      <p class="text-sm text-slate-700"><MathText :text="step.whatWeCheck" /></p>
    </div>

    <ul v-if="step.checklist?.length" class="list-disc space-y-1 pl-5 text-sm text-slate-600">
      <li v-for="(c, i) in step.checklist" :key="i">
        <MathText :text="c" />
      </li>
    </ul>

    <div v-if="step.substeps?.length" class="rounded-xl bg-slate-50 p-4">
      <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Шаги: что делаем и зачем</p>
      <ol class="list-decimal space-y-3 pl-5 text-sm">
        <li v-for="(s, i) in step.substeps" :key="i" class="text-slate-700">
          <span class="font-medium text-slate-800"><MathText :text="s.action" /></span>
          <p class="mt-0.5 text-slate-500"><MathText :text="s.why" /></p>
        </li>
      </ol>
    </div>

    <div v-if="step.branches?.length" class="rounded-xl bg-slate-50 p-4">
      <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Развилка: условие → критерий</p>
      <ul class="flex flex-col gap-4">
        <li
          v-for="b in step.branches"
          :key="b.goto"
          class="rounded-lg bg-white p-3 ring-1 ring-slate-200"
        >
          <p class="text-sm font-semibold text-slate-800">
            <MathText :text="b.if" />
            <span class="text-slate-400"> → </span>
            <MathText :text="branchLabels[b.goto] || b.goto" />
          </p>
          <p v-if="b.computes" class="mt-2 text-sm text-slate-600">
            <span class="font-medium text-slate-700">Считаем: </span>
            <MathText :text="b.computes" />
          </p>
          <p v-if="b.why" class="mt-1 text-sm text-slate-600">
            <span class="font-medium text-slate-700">Зачем: </span>
            <MathText :text="b.why" />
          </p>
          <RouterLink
            v-if="b.theoryId"
            :to="{ path: '/theory', query: { q: String(b.theoryId) } }"
            class="mt-2 inline-block text-xs font-semibold text-brand-600 hover:underline"
          >
            Подробнее в теории →
          </RouterLink>
        </li>
      </ul>
    </div>

    <HistogramChart
      v-if="showHistogram && histogram?.bins?.length"
      :data="histogram"
      :label="step.datasetRef"
    />
  </article>
</template>
