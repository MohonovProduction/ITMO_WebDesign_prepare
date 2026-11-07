<script setup>
import { computed, ref } from 'vue'
import { formTags, inputTypes } from '@/data/expandedConcepts'
import { getConcept } from '@/data/concepts'
import ChoiceChips from './ChoiceChips.vue'
import DisclosureCard from './DisclosureCard.vue'
import RichText from './RichText.vue'
const type = ref('text')
const active = ref('html-form')
const submitted = ref(false)
const current = computed(() => inputTypes.find(item => item.type === type.value))
const selected = computed(() => active.value ? getConcept(active.value) : null)
const code = computed(() => `<form method="post">\n  <fieldset>\n    <legend>Данные заявки</legend>\n    <label for="demo-field">${current.value.title}</label>\n    <input id="demo-field" name="answer" type="${type.value}" />\n  </fieldset>\n  <button type="submit">Отправить</button>\n</form>`)
function selectType(value) { type.value = value; active.value = `html-input-${value}`; submitted.value = false }
const options = inputTypes.map(item => ({ id: item.type, label: item.type }))
</script>
<template>
  <section class="card p-5">
    <h2 class="text-xl font-bold">Как устроена форма</h2><p class="mt-2 text-sm text-slate-600">Выберите тип поля. Ввод работает локально: данные никуда не отправляются.</p>
    <div class="mt-4"><ChoiceChips :model-value="type" :options="options" label="Тип input" @update:model-value="selectType" /></div>
    <div class="mt-5 grid gap-5 lg:grid-cols-2">
      <form class="rounded-xl border border-slate-200 bg-slate-50 p-5" @submit.prevent="submitted = true; active = 'html-form'" @focusin="active = current.conceptId">
        <fieldset class="rounded-lg border border-slate-300 p-4"><legend class="px-2 font-semibold">Данные заявки</legend>
          <label v-if="!['hidden', 'submit', 'radio'].includes(type)" for="demo-field" class="mb-2 block text-sm font-semibold">{{ current.title }}</label>
          <template v-if="type === 'radio'"><label class="mr-4 inline-flex gap-2"><input type="radio" name="answer" value="email">Почта</label><label class="inline-flex gap-2"><input type="radio" name="answer" value="phone">Телефон</label></template>
          <input v-else :key="type" id="demo-field" :type="type" name="answer" :value="type === 'submit' ? 'Отправить' : type === 'hidden' ? 'course-web' : undefined" :class="['checkbox', 'range'].includes(type) ? '' : 'w-full rounded-lg border border-slate-300 bg-white p-3'" :aria-label="current.title">
          <p v-if="type === 'hidden'" class="text-sm text-slate-600">Поле скрыто. В коде остаётся: value="course-web".</p>
        </fieldset>
        <button type="submit" class="btn-primary mt-4">Проверить отправку</button><p v-if="submitted" role="status" class="mt-3 text-sm text-slate-600">Учебная форма отправлена локально. Запрос к серверу не выполнялся.</p>
      </form>
      <pre class="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-7 text-slate-200"><code v-for="(line, i) in code.split('\n')" :key="i" class="block rounded px-2" :class="line.includes('input ') && active.startsWith('html-input') ? 'bg-brand-800 text-white' : ''">{{ line }}</code></pre>
    </div>
    <div v-if="selected" class="mt-4 rounded-xl bg-brand-50 p-4" aria-live="polite"><RichText :text="selected.definition" /></div>
  </section>
  <section class="flex flex-col gap-3">
    <DisclosureCard v-for="item in [...formTags, ...inputTypes.map(input => ({ tag: input.type, title: 'input type=' + input.type, conceptId: input.conceptId, mdn: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/' + input.type }))]" :id="'form-' + item.conceptId" :key="item.conceptId" :open="active === item.conceptId" @toggle="active = active === item.conceptId ? '' : item.conceptId">
      <template #heading><code>{{ item.title }}</code></template><RichText :text="getConcept(item.conceptId).definition" /><a :href="item.mdn" target="_blank" rel="noreferrer" class="mt-4 block text-sm font-semibold text-brand-700 underline">Подробнее на MDN ↗</a>
    </DisclosureCard>
  </section>
</template>
