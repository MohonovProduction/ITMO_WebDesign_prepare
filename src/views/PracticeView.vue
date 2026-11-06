<script setup>
import { computed, ref } from 'vue'
import { webTheory } from '@/data/webTheory'
import { TRACKS } from '@/data/tracks'

const STORAGE_KEY = 'webdesign_practice_v1'
const mode = ref('mixed')
const singleTrack = ref('tech')
const revealed = ref(false)
const ratings = ref({ terminology: false, logic: false, example: false, relation: false })
const history = ref(loadHistory())
const ticket = ref(makeTicket())

const readyTopics = computed(() => webTheory.filter((topic) => topic.status === 'ready'))
const criteria = [
  { id: 'terminology', title: 'Терминология', text: 'Дал точное определение и не спутал ключевые понятия.' },
  { id: 'logic', title: 'Логика', text: 'Объяснил ход процесса или устройство темы, а не только перечислил термины.' },
  { id: 'example', title: 'Пример', text: 'Привёл уместный пример, сценарий или практическое следствие.' },
  { id: 'relation', title: 'Связи', text: 'Связал тему с продуктом, пользователем или соседними вопросами.' },
]

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

function randomTopic(trackId) {
  const list = readyTopics.value.filter((topic) => topic.trackId === trackId)
  return list[Math.floor(Math.random() * list.length)]
}

function makeTicket() {
  const ready = webTheory.filter((topic) => topic.status === 'ready')
  const fromTrack = (trackId) => {
    const list = ready.filter((topic) => topic.trackId === trackId)
    return list[Math.floor(Math.random() * list.length)]
  }
  return mode.value === 'mixed' ? [fromTrack('tech'), fromTrack('ux')] : [fromTrack(singleTrack.value)]
}

function newTicket() {
  ticket.value = makeTicket()
  revealed.value = false
  ratings.value = { terminology: false, logic: false, example: false, relation: false }
}

function toggleRating(id) {
  ratings.value = { ...ratings.value, [id]: !ratings.value[id] }
}

const score = computed(() => Object.values(ratings.value).filter(Boolean).length)
const attempts = computed(() => history.value.length)
const average = computed(() => attempts.value ? Math.round((history.value.reduce((sum, item) => sum + item.score, 0) / attempts.value) * 25) : 0)

function saveAttempt() {
  const item = {
    at: Date.now(),
    score: score.value,
    topics: ticket.value.map((topic) => topic.id),
  }
  history.value = [item, ...history.value].slice(0, 20)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
}

function trackTitle(id) { return TRACKS.find((track) => track.id === id)?.shortTitle || id }
</script>

<template>
  <div class="flex flex-col gap-5">
    <header>
      <h1 class="text-2xl font-extrabold text-slate-900">Тренировка ответа</h1>
      <p class="mt-1 text-slate-500">Сначала проговорите ответ самостоятельно, затем откройте опорный план и оцените себя.</p>
    </header>

    <section class="card flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold text-slate-500">Режим билета</p>
        <div class="mt-2 flex flex-wrap gap-2">
          <button class="rounded-lg px-3 py-2 text-sm font-semibold" :class="mode === 'mixed' ? 'bg-brand-gradient text-slate-800' : 'bg-slate-100 text-slate-600'" @click="mode = 'mixed'; newTicket()">Смешанный: 2 вопроса</button>
          <button class="rounded-lg px-3 py-2 text-sm font-semibold" :class="mode === 'single' ? 'bg-brand-gradient text-slate-800' : 'bg-slate-100 text-slate-600'" @click="mode = 'single'; newTicket()">Один блок</button>
        </div>
        <div v-if="mode === 'single'" class="mt-3 flex gap-2">
          <button v-for="track in TRACKS" :key="track.id" class="rounded-lg px-3 py-1.5 text-sm" :class="singleTrack === track.id ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'" @click="singleTrack = track.id; newTicket()">{{ track.icon }} {{ track.shortTitle }}</button>
        </div>
      </div>
      <button class="btn-primary" @click="newTicket">Новый билет ↻</button>
    </section>

    <section class="grid gap-4 sm:grid-cols-2">
      <div class="card p-4"><p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Сохранено попыток</p><p class="mt-1 text-2xl font-extrabold text-slate-800">{{ attempts }}</p></div>
      <div class="card p-4"><p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Средняя самооценка</p><p class="mt-1 text-2xl font-extrabold text-slate-800">{{ average }}%</p></div>
    </section>

    <section v-for="(topic, ticketIndex) in ticket" :key="topic.id" class="card overflow-hidden">
      <div class="border-b border-slate-100 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-500">Вопрос {{ ticketIndex + 1 }} · {{ trackTitle(topic.trackId) }}</div>
      <div class="p-5">
        <h2 class="text-xl font-extrabold leading-snug text-slate-900">{{ topic.number }}. {{ topic.title }}</h2>
        <p class="mt-3 text-sm text-slate-500">Постарайтесь назвать определение, объяснить процесс, привести пример и связать тему с продуктом.</p>
        <button class="btn-secondary mt-5" @click="revealed = !revealed">{{ revealed ? 'Скрыть опорный план' : 'Открыть опорный план' }}</button>

        <div v-if="revealed" class="mt-5 rounded-xl bg-brand-50 p-4">
          <p class="font-semibold text-slate-800">Ключевая мысль</p>
          <p class="mt-1 text-sm leading-relaxed text-slate-700">{{ topic.definition }}</p>
          <ol class="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
            <li v-for="step in topic.answerOutline" :key="step">{{ step }}</li>
          </ol>
          <p class="mt-4 text-sm text-slate-600"><span class="font-semibold">Типичная ошибка:</span> {{ topic.pitfalls[0] }}</p>
        </div>
      </div>
    </section>

    <section class="card p-5">
      <h2 class="text-lg font-extrabold text-slate-900">Самопроверка</h2>
      <p class="mt-1 text-sm text-slate-500">Оцените ответ целиком: в смешанном билете — оба вопроса.</p>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <button v-for="criterion in criteria" :key="criterion.id" class="rounded-xl border p-4 text-left transition" :class="ratings[criterion.id] ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white hover:bg-slate-50'" @click="toggleRating(criterion.id)">
          <span class="font-semibold text-slate-800">{{ ratings[criterion.id] ? '✓ ' : '' }}{{ criterion.title }}</span>
          <span class="mt-1 block text-sm text-slate-500">{{ criterion.text }}</span>
        </button>
      </div>
      <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p class="font-semibold text-slate-700">Результат: {{ score }} / {{ criteria.length }}</p>
        <button class="btn-primary" @click="saveAttempt">Сохранить попытку</button>
      </div>
    </section>
  </div>
</template>
