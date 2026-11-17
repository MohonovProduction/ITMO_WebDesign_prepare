<script setup>
import { computed, ref } from 'vue'
import { agileReference, agileSources, workCycle } from '@/data/agileReference'
import RichText from '@/components/RichText.vue'
import StudyNote from '@/components/StudyNote.vue'
import ChoiceChips from '@/components/ChoiceChips.vue'
const selected = ref('backlog')
const current = computed(() => agileReference.find(t => t.slug === selected.value))
const stage = computed(() => workCycle.find(s => s.terms.includes(selected.value)))
const options = agileReference.map(t => ({id:t.slug,label:t.term}))
</script>
<template>
  <div class="flex flex-col gap-5">
    <header><h1 class="text-2xl font-extrabold">Agile и Scrum</h1><p class="mt-2 text-slate-600">Шесть знакомых слов на примере работы одной команды.</p></header>
    <section class="card p-5 text-sm leading-relaxed"><p><strong>Agile</strong> — ценности и принципы гибкой разработки: команда получает обратную связь и уточняет решение по ходу работы. <strong>Scrum</strong> — фреймворк с определёнными правилами организации такой работы. Это не два названия одного и того же.</p><p class="mt-3 text-slate-500">Дополнение к курсу. Ниже — упрощённый учебный цикл, а не полное описание Scrum. Sync и Feature — общие слова команд; Story points — необязательная практика оценки.</p></section>
    <section class="card p-5"><p class="text-xs font-semibold uppercase tracking-wider text-brand-700">Вымышленный проект</p><h2 class="mt-2 text-lg font-bold">«Искра» · сайт студенческого фестиваля</h2><p class="mt-2 text-sm text-slate-600">Дизайнеры и разработчики помогают гостю собрать личную программу. В этом цикле команда делает избранное событий. Нажмите на этап или термин, чтобы посмотреть его роль.</p></section>
    <div class="agile-layout">
      <nav class="card cycle p-5" aria-label="Упрощённый цикл работы команды"><h2 class="font-bold">Как связаны термины</h2><ol class="cycle-steps"><li v-for="(step,index) in workCycle" :key="step.id"><button type="button" class="cycle-step" :class="{chosen:stage.id === step.id}" :aria-pressed="stage.id === step.id" @click="selected = step.defaultTerm"><span class="step-number" aria-hidden="true">{{ index + 1 }}</span><span><strong class="block">{{ step.title }}</strong><span class="mt-1 block text-xs">{{ step.terms.map(id => agileReference.find(t => t.slug === id).term).join(' · ') }}</span><span v-if="step.id === 'working'" class="mt-2 block text-xs">↻ Daily — каждый рабочий день спринта</span></span></button></li></ol><p class="mt-4 rounded-xl bg-brand-50 p-3 text-sm"><span aria-hidden="true">↺</span> Следующий цикл: учитываем обратную связь и снова планируем.</p></nav>
      <section class="min-w-0" aria-label="Объяснение выбранного термина"><ChoiceChips v-model="selected" :options="options" label="Термины Agile и Scrum" />
        <Transition name="term" mode="out-in"><article :key="current.slug" class="card mt-4 p-5 sm:p-6"><p class="text-xs font-semibold text-brand-700">{{ stage.title }}</p><p class="mt-2 text-sm text-slate-600">{{ stage.description }}</p><h2 class="mt-5 text-2xl font-extrabold">{{ current.term }}</h2><p class="mt-1 text-xs text-slate-500">{{ current.scope }}</p><div class="mt-4 text-sm leading-relaxed"><RichText :text="current.definition" /></div><section class="mt-4 rounded-xl bg-brand-50 p-4"><h3 class="mb-2 text-sm font-bold">На проекте «Искра»</h3><div class="text-sm leading-relaxed"><RichText :text="current.projectExample" /></div></section><StudyNote class="mt-4" kind="errors" :items="[current.pitfall]" /><div class="mt-4 flex flex-wrap gap-3"><RouterLink :to="{path:'/theory',query:{topic:'product.language',concept:current.conceptId}}" class="btn-secondary">Теория термина →</RouterLink><RouterLink :to="{path:'/flashcards',query:{topic:'product.language'}}" class="btn-secondary">Повторить карточки →</RouterLink><RouterLink to="/trainers?exercise=team" class="btn-secondary">Проверить себя →</RouterLink></div><div class="mt-5 border-t border-slate-100 pt-4"><h3 class="text-sm font-semibold">{{ current.sources?.length ? 'Источники' : 'Контекст: ценности и правила работы' }}</h3><a v-for="source in (current.sources?.length ? current.sources : agileSources.slice(0,2))" :key="source.url" :href="source.url" target="_blank" rel="noreferrer" class="mt-2 block text-sm text-brand-700 underline">{{ source.label }} ↗</a></div></article></Transition>
      </section>
    </div>
    <section class="card p-5"><h2 class="font-bold">Первичные источники и дополнительные материалы</h2><p class="mt-2 text-sm text-slate-500">Манифест описывает ценности Agile; Scrum Guide — правила Scrum; материал Atlassian — практику оценки в points.</p><a v-for="source in agileSources" :key="source.url" :href="source.url" target="_blank" rel="noreferrer" class="mt-3 block text-sm text-brand-700 underline">{{ source.label }} ↗</a></section>
  </div>
</template>
<style scoped>
.agile-layout { display:grid;gap:20px; }
.cycle-steps { margin-top:20px;display:flex;flex-direction:column;gap:18px; }
.cycle-steps li { position:relative; }
.cycle-steps li:not(:last-child)::after { content:'↓';position:absolute;bottom:-19px;left:23px;color:#596da8; }
.cycle-step { display:flex;gap:12px;width:100%;text-align:left;padding:14px;border:1px solid #cbd7f1;border-radius:14px;background:#f8fafc;transition:background .2s,box-shadow .2s;min-height:64px; }
.cycle-step.chosen { background:var(--study-gradient);box-shadow:0 0 0 2px #596da8; }
.cycle-step:hover { border-color:#596da8; }
.step-number { display:flex;align-items:center;justify-content:center;flex:none;width:24px;height:24px;border-radius:50%;background:#ffffffb3;font-size:12px;font-weight:700; }
.term-enter-active,.term-leave-active { transition:opacity .18s,transform .18s; }
.term-enter-from,.term-leave-to { opacity:0;transform:translateY(6px); }
@media(min-width:1024px) { .agile-layout { grid-template-columns:320px minmax(0,1fr);align-items:start; }.cycle { position:sticky;top:96px; } }
</style>
