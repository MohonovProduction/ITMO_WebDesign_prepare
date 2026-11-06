<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExamBuilder } from '@/composables/useExamBuilder'
import { useProgressStore } from '@/store/progress'
import DefinitionRecallCard from '@/components/DefinitionRecallCard.vue'
import ThinkingQuestionCard from '@/components/ThinkingQuestionCard.vue'

const router = useRouter()
const store = useProgressStore()
const exam = useExamBuilder()

onMounted(() => exam.start())

function onDef(score) {
  exam.submitDefScore(score)
  if (exam.finished()) finish()
}
function onThink(score) {
  exam.submitThinkScore(score)
  if (exam.finished()) finish()
}
function finish() {
  const percent = store.saveTanchenkoAttempt({
    defScores: exam.defScores.value,
    thinkScores: exam.thinkScores.value,
  })
  router.push({ path: '/results', query: { mode: 'tanchenko', percent: String(percent) } })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <header>
      <h1 class="text-xl font-bold text-slate-900">Экзамен · формат Танченко</h1>
      <p class="text-sm text-slate-500">2 определения + 2 вопроса на подумать · самооценка</p>
      <p class="text-xs text-slate-400">Шаг {{ Math.min(exam.phase.value + 1, exam.totalPhases) }} / {{ exam.totalPhases }}</p>
    </header>
    <DefinitionRecallCard
      v-if="exam.phase.value < 2 && exam.currentDef()"
      :item="exam.currentDef()"
      :index="exam.phase.value"
      @score="onDef"
    />
    <ThinkingQuestionCard
      v-else-if="exam.phase.value >= 2 && exam.phase.value < 4 && exam.currentThink()"
      :item="exam.currentThink()"
      :index="exam.phase.value - 2"
      @score="onThink"
    />
    <div v-else-if="exam.finished()" class="card p-6 text-center">
      <p class="text-slate-600">Сохраняем результат…</p>
    </div>
  </div>
</template>
