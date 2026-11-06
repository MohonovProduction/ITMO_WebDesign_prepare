<script setup>
import { TRACKS } from '@/data/tracks'
import { topicsByTrack } from '@/data/webTheory'
</script>

<template>
  <div class="flex flex-col gap-6">
    <header>
      <h1 class="text-2xl font-extrabold text-slate-900">Два трека экзамена</h1>
      <p class="mt-1 max-w-2xl text-slate-500">
        Экзамен состоит из двух самостоятельных вопросов. Материалы и прогресс будут храниться раздельно,
        а перед экзаменом их можно будет соединить в смешанной тренировке.
      </p>
    </header>

    <section v-for="track in TRACKS" :key="track.id" class="card p-6">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p class="text-sm font-semibold text-slate-400">{{ track.teacher }} · {{ track.points }} баллов</p>
          <h2 class="mt-1 text-xl font-extrabold text-slate-900">{{ track.icon }} {{ track.title }}</h2>
          <p class="mt-2 max-w-xl text-slate-600">{{ track.description }}</p>
        </div>
        <RouterLink :to="{ path: '/theory', query: { track: track.id } }" class="btn-primary shrink-0">
          Открыть темы
        </RouterLink>
      </div>
      <ol class="mt-5 grid gap-2 border-t border-slate-100 pt-5 sm:grid-cols-2">
        <li v-for="topic in topicsByTrack(track.id)" :key="topic.id" class="flex gap-2 text-sm text-slate-600">
          <span class="font-semibold text-slate-400">{{ topic.number }}.</span>{{ topic.title }}
        </li>
      </ol>
    </section>
  </div>
</template>
