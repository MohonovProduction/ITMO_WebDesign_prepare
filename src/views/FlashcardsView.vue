<script setup>
import { computed, ref, watch } from 'vue'
import Flashcard from '@/components/Flashcard.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import { WEB_DECKS, cardsByDeck } from '@/data/webFlashcards'

const STORAGE_KEY = 'webdesign_flashcards_v1'
const activeDeck = ref('semantic')
const index = ref(0)
const flipped = ref(false)
const marks = ref(loadMarks())

function loadMarks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} } catch { return {} }
}

const cards = computed(() => cardsByDeck(activeDeck.value))
const current = computed(() => cards.value[index.value] || null)
const stats = computed(() => {
  const list = cards.value
  const known = list.filter((item) => marks.value[item.id] === 'known').length
  const unknown = list.filter((item) => marks.value[item.id] === 'unknown').length
  return { total: list.length, known, unknown, percent: list.length ? Math.round((known / list.length) * 100) : 0 }
})

function saveMarks() { localStorage.setItem(STORAGE_KEY, JSON.stringify(marks.value)) }
function selectDeck(id) { activeDeck.value = id }
function go(delta) {
  const total = cards.value.length
  if (!total) return
  index.value = (index.value + delta + total) % total
  flipped.value = false
}
function mark(status) {
  if (!current.value) return
  marks.value = { ...marks.value, [current.value.id]: status }
  saveMarks()
  if (index.value < cards.value.length - 1) go(1)
  else flipped.value = false
}
function resetDeck() {
  const next = { ...marks.value }
  cards.value.forEach((item) => delete next[item.id])
  marks.value = next
  saveMarks()
  index.value = 0
  flipped.value = false
}

watch(activeDeck, () => { index.value = 0; flipped.value = false })
</script>

<template>
  <div class="flex flex-col gap-5">
    <header>
      <h1 class="text-2xl font-extrabold text-slate-900">Карточки</h1>
      <p class="text-slate-500">Термин → объяснение → связь с экзаменационным вопросом. Отмечайте то, что нужно повторить.</p>
    </header>

    <div class="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible">
      <button v-for="deck in WEB_DECKS" :key="deck.id" class="flex min-w-[9rem] flex-none flex-col items-center gap-0.5 rounded-xl px-3 py-3 text-center transition sm:min-w-0" :class="activeDeck === deck.id ? 'bg-brand-gradient text-slate-800 shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'" @click="selectDeck(deck.id)">
        <span class="emoji text-xl">{{ deck.icon }}</span>
        <span class="text-sm font-semibold">{{ deck.title }}</span>
        <span class="text-[11px] opacity-80">{{ deck.hint }}</span>
      </button>
    </div>

    <div class="card p-4">
      <ProgressBar :value="stats.percent" label="Уверенно знаю" color="emerald" />
      <div class="mt-2 flex justify-between text-xs text-slate-500">
        <span>✓ Знаю: {{ stats.known }}</span><span>↻ Повторить: {{ stats.unknown }}</span><span>Всего: {{ stats.total }}</span>
      </div>
    </div>

    <div v-if="current">
      <div class="mb-3 flex items-center justify-between text-sm text-slate-500">
        <span>Карточка {{ index + 1 }} из {{ cards.length }}</span>
        <button class="text-rose-500 hover:underline" @click="resetDeck">Сбросить колоду</button>
      </div>
      <Flashcard :card="current" :flipped="flipped" :status="marks[current.id] || null" @flip="flipped = !flipped" @know="mark('known')" @dontknow="mark('unknown')" />
      <p class="mt-4 text-center text-xs text-slate-400">Связанные вопросы: {{ current.examRefs.map((id) => id.replace('-', ' №')).join(', ') }}</p>
      <div class="mt-3 flex items-center justify-between">
        <button class="btn-secondary" @click="go(-1)">← Назад</button><button class="btn-secondary" @click="flipped = !flipped">Перевернуть</button><button class="btn-secondary" @click="go(1)">Вперёд →</button>
      </div>
    </div>
  </div>
</template>
