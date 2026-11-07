<script setup>
defineProps({ modelValue: { type: String, required: true }, options: { type: Array, required: true }, label: { type: String, required: true } })
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <div role="group" :aria-label="label" class="flex flex-wrap gap-2">
    <button v-for="option in options" :key="option.id" type="button" :aria-pressed="modelValue === option.id" class="min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition-colors" :class="modelValue === option.id ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50'" @click="emit('update:modelValue', option.id)">{{ option.label }}</button>
  </div>
</template>
