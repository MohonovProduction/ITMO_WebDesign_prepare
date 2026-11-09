<script setup>
import { computed, ref } from 'vue'
import RichText from './RichText.vue'
import { useWebProgressStore } from '@/store/webProgress'
import { trainingSnapshot, completionRows } from '@/utils/trainingFeedback'
import { notifyProgress } from '@/store/notifications'
const props = defineProps({ questions: { type:Array, required:true }, quizId: { type:String, required:true }, title: { type:String, required:true }, daily: Boolean })
const emit = defineEmits(['answered'])
const store = useWebProgressStore()
const index = ref(0)
const answers = ref({})
let initialProgress = trainingSnapshot(store)
const task = computed(() => props.questions[index.value])
const answer = computed(() => answers.value[task.value.id])
const score = computed(() => props.questions.filter(q => answers.value[q.id] === q.answer).length)
function choose(option) {
  if (answer.value) return
  answers.value[task.value.id] = option
  if (!props.daily) store.recordExercise(`${props.quizId}:${task.value.id}`, option === task.value.answer)
  if (!props.daily && index.value === props.questions.length - 1) notifyProgress(`${props.title}: подход завершён`, completionRows(initialProgress, trainingSnapshot(store)))
  emit('answered', option === task.value.answer)
}
function restart() { index.value = 0; answers.value = {}; initialProgress = trainingSnapshot(store) }
</script>
<template>
  <section class="card p-5" :aria-label="title">
    <h2 class="text-xl font-bold">{{ title }}</h2><p v-if="!daily" class="mt-2 text-sm text-slate-500">Задание {{ index + 1 }} из {{ questions.length }} · один правильный ответ</p>
    <Transition name="question" mode="out-in"><div :key="task.id">
      <div class="my-4 text-base leading-relaxed font-medium"><RichText :text="task.question" /></div>
      <div role="group" aria-label="Варианты ответа" class="flex flex-wrap gap-3"><button v-for="option in task.options" :key="option" class="btn-secondary" :class="answer === option ? 'ring-2 ring-brand-700' : ''" :disabled="!!answer" @click="choose(option)">{{ option }}</button></div>
      <div v-if="answer" role="status" class="mt-4 rounded-xl bg-brand-50 p-4"><p class="font-bold">{{ answer === task.answer ? 'Верно!' : 'Разберёмся вместе' }}</p><p class="mt-2 text-sm">{{ task.explanation }}</p><p v-if="answer !== task.answer" class="mt-2 text-sm">Правильный ответ: <strong>{{ task.answer }}</strong>.</p></div>
    </div></Transition>
    <button v-if="answer && index < questions.length - 1" class="btn-primary mt-4" @click="index++">Следующий вопрос →</button>
    <div v-if="answer && index === questions.length - 1 && !daily" class="mt-4" role="status"><p>Результат: {{ score }} из {{ questions.length }}.</p><button class="btn-secondary mt-3" @click="restart">Пройти заново</button></div>
  </section>
</template>
<style scoped>
.question-enter-active,.question-leave-active { transition:opacity .18s,transform .18s; }
.question-enter-from,.question-leave-to { opacity:0; transform:translateY(6px); }
</style>
