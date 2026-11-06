<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { TRACKS } from '@/data/tracks'
import { webTheory } from '@/data/webTheory'
import RichText from '@/components/RichText.vue'

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
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="font-bold text-slate-900">{{ topic.title }}</h2>
              <span class="chip" :class="topic.status === 'ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'">
                {{ topic.status === 'ready' ? 'Тема готова' : 'В плане наполнения' }}
              </span>
            </div>
            <template v-if="topic.status === 'ready'">
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
  </div>
</template>
