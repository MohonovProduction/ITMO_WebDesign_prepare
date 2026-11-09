<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TRACKS } from '@/data/tracks'
import { webTheory } from '@/data/webTheory'
import RichText from '@/components/RichText.vue'
import ChoiceChips from '@/components/ChoiceChips.vue'
import TheoryDiagram from '@/components/TheoryDiagram.vue'
import { useWebProgressStore } from '@/store/webProgress'
import { trainersForTopic } from '@/data/trainers'
import { theoryBranches, theoryForTopic, topicsForTicket } from '@/data/theoryTopics'
import { cssLearning } from '@/data/cssLearning'

const route = useRoute()
const router = useRouter()
const store = useWebProgressStore()
const activeTrack = ref(route.query.track || 'tech')
const query = ref('')
const mode = ref(route.query.track ? 'tickets' : 'topics')
const topicId = ref([...theoryBranches, ...theoryBranches.flatMap(b => b.children)].some(t => t.id === route.query.topic) ? route.query.topic : 'html')
watch(topicId, () => { query.value = '' })
const selectedLeaves = computed(() => theoryBranches.flatMap(b => b.id === topicId.value ? b.children : b.children.filter(c => c.id === topicId.value)))
const learned = computed(() => selectedLeaves.value.every(t => store.learnedTopics.includes(t.id)))
const relatedTrainers = computed(() => trainersForTopic(topicId.value))
watch([topicId, mode, activeTrack], () => router.replace({ query: mode.value === 'topics' ? { topic: topicId.value } : { track: activeTrack.value } }))
const topicLabel = computed(() => [...theoryBranches, ...theoryBranches.flatMap(b => b.children)].find(t => t.id === topicId.value)?.label)
watch([topicId, mode, activeTrack], () => store.rememberActivity(mode.value === 'topics' ? `/theory?topic=${topicId.value}` : `/theory?track=${activeTrack.value}`, mode.value === 'topics' ? topicLabel.value : 'Теория по билетам'), {immediate:true})
const content = computed(() => {
  const data = theoryForTopic(topicId.value)
  const q = query.value.trim().toLowerCase()
  return { concepts: data.concepts.filter(c => `${c.question} ${c.definition}`.toLowerCase().includes(q)), lessons: data.lessons.filter(t => `${t.title} ${t.definition} ${t.answerOutline?.join(' ')}`.toLowerCase().includes(q)) }
})
const reference = computed(() => ({ html: '/semantics', css: '/css', svg: '/svg' })[topicId.value.split('.')[0]])

const items = computed(() => {
  let list = webTheory.filter((topic) => topic.trackId === activeTrack.value)
  const q = query.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.answerPlan.join(' ').toLowerCase().includes(q),
    )
  }
  return list
})

watch(() => route.query.track, (track) => {
  if (TRACKS.some((item) => item.id === track)) { activeTrack.value = track; mode.value = 'tickets' }
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <header>
      <h1 class="text-2xl font-extrabold text-slate-900">Теория</h1>
      <p class="text-slate-500">Изучайте связанные темы или готовьте ответ по экзаменационным вопросам двух блоков.</p>
    </header>

    <ChoiceChips v-model="mode" :options="[{ id: 'topics', label: 'По темам' }, { id: 'tickets', label: 'По билетам' }]" label="Навигация по теории" />
    <template v-if="mode === 'topics'">
      <TheoryDiagram v-model="topicId" />
      <section class="card p-5"><h2 class="text-xl font-bold">{{ topicLabel }}</h2><p class="mt-2 text-sm text-slate-600">Определения связаны с карточками повторения. Материалы конспектов сохраняют принадлежность к экзаменационному блоку.</p><div class="mt-3 flex flex-wrap gap-3"><RouterLink v-if="reference" :to="reference" class="btn-secondary">Интерактивный справочник →</RouterLink><RouterLink v-if="theoryForTopic(topicId).concepts.length" :to="{ path: '/flashcards', query: { topic: topicId } }" class="btn-secondary">Повторить определения →</RouterLink></div></section>
      <section class="card p-5"><div class="flex flex-wrap items-center gap-3"><button class="btn-secondary" :aria-pressed="learned" @click="store.setLearned(selectedLeaves.map(t => t.id), !learned)">{{ learned ? '✓ Разобрал · отметить как неразобранную' : selectedLeaves.length > 1 ? 'Отметить все темы ветви как разобранные' : 'Тему разобрал' }}</button><span class="text-xs text-slate-500">Отметка по вашей оценке, её можно отменить.</span></div><h3 v-if="relatedTrainers.length" class="mt-4 font-semibold">Закрепить тему</h3><div class="mt-3 flex flex-wrap gap-3"><RouterLink v-for="trainer in relatedTrainers" :key="trainer.id" :to="{path:'/trainers',query:{exercise:trainer.id}}" class="btn-secondary">{{ trainer.label }} →</RouterLink></div></section>
      <label class="card p-3 text-sm">Поиск в выбранной теме<input v-model="query" type="search" class="mt-2 w-full rounded-lg border border-slate-300 p-3" placeholder="Термин или объяснение"></label>
      <TransitionGroup name="theory" tag="div" class="flex flex-col gap-3">
        <article v-for="concept in content.concepts" :key="concept.id" class="card p-5">
          <h3 class="font-bold"><RichText :text="concept.question" /></h3><div class="mt-3 text-sm leading-relaxed"><RichText :text="concept.definition" /></div>
          <p class="mt-3 text-xs text-slate-500">{{ cssLearning.some(c => c.id === concept.id) ? 'Дополнительное пояснение · MDN' : 'База курса · ' + [...new Set(concept.examRefs.map(id => id.startsWith('tech') ? 'Блок 1: технология' : 'Блок 2: UX/UI'))].join(' · ') }}</p>
          <a v-if="concept.mdn" :href="concept.mdn" target="_blank" rel="noreferrer" class="mt-3 inline-block text-sm text-brand-700 underline">Подробнее на MDN ↗</a>
        </article>
        <article v-for="lesson in content.lessons" :key="lesson.id" class="card p-5"><p class="mb-2 text-xs text-slate-500">{{ lesson.trackId === 'tech' ? 'Блок 1: технология' : 'Блок 2: UX/UI' }} · вопрос {{ lesson.number }}</p><h3 class="font-bold">{{ lesson.title }}</h3><div class="mt-3 text-sm"><RichText :text="lesson.definition" /></div><ul class="mt-3 list-disc space-y-2 pl-5 text-sm"><li v-for="step in lesson.answerOutline" :key="step"><RichText :text="step" /></li></ul><p v-if="lesson.pitfalls?.length" class="mt-4 font-semibold text-sm">Частые ошибки</p><ul class="mt-2 list-disc space-y-2 pl-5 text-sm"><li v-for="pitfall in lesson.pitfalls" :key="pitfall"><RichText :text="pitfall" /></li></ul></article>
      </TransitionGroup>
      <p v-if="!content.concepts.length && !content.lessons.length" class="card p-5">По этому запросу ничего не найдено.</p>
    </template>
    <template v-else>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="track in TRACKS"
        :key="track.id"
        class="rounded-full px-4 py-2 text-sm font-semibold transition"
        :class="activeTrack === track.id ? 'bg-brand-gradient text-slate-800 shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'"
        @click="activeTrack = track.id"
      >
        {{ track.icon }} {{ track.shortTitle }}
      </button>
    </div>

    <input
      v-model="query"
      type="search"
      placeholder="Поиск по теме или шагу ответа…"
      class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
    />

    <p class="text-sm text-slate-400">Найдено тем: {{ items.length }}</p>

    <div class="flex flex-col gap-3">
      <article v-for="topic in items" :key="topic.id" class="card p-5">
        <div class="flex gap-4">
          <span class="text-lg font-extrabold text-slate-300">{{ topic.number }}</span>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="font-bold text-slate-900">{{ topic.title }}</h2>
              <span class="chip" :class="topic.status === 'ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'">
                {{ topic.status === 'ready' ? 'Тема готова' : 'В плане наполнения' }}
              </span>
            </div>
            <template v-if="topic.status === 'ready'">
              <div class="mt-3 flex flex-wrap gap-2"><RouterLink v-for="related in topicsForTicket(topic.id)" :key="related.id" :to="{path:'/theory',query:{topic:related.id}}" class="btn-secondary" @click="topicId = related.id; mode = 'topics'">Тема: {{ related.label }} →</RouterLink></div>
              <div class="mt-3 text-sm leading-relaxed text-slate-700"><RichText :text="topic.definition" /></div>
              <div class="mt-2 text-sm text-slate-500"><span class="font-semibold text-slate-600">Зачем учить:</span> <RichText :text="topic.why" /></div>
              <details class="mt-4 rounded-xl bg-slate-50 p-4">
                <summary class="cursor-pointer font-semibold text-slate-700">Открыть структуру ответа на билет</summary>
                <ol class="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
                  <li v-for="step in topic.answerOutline" :key="step"><RichText :text="step" /></li>
                </ol>
                <h3 class="mt-4 text-sm font-semibold text-slate-700">Типичные ошибки</h3>
                <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  <li v-for="pitfall in topic.pitfalls" :key="pitfall"><RichText :text="pitfall" /></li>
                </ul>
              </details>
            </template>
            <template v-else>
              <p class="mt-1 text-sm text-slate-500">Карточка ответа будет собрана по этой схеме:</p>
              <ol class="mt-2 flex flex-wrap gap-2">
                <li v-for="step in topic.answerPlan" :key="step" class="chip bg-slate-100 text-slate-600">{{ step }}</li>
              </ol>
            </template>
          </div>
        </div>
      </article>
    </div>

    <p v-if="!items.length" class="card p-8 text-center text-slate-400">
      Ничего не найдено.
    </p>
    </template>
  </div>
</template>
<style scoped>
.theory-enter-active { transition:opacity .2s,transform .2s; }
.theory-enter-from { opacity:0; transform:translateY(6px); }
</style>
