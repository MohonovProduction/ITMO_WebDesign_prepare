<script setup>
const props = defineProps({
  value: { type: Number, default: 0 }, // 0..100
  label: { type: String, default: '' },
  color: { type: String, default: 'brand' }, // brand | emerald | violet | amber
  size: { type: String, default: 'md' }, // sm | md | lg
})

const barColors = {
  brand: 'bg-brand-gradient',
  mint: 'bg-accent-mint',
  sky: 'bg-accent-sky',
  pink: 'bg-accent-pink',
  lavender: 'bg-accent-lavender',
  peach: 'bg-accent-peach',
  amber: 'bg-accent-yellow',
  // обратная совместимость со старыми ключами
  emerald: 'bg-accent-mint',
  violet: 'bg-accent-lavender',
}
const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }
</script>

<template>
  <div class="w-full">
    <div v-if="label" class="mb-1 flex items-center justify-between text-sm">
      <span class="font-medium text-slate-700">{{ label }}</span>
      <span class="tabular-nums font-semibold text-slate-500">{{ Math.round(value) }}%</span>
    </div>
    <div class="w-full overflow-hidden rounded-full bg-slate-200" :class="heights[size]">
      <div
        class="h-full rounded-full transition-all duration-500"
        :class="barColors[color] || barColors.brand"
        :style="{ width: Math.max(0, Math.min(100, value)) + '%' }"
      />
    </div>
  </div>
</template>
