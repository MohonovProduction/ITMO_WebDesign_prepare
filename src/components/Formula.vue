<script setup>
import { computed } from 'vue'
import katex from 'katex'

const props = defineProps({
  expr: { type: String, required: true },
  display: { type: Boolean, default: true },
})

const html = computed(() => {
  try {
    return katex.renderToString(props.expr, {
      displayMode: props.display,
      throwOnError: false,
      strict: false,
    })
  } catch (e) {
    return props.expr
  }
})
</script>

<template>
  <div v-if="display" class="overflow-x-auto py-1" v-html="html" />
  <span v-else v-html="html" />
</template>
