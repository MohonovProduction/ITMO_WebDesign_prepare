import { nextTick, ref } from 'vue'
import { theory } from '@/data/theory'
import { enrichTheoryItem } from '@/data/theoryEnrichment'
import { compactItemsFromTheory } from '@/data/cheatsheetCompact'

export function useCheatsheetPrint(getFullItems) {
  const printMode = ref(null)
  const printItems = ref([])

  async function triggerPrint(mode) {
    if (mode === 'compact') {
      const enriched = theory.map(enrichTheoryItem)
      printItems.value = compactItemsFromTheory(enriched).map((c) => ({
        id: c.theoryId,
        title: c.title,
        formulas: c.lines,
        mnemonic: c.mnemonic,
      }))
    } else {
      printItems.value = getFullItems().map((t) => ({
        id: t.id,
        title: t.title,
        definition: t.definition,
        formulas: t.formulas || [],
        mnemonic: t.mnemonic || '',
      }))
    }
    printMode.value = mode
    await nextTick()
    const bodyClass = mode === 'compact' ? 'printing-cheatsheet-compact' : 'printing-cheatsheet-full'
    document.body.classList.add(bodyClass)
    await new Promise((resolve) => {
      const cleanup = () => {
        document.body.classList.remove('printing-cheatsheet-compact', 'printing-cheatsheet-full')
        printMode.value = null
        window.removeEventListener('afterprint', cleanup)
        resolve()
      }
      window.addEventListener('afterprint', cleanup)
      window.print()
      setTimeout(cleanup, 2000)
    })
  }

  return { printMode, printItems, triggerPrint }
}
