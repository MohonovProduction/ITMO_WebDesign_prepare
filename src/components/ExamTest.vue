<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useTest } from '@/composables/useTest'
import QuestionCard from '@/components/QuestionCard.vue'
import ProgressBar from '@/components/ProgressBar.vue'

const props = defineProps({
  count: { type: Number, default: 15 },
  timerSeconds: { type: Number, default: 0 }, // 0 — без таймера
  onlyIds: { type: Array, default: null }, // для режима «повторить ошибки»
})

const emit = defineEmits(['complete'])

const test = useTest({
  count: props.count,
  instant: false,
  lockBack: true,
  onlyIds: props.onlyIds,
})
const {
  current,
  index,
  total,
  finished,
  percent,
  correctCount,
  wrongIds,
  isLast,
  answer,
  answers,
  next,
} = test

const selected = ref(null)
const remaining = ref(props.timerSeconds)
let timerId = null

const timeLabel = computed(() => {
  const m = Math.floor(remaining.value / 60)
  const s = remaining.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const hasAnswer = computed(() => current.value && answers[current.value.id] !== undefined)

function choose(i) {
  if (hasAnswer.value) return
  selected.value = i
  answer(i)
}

function advance() {
  selected.value = null
  next()
}

function tick() {
  if (remaining.value > 0) {
    remaining.value -= 1
  } else {
    finishNow()
  }
}

function finishNow() {
  if (timerId) clearInterval(timerId)
  timerId = null
  test.finish()
}

watch(finished, (done) => {
  if (done) {
    if (timerId) clearInterval(timerId)
    emit('complete', {
      correct: correctCount.value,
      total: total.value,
      percent: percent.value,
      wrongIds: wrongIds.value,
    })
  }
})

onMounted(() => {
  if (props.timerSeconds > 0) {
    timerId = setInterval(tick, 1000)
  }
})
onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId)
})
</script>

<template>
  <div v-if="!finished" class="flex flex-col gap-5">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-bold text-slate-900">Режим экзамена</h1>
      <div class="flex items-center gap-2">
        <span v-if="timerSeconds > 0" class="chip"
          :class="remaining <= 30 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'">
          ⏱ {{ timeLabel }}
        </span>
        <span class="chip bg-slate-100 text-slate-500">{{ index + 1 }} / {{ total }}</span>
      </div>
    </div>

    <ProgressBar :value="(index / total) * 100" size="sm" color="violet" />

    <div class="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
      Вернуться к предыдущим вопросам нельзя. Выбирайте ответ внимательно.
    </div>

    <QuestionCard
      v-if="current"
      :question="current"
      :choice="selected"
      :revealed="false"
      :index="index"
      :total="total"
      @answer="choose"
    />

    <div class="flex justify-end">
      <button class="btn-primary" :disabled="!hasAnswer" @click="advance">
        {{ isLast ? 'Завершить экзамен' : 'Следующий вопрос' }}
      </button>
    </div>
  </div>
</template>
