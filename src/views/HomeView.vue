<script setup>
import { TRACKS } from '@/data/tracks'
import { topicsByTrack } from '@/data/webTheory'
</script>

<template>
  <div class="flex flex-col gap-6">
    <section class="card overflow-hidden">
      <div
        class="p-6 text-slate-800 sm:p-8"
        style="background-image: var(--study-gradient)"
      >
        <p class="text-sm font-bold uppercase tracking-[0.16em] text-slate-600">ИТМО · 2 семестр</p>
        <h1 class="mt-2 text-2xl font-extrabold sm:text-3xl">Веб-проектирование · подготовка к экзамену</h1>
        <p class="mt-1 max-w-xl text-slate-700">
          Два экзаменационных блока, карточки с деревом тем и интерактивные лаборатории.
          Изучайте понятия на примерах и проверяйте себя в тренировке билетов.
        </p>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <RouterLink
        v-for="track in TRACKS"
        :key="track.id"
        :to="{ path: '/theory', query: { track: track.id } }"
        class="card flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="emoji flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-brand-50 text-2xl">
          {{ track.icon }}
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-400">{{ track.teacher }} · {{ track.points }} баллов</p>
          <h2 class="font-bold text-slate-900">{{ track.title }}</h2>
          <p class="text-sm text-slate-500">{{ topicsByTrack(track.id).length }} вопросов · {{ track.description }}</p>
        </div>
      </RouterLink>
    </section>

    <RouterLink to="/flashcards" class="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div class="emoji flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-brand-50 text-2xl">🃏</div>
      <div>
        <h2 class="font-bold text-slate-900">Повторить в карточках</h2>
        <p class="text-sm text-slate-500">Семантические HTML-теги, SVG и определения из конспектов.</p>
      </div>
    </RouterLink>

    <RouterLink to="/practice" class="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div class="emoji flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-brand-50 text-2xl">🎓</div>
      <div>
        <h2 class="font-bold text-slate-900">Тренировка билета</h2>
        <p class="text-sm text-slate-500">Случайные вопросы, опорный план и самооценка устного ответа.</p>
      </div>
    </RouterLink>

    <RouterLink to="/semantics" class="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div class="emoji flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-brand-50 text-2xl">🌳</div>
      <div>
        <h2 class="font-bold text-slate-900">Справочник HTML-семантики</h2>
        <p class="text-sm text-slate-500">Интерактивное дерево страницы, DOM-пути и ссылки на MDN.</p>
      </div>
    </RouterLink>

    <div class="grid gap-4 sm:grid-cols-2">
      <RouterLink to="/css" class="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md"><div class="emoji flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">🎨</div><div><h2 class="font-bold text-slate-900">Справочник CSS</h2><p class="text-sm text-slate-500">Селекторы, шрифты, раскладка, состояния и адаптив.</p></div></RouterLink>
      <RouterLink to="/svg" class="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md"><div class="emoji flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">✒️</div><div><h2 class="font-bold text-slate-900">Справочник SVG</h2><p class="text-sm text-slate-500">Интерактивная схема и элементы векторной графики.</p></div></RouterLink>
    </div>

    <section class="card p-5">
      <h2 class="text-lg font-bold text-slate-900">От темы — к уверенному ответу</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-600">
        Прочитайте конспект, попробуйте интерактивный пример и закрепите определение карточками.
        Затем проговорите ответ на билет и оцените каждый вопрос отдельно.
      </p>
      <RouterLink to="/tracks" class="btn-secondary mt-4">Посмотреть карту экзамена →</RouterLink>
    </section>
  </div>
</template>
