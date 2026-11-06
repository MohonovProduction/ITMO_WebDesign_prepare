import { computed, ref } from 'vue'
import { theory } from '@/data/theory'
import { enrichTheoryItem } from '@/data/theoryEnrichment'

export function useCheatsheet() {
  const query = ref('')
  const activeLevel = ref('all')

  const items = computed(() => {
    let list = theory.map(enrichTheoryItem)
    if (activeLevel.value !== 'all') {
      list = list.filter((t) => t.level === activeLevel.value)
    }
    const q = query.value.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q) ||
          (t.mnemonic || '').toLowerCase().includes(q),
      )
    }
    return list
  })

  return { query, activeLevel, items }
}
