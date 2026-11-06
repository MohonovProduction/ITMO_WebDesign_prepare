<script setup>
import { ref, watch } from 'vue'
import { useTest } from '@/composables/useTest'
import QuestionCard from '@/components/QuestionCard.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import { levelTitle, PASS_THRESHOLD } from '@/data/levels'

const props = defineProps({
  levelId: { type: String, required: true },
  count: { type: Number, default: 5 },
})

const emit = defineEmits(['complete', 'cards'])

let test = useTest({
  levelId: props.levelId,
  count: props.count,
  instant: true,
  stratifyByTheory: true,
  types: ['mcq', 'relation'],
})
const {
  current,
  index,
  total,
  finished,
  revealed,
  percent,
  correctCount,
  wrongIds,
  isLast,
  answer,
  next,
  restart,
} = test

const saved = ref(false)

watch(finished, (done) => {
  if (done && !saved.value) {
    saved.value = true
    emit('complete', {
      levelId: props.levelId,
      correct: correctCount.value,
      total: total.value,
      percent: percent.value,
      wrongIds: wrongIds.value,
    })
  }
})

function retry() {
  saved.value = false
  restart({
    levelId: props.levelId,
    count: props.count,
    instant: true,
    stratifyByTheory: true,
    types: ['mcq', 'relation'],
  })
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Прохождение -->
    <template v-if="!finished">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-bold text-slate-900">
          Мини-тест · {{ levelTitle(levelId) }}
        </h1>
        <span class="chip bg-slate-100 text-slate-500">5 вопросов</span>
      </div>
      <ProgressBar :value="(index / total) * 100" size="sm" />

      <QuestionCard
        v-if="current"
        :question="current"
        :choice="test.answers[current.id]?.choice ?? null"
        :revealed="revealed"
        :index="index"
        :total="total"
        @answer="answer"
      />

      <div class="flex justify-end">
        <button class="btn-primary" :disabled="!revealed" @click="next">
          {{ isLast ? 'Завершить' : 'Дальше' }}
        </button>
      </div>
    </template>

    <!-- Результат -->
    <template v-else>
      <div class="card flex flex-col items-center gap-4 p-8 text-center">
        <div class="emoji text-5xl">{{ percent >= PASS_THRESHOLD ? '🎉' : '📚' }}</div>
        <h2 class="text-2xl font-bold text-slate-900">Результат: {{ percent }}%</h2>
        <p class="text-slate-600">
          Правильно {{ correctCount }} из {{ total }} по теме «{{ levelTitle(levelId) }}».
        </p>

        <div
          class="w-full rounded-xl p-4 text-sm"
          :class="percent >= PASS_THRESHOLD ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'"
        >
          <template v-if="percent >= PASS_THRESHOLD">
            Отлично! Вы преодолели порог {{ PASS_THRESHOLD }}% — следующий уровень воронки открыт.
          </template>
          <template v-else>
            Чтобы пройти уровень, нужно {{ PASS_THRESHOLD }}%. Рекомендуем повторить карточки этого уровня и попробовать снова.
          </template>
        </div>

        <div class="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
          <button class="btn-secondary" @click="emit('cards')">Повторить карточки</button>
          <button class="btn-primary" @click="retry">Пройти ещё раз</button>
        </div>
      </div>
    </template>
  </div>
</template>
