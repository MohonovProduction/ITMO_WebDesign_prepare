<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProgressStore } from '@/store/progress'
import ExamTest from '@/components/ExamTest.vue'

const route = useRoute()
const router = useRouter()
const store = useProgressStore()

const phase = ref('config') // 'config' | 'running'
const useTimer = ref(false)
const minutes = ref(10)
const count = ref(15)

// Режим «повторить ошибки»
const reviewMode = computed(() => route.query.review === '1')
const reviewIds = computed(() => store.exam.lastWrong || [])

const examKey = ref(0)

function start() {
  examKey.value += 1
  phase.value = 'running'
}

function onComplete({ percent, wrongIds }) {
  store.saveExam(percent, wrongIds)
  router.push('/results')
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Экран настройки -->
    <template v-if="phase === 'config'">
      <header>
        <h1 class="text-2xl font-extrabold text-slate-900">Пробный экзамен</h1>
        <p class="text-slate-500">
          {{ reviewMode ? 'Режим повторения ошибок прошлого экзамена.' : '15 вопросов со всех уровней. Вернуться назад нельзя.' }}
        </p>
      </header>

      <div v-if="reviewMode && !reviewIds.length" class="card p-6 text-center text-slate-500">
        Нет сохранённых ошибок для повторения. Сначала пройдите экзамен.
        <div class="mt-4">
          <button class="btn-primary" @click="router.replace('/exam')">К обычному экзамену</button>
        </div>
      </div>

      <div v-else class="card flex flex-col gap-4 p-6">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-slate-700">Вопросов в экзамене</span>
          <span class="font-bold text-slate-900">
            {{ reviewMode ? reviewIds.length : count }}
          </span>
        </div>

        <label class="flex items-center justify-between">
          <span class="text-sm font-medium text-slate-700">Включить таймер</span>
          <input v-model="useTimer" type="checkbox" class="h-5 w-5 accent-brand-600" />
        </label>

        <div v-if="useTimer" class="flex items-center justify-between">
          <span class="text-sm text-slate-600">Минут на экзамен</span>
          <input
            v-model.number="minutes"
            type="number"
            min="1"
            max="60"
            class="w-20 rounded-lg border border-slate-200 px-3 py-1.5 text-right"
          />
        </div>

        <button class="btn-primary mt-2" @click="start">Начать экзамен (15 MCQ)</button>
        <RouterLink to="/exam/tanchenko" class="btn-secondary mt-2 block text-center">
          Формат Танченко: 2 определения + 2 на подумать
        </RouterLink>
        <p class="text-center text-xs text-slate-400">
          Лучший результат: {{ store.exam.best }}%
        </p>
      </div>
    </template>

    <!-- Прохождение экзамена -->
    <ExamTest
      v-else
      :key="examKey"
      :count="reviewMode ? reviewIds.length : count"
      :timer-seconds="useTimer ? minutes * 60 : 0"
      :only-ids="reviewMode ? reviewIds : null"
      @complete="onComplete"
    />
  </div>
</template>
