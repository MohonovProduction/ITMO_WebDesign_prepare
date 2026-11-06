<script setup>
import { computed } from 'vue'

const props = defineProps({ text: { type: String, default: '' } })

function inlineParts(value) {
  return value.split(/(`[^`]+`)/g).filter(Boolean).map((part) => ({
    type: part.startsWith('`') && part.endsWith('`') ? 'code' : 'text',
    value: part.startsWith('`') && part.endsWith('`') ? part.slice(1, -1) : part,
  }))
}

const blocks = computed(() => {
  const result = []
  const pattern = /```(?:[\w+-]+)?\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = pattern.exec(props.text)) !== null) {
    if (match.index > lastIndex) result.push({ type: 'text', parts: inlineParts(props.text.slice(lastIndex, match.index)) })
    result.push({ type: 'block', value: match[1].trim() })
    lastIndex = pattern.lastIndex
  }
  if (lastIndex < props.text.length) result.push({ type: 'text', parts: inlineParts(props.text.slice(lastIndex)) })
  return result
})
</script>

<template>
  <template v-for="(block, blockIndex) in blocks" :key="blockIndex">
    <pre v-if="block.type === 'block'" class="my-3 overflow-x-auto rounded-xl bg-slate-900 p-4 text-left font-mono text-sm leading-relaxed text-slate-100"><code>{{ block.value }}</code></pre>
    <template v-else>
      <template v-for="(part, partIndex) in block.parts" :key="partIndex">
        <code v-if="part.type === 'code'" class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.92em] text-slate-800">{{ part.value }}</code>
        <span v-else class="whitespace-pre-line">{{ part.value }}</span>
      </template>
    </template>
  </template>
</template>
