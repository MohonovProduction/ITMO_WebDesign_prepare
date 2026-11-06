<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProgressStore } from '@/store/progress'
import { questionById } from '@/data/questions'
import MathText from '@/components/MathText.vue'

const route = useRoute()
const router = useRouter()
const store = useProgressStore()
const { exam, examTanchenko } = storeToRefs(store)

const isTanchenko = computed(() => route.query.mode === 'tanchenko')
const wrong = computed(() => exam.value.lastWrong.map((id) => questionById(id)).filter(Boolean))
const passed = computed(() => exam.value.lastPercent >= 60)
</script>

<template>
  <div class="flex flex-col gap-5">
    <div v-if="isTanchenko" class="card flex flex-col items-center gap-3 p-8 text-center">
      <div class="emoji text-5xl">📝</div>
      <h1 class="text-3xl font-extrabold text-slate-900">{{ examTanchenko.lastSelfScore }}%</h1>
      <p class="text-slate-600">Экзамен в формате Танченко (самооценка 4 задания)</p>
      <p class="text-sm text-slate-500">Попыток: {{ examTanchenko.attempts }}</p>
      <button class="btn-primary" @click="router.push('/exam/tanchenko')">Пройти снова</button>
      <button class="btn-secondary" @click="router.push('/exam')">К MCQ-экзамену</button>
    </div>

    <template v-else>
      <div v-if="!exam.attempts" class="card p-8 text-center text-slate-500">
        Вы ещё не проходили экзамен.
        <div class="mt-4">
          <button class="btn-primary" @click="router.push('/exam')">Пройти экзамен</button>
        </div>
      </div>

      <template v-else>
        <div class="card flex flex-col items-center gap-3 p-8 text-center">
          <div class="emoji text-5xl">{{ passed ? '🎓' : '📚' }}</div>
          <h1 class="text-3xl font-extrabold text-slate-900">{{ exam.lastPercent }}%</h1>
          <p class="text-slate-600">Результат последнего экзамена</p>
          <div class="flex gap-4 text-sm text-slate-500">
            <span>Лучший: <strong class="text-slate-800">{{ exam.best }}%</strong></span>
            <span>Попыток: <strong class="text-slate-800">{{ exam.attempts }}</strong></span>
            <span>Ошибок: <strong class="text-slate-800">{{ wrong.length }}</strong></span>
          </div>
          <div class="mt-2 grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
            <button class="btn-secondary" :disabled="!wrong.length" @click="router.push('/exam?review=1')">
              Повторить ошибки
            </button>
            <button class="btn-primary" @click="router.push('/exam')">Пройти заново</button>
          </div>
        </div>
        <section v-if="wrong.length" class="flex flex-col gap-3">
          <h2 class="text-lg font-bold text-slate-900">Разбор ошибок</h2>
          <article v-for="q in wrong" :key="q.id" class="card flex flex-col gap-3 p-5">
            <h3 class="font-semibold text-slate-900"><MathText :text="q.question" /></h3>
            <div class="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              <span class="font-semibold">Правильный ответ: </span>
              <MathText :text="q.options[q.answer]" />
            </div>
            <div class="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              <MathText :text="q.explanation" />
            </div>
          </article>
        </section>
        <div v-else class="card p-6 text-center text-emerald-700">Ошибок нет — отличная работа!</div>
      </template>
    </template>
  </div>
</template>
