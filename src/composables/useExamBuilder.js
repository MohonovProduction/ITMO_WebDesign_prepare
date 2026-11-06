import { ref } from 'vue'
import { theory } from '@/data/theory'
import { enrichTheoryItem } from '@/data/theoryEnrichment'
import { isGenericThinkingItem } from '@/data/tanchenkoGeneric'
import { tanchenkoThinkingPool } from '@/data/tanchenkoPool'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function poolItemToExam(item) {
  const base = theory.find((t) => t.id === item.theoryId)
  if (!base) return { ...item, id: item.theoryId, title: 'Вопрос' }
  const enriched = enrichTheoryItem(base)
  return {
    ...enriched,
    thinkingPrompt: item.thinkingPrompt,
    modelAnswer: item.modelAnswer,
  }
}

export function useExamBuilder() {
  const phase = ref(0)
  const defItems = ref([])
  const thinkItems = ref([])
  const defScores = ref([])
  const thinkScores = ref([])

  function start() {
    const enriched = theory.map(enrichTheoryItem)
    const forDef = shuffle(enriched.filter((t) => t.examRole === 'definition' || t.examRole === 'both'))
    let forThink = shuffle(
      enriched.filter(
        (t) =>
          (t.examRole === 'thinking' || t.examRole === 'both') &&
          t.thinkingPrompt &&
          !isGenericThinkingItem(t),
      ),
    )

    defItems.value = forDef.slice(0, 2)
    if (defItems.value.length < 2) {
      defItems.value = shuffle(enriched).slice(0, 2)
    }

    thinkItems.value = forThink.slice(0, 2)
    if (thinkItems.value.length < 2) {
      const fromPool = shuffle(tanchenkoThinkingPool).map(poolItemToExam)
      thinkItems.value = fromPool.slice(0, 2)
    } else if (thinkItems.value.length === 1) {
      const extra = shuffle(tanchenkoThinkingPool).map(poolItemToExam)[0]
      if (extra) thinkItems.value.push(extra)
    }

    defScores.value = []
    thinkScores.value = []
    phase.value = 0
  }

  const totalPhases = 4
  const currentDef = () => defItems.value[phase.value] || null
  const currentThink = () => thinkItems.value[phase.value - 2] || null

  function submitDefScore(score) {
    defScores.value.push(score)
    phase.value += 1
  }

  function submitThinkScore(score) {
    thinkScores.value.push(score)
    phase.value += 1
  }

  const finished = () => phase.value >= totalPhases

  return {
    phase,
    totalPhases,
    defItems,
    thinkItems,
    defScores,
    thinkScores,
    start,
    currentDef,
    currentThink,
    submitDefScore,
    submitThinkScore,
    finished,
  }
}
