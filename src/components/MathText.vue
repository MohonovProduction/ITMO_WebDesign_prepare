<script setup>
import { computed } from 'vue'
import katex from 'katex'

/**
 * Рендерит строку, в которой обычный текст перемешан с inline-формулами,
 * заключёнными в $...$. Например: "Среднее $\\bar X$ оценивает $\\mu$".
 */
const props = defineProps({
  text: { type: String, default: '' },
})

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const html = computed(() => {
  const parts = String(props.text).split('$')
  let out = ''
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      // нечётные сегменты — это формулы между знаками $
      try {
        out += katex.renderToString(part, {
          displayMode: false,
          throwOnError: false,
          strict: false,
        })
      } catch (e) {
        out += escapeHtml(part)
      }
    } else {
      out += escapeHtml(part)
    }
  })
  return out
})
</script>

<template>
  <span v-html="html" />
</template>
