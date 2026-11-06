<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import MathText from '@/components/MathText.vue'
import { methodFunnels } from '@/data/methodFunnels'

const router = useRouter()
const openRobotQuiz = inject('openRobotQuiz', null)
function goMini(ids) {
  if (ids?.length) router.push({ name: 'minitest', params: { level: 'methods' } })
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <header class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900">Методы анализа</h1>
        <p class="text-slate-500">Когда применять, входы, шаги и типичные ошибки.</p>
      </div>
      <button
        v-if="openRobotQuiz"
        type="button"
        class="btn-secondary shrink-0 text-sm"
        @click="openRobotQuiz()"
      >
        Проверка: выбор метода
      </button>
    </header>
    <article v-for="m in methodFunnels" :key="m.id" class="card flex flex-col gap-3 p-5">
      <h2 class="text-lg font-bold text-slate-900">
        <MathText :text="m.title" />
      </h2>
      <p v-if="m.purpose" class="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-900">
        <span class="font-semibold text-brand-700">Для чего: </span>
        <MathText :text="m.purpose" />
      </p>
      <div v-if="m.when?.length">
        <p class="text-xs font-semibold uppercase text-slate-400">Когда</p>
        <ul class="list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li v-for="(w, i) in m.when" :key="i"><MathText :text="w" /></li>
        </ul>
      </div>
      <div v-if="m.inputs?.length">
        <p class="text-xs font-semibold uppercase text-slate-400">Входы</p>
        <ul class="list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li v-for="(inp, i) in m.inputs" :key="i"><MathText :text="inp" /></li>
        </ul>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase text-slate-400">Шаги</p>
        <ol class="list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li v-for="(s, i) in m.steps" :key="i"><MathText :text="s" /></li>
        </ol>
      </div>
      <div v-if="m.pitfalls?.length">
        <p class="text-xs font-semibold uppercase text-rose-400">Ошибки</p>
        <ul class="list-disc space-y-1 pl-5 text-sm text-rose-800">
          <li v-for="(p, i) in m.pitfalls" :key="i"><MathText :text="p" /></li>
        </ul>
      </div>
      <button v-if="m.miniQuizIds?.length" class="btn-secondary text-sm" @click="goMini(m.miniQuizIds)">
        Повторить в мини-тесте (уровень «Методы»)
      </button>
    </article>
  </div>
</template>
