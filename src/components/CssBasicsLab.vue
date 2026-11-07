<script setup>
import { computed, ref } from 'vue'
import ChoiceChips from './ChoiceChips.vue'
import ResponsiveControls from './ResponsiveControls.vue'
import RichText from './RichText.vue'
import { getConcept } from '@/data/concepts'
const group = ref('box')
const padding = ref(16), border = ref(4), margin = ref(20), sizing = ref('content-box')
const color = ref('#35485a'), background = ref('#bcebd9'), size = ref(20), weight = ref('400'), lineHeight = ref(1.5), family = ref('system-ui')
const state = ref('link')
const states = ['link', 'visited', 'hover', 'active', 'focus-visible']
const outer = computed(() => sizing.value === 'content-box' ? 180 + 2 * (padding.value + border.value) : 180)
const contentWidth = computed(() => sizing.value === 'content-box' ? 180 : 180 - 2 * (padding.value + border.value))
const currentIds = computed(() => ({ box: ['css-padding','css-border','css-margin','css-box-sizing'], appearance: ['css-color','css-background'], type: ['css-font','css-font-size','css-font-weight','css-line-height'], states: ['css-link','css-visited','css-hover','css-active','css-focus-visible'] }[group.value]))
const textStyle = computed(() => ({ color: color.value, backgroundColor: background.value, fontSize: `${size.value}px`, fontWeight: weight.value, fontFamily: family.value, lineHeight: lineHeight.value }))
</script>
<template>
  <div class="flex flex-col gap-4">
  <section class="card p-5">
    <ChoiceChips v-model="group" :options="[{ id:'appearance',label:'Цвет и фон' },{ id:'box',label:'Box model' },{ id:'type',label:'Шрифт' },{ id:'states',label:'Состояния ссылки' }]" label="Базовые CSS-свойства" />
    <ResponsiveControls title="Базовые CSS-свойства">
      <div v-if="group === 'box'" class="mt-5 grid gap-4 sm:grid-cols-3"><label v-for="field in ['padding','border','margin']" :key="field" class="text-sm">{{ field }}: {{ { padding,border,margin }[field] }}px<input v-if="field === 'padding'" v-model.number="padding" type="range" min="0" max="32" class="mt-2 w-full"><input v-else-if="field === 'border'" v-model.number="border" type="range" min="0" max="12" class="mt-2 w-full"><input v-else v-model.number="margin" type="range" min="0" max="40" class="mt-2 w-full"></label><ChoiceChips v-model="sizing" :options="['content-box','border-box'].map(id=>({id,label:id}))" label="Расчёт размеров" /></div>
      <div v-if="group === 'appearance' || group === 'type'" class="mt-5 flex flex-wrap gap-4"><label>Цвет текста<input v-model="color" type="color" class="ml-2 h-11"></label><label>Фон<input v-model="background" type="color" class="ml-2 h-11"></label></div>
      <div v-if="group === 'type'" class="mt-5 grid gap-4"><label>font-size: {{ size }}px<input v-model.number="size" type="range" min="14" max="40" class="w-full"></label><label>line-height: {{ lineHeight }}<input v-model.number="lineHeight" type="range" min="1" max="2" step="0.1" class="w-full"></label><ChoiceChips v-model="weight" :options="['400','600','700'].map(id=>({id,label:id}))" label="Насыщенность" /><ChoiceChips v-model="family" :options="['system-ui','Georgia','monospace'].map(id=>({id,label:id}))" label="Семейство шрифта" /></div>
      <div v-if="group === 'states'" class="mt-5"><ChoiceChips v-model="state" :options="states.map(id=>({id,label:':' + id}))" label="Демонстрация состояния ссылки" /></div>
    </ResponsiveControls>
    <div v-if="group === 'box'" class="mt-5 overflow-x-auto pb-3">
      <div class="box-stage"><div class="margin-layer" :style="{padding: margin + 'px'}"><span class="layer-caption">margin</span><div class="border-layer" :style="{width:'180px', boxSizing:sizing, padding:padding+'px', borderWidth:border+'px'}"><span>padding</span><div class="content-layer">content<br>{{ contentWidth }}px</div></div></div></div>
      <p class="mt-3 text-sm text-slate-600" aria-live="polite">Заданная width: 180px · Видимая ширина с границей: {{ outer }}px · Вместе с margin: {{ outer + margin * 2 }}px</p>
      <pre class="mt-4 code-panel"><code>box-sizing: {{ sizing }};
width: 180px;
padding: {{ padding }}px;
border: {{ border }}px solid #8b9ccf;
margin: {{ margin }}px;</code></pre>
    </div>
    <div v-else-if="group === 'states'" class="mt-5 rounded-xl bg-slate-50 p-6"><span class="demo-link" :class="'demo-' + state">Открыть учебный материал ↗</span><p class="mt-4 text-sm text-slate-600">Выше — управляемая иллюстрация :{{ state }}. Это не чтение вашей истории браузера.</p><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:visited" target="_blank" rel="noreferrer" class="live-link mt-4 inline-block p-3">Настоящая ссылка: наведите, нажмите или перейдите клавишей Tab</a><p class="mt-3 text-sm text-slate-500">Порядок правил: :link → :visited → :hover → :active. Для клавиатуры добавляют :focus-visible. Браузер ограничивает стили :visited ради приватности.</p><pre class="mt-4 code-panel"><code>a:link { color: #315d80; }
a:visited { color: #66569d; }
a:hover { text-decoration: underline; }
a:active { color: #263d58; }
a:focus-visible { outline: 3px solid #315d80; }</code></pre></div>
    <div v-else class="mt-5"><div class="rounded-xl p-6 transition-colors" :style="textStyle">Дизайн начинается с понятного текста.<br>Цвет, размер и ритм помогают читать.</div><pre class="mt-4 code-panel"><code>color: {{ color }};
background-color: {{ background }};
font-family: {{ family }};
font-size: {{ size }}px;
font-weight: {{ weight }};
line-height: {{ lineHeight }};</code></pre></div>
  </section>
  <section class="grid gap-3 sm:grid-cols-2"><article v-for="id in currentIds" :key="id" class="card p-5"><h2 class="font-semibold">{{ getConcept(id).question }}</h2><div class="mt-2 text-sm leading-relaxed text-slate-600"><RichText :text="getConcept(id).definition" /></div><a v-if="getConcept(id).mdn" :href="getConcept(id).mdn" target="_blank" rel="noreferrer" class="mt-3 inline-flex min-h-11 items-center text-sm text-brand-700 underline">MDN Web Docs ↗</a></article></section>
  </div>
</template>
<style scoped>
.box-stage{min-width:350px;display:flex;justify-content:center;padding:24px;background:#f8fafc;border-radius:12px}.margin-layer{position:relative;background:#e5d7b5;transition:padding 180ms}.layer-caption{position:absolute;top:0;left:4px;font:11px monospace}.border-layer{background:#b5e2d7;border-style:solid;border-color:#8b9ccf;transition:padding 180ms,border-width 180ms;position:relative}.border-layer>span{font:11px monospace;display:block;height:0;position:relative;top:-12px}.content-layer{background:#b6d4e9;min-height:64px;text-align:center;font:13px monospace;display:grid;place-content:center}.code-panel{overflow-x:auto;border-radius:12px;background:#0f172a;padding:16px;color:#e2e8f0;font-size:13px}.demo-link{display:inline-block;padding:12px;border-radius:6px;color:#315d80;transition:color 160ms,background-color 160ms}.demo-visited{color:#66569d}.demo-hover{background:#e3e9fa;text-decoration:underline}.demo-active{color:#263d58;background:#c3d1ec}.demo-focus-visible{outline:3px solid #315d80}.live-link:link{color:#315d80}.live-link:visited{color:#66569d}.live-link:hover{text-decoration:underline}.live-link:active{color:#263d58}
</style>
