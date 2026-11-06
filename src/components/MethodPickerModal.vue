<script setup>
import MathText from '@/components/MathText.vue'
import { useMethodPicker } from '@/composables/useMethodPicker'
import { useProgressStore } from '@/store/progress'

const emit = defineEmits(['close'])
const { current, answered, chosen, pickCase, select } = useMethodPicker()
const store = useProgressStore()

pickCase()

function choose(method) {
  const res = select(method)
  if (res) store.saveMethodPicker(res.caseId, res.correct)
}

function close() {
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" @click.self="close">
    <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl">
      <h2 class="text-lg font-bold text-slate-900">Докажите, что вы не робот</h2>
      <p class="mt-1 text-sm text-slate-500">Выберите подходящий метод анализа.</p>

      <template v-if="current">
        <p class="mt-4 text-sm text-slate-800">
          <MathText :text="current.story" />
        </p>
        <div class="mt-4 flex flex-col gap-2">
          <button
            v-for="opt in current.options"
            :key="opt.method"
            type="button"
            class="min-h-[44px] rounded-xl border px-4 py-3 text-left text-sm font-medium transition"
            :class="answered
              ? (opt.correct ? 'border-emerald-500 bg-emerald-50' : chosen === opt.method ? 'border-rose-400 bg-rose-50' : 'border-slate-200 opacity-60')
              : 'border-slate-200 hover:border-brand-400'"
            :disabled="answered"
            @click="choose(opt.method)"
          >
            <MathText :text="opt.method" />
          </button>
        </div>
        <div v-if="answered" class="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
          <MathText :text="current.explanation" />
        </div>
      </template>

      <div v-else class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p>Не удалось загрузить задачу. Попробуйте другую.</p>
        <button type="button" class="btn-secondary mt-3 min-h-[44px] w-full" @click="pickCase">
          Другая задача
        </button>
      </div>

      <button class="btn-secondary mt-4 w-full min-h-[44px]" @click="close">Закрыть</button>
    </div>
  </div>
</template>
