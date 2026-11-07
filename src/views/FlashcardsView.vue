<script setup>
import { computed, ref, watch } from 'vue'
import ChoiceChips from '@/components/ChoiceChips.vue'
import Flashcard from '@/components/Flashcard.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import { WEB_DECKS, cardsByDeck, webFlashcards } from '@/data/webFlashcards'
import { matchesTopic, topicBranches } from '@/data/topics'
import TopicTree from '@/components/TopicTree.vue'
import ResponsiveControls from '@/components/ResponsiveControls.vue'
import { useWebProgressStore } from '@/store/webProgress'

const store = useWebProgressStore()
const session = store.cardSession
const activeDeck = ref(session?.deck === 'all' || WEB_DECKS.some(deck => deck.id === session?.deck) ? session.deck : 'semantic')
const topic = ref(session?.topicId || (activeDeck.value === 'semantic' ? 'html' : activeDeck.value === 'definitions' ? 'ux' : activeDeck.value))
const topicLabel = computed(() => [ ...topicBranches, ...topicBranches.flatMap(branch => branch.children) ].find(item => item.id === topic.value)?.label || 'Все темы')
const filter = ref(session?.filter || 'all')
const index = ref(0)
const flipped = ref(false)
const marks = computed(() => store.marks)

const allCards = computed(() => (activeDeck.value === 'all' ? webFlashcards : cardsByDeck(activeDeck.value)).filter(card => matchesTopic(card, topic.value)))
const cards = computed(() => allCards.value.filter(card => filter.value === 'all' || (filter.value === 'unknown' ? marks.value[card.id] === 'unknown' : !marks.value[card.id])))
index.value = Math.max(0, cards.value.findIndex(card => card.id === session?.cardId))
const current = computed(() => cards.value[index.value] || null)
const stats = computed(() => {
  const list = allCards.value
  const known = list.filter((item) => marks.value[item.id] === 'known').length
  const unknown = list.filter((item) => marks.value[item.id] === 'unknown').length
  return { total: list.length, known, unknown, percent: list.length ? Math.round((known / list.length) * 100) : 0 }
})

function selectDeck(id) { activeDeck.value = id; topic.value = id === 'semantic' ? 'html' : id === 'definitions' ? 'ux' : id }
function selectTopic(id) {
  topic.value = id
  activeDeck.value = topicBranches.find(branch => id === branch.id || id.startsWith(`${branch.id}.`))?.deck || 'all'
}
function go(delta) {
  const total = cards.value.length
  if (!total) return
  index.value = (index.value + delta + total) % total
  flipped.value = false
}
function mark(status) {
  if (!current.value) return
  const oldIndex = index.value
  store.markCard(current.value.id, status)
  if (filter.value === 'all' || (filter.value === 'unknown' && status === 'unknown')) go(1)
  else { index.value = Math.min(oldIndex, Math.max(0, cards.value.length - 1)); flipped.value = false }
}
function resetDeck() {
  store.resetCards(allCards.value.map(item => item.id))
  index.value = 0
  flipped.value = false
}

watch(activeDeck, () => { index.value = 0; flipped.value = false })
watch(filter, () => { index.value = 0; flipped.value = false })
watch(topic, () => { index.value = 0; flipped.value = false })
watch([activeDeck, topic, filter, () => current.value?.id], () => {
  store.saveCardSession({ deck: activeDeck.value, topicId: topic.value, filter: filter.value, cardId: current.value?.id || null })
}, { flush: 'post' })
</script>

<template>
  <div class="flex flex-col gap-5">
    <header>
      <h1 class="text-2xl font-extrabold text-slate-900">Карточки</h1>
      <p class="text-slate-500">Термин → объяснение → связь с экзаменационным вопросом. Отмечайте то, что нужно повторить.</p>
    </header>

    <div class="study-layout">
    <aside class="topic-panel"><ResponsiveControls title="Дерево тем" trigger-label="Выбрать тему"><div class="card p-4"><h2 class="mb-3 font-semibold">Дерево тем</h2><TopicTree :model-value="topic" @update:model-value="selectTopic" /></div></ResponsiveControls></aside>
    <div class="min-w-0 flex flex-col gap-5">
    <div class="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible">
      <button v-for="deck in WEB_DECKS" :key="deck.id" class="flex min-w-[9rem] flex-none flex-col items-center gap-0.5 rounded-xl px-3 py-3 text-center transition sm:min-w-0" :class="activeDeck === deck.id ? 'bg-brand-gradient text-slate-800 shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'" @click="selectDeck(deck.id)">
        <span class="emoji text-xl">{{ deck.icon }}</span>
        <span class="text-sm font-semibold">{{ deck.title }}</span>
        <span class="text-[11px] opacity-80">{{ deck.hint }}</span>
      </button>
    </div>

    <ChoiceChips v-model="filter" :options="[{ id: 'all', label: 'Все карточки' }, { id: 'unknown', label: 'Повторить незнакомые' }, { id: 'new', label: 'Ещё не изучены' }]" label="Режим повторения" />
    <p role="status" class="flex flex-wrap items-center gap-3 text-sm text-slate-600">Тема: {{ topicLabel }} · {{ cards.length }} карточек <button v-if="topic !== 'all'" class="underline" @click="selectTopic('all')">Сбросить тему</button></p>
    <p v-if="session" class="text-sm text-slate-500">Занятие продолжено с сохранённого места.</p>
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
    <div v-else class="card p-6 text-center" role="status">
      <p>{{ filter === 'unknown' ? 'В этой колоде нет карточек для повторения.' : 'Все карточки этой колоды уже просмотрены.' }}</p>
      <button class="btn-secondary mt-4" @click="filter = 'all'">Открыть все карточки</button>
    </div>
    </div></div>
  </div>
</template>

<style scoped>
.study-layout{display:grid;gap:24px}.topic-panel{min-width:0}@media(min-width:1024px){.study-layout{grid-template-columns:250px minmax(0,1fr)}.topic-panel{align-self:start;position:sticky;top:96px;max-height:calc(100dvh - 112px);overflow:auto}}
</style>
