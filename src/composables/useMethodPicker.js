import { ref } from 'vue'
import { methodPickerCases } from '@/data/methodPickerCases'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function useMethodPicker() {
  const current = ref(null)
  const answered = ref(false)
  const chosen = ref(null)

  function pickCase() {
    const pool = shuffle(
      methodPickerCases.filter((c) => c?.id && Array.isArray(c.options) && c.options.length > 0),
    )
    current.value = pool[0] || null
    answered.value = false
    chosen.value = null
  }

  function select(method) {
    if (answered.value || !current.value) return
    chosen.value = method
    answered.value = true
    const correct = current.value.options.find((o) => o.method === method)?.correct ?? false
    return { correct, caseId: current.value.id }
  }

  return { current, answered, chosen, pickCase, select }
}
