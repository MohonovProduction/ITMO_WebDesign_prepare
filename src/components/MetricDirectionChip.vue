<script setup>
import MathText from '@/components/MathText.vue'

defineProps({
  direction: { type: String, default: 'context' },
  name: { type: String, default: '' },
  plain: { type: String, default: '' },
})
const labels = { higher: '↑ лучше больше', lower: '↓ лучше меньше', target: '◎ к цели', context: '↔ зависит' }
</script>
<template>
  <span class="inline-flex flex-wrap items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
    <span>{{ labels[direction] || labels.context }}</span>
    <span v-if="name || plain" class="text-slate-500">
      ·
      <MathText v-if="name" :text="name" />
      <template v-if="name && plain"> — </template>
      <MathText v-if="plain" :text="plain" />
    </span>
  </span>
</template>
