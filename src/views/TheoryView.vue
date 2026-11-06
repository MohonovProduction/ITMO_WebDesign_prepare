<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { TRACKS } from '@/data/tracks'
import { webTheory } from '@/data/webTheory'

const route = useRoute()
const activeTrack = ref(route.query.track || 'tech')
const query = ref('')

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
  if (TRACKS.some((item) => item.id === track)) activeTrack.value = track
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <header>
      <h1 class="text-2xl font-extrabold text-slate-900">Теория</h1>
      <p class="text-slate-500">Карта вопросов и будущая структура развёрнутых ответов.</p>
    </header>

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
          <div>
            <h2 class="font-bold text-slate-900">{{ topic.title }}</h2>
            <p class="mt-1 text-sm text-slate-500">Карточка ответа будет собрана по этой схеме:</p>
            <ol class="mt-2 flex flex-wrap gap-2">
              <li v-for="step in topic.answerPlan" :key="step" class="chip bg-slate-100 text-slate-600">{{ step }}</li>
            </ol>
          </div>
        </div>
      </article>
    </div>

    <p v-if="!items.length" class="card p-8 text-center text-slate-400">
      Ничего не найдено.
    </p>
  </div>
</template>
