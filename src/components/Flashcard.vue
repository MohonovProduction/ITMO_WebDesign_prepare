<script setup>
import { computed } from 'vue'
import MathText from '@/components/MathText.vue'
import Formula from '@/components/Formula.vue'

const props = defineProps({
  card: { type: Object, required: true },
  flipped: { type: Boolean, default: false },
  status: { type: String, default: null }, // 'known' | 'unknown' | null
  variant: { type: String, default: 'default' }, // 'default' | 'formulaRecall'
})

const emit = defineEmits(['flip', 'know', 'dontknow'])

const isFormulaRecall = computed(() => props.variant === 'formulaRecall')
const theoryLink = computed(() =>
  props.card.theoryId != null ? { path: '/theory', query: { q: String(props.card.theoryId) } } : null,
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flip-card select-none">
      <div
        class="flip-inner relative min-h-[16rem] w-full cursor-pointer sm:min-h-[20rem]"
        :class="{ 'is-flipped': flipped }"
        role="button"
        tabindex="0"
        @click="emit('flip')"
        @keydown.enter.prevent="emit('flip')"
        @keydown.space.prevent="emit('flip')"
      >
        <div
          class="flip-face card absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
        >
          <span class="chip bg-slate-100 text-slate-500">
            {{ isFormulaRecall ? 'Задание' : 'Вопрос' }}
          </span>
          <div class="text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
            <MathText :text="card.front" />
          </div>
          <p v-if="card.purposeFor && !isFormulaRecall" class="max-w-md text-xs text-slate-500">
            <MathText :text="card.purposeFor" />
          </p>
          <p v-if="isFormulaRecall" class="max-w-md text-sm text-slate-500">
            Запишите формулу на бумаге, затем переверните и сверьте.
          </p>
          <span class="mt-2 text-xs text-slate-400">Нажмите, чтобы перевернуть</span>
        </div>

        <div
          class="flip-face flip-back card absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-y-auto bg-brand-50 p-6 text-center ring-brand-100"
        >
          <span class="chip bg-brand-100 text-brand-700">Формула</span>
          <div
            v-if="isFormulaRecall"
            class="w-full max-w-lg text-base leading-relaxed text-slate-800 sm:text-lg"
          >
            <Formula :expr="card.back" />
          </div>
          <div v-else class="text-base leading-relaxed text-slate-800 sm:text-lg">
            <MathText :text="card.back" />
          </div>
          <RouterLink
            v-if="isFormulaRecall && theoryLink"
            :to="theoryLink"
            class="text-xs text-brand-700 hover:underline"
            @click.stop
          >
            Подробнее в теории →
          </RouterLink>
        </div>
      </div>
    </div>

    <div v-if="status" class="text-center text-sm">
      <span v-if="status === 'known'" class="chip bg-emerald-100 text-emerald-700">✓ Отмечена как «Знаю»</span>
      <span v-else class="chip bg-rose-100 text-rose-700">↻ Отмечена как «Не знаю»</span>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button class="btn-danger" @click="emit('dontknow')">Не знаю</button>
      <button class="btn-success" @click="emit('know')">Знаю</button>
    </div>
  </div>
</template>
