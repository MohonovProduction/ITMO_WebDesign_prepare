<script setup>
import { computed, ref } from 'vue'
import { getConcept } from '@/data/concepts'
import ChoiceChips from './ChoiceChips.vue'
import ResponsiveControls from './ResponsiveControls.vue'
import RichText from './RichText.vue'
const shape = ref('rect'), fill = ref('#bcebd9'), stroke = ref('#516880'), thickness = ref(4), scale = ref(80), radius = ref(12)
const shapes = ['rect','circle','ellipse','line','polyline','polygon','path']
const attrs = computed(() => {
  const s = scale.value
  return {
    rect: { x:160-s, y:100-s/2, width:s*2, height:s, rx:radius.value },
    circle: { cx:160, cy:100, r:s/1.5 },
    ellipse: { cx:160, cy:100, rx:s, ry:s/2 },
    line: { x1:160-s,y1:100-s/2,x2:160+s,y2:100+s/2 },
    polyline: { points:`${160-s},130 160,${100-s/2} ${160+s},130` },
    polygon: { points:`${160-s},150 160,${100-s} ${160+s},150` },
    path: { d:`M ${160-s} 100 Q 160 ${100-s} ${160+s} 100 T ${160+s+30} 130` },
  }[shape.value]
})
const concept = computed(() => getConcept(`svg-${shape.value}`))
const code = computed(() => `<svg viewBox="0 0 320 200">\n  <${shape.value} ${Object.entries(attrs.value).map(([key,value])=>`${key}="${value}"`).join(' ')}\n    fill="${['line','polyline','path'].includes(shape.value)?'none':fill.value}" stroke="${stroke.value}"\n    stroke-width="${thickness.value}" />\n</svg>`)
</script>
<template>
  <section class="card p-5"><h2 class="mb-4 text-xl font-bold">Конструктор SVG-фигур</h2>
    <ResponsiveControls title="Фигура и оформление"><ChoiceChips v-model="shape" :options="shapes.map(id=>({id,label:'<' + id + '>'}))" label="Базовая фигура" /><div class="mt-4 grid gap-4 sm:grid-cols-2"><label>Размер: {{ scale }}<input v-model.number="scale" class="w-full" type="range" min="30" max="90"></label><label>stroke-width: {{ thickness }}<input v-model.number="thickness" class="w-full" type="range" min="1" max="12"></label><label>fill<input v-model="fill" type="color" class="ml-3 h-11"></label><label>stroke<input v-model="stroke" type="color" class="ml-3 h-11"></label><label v-if="shape === 'rect'">Скругление rx: {{ radius }}<input v-model.number="radius" type="range" min="0" max="40" class="w-full"></label></div></ResponsiveControls>
    <svg viewBox="0 0 320 200" role="img" :aria-label="'Пример ' + shape" class="shape-preview mt-5 w-full rounded-xl bg-slate-50"><defs><pattern id="svg-lab-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" stroke-width="0.5" /></pattern></defs><rect width="320" height="200" fill="url(#svg-lab-grid)" /><component :is="shape" :key="shape" v-bind="attrs" :fill="['line','polyline','path'].includes(shape)?'none':fill" :stroke="stroke" :stroke-width="thickness" class="drawn-shape" /></svg>
    <div class="mt-4 text-sm text-slate-600" aria-live="polite"><RichText :text="concept.definition" /></div><pre class="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-200"><code>{{ code }}</code></pre>
  </section>
</template>
<style scoped>
.shape-preview{max-height:340px}.drawn-shape{transition:fill 180ms,stroke 180ms,stroke-width 180ms;animation:shape-appear 200ms ease-out}@keyframes shape-appear{from{opacity:0}to{opacity:1}}
</style>
