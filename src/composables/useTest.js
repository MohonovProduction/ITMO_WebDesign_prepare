import { computed, reactive, ref } from 'vue'
import { questions } from '@/data/questions'

const SESSION_KEY = 'mathstat_last_test_ids'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function normalizeType(q) {
  return q.type || 'mcq'
}

function getLastSessionIds() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveSessionIds(ids) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(ids))
  } catch { /* ignore */ }
}

function buildStratifiedPool(pool, count, { stratifyByTheory = false, types = null } = {}) {
  let filtered = pool
  if (types && types.length) {
    filtered = filtered.filter((q) => types.includes(normalizeType(q)))
  }
  const lastIds = new Set(getLastSessionIds())
  filtered = filtered.filter((q) => !lastIds.has(q.id))

  const relation = filtered.filter((q) => normalizeType(q) === 'relation')
  const rest = filtered.filter((q) => normalizeType(q) !== 'relation')
  const picked = []
  const usedTheory = new Set()

  if (relation.length) {
    const r = relation[Math.floor(Math.random() * relation.length)]
    picked.push(r)
    if (r.theoryId) usedTheory.add(r.theoryId)
  }

  const bag = shuffle([...rest, ...relation.filter((q) => !picked.includes(q))])
  for (const q of bag) {
    if (picked.length >= count) break
    if (stratifyByTheory && q.theoryId && usedTheory.has(q.theoryId)) continue
    if (picked.some((p) => p.id === q.id)) continue
    picked.push(q)
    if (q.theoryId) usedTheory.add(q.theoryId)
  }

  if (picked.length < count) {
    for (const q of shuffle(pool)) {
      if (picked.length >= count) break
      if (!picked.some((p) => p.id === q.id)) picked.push(q)
    }
  }

  return picked.slice(0, count)
}

/**
 * Универсальный движок тестирования.
 * Новые опции: stratifyByTheory, types, excludeIds
 */
export function useTest(options = {}) {
  const {
    levelId = null,
    count = 5,
    instant = true,
    lockBack = false,
    onlyIds = null,
    stratifyByTheory = false,
    types = null,
    excludeIds = [],
  } = options

  function buildPool() {
    let pool = questions
    if (onlyIds && onlyIds.length) {
      pool = questions.filter((q) => onlyIds.includes(q.id))
    } else if (levelId) {
      pool = questions.filter((q) => q.level === levelId)
    }
    if (excludeIds.length) {
      pool = pool.filter((q) => !excludeIds.includes(q.id))
    }
    if (stratifyByTheory || types) {
      return buildStratifiedPool(pool, Math.min(count, pool.length), { stratifyByTheory, types })
    }
    return shuffle(pool).slice(0, Math.min(count, pool.length))
  }

  const items = ref(buildPool())
  const index = ref(0)
  const answers = reactive({})
  const finished = ref(false)
  const revealed = ref(false)

  const current = computed(() => items.value[index.value] || null)
  const total = computed(() => items.value.length)
  const answeredCount = computed(() => Object.keys(answers).length)
  const correctCount = computed(() => Object.values(answers).filter((a) => a.correct).length)
  const percent = computed(() => (total.value ? Math.round((correctCount.value / total.value) * 100) : 0))
  const wrongIds = computed(() =>
    Object.entries(answers)
      .filter(([, a]) => !a.correct)
      .map(([id]) => Number(id)),
  )

  const isAnswered = (q) => q && answers[q.id] !== undefined
  const canGoBack = computed(() => !lockBack && index.value > 0)
  const isLast = computed(() => index.value >= total.value - 1)

  function answer(choiceIndex) {
    const q = current.value
    if (!q || answers[q.id] !== undefined) return
    const correct = choiceIndex === q.answer
    answers[q.id] = { choice: choiceIndex, correct }
    if (instant) revealed.value = true
  }

  function next() {
    revealed.value = false
    if (index.value < total.value - 1) index.value += 1
    else finished.value = true
  }

  function prev() {
    if (canGoBack.value) {
      index.value -= 1
      revealed.value = instant && isAnswered(current.value)
    }
  }

  function finish() {
    finished.value = true
    saveSessionIds(items.value.map((q) => q.id))
  }

  function restart(newOptions = {}) {
    Object.assign(options, newOptions)
    items.value = buildPool()
    index.value = 0
    Object.keys(answers).forEach((k) => delete answers[k])
    finished.value = false
    revealed.value = false
  }

  return {
    items,
    index,
    answers,
    finished,
    revealed,
    current,
    total,
    answeredCount,
    correctCount,
    percent,
    wrongIds,
    canGoBack,
    isLast,
    isAnswered,
    answer,
    next,
    prev,
    finish,
    restart,
  }
}
