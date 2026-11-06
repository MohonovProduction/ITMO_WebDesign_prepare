<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import MathText from '@/components/MathText.vue'

defineProps({ item: { type: Object, required: true }, index: { type: Number, default: 0 } })
const emit = defineEmits(['score'])
const revealed = ref(false)

function grade(score) {
  emit('score', score)
  revealed.value = false
}
</script>
<template>
  <div class="card flex flex-col gap-4 p-5">
    <p class="text-xs text-slate-400">На подумать {{ index + 1 }} / 2</p>
    <p v-if="item.title" class="text-sm font-medium text-slate-500">{{ item.title }}</p>
    <section>
      <div class="mb-1 text-xs font-semibold uppercase text-slate-400">Вопрос</div>
      <h2 class="text-lg font-semibold leading-snug text-slate-900">
        <MathText :text="item.thinkingPrompt || item.title" />
      </h2>
    </section>
    <button v-if="!revealed" class="btn-secondary" @click="revealed = true">Показать эталон</button>
    <section v-else class="rounded-xl bg-violet-50 p-4 text-sm text-violet-900">
      <div class="mb-1 text-xs font-semibold uppercase text-violet-600">Эталон</div>
      <MathText :text="item.modelAnswer || item.explanation || 'Сверьтесь с теорией по этой теме.'" />
      <RouterLink
        v-if="item.id"
        :to="{ path: '/theory', query: { q: String(item.id) } }"
        class="mt-3 inline-block text-xs font-semibold text-violet-700 hover:underline"
      >
        Тема в разделе «Теория» →
      </RouterLink>
    </section>
    <div v-if="revealed" class="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <button class="btn-primary min-h-[44px]" @click="grade(1)">Справился</button>
      <button class="btn-secondary min-h-[44px]" @click="grade(0.5)">Частично</button>
      <button class="btn-secondary min-h-[44px]" @click="grade(0)">Не справился</button>
    </div>
  </div>
</template>
