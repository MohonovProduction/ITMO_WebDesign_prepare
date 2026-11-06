<script setup>
import { ref } from 'vue'
import MathText from '@/components/MathText.vue'

defineProps({ item: { type: Object, required: true }, index: { type: Number, default: 0 } })
const emit = defineEmits(['score'])
const revealed = ref(false)
const notes = ref('')

function grade(score) {
  emit('score', score)
  revealed.value = false
  notes.value = ''
}
</script>
<template>
  <div class="card flex flex-col gap-4 p-5">
    <p class="text-xs text-slate-400">Определение {{ index + 1 }} / 2</p>
    <h2 class="text-lg font-bold text-slate-900">{{ item.title }}</h2>
    <p class="text-sm text-slate-600">Вспомните определение своими словами (можно кратко в поле ниже).</p>
    <textarea v-model="notes" class="min-h-[88px] w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Запишите определение…" />
    <button v-if="!revealed" class="btn-secondary" @click="revealed = true">Показать эталон</button>
    <div v-else class="rounded-xl bg-slate-50 p-4 text-sm">
      <div class="mb-1 text-xs font-semibold uppercase text-slate-400">Эталон</div>
      <MathText :text="item.definition" />
    </div>
    <div v-if="revealed" class="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <button class="btn-primary min-h-[44px]" @click="grade(1)">Знаю</button>
      <button class="btn-secondary min-h-[44px]" @click="grade(0.5)">Частично</button>
      <button class="btn-secondary min-h-[44px]" @click="grade(0)">Не угадал</button>
    </div>
  </div>
</template>
