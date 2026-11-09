<script setup>
import { onMounted, ref } from 'vue'
import { useWebProgressStore } from '@/store/webProgress'
import { localDay } from '@/utils/webProgress'
import { semanticsExercises, formsExercises } from '@/data/htmlExercises'
import SheetDialog from './SheetDialog.vue'
import QuestionQuiz from './QuestionQuiz.vue'
const store = useWebProgressStore()
const open = ref(false)
const answered = ref(false)
const questions = [...semanticsExercises, ...formsExercises]
const day = localDay()
const question = questions[[...day].reduce((sum, char) => sum + char.charCodeAt(0), 0) % questions.length]
onMounted(() => { if (store.warmupDay !== day) { store.dismissWarmup(day); open.value = true } })
</script>
<template>
  <SheetDialog v-model="open" title="Докажите, что вы не робот" v-slot="{close}"><p class="mb-4 text-sm text-slate-600">Учебная разминка дня. Один вопрос — и можно продолжать. Её можно пропустить.</p><QuestionQuiz :questions="[question]" quiz-id="daily" title="Вопрос дня" daily @answered="answered = true" /><button class="btn-primary mt-4" @click="close">{{ answered ? 'Продолжить обучение' : 'Пропустить' }}</button></SheetDialog>
</template>
