<script setup>
import { computed } from 'vue'
import ProgressBar from '@/components/ProgressBar.vue'

const props = defineProps({
  level: { type: Object, required: true }, // { id, order, title, icon, color, description, score, unlocked, passed }
  threshold: { type: Number, default: 80 },
})

const emit = defineEmits(['minitest', 'cards', 'theory'])

const statusChip = computed(() => {
  if (props.level.passed) return { text: 'Пройден', cls: 'bg-emerald-100 text-emerald-700' }
  if (props.level.unlocked) return { text: 'Доступен', cls: 'bg-brand-100 text-brand-700' }
  return { text: 'Заблокирован', cls: 'bg-slate-100 text-slate-400' }
})
</script>

<template>
  <div
    class="card relative flex flex-col gap-4 p-5 transition"
    :class="level.unlocked ? '' : 'opacity-60'"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-3">
        <div
          class="emoji flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
          :class="level.passed ? 'bg-emerald-100' : 'bg-slate-100'"
        >
          {{ level.unlocked ? level.icon : '🔒' }}
        </div>
        <div>
          <div class="text-xs font-medium uppercase tracking-wide text-slate-400">
            Уровень {{ level.order }}
          </div>
          <h3 class="text-lg font-bold text-slate-900">{{ level.title }}</h3>
        </div>
      </div>
      <span class="chip" :class="statusChip.cls">{{ statusChip.text }}</span>
    </div>

    <p class="text-sm leading-relaxed text-slate-600">{{ level.description }}</p>

    <ProgressBar
      :value="level.score"
      :color="level.color"
      :label="`Лучший мини-тест (нужно ${threshold}%)`"
    />

    <div v-if="level.unlocked" class="grid grid-cols-3 gap-2">
      <button class="btn-secondary !px-2 text-xs" @click="emit('theory')">Теория</button>
      <button class="btn-secondary !px-2 text-xs" @click="emit('cards')">Карточки</button>
      <button class="btn-primary !px-2 text-xs" @click="emit('minitest')">Мини-тест</button>
    </div>
    <div v-else class="rounded-lg bg-slate-50 p-3 text-center text-xs text-slate-400">
      Наберите {{ threshold }}% в предыдущем уровне, чтобы открыть
    </div>
  </div>
</template>
