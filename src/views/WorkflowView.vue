<script setup>
import { RGR_STEPS, BRANCH_LABELS } from '@/data/rgrWorkflow'
import WorkflowStepCard from '@/components/WorkflowStepCard.vue'
import { useDataset } from '@/composables/useDataset'

const { columnHistogram } = useDataset()
const hist = columnHistogram('c15.X1')
</script>

<template>
  <div class="flex flex-col gap-5">
    <header>
      <h1 class="text-2xl font-extrabold text-slate-900">Схема РГР</h1>
      <p class="text-slate-500">
        Все шаги расчётно-графической работы — сверху вниз, от постановки до интерпретации.
      </p>
    </header>

    <div class="flex flex-col gap-4">
      <WorkflowStepCard
        v-for="s in RGR_STEPS"
        :key="s.id"
        :step="s"
        :branch-labels="BRANCH_LABELS"
        :histogram="hist"
        :show-histogram="!!s.datasetRef"
      />
    </div>
  </div>
</template>
