<script setup>
import { computed } from 'vue'
import { TRACKS } from '@/data/tracks'
import { theoryBranches, theoryForTopic } from '@/data/theoryTopics'
import { webFlashcards } from '@/data/webFlashcards'
import { exerciseIds, trainersForTopic } from '@/data/trainers'
import { learningStats } from '@/utils/learningStats'
import { useWebProgressStore } from '@/store/webProgress'
const store = useWebProgressStore()
const leaves = theoryBranches.flatMap(b => b.children)
const stats = computed(() => learningStats(store, webFlashcards, leaves.map(t => t.id), exerciseIds))
const nextTopic = computed(() => leaves.find(t => !store.learnedTopics.includes(t.id)))
const resume = computed(() => store.lastActivity || {path:'/theory',label:'Начать с теории'})
const percent = (value,total) => total ? Math.round(value/total*100) : 0
</script>
<template>
  <div class="flex flex-col gap-6">
    <section class="card overflow-hidden"><div class="p-6 sm:p-8" style="background:var(--study-gradient)"><p class="text-xs font-bold uppercase tracking-widest">ИТМО · веб-проектирование</p><h1 class="mt-2 text-3xl font-extrabold">Ваше обучение</h1><p class="mt-2 text-sm">Теория, примеры и практика — в одном маршруте.</p><RouterLink :to="resume.path" class="btn-secondary mt-5">{{ store.lastActivity ? 'Вернуться: ' : '' }}{{ resume.label }} →</RouterLink></div></section>
    <section aria-label="Прогресс обучения" class="grid gap-4 sm:grid-cols-3">
      <article class="card p-5"><h2 class="font-bold">Теория</h2><p class="my-3 text-3xl font-extrabold">{{ stats.learned }} <span class="text-base font-normal text-slate-500">/ {{ leaves.length }} тем</span></p><progress :value="stats.learned" :max="leaves.length" aria-label="Темы, отмеченные как разобранные" class="w-full accent-brand-600"/><p class="mt-2 text-xs text-slate-500">{{ percent(stats.learned, leaves.length) }}% · ваша отметка «Разобрал»</p><RouterLink to="/theory" class="mt-3 inline-block text-sm underline">Изучать темы →</RouterLink></article>
      <article class="card p-5"><h2 class="font-bold">Карточки</h2><p class="my-3 text-3xl font-extrabold">{{ stats.known }} <span class="text-base font-normal text-slate-500">/ {{ webFlashcards.length }} знаю</span></p><progress :value="stats.known" :max="webFlashcards.length" aria-label="Известные карточки" class="w-full accent-brand-600"/><p class="mt-2 text-xs text-slate-500">Повторить: {{ stats.unknown }} · новые: {{ stats.newCards }}</p><RouterLink to="/flashcards" class="mt-3 inline-block text-sm underline">Повторить →</RouterLink></article>
      <article class="card p-5"><h2 class="font-bold">Упражнения</h2><p class="my-3 text-3xl font-extrabold">{{ stats.mastered }} <span class="text-base font-normal text-slate-500">/ {{ exerciseIds.length }} решено</span></p><progress :value="stats.mastered" :max="exerciseIds.length" aria-label="Упражнения с верным решением" class="w-full accent-brand-600"/><p class="mt-2 text-xs text-slate-500">{{ stats.accuracy === null ? 'Пока нет ответов' : `Точность: ${stats.accuracy}% · ответов: ${stats.attempts}` }}</p><RouterLink to="/trainers" class="mt-3 inline-block text-sm underline">Тренироваться →</RouterLink></article>
    </section>
    <p class="text-xs text-slate-600">Решено — хотя бы один верный ответ на задание. Точность учитывает все проверки, включая повторные. Выбор и ввод селектора считаются отдельно. Прогресс хранится в этом браузере.</p>
    <section v-if="stats.unknown || nextTopic" class="card p-5"><h2 class="text-lg font-bold">Следующий шаг</h2><div class="mt-3 flex flex-wrap gap-3"><RouterLink v-if="stats.unknown" to="/flashcards?filter=unknown" class="btn-primary">Повторить незнакомые · {{ stats.unknown }}</RouterLink><RouterLink v-if="nextTopic" :to="{path:'/theory',query:{topic:nextTopic.id}}" class="btn-secondary">Разобраться: {{ nextTopic.label }} →</RouterLink></div></section>
    <section><h2 class="mb-4 text-xl font-bold">Что изучаем</h2><div class="grid gap-4 sm:grid-cols-2"><article v-for="branch in theoryBranches" :key="branch.id" class="card p-5"><h3 class="text-lg font-bold">{{ branch.label }}</h3><p class="mt-2 text-sm text-slate-500">Разобрано {{ branch.children.filter(t => store.learnedTopics.includes(t.id)).length }} из {{ branch.children.length }} тем</p><div class="mt-4 flex flex-wrap gap-3"><RouterLink :to="{path:'/theory',query:{topic:branch.id}}" class="btn-secondary">Теория</RouterLink><RouterLink v-if="theoryForTopic(branch.id).concepts.length" :to="{path:'/flashcards',query:{topic:branch.id}}" class="btn-secondary">Карточки</RouterLink><RouterLink v-if="trainersForTopic(branch.id).length" :to="{path:'/trainers',query:{topic:branch.id}}" class="btn-secondary">Практика</RouterLink></div></article></div></section>
    <section class="card p-5"><h2 class="text-lg font-bold">Подготовка по билетам</h2><div class="mt-4 flex flex-wrap gap-3"><RouterLink v-for="track in TRACKS" :key="track.id" :to="{path:'/theory',query:{track:track.id}}" class="btn-secondary">{{ track.title }}</RouterLink><RouterLink to="/practice" class="btn-secondary">Проговорить ответ</RouterLink></div><p class="mt-3 text-xs text-slate-500">Сохранено тренировок ответа: {{ store.attempts.length }} · дней подготовки: {{ store.prepDays.length }}</p></section>
    <section class="card p-5"><h2 class="text-lg font-bold">Интерактивные справочники</h2><div class="mt-4 flex flex-wrap gap-3"><RouterLink to="/semantics" class="btn-secondary">HTML</RouterLink><RouterLink to="/css" class="btn-secondary">CSS</RouterLink><RouterLink to="/svg" class="btn-secondary">SVG</RouterLink></div></section>
  </div>
</template>
<style scoped>
progress { display:block;height:8px;border:0;border-radius:999px;overflow:hidden;background:#e2e8f0; }
progress::-webkit-progress-bar { background:#e2e8f0;border-radius:999px; }
progress::-webkit-progress-value { background:var(--study-gradient);border-radius:999px;transition:width .3s ease; }
progress::-moz-progress-bar { background:var(--study-gradient);border-radius:999px; }
</style>
