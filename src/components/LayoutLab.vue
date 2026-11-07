<script setup>
import { computed, ref, onBeforeUpdate, onUpdated } from 'vue'
import ResponsiveControls from './ResponsiveControls.vue'
defineProps({ mode: { type: String, required: true } })
const direction = ref('row')
const justify = ref('flex-start')
const align = ref('center')
const columns = ref(3)
const justifyItems = ref('center')
const alignItems = ref('center')
const gridJustify = ref('start')
const gridAlign = ref('start')
const content = [
  { title: 'Айдентика', text: 'Цвет и характер бренда.', icon: '✳', height: 38 },
  { title: 'Интерфейс', text: 'Понятный путь от идеи к действию. Прототип и детали.', icon: '◉', height: 62 },
  { title: 'Моушен', text: 'История в движении.', icon: '↗', height: 26 },
]
const flexStyle = computed(() => ({ flexDirection: direction.value, justifyContent: justify.value, alignItems: align.value }))
const gridStyle = computed(() => ({ gridTemplateColumns: `repeat(${columns.value}, 140px)`, gridTemplateRows: 'repeat(2, 190px)', justifyItems: justifyItems.value, alignItems: alignItems.value, justifyContent: gridJustify.value, alignContent: gridAlign.value }))
const edgeOptions = ['start', 'center', 'end', 'stretch']
const scene = ref(null)
let previousRects = []
onBeforeUpdate(() => {
  previousRects = [...(scene.value?.querySelectorAll('.sample') || [])].map(node => node.getBoundingClientRect())
})
onUpdated(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  scene.value?.querySelectorAll('.sample').forEach((node, index) => {
    const old = previousRects[index]
    const next = node.getBoundingClientRect()
    if (!old) return
    node.animate([{ transformOrigin:'top left', transform: `translate(${old.left - next.left}px, ${old.top - next.top}px) scale(${old.width / next.width}, ${old.height / next.height})` }, { transformOrigin:'top left', transform: 'translate(0, 0) scale(1)' }], { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' })
  })
})
</script>

<template>
  <section class="card p-5">
    <ResponsiveControls :title="mode === 'flex' ? 'Настройки Flexbox' : 'Настройки Grid'">
    <div v-if="mode === 'flex'" class="controls">
      <div class="control-label">Направление <code>flex-direction</code><span class="chip-group"><button v-for="value in ['row', 'column']" :key="value" type="button" :aria-pressed="direction === value" :class="{ selected: direction === value }" @click="direction = value">{{ value }}</button></span></div>
      <div class="control-label">По главной оси <code>justify-content</code><span class="chip-group"><button v-for="value in ['flex-start','center','flex-end','space-between','space-around','space-evenly']" :key="value" type="button" :aria-pressed="justify === value" :class="{ selected: justify === value }" @click="justify = value">{{ value }}</button></span></div>
      <div class="control-label">По поперечной оси <code>align-items</code><span class="chip-group"><button v-for="value in ['flex-start','center','flex-end','stretch','baseline']" :key="value" type="button" :aria-pressed="align === value" :class="{ selected: align === value }" @click="align = value">{{ value }}</button></span></div>
    </div>
    <div v-else class="controls">
      <label>Количество колонок<input v-model.number="columns" type="range" min="2" max="4"><output>{{ columns }}</output></label>
      <div class="control-label">Элемент в ячейке: горизонталь <code>justify-items</code><span class="chip-group"><button v-for="value in edgeOptions" :key="value" type="button" :aria-pressed="justifyItems === value" :class="{ selected: justifyItems === value }" @click="justifyItems = value">{{ value }}</button></span></div>
      <div class="control-label">Элемент в ячейке: вертикаль <code>align-items</code><span class="chip-group"><button v-for="value in edgeOptions" :key="value" type="button" :aria-pressed="alignItems === value" :class="{ selected: alignItems === value }" @click="alignItems = value">{{ value }}</button></span></div>
      <div class="control-label">Вся сетка: горизонталь <code>justify-content</code><span class="chip-group"><button v-for="value in ['start','center','end','space-between']" :key="value" type="button" :aria-pressed="gridJustify === value" :class="{ selected: gridJustify === value }" @click="gridJustify = value">{{ value }}</button></span></div>
      <div class="control-label">Вся сетка: вертикаль <code>align-content</code><span class="chip-group"><button v-for="value in ['start','center','end','space-between']" :key="value" type="button" :aria-pressed="gridAlign === value" :class="{ selected: gridAlign === value }" @click="gridAlign = value">{{ value }}</button></span></div>
    </div>
    <p class="my-4 text-sm text-slate-500" aria-live="polite">{{ mode === 'flex' ? (direction === 'row' ? 'Главная ось → горизонтально. Поперечная ось ↓ вертикально.' : 'Главная ось ↓ вертикально. Поперечная ось → горизонтально.') : 'Пунктир показывает ячейки. items двигает карточки внутри них, content — всю сетку в свободном пространстве.' }}</p>
    </ResponsiveControls>
    <p v-if="mode === 'flex'" class="mb-3 text-sm text-slate-600">Синяя рамка — flex-контейнер. Между ней и пунктиром — padding: 24px. Выравнивание работает внутри пунктира.</p>
    <div ref="scene" class="scene-scroll" :class="{ 'flex-viewport': mode === 'flex' }">
      <div v-if="mode === 'flex'" class="flex-scene" :style="flexStyle">
        <div class="axes" aria-hidden="true" :class="{ vertical: direction === 'column' }">
          <span class="axis horizontal-axis">{{ direction === 'row' ? 'Главная →' : 'Поперечная →' }}</span>
          <span class="axis vertical-axis">{{ direction === 'row' ? 'Поперечная ↓' : 'Главная ↓' }}</span>
          <span class="edge-start">start</span><span class="edge-end">end</span>
        </div>
        <article v-for="item in content" :key="item.title" class="sample" :class="direction === 'column' ? 'column-sample' : 'row-sample'">
          <div class="placeholder" :style="{height: `${item.height}px`}">{{ item.icon }}</div><h2>{{ item.title }}</h2><p>{{ item.text }}</p>
        </article>
      </div>
      <div v-else class="grid-scene" :style="gridStyle">
        <div v-for="(item, i) in [...content, ...content]" :key="i" class="cell" :style="{justifyItems, alignItems}">
          <article class="sample"><div class="placeholder" :style="{height: `${item.height}px`}">{{ item.icon }}</div><h2>{{ item.title }}</h2><p>{{ item.text }}</p></article>
        </div>
      </div>
    </div>
    <p class="mt-3 text-sm text-slate-500">{{ mode === 'flex' ? 'Конец главной оси отмечен словом end. При column оси меняются местами.' : 'На узком экране прокрутите сетку по горизонтали, чтобы увидеть все колонки.' }}</p>
    <pre class="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-200"><code v-if="mode === 'flex'">display: flex;
flex-direction: {{ direction }};
justify-content: {{ justify }};
align-items: {{ align }};
gap: 16px;
/* карточки: flex: 0 0 auto */</code><code v-else>display: grid;
grid-template-columns: repeat({{ columns }}, 140px);
grid-template-rows: repeat(2, 190px);
justify-items: {{ justifyItems }};
align-items: {{ alignItems }};
justify-content: {{ gridJustify }};
align-content: {{ gridAlign }};
gap: 16px;</code></pre>
  </section>
</template>

<style scoped>
.controls { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:16px; }
label { display:flex; flex-direction:column; gap:6px; font-size:14px; color:#475569; }
.control-label { font-size:14px; color:#475569; }
.chip-group { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
.chip-group button { border-radius:999px; padding:8px 12px; background:#f1f5f9; color:#475569; min-height:44px; font:13px monospace; transition:background-color 160ms,color 160ms; }
.chip-group button.selected { background:#0f172a; color:white; }
@media(prefers-reduced-motion:reduce){.chip-group button{transition:none}}
.scene-scroll { overflow-x:auto; border:1px dashed #94a3b8; border-radius:12px; background:#f1f5f9; }
.flex-scene { position:relative; isolation:isolate; display:flex; width:100%; min-width:300px; height:620px; padding:24px; gap:16px; box-sizing:border-box; border:2px solid #0284c7; }
.flex-viewport { border:0; }
.axes { position:absolute; inset:24px; border:1px dashed #94a3b8; pointer-events:none; z-index:-1; background:linear-gradient(90deg,transparent calc(50% - .5px),#94a3b866 50%,transparent calc(50% + .5px)),linear-gradient(transparent calc(50% - .5px),#94a3b866 50%,transparent calc(50% + .5px)); }
.axis { position:absolute; color:#0369a1; font-size:12px; background:#f1f5f9; padding:2px 4px; }
.horizontal-axis { top:0; left:50%; transform:translate(-50%,-50%); }
.vertical-axis { top:50%; left:0; writing-mode:vertical-rl; transform:translate(-50%,-50%); }
.edge-start,.edge-end { position:absolute; bottom:-20px; font:11px monospace; color:#64748b; }
.edge-start { left:0; }.edge-end { right:0; }
.vertical .edge-start { top:0; bottom:auto; left:auto; right:-20px; }.vertical .edge-end { bottom:0; right:-20px; }
.grid-scene { display:grid; min-width:720px; height:520px; padding:24px; gap:16px; box-sizing:border-box; }
.cell { display:grid; justify-self:stretch; align-self:stretch; outline:1px dashed #94a3b8; background:#e2e8f055; min-width:0; }
.sample { background:white; border-radius:10px; padding:12px; min-width:0; box-shadow:0 2px 5px #0f172a12; }
.row-sample { flex:0 0 auto; width:150px; }
.column-sample { flex:0 0 auto; }
h2 { margin:8px 0 4px; font-weight:700; font-size:14px; }
.sample p { max-width:126px; font-size:12px; line-height:1.5; color:#64748b; }
.placeholder { display:flex; align-items:center; justify-content:center; background:var(--study-gradient); border-radius:6px; font-size:22px; color:#334155; }
@media(max-width:639px) { .row-sample { width:68px; padding:7px; }.sample p { font-size:11px; }.sample h2 { font-size:11px; overflow-wrap:anywhere; }.controls { grid-template-columns:1fr; } select { font-size:16px; min-height:44px; } }
</style>
