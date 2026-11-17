<script setup>
import { computed, ref } from 'vue'
import { courseworkSource, courseworkSections, courseworkProgress } from '@/data/coursework'
import { useWebProgressStore } from '@/store/webProgress'
import ChoiceChips from '@/components/ChoiceChips.vue'
import RichText from '@/components/RichText.vue'
import SheetDialog from '@/components/SheetDialog.vue'
const store = useWebProgressStore()
const filter = ref('all')
const resetting = ref(false)
const progress = computed(() => courseworkProgress(store.coursework))
const sections = computed(() => courseworkSections.map(section => ({...section,progress:courseworkProgress(store.coursework, section.groups.flatMap(group => group.items)),groups:section.groups.map(group => ({...group,items:group.items.filter(item => filter.value === 'all' || !store.coursework[item.id])})).filter(group => group.items.length)})))
function reset() { store.resetCoursework(); resetting.value = false }
</script>
<template>
  <div class="flex flex-col gap-5">
    <header><h1 class="text-2xl font-extrabold">Курсовая работа</h1><p class="text-slate-500">Условие и чеклист самопроверки перед защитой.</p></header>
    <section class="card p-5 sm:p-6" aria-labelledby="coursework-brief"><h2 id="coursework-brief" class="text-xl font-bold">Что нужно подготовить</h2><p class="mt-3 text-sm leading-relaxed">Спроектировать и реализовать веб-проект с desktop- и mobile-версиями, не менее чем 10 уникальными экранами и основными пользовательскими сценариями. Подготовить UI-kit, хотя бы одну веб-форму с валидацией, состояниями полей и результатами отправки. Опубликовать проект, подготовить презентацию и выступление.</p><p class="mt-3 text-xs text-slate-500">Это краткое резюме критериев, а не отдельное задание на тему проекта. Полные требования перечислены ниже.</p></section>
    <section class="card p-5" aria-label="Прогресс курсовой"><div class="flex flex-wrap items-baseline justify-between gap-2"><h2 class="font-bold">Самопроверка</h2><p role="status" class="text-sm"><strong>{{ progress.done }} из {{ progress.total }}</strong> выполнено · {{ progress.percent }}%</p></div><progress class="course-progress mt-4" :value="progress.done" :max="progress.total" aria-label="Выполненные пункты курсовой"/><p class="mt-3 text-xs text-slate-500">Максимальная оценка — 100 баллов. Галочки показывают готовность по вашей оценке, а не заработанные баллы. Отметки сохраняются в этом браузере.</p><p v-if="progress.done === progress.total" class="mt-3 font-semibold text-teal-800">Все пункты проверены. Сверьтесь с оригиналом критериев перед защитой.</p></section>
    <div class="flex flex-wrap items-center justify-between gap-3"><ChoiceChips v-model="filter" :options="[{id:'all',label:'Все пункты'},{id:'remaining',label:'Осталось проверить'}]" label="Показать пункты курсовой"/><button class="btn-secondary" :disabled="!progress.done" @click="resetting = true">Сбросить чеклист</button></div>
    <section v-for="section in sections" :key="section.id" class="card p-5 sm:p-6" :aria-labelledby="'course-' + section.id"><div class="flex flex-wrap items-start justify-between gap-3"><h2 :id="'course-' + section.id" class="text-lg font-bold">{{ section.title }}</h2><span class="chip bg-brand-50 text-brand-800">{{ section.points }} баллов</span></div><div class="my-3 flex items-center gap-3"><progress class="course-progress flex-1" :value="section.progress.done" :max="section.progress.total" :aria-label="'Готовность раздела: ' + section.title"/><span class="text-xs text-slate-500">{{ section.progress.done }} / {{ section.progress.total }}</span></div>
      <div v-for="group in section.groups" :key="group.id" class="mt-5"><h3 class="mb-2 text-sm font-bold text-slate-600">{{ group.title }}</h3><div class="flex flex-col gap-2"><label v-for="item in group.items" :key="item.id" class="check-row" :class="{'is-done':store.coursework[item.id]}"><input type="checkbox" :checked="!!store.coursework[item.id]" @change="store.setCourseworkItem(item.id, $event.target.checked)"><span class="text-sm leading-relaxed"><RichText :text="item.text" /></span></label></div></div><p v-if="!section.groups.length" class="mt-4 text-sm text-teal-800">В этом разделе всё проверено.</p>
    </section>
    <footer class="card p-5 text-sm"><h2 class="font-bold">Источник требований</h2><p class="mt-2 text-slate-600">Формулировки адаптированы для чеклиста. Баллы сохранены на уровне разделов; дополнительные баллы за подпункты не назначались.</p><a :href="courseworkSource" target="_blank" rel="noreferrer" class="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-700 underline">Оригинал критериев оценки ↗</a></footer>
    <SheetDialog v-model="resetting" title="Сбросить чеклист курсовой?" v-slot="{close}"><p class="text-sm text-slate-600">Все отметки курсовой будут сняты. Учебные темы, карточки и результаты тренажёров сохранятся.</p><div class="mt-5 flex flex-wrap gap-3"><button class="btn-secondary" @click="close">Отмена</button><button class="btn-danger" @click="reset">Сбросить отметки</button></div></SheetDialog>
  </div>
</template>
<style scoped>
.check-row { display:flex;align-items:flex-start;gap:12px;padding:12px;border-radius:12px;border:1px solid #e2e8f0;cursor:pointer;transition:background .18s,border-color .18s; }
.check-row:hover { background:#f1f5fb; }
.check-row.is-done { background:#edf8f4;border-color:#bcebd9; }
.check-row input { margin-top:3px;width:20px;height:20px;flex:none;accent-color:#387b68; }
.course-progress { display:block;width:100%;height:8px;border:0;border-radius:999px;overflow:hidden;background:#e2e8f0; }
.course-progress::-webkit-progress-bar { background:#e2e8f0; }
.course-progress::-webkit-progress-value { background:var(--study-gradient);transition:width .25s; }
.course-progress::-moz-progress-bar { background:var(--study-gradient); }
</style>
