<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { trainers, trainersForTopic } from '@/data/trainers'
import { useWebProgressStore } from '@/store/webProgress'
import SelectorQuiz from '@/components/SelectorQuiz.vue'
import QuestionQuiz from '@/components/QuestionQuiz.vue'
const route = useRoute()
const store = useWebProgressStore()
const active = computed(() => trainers.find(t => t.id === route.query.exercise))
const available = computed(() => typeof route.query.topic === 'string' ? trainersForTopic(route.query.topic) : trainers)
watch(active, value => { if (value) store.rememberActivity(`/trainers?exercise=${value.id}`, value.label) }, {immediate:true})
</script>
<template>
  <div class="flex flex-col gap-5">
    <header><h1 class="text-2xl font-extrabold">Тренажёры</h1><p class="text-slate-500">Вспомните определение, примените его в задаче и разберите ответ.</p></header>
    <template v-if="active">
      <div class="flex flex-wrap gap-3"><RouterLink to="/trainers" class="btn-secondary">← Все тренажёры</RouterLink><RouterLink :to="{path:'/theory',query:{topic:active.topics[0]}}" class="btn-secondary">Разобрать тему →</RouterLink><RouterLink :to="{path:'/flashcards',query:{topic:active.topics[0]}}" class="btn-secondary">Карточки темы →</RouterLink></div>
      <SelectorQuiz v-if="active.id === 'selectors'" /><QuestionQuiz v-else :key="active.id" :quiz-id="active.id" :questions="active.questions" :title="active.label" />
    </template>
    <template v-else>
      <RouterLink :to="{path:'/flashcards',query:route.query.topic ? {topic:route.query.topic} : {}}" class="card p-5 transition hover:-translate-y-0.5"><h2 class="text-xl font-bold">Карточки повторения</h2><p class="mt-2 text-sm text-slate-600">Определения HTML, CSS, SVG и UX/UI. Отмечайте, что знаете и что нужно повторить.</p></RouterLink>
      <div class="grid gap-4 sm:grid-cols-2"><RouterLink v-for="trainer in available" :key="trainer.id" :to="{path:'/trainers',query:{exercise:trainer.id}}" class="card p-5 transition hover:-translate-y-0.5"><h2 class="font-bold">{{ trainer.label }}</h2><p class="mt-2 text-sm text-slate-600">{{ trainer.description }}</p><p class="mt-3 text-xs text-brand-700">{{ trainer.questions.length }} заданий →</p></RouterLink></div>
      <p v-if="route.query.topic" class="card p-4 text-sm">Показаны тренажёры выбранной темы. <RouterLink to="/trainers" class="underline">Показать все</RouterLink></p>
      <RouterLink to="/practice" class="card p-5"><h2 class="font-bold">Экзаменационный ответ</h2><p class="mt-2 text-sm text-slate-600">Проговорите билет и оцените ответ по каждому вопросу.</p></RouterLink>
    </template>
  </div>
</template>
