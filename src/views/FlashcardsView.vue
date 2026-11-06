<script setup>
import { computed, ref } from 'vue'
import { useFlashcards } from '@/composables/useFlashcards'
import { DECKS } from '@/data/flashcards'
import { LEVELS } from '@/data/levels'
import Flashcard from '@/components/Flashcard.vue'
import ProgressBar from '@/components/ProgressBar.vue'

const activeDeck = ref('terms')
const formulaLevel = ref(null)
const formulaShuffle = ref(false)

const isFormulasDeck = computed(() => activeDeck.value === 'formulas')

const { current, index, cards, allCards, stats, flipped, statusOf, flip, next, prev, mark, reset, goTo } =
  useFlashcards(activeDeck, {
    levelFilter: formulaLevel,
    shuffled: formulaShuffle,
  })

const pageSubtitle = computed(() =>
  isFormulasDeck.value
    ? 'Смотрите задание, запишите формулу на бумаге, переверните карточку и сверьте с эталоном.'
    : 'Переворачивайте карточку и честно отмечайте «Знаю» / «Не знаю».',
)

function selectDeck(id) {
  activeDeck.value = id
  formulaLevel.value = null
  formulaShuffle.value = false
  goTo(0)
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <header>
      <h1 class="text-2xl font-extrabold text-slate-900">Карточки</h1>
      <p class="text-slate-500">{{ pageSubtitle }}</p>
    </header>

    <div class="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:overflow-visible">
      <button
        v-for="d in DECKS"
        :key="d.id"
        class="flex min-w-[5.5rem] flex-none flex-col items-center gap-0.5 rounded-xl px-2 py-3 text-center transition sm:min-w-0 sm:flex-1"
        :class="activeDeck === d.id ? 'bg-brand-gradient text-slate-800 shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'"
        @click="selectDeck(d.id)"
      >
        <span class="emoji text-xl">{{ d.icon }}</span>
        <span class="text-sm font-semibold">{{ d.title }}</span>
        <span class="text-[11px] opacity-80">{{ d.hint }}</span>
      </button>
    </div>

    <div v-if="isFormulasDeck" class="card flex flex-wrap items-center gap-2 p-4">
      <span class="text-xs font-semibold uppercase tracking-wide text-slate-400">Уровень</span>
      <button
        class="rounded-lg px-3 py-1.5 text-sm font-medium transition"
        :class="formulaLevel === null ? 'bg-brand-gradient text-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        @click="formulaLevel = null"
      >
        Все ({{ allCards.length }})
      </button>
      <button
        v-for="l in LEVELS"
        :key="l.id"
        class="rounded-lg px-3 py-1.5 text-sm font-medium transition"
        :class="formulaLevel === l.id ? 'bg-brand-gradient text-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        @click="formulaLevel = l.id"
      >
        {{ l.icon }} {{ l.title }}
      </button>
      <label class="ml-auto flex cursor-pointer items-center gap-2 text-sm text-slate-600">
        <input v-model="formulaShuffle" type="checkbox" class="rounded border-slate-300" />
        Перемешать
      </label>
    </div>

    <div class="card p-4">
      <ProgressBar :value="stats.percent" label="Изучено в этой колоде" color="emerald" />
      <div class="mt-2 flex justify-between text-xs text-slate-500">
        <span>✓ Знаю: {{ stats.known }}</span>
        <span>↻ Не знаю: {{ stats.unknown }}</span>
        <span>Всего: {{ stats.total }}</span>
      </div>
    </div>

    <div v-if="current">
      <div class="mb-3 flex items-center justify-between text-sm text-slate-500">
        <span>Карточка {{ index + 1 }} из {{ cards.length }}</span>
        <button class="text-rose-500 hover:underline" @click="reset">Сбросить колоду</button>
      </div>

      <Flashcard
        :card="current"
        :flipped="flipped"
        :status="statusOf(current.id)"
        :variant="isFormulasDeck ? 'formulaRecall' : 'default'"
        @flip="flip"
        @know="mark('known')"
        @dontknow="mark('unknown')"
      />

      <div class="mt-4 flex items-center justify-between">
        <button class="btn-secondary" @click="prev">← Назад</button>
        <button class="btn-secondary" @click="flip">Перевернуть</button>
        <button class="btn-secondary" @click="next">Вперёд →</button>
      </div>
    </div>

    <p v-else class="card p-8 text-center text-slate-400">
      {{ isFormulasDeck && formulaLevel ? 'В этом уровне нет карточек.' : 'В этой колоде пока нет карточек.' }}
    </p>
  </div>
</template>
