<script setup>
import RichText from '@/components/RichText.vue'

const props = defineProps({
  card: { type: Object, required: true },
  flipped: { type: Boolean, default: false },
  status: { type: String, default: null }, // 'known' | 'unknown' | null
})

const emit = defineEmits(['flip', 'know', 'dontknow'])

</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flip-card select-none">
      <div
        class="flip-inner relative min-h-[16rem] w-full cursor-pointer sm:min-h-[20rem]"
        :class="{ 'is-flipped': flipped }"
        role="button"
        tabindex="0"
        :aria-label="flipped ? 'Показать вопрос' : 'Показать ответ'"
        :aria-describedby="`${card.id}-${flipped ? 'answer' : 'question'}`"
        :aria-pressed="flipped"
        @click="emit('flip')"
        @keydown.enter.prevent="emit('flip')"
        @keydown.space.prevent="emit('flip')"
      >
        <div
          :aria-hidden="flipped"
          :inert="flipped"
          class="flip-face card absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
        >
          <span class="chip bg-slate-100 text-slate-500">
            Вопрос
          </span>
          <div :id="`${card.id}-question`" class="text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
            <RichText :text="card.front" />
          </div>
          <p v-if="card.purposeFor" class="max-w-md text-xs text-slate-500">
            <RichText :text="card.purposeFor" />
          </p>
          <span class="mt-2 text-xs text-slate-400">Нажмите, чтобы перевернуть</span>
        </div>

        <div
          :aria-hidden="!flipped"
          :inert="!flipped"
          class="flip-face flip-back card absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-y-auto bg-brand-50 p-6 text-center ring-brand-100"
        >
          <span class="chip bg-brand-100 text-brand-700">Ответ</span>
          <div :id="`${card.id}-answer`" class="text-base leading-relaxed text-slate-800 sm:text-lg">
            <RichText :text="card.back" />
          </div>
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
