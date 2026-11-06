<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Object, required: true },
  label: { type: String, default: '' },
})
const maxDensity = computed(() => Math.max(...(props.data.bins?.map((b) => b.density) || [1]), 0.001))
</script>
<template>
  <div class="w-full">
    <p v-if="label" class="mb-1 text-xs text-slate-500">{{ label }}</p>
    <svg viewBox="0 0 100 40" class="h-32 w-full" preserveAspectRatio="none" role="img">
      <rect
        v-for="(b, i) in data.bins"
        :key="i"
        :x="(i / data.bins.length) * 100"
        :y="40 - (b.density / maxDensity) * 36"
        :width="100 / data.bins.length - 0.5"
        :height="(b.density / maxDensity) * 36"
        class="fill-brand-400 opacity-80"
        rx="0.5"
      />
    </svg>
  </div>
</template>
