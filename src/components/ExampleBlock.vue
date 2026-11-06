<script setup>
import MathText from '@/components/MathText.vue'
import HistogramChart from '@/components/HistogramChart.vue'
import { useDataset } from '@/composables/useDataset'

const props = defineProps({ example: { type: Object, required: true } })
const { columnHistogram } = useDataset()
const hist = props.example.datasetRef ? columnHistogram(props.example.datasetRef) : null
</script>
<template>
  <section class="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
    <div class="mb-1 text-xs font-semibold uppercase text-emerald-700">Пример · C-15</div>
    <h4 class="font-semibold text-slate-900"><MathText :text="example.title" /></h4>
    <p class="mt-2 text-sm text-slate-700"><MathText :text="example.scenario" /></p>
    <ol v-if="example.steps?.length" class="mt-2 list-decimal pl-5 text-sm text-slate-600">
      <li v-for="(s, i) in example.steps" :key="i"><MathText :text="s" /></li>
    </ol>
    <p v-if="example.result" class="mt-2 text-sm font-medium text-emerald-900"><MathText :text="example.result" /></p>
    <HistogramChart v-if="hist && hist.bins.length" class="mt-3" :data="hist" :label="example.datasetRef" />
  </section>
</template>
