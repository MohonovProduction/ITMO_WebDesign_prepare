import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProgressStore } from '@/store/progress'
import { flashcards } from '@/data/flashcards'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function filterByLevel(list, levelId) {
  if (!levelId) return list
  return list.filter((c) => c.level === levelId)
}

/**
 * Логика работы с колодой карточек выбранного режима (deck).
 * deckRef — ref со строкой id колоды.
 * options.levelFilter — ref с id уровня или null (все).
 * options.shuffled — ref boolean (перемешать порядок).
 */
export function useFlashcards(deckRef, options = {}) {
  const store = useProgressStore()
  const { flashcards: marks } = storeToRefs(store)

  const index = ref(0)
  const flipped = ref(false)

  const levelFilter = options.levelFilter
  const shuffled = options.shuffled

  const deck = computed(() => deckRef.value)
  const allCards = computed(() => flashcards[deck.value] || [])

  const filteredCards = computed(() =>
    filterByLevel(allCards.value, levelFilter?.value ?? null),
  )

  const shuffledOrder = ref([])

  function applyShuffle() {
    const base = filteredCards.value
    shuffledOrder.value = shuffled?.value ? shuffleArray(base) : base
  }

  const cards = computed(() => shuffledOrder.value)

  watch(
    [deck, filteredCards, () => shuffled?.value],
    () => {
      applyShuffle()
    },
    { immediate: true },
  )

  const current = computed(() => cards.value[index.value] || null)

  const stats = computed(() => store.cardStats(deck.value))

  const statusOf = (cardId) => marks.value[deck.value]?.[cardId] || null

  function flip() {
    flipped.value = !flipped.value
  }

  function go(delta) {
    const len = cards.value.length
    if (!len) return
    index.value = (index.value + delta + len) % len
    flipped.value = false
  }

  function next() {
    go(1)
  }
  function prev() {
    go(-1)
  }

  function mark(status) {
    if (!current.value) return
    store.markCard(deck.value, current.value.id, status)
    if (index.value < cards.value.length - 1) next()
    else flipped.value = false
  }

  function reset() {
    store.resetDeck(deck.value)
    index.value = 0
    flipped.value = false
  }

  function goTo(i) {
    if (i >= 0 && i < cards.value.length) {
      index.value = i
      flipped.value = false
    }
  }

  watch([deck, () => levelFilter?.value, () => shuffled?.value], () => {
    index.value = 0
    flipped.value = false
  })

  return {
    index,
    flipped,
    cards,
    allCards,
    current,
    stats,
    statusOf,
    flip,
    next,
    prev,
    mark,
    reset,
    goTo,
  }
}
