<script setup>
import { computed, ref, watch } from 'vue'
import { selectorExercises, selectorMarkup } from '@/data/cssLearning'
import { createSelectorMatcher } from '@/utils/selectorMatcher'
import { useWebProgressStore } from '@/store/webProgress'
import ChoiceChips from './ChoiceChips.vue'
import { trainingSnapshot, completionRows } from '@/utils/trainingFeedback'
import { notifyProgress } from '@/store/notifications'
const store = useWebProgressStore()
const index = ref(0)
const mode = ref('choice')
const selected = ref('')
const typed = ref('')
const feedback = ref(null)
const answers = ref({})
let initialProgress = trainingSnapshot(store)
let completed = false
const task = computed(() => selectorExercises[index.value])
const evaluate = createSelectorMatcher(selectorMarkup)
const result = computed(() => evaluate(mode.value === 'input' ? typed.value : selected.value))
const matches = computed(() => result.value.lines)
const answered = computed(() => feedback.value !== null)
const score = computed(() => selectorExercises.filter(t => answers.value[`${mode.value}:${t.id}`] === true).length)
function submit(option) {
  if (answered.value || result.value.error) return
  const correct = mode.value === 'choice' ? option === task.value.answer : result.value.total === task.value.target.length && JSON.stringify(matches.value) === JSON.stringify(task.value.target)
  feedback.value = correct
  answers.value[`${mode.value}:${task.value.id}`] = correct
  store.recordExercise(`selectors-${mode.value}:${task.value.id}`, correct)
  if (index.value === selectorExercises.length - 1 && !completed) {
    completed = true
    notifyProgress('CSS-селекторы: подход завершён', completionRows(initialProgress, trainingSnapshot(store)))
  }
}
function choose(option) { selected.value = option; submit(option) }
function resetAnswer() { selected.value = ''; typed.value = ''; feedback.value = null }
function next() { index.value++; resetAnswer() }
function restart() { index.value = 0; answers.value = {}; resetAnswer(); completed = false; initialProgress = trainingSnapshot(store) }
watch(mode, restart)
watch(typed, () => { feedback.value = null })
</script>
<template>
  <section class="card p-5" aria-labelledby="selector-quiz-title">
    <h2 id="selector-quiz-title" class="text-xl font-bold">Какой селектор подойдёт?</h2>
    <div class="mt-4"><ChoiceChips v-model="mode" :options="[{id:'choice',label:'Выбрать ответ'},{id:'input',label:'Написать селектор'}]" label="Режим селекторов" /></div>
    <p class="mt-3 text-sm text-slate-600">{{ mode === 'choice' ? 'Один правильный ответ.' : 'Подойдёт любой селектор, выбирающий ровно нужные элементы. Подсветка меняется по мере ввода.' }} Лишние совпадения не подходят.</p>
    <p class="mt-4 text-sm">Задание {{ index + 1 }} из {{ selectorExercises.length }}</p>
    <Transition name="quiz" mode="out-in"><div :key="task.id + mode">
      <h3 class="my-3 font-semibold">{{ task.requirement }}</h3>
      <p class="mb-2 text-xs text-slate-600">◎ — цель. ✓ — совпадение вашего селектора. Подсвечивается открывающая строка элемента.</p>
      <pre class="overflow-x-auto rounded-xl bg-slate-950 p-3 text-sm leading-7 text-slate-100"><code v-for="(line, n) in selectorMarkup.split('\n')" :key="n" class="block rounded px-2 transition-colors" :class="matches.includes(n) ? 'bg-teal-800' : task.target.includes(n) ? 'bg-slate-700' : ''">{{ task.target.includes(n) ? '◎' : ' ' }}{{ matches.includes(n) ? '✓' : ' ' }} {{ line }}</code></pre>
      <div v-if="mode === 'choice'" class="mt-4 flex flex-wrap gap-3" role="group" aria-label="Варианты селектора"><button v-for="option in task.options" :key="option" class="btn-secondary" :class="selected === option ? 'ring-2 ring-brand-700' : ''" :disabled="answered" @click="choose(option)"><code>{{ option }}</code></button></div>
      <form v-else class="mt-4" @submit.prevent="submit()"><label for="selector-input" class="text-sm font-semibold">Ваш CSS-селектор</label><input id="selector-input" v-model="typed" autocomplete="off" autocapitalize="off" :spellcheck="false" class="mt-2 w-full rounded-xl border border-slate-300 p-3 font-mono" placeholder="Например, .card > p" :aria-invalid="!!result.error" aria-describedby="selector-hint"><p id="selector-hint" class="mt-2 text-sm text-slate-600" aria-live="polite">{{ result.error || `Найдено элементов: ${result.total}` }}</p><p class="mt-1 text-xs text-slate-500">Учебный фрагмент статичен: :hover и другие состояния взаимодействия здесь не включаются.</p><button class="btn-primary mt-3" :disabled="!typed.trim() || !!result.error || answered" type="submit">Проверить селектор</button></form>
      <div v-if="answered" role="status" class="mt-4 rounded-xl bg-brand-50 p-4"><p class="font-bold">{{ feedback ? 'Верно' : 'Попробуем разобраться' }}</p><p class="mt-2 text-sm">{{ task.explanation }}</p><p class="mt-2 text-sm">Пример решения: <code>{{ task.answer }}</code>. Совпадений у выбранного: {{ result.total }}.</p><p v-if="mode === 'input' && !feedback" class="mt-2 text-sm">Измените селектор и проверьте ещё раз.</p></div>
    </div></Transition>
    <button v-if="answered && index < selectorExercises.length - 1" class="btn-primary mt-4" @click="next">Следующее задание →</button>
    <div v-if="answered && index === selectorExercises.length - 1" class="mt-4" role="status"><p>Результат: {{ score }} из {{ selectorExercises.length }}.</p><button class="btn-secondary mt-3" @click="restart">Пройти заново</button></div>
  </section>
</template>
<style scoped>
.quiz-enter-active,.quiz-leave-active { transition:opacity .18s,transform .18s; }
.quiz-enter-from,.quiz-leave-to { opacity:0; transform:translateY(6px); }
</style>
