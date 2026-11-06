<script setup>
import MathText from '@/components/MathText.vue'
import { questionType } from '@/data/questions'

const props = defineProps({
  question: { type: Object, required: true },
  choice: { type: Number, default: null },
  revealed: { type: Boolean, default: false },
  index: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
})

const emit = defineEmits(['answer'])

function optionClass(i) {
  const isChosen = props.choice === i
  const isCorrect = i === props.question.answer
  if (!props.revealed) {
    return isChosen
      ? 'border-brand-500 bg-brand-50 text-brand-800'
      : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50'
  }
  if (isCorrect) return 'border-emerald-500 bg-emerald-50 text-emerald-800'
  if (isChosen && !isCorrect) return 'border-rose-500 bg-rose-50 text-rose-800'
  return 'border-slate-200 bg-white text-slate-500'
}

function marker(i) {
  if (!props.revealed) return String.fromCharCode(65 + i)
  if (i === props.question.answer) return '✓'
  if (props.choice === i) return '✕'
  return String.fromCharCode(65 + i)
}
</script>

<template>
  <div class="card flex flex-col gap-5 p-5 sm:p-6">
    <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-400">
      <span v-if="total">Вопрос {{ index + 1 }} из {{ total }}</span>
      <div class="flex gap-2">
        <span v-if="questionType(question) === 'relation'" class="chip bg-violet-100 text-violet-700">На связь</span>
        <span class="chip bg-slate-100 text-slate-500">{{ question.level }}</span>
      </div>
    </div>

    <h2 class="text-lg font-semibold leading-snug text-slate-900">
      <MathText :text="question.question" />
    </h2>

    <div class="flex flex-col gap-2.5">
      <button
        v-for="(opt, i) in question.options"
        :key="i"
        type="button"
        :disabled="revealed"
        class="flex min-h-[44px] items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors disabled:cursor-default"
        :class="optionClass(i)"
        @click="emit('answer', i)"
      >
        <span
          class="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border text-xs font-bold"
          :class="revealed && i === question.answer ? 'border-emerald-500 text-emerald-600'
            : revealed && choice === i ? 'border-rose-500 text-rose-600'
            : 'border-slate-300 text-slate-500'"
        >
          {{ marker(i) }}
        </span>
        <span class="leading-relaxed"><MathText :text="opt" /></span>
      </button>
    </div>

    <Transition name="fade">
      <div
        v-if="revealed"
        class="flex flex-col gap-3"
      >
        <div
          class="rounded-xl border-l-4 p-4 text-sm leading-relaxed"
          :class="choice === question.answer
            ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
            : 'border-amber-400 bg-amber-50 text-amber-900'"
        >
          <div class="mb-1 font-semibold">
            {{ choice === question.answer ? 'Верно!' : 'Неверно.' }}
          </div>
          <MathText :text="question.explanation" />
        </div>
        <div
          v-if="question.interpretation"
          class="rounded-xl bg-sky-50 p-4 text-sm text-sky-900"
        >
          <div class="mb-1 text-xs font-semibold uppercase text-sky-600">На бытовом языке</div>
          <MathText :text="question.interpretation" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active { transition: opacity 0.2s ease; }
.fade-enter-from { opacity: 0; }
</style>
