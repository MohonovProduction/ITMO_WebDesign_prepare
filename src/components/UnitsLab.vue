<script setup>
import { computed, ref } from 'vue'
import ResponsiveControls from './ResponsiveControls.vue'
const unit = ref('em')
const value = ref(8)
const definitions = {
  px: 'CSS-пиксель — фиксированная единица длины. Он не обязательно равен одному физическому пикселю экрана.',
  '%': 'Для width процент — доля ширины родителя. Половина контейнера — это 50%.',
  em: 'Для ширины 1em равен размеру шрифта самого блока. Здесь шрифт всегда 20px: меняется только множитель.',
  rem: '1rem равен размеру шрифта корневого html. Значение показано ниже; сам модуль остаётся постоянным.',
  vw: '1vw — один процент ширины окна браузера, а не родительского блока. При изменении окна эта длина меняется.',
  fr: 'fr делит свободную ширину Grid. Здесь первая колонка меняется, вторая всегда 1fr. Промежуток вычитается до деления.',
}
const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
const maximum = computed(() => unit.value === 'px' ? 300 : ['%', 'vw'].includes(unit.value) ? 100 : unit.value === 'fr' ? 5 : 15)
const width = computed(() => `${value.value}${unit.value}`)
function select(next) { unit.value = next; value.value = next === 'px' ? 160 : next === '%' ? 50 : next === 'fr' ? 2 : 8 }
</script>
<template>
  <section class="card p-5">
    <ResponsiveControls title="Единицы и значение">
      <div class="flex flex-wrap gap-2"><button v-for="(_, key) in definitions" :key="key" type="button" :aria-pressed="unit === key" class="rounded-full px-4 py-3 font-mono text-sm transition-colors" :class="unit === key ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'" @click="select(key)">{{ key }}</button></div>
      <label class="mt-4 block text-sm text-slate-600">Значение: <output>{{ value }}{{ unit }}</output><input v-model.number="value" type="range" min="1" :max="maximum" :step="unit === 'em' || unit === 'rem' || unit === 'fr' ? 0.5 : 1" class="mt-3 w-full"></label>
    </ResponsiveControls>
    <p class="my-4 text-sm text-slate-600" aria-live="polite">{{ definitions[unit] }}</p>
    <div v-if="unit === 'em' || unit === 'rem'" class="mb-4 flex items-center gap-3 text-sm text-slate-600"><span class="module" :style="{ width: `${unit === 'em' ? 20 : rootSize}px`, height: `${unit === 'em' ? 20 : rootSize}px` }">M</span>Постоянный модуль: 1{{ unit }} = {{ unit === 'em' ? 20 : rootSize }}px</div>
    <div v-if="unit === 'fr'" class="grid-demo" :style="{ gridTemplateColumns: `minmax(0, ${value}fr) minmax(0, 1fr)` }">
      <div class="grid-cell"><div class="fill">{{ value }}fr<br>{{ (value / (value + 1) * 100).toFixed(1) }}%</div></div>
      <div class="grid-cell"><div class="fill muted">1fr<br>{{ (100 / (value + 1)).toFixed(1) }}%</div></div>
    </div>
    <div v-else class="ruler-scroll">
      <div class="ruler" aria-hidden="true"><span v-for="n in 7" :key="n">{{ (n - 1) * 50 }}</span></div>
      <div class="parent" :class="{ percent: unit === '%' }" style="font-size:20px">
        <div class="measured" :style="{ width }"></div>
      </div>
      <p class="mt-2 text-sm text-slate-500">{{ unit === '%' ? 'Родитель: 300px = 100%. ' : '' }}width: {{ width }}{{ unit === 'em' ? ` = ${value * 20}px` : unit === 'rem' ? ` = ${value * rootSize}px` : unit === '%' ? ` = ${value * 3}px` : '' }}</p>
    </div>
    <pre class="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-200"><code>{{ unit === 'fr' ? `display: grid;\ngrid-template-columns: ${value}fr 1fr;\ngap: 12px;` : `width: ${width};${unit === 'em' ? '\nfont-size: 20px; /* постоянный модуль */' : ''}` }}</code></pre>
  </section>
</template>
<style scoped>
.module{display:inline-flex;align-items:center;justify-content:center;border:1px solid #64748b;font:14px monospace;background:#e2e8f0}
.ruler-scroll{overflow-x:auto;padding:4px 0 12px}
.ruler{width:300px;display:flex;justify-content:space-between;border-bottom:1px solid #64748b;background:repeating-linear-gradient(90deg,#94a3b8 0 1px,transparent 1px 10px) bottom/100% 6px no-repeat;padding-bottom:10px;font:11px monospace;color:#64748b}
.parent{width:300px;height:90px;margin-top:12px;border:1px dashed #64748b;background:#f1f5f9;box-sizing:content-box}
.parent.percent{background:repeating-linear-gradient(90deg,#e2e8f0 0 1px,transparent 1px 30px),#f1f5f9}
.measured{height:90px;background:var(--study-gradient);transition:width 200ms ease-out}
.grid-demo{display:grid;gap:12px;min-height:140px;transition:grid-template-columns 250ms ease-out}
.grid-cell{border:1px dashed #64748b;padding:6px;background:repeating-linear-gradient(90deg,#e2e8f0 0 1px,transparent 1px 20px),#f8fafc;min-width:0}
.fill{height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;background:#cfc6ed;color:#334155;font:14px monospace}.fill.muted{background:#a3e5d7}
@media(prefers-reduced-motion:reduce){.measured,.grid-demo{transition:none}}
</style>
