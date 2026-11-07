<script setup>
import { computed, ref } from 'vue'
import ResponsiveControls from './ResponsiveControls.vue'
const position = ref('relative')
const descriptions = {
  static: 'Блок стоит между соседями. Смещения top и left не действуют.',
  relative: 'Блок сдвинут относительно своего места. Сосед B остаётся там же: место блока сохранено.',
  absolute: 'Блок вынут из потока. Сосед B занимает освободившееся место, а блок привязан к рамке родителя.',
  fixed: 'Прокрутите мини-окно: блок остаётся у его верхнего края, пока страница движется.',
  sticky: 'Прокрутите мини-окно: блок сначала движется, затем прилипает в 12px от верхнего края. В конце родителя закрепление заканчивается.',
}
const document = computed(() => `<!doctype html><html lang="ru"><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>
*{box-sizing:border-box}body{margin:0;padding:16px;font:14px system-ui;color:#334155;background:#f8fafc}.intro{height:90px;color:#64748b}.parent{position:relative;border:2px solid #0284c7;padding:16px;min-height:650px}.neighbor,.target{padding:16px;border-radius:8px;margin:12px 0}.neighbor{background:#e2e8f0}.target{background:#a3e5d7;position:${position.value};${position.value === 'static' ? '' : 'top:12px;left:12px;'}z-index:1;max-width:220px}.tail{height:380px;padding-top:36px;color:#64748b}.marker{font-size:12px;color:#0369a1}html{scroll-behavior:smooth}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style></head><body><div class="intro">Мини-окно браузера ↕<br>Прокрутите эту область</div><section class="parent"><span class="marker">Родитель · position: relative</span><div class="neighbor">Сосед A</div><div class="target">Выбранный блок<br><strong>${position.value}</strong></div><div class="neighbor">Сосед B</div><p>Содержимое родителя</p></section><div class="tail">Родитель закончился. Страница продолжается.</div>${position.value === 'sticky' ? '<script>addEventListener("load",()=>requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:280,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"}))));<\/script>' : ''}</body></html>`)
</script>
<template>
  <section class="card p-5">
    <ResponsiveControls title="Позиционирование"><div class="flex flex-wrap gap-2"><button v-for="(_, key) in descriptions" :key="key" :aria-pressed="position === key" class="rounded-lg px-3 py-3 font-mono text-sm transition-colors" :class="position === key ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'" @click="position = key">{{ key }}</button></div></ResponsiveControls>
    <p class="my-4 text-sm text-slate-600" aria-live="polite">{{ descriptions[position] }}</p>
    <Transition name="position-scene" mode="out-in"><iframe :key="position" :srcdoc="document" title="Прокручиваемая демонстрация CSS position" sandbox="allow-scripts" class="position-window" /></Transition>
    <pre class="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-200"><code>.parent { position: relative; }
.target {
  position: {{ position }};
  top: 12px;
  left: 12px;
}</code></pre>
  </section>
</template>
<style scoped>
.position-window{width:100%;height:400px;border:1px solid #94a3b8;border-radius:12px;background:#f8fafc}
.position-scene-enter-active,.position-scene-leave-active{transition:opacity 140ms ease,transform 140ms ease}.position-scene-enter-from,.position-scene-leave-to{opacity:0;transform:translateY(4px)}
@media(prefers-reduced-motion:reduce){.position-scene-enter-active,.position-scene-leave-active{transition:none}}
</style>
