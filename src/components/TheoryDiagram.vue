<script setup>
import { computed } from 'vue'
import { theoryBranches } from '@/data/theoryTopics'
const props = defineProps({ modelValue: { type: String, required: true } })
defineEmits(['update:modelValue'])
const branch = computed(() => theoryBranches.find(b => b.id === props.modelValue || b.children.some(c => c.id === props.modelValue)) || theoryBranches[0])
</script>
<template>
  <nav class="card p-4 sm:p-6" aria-label="Диаграмма тем">
    <p class="mb-3 text-xs text-slate-500">Раздел → тема → материалы. <span class="lg:hidden">Схему можно прокручивать по горизонтали.</span></p>
    <div class="mx-auto w-fit rounded-xl bg-slate-800 px-5 py-3 font-bold text-white">Веб-проектирование</div>
    <div class="full-tree"><section v-for="b in theoryBranches" :key="b.id" class="full-branch"><button class="node branch-title" :class="branch.id === b.id ? 'selected' : ''" :aria-pressed="modelValue === b.id" @click="$emit('update:modelValue', b.id)">{{ b.label }}</button><div class="full-children"><button v-for="child in b.children" :key="child.id" class="node" :class="modelValue === child.id ? 'selected' : ''" :aria-pressed="modelValue === child.id" @click="$emit('update:modelValue', child.id)">{{ child.label }}</button></div></section></div>
    <div class="compact-tree">
    <div class="diagram-scroll" tabindex="0" aria-label="Разделы диаграммы, можно прокручивать по горизонтали"><div class="diagram-branches"><button v-for="b in theoryBranches" :key="b.id" class="node" :class="branch.id === b.id ? 'selected' : ''" :aria-pressed="branch.id === b.id" @click="$emit('update:modelValue', b.id)">{{ b.label }}</button></div></div>
    <p class="my-3 text-center text-xs text-slate-600">Ветвь: {{ branch.label }} → выберите тему</p>
    <Transition name="branch" mode="out-in"><div :key="branch.id" class="diagram-scroll" tabindex="0" aria-label="Подтемы диаграммы, можно прокручивать по горизонтали"><div class="diagram-leaves"><button v-for="child in branch.children" :key="child.id" class="node" :class="modelValue === child.id ? 'selected' : ''" :aria-pressed="modelValue === child.id" @click="$emit('update:modelValue', child.id)">{{ child.label }}</button></div></div></Transition>
    </div>
  </nav>
</template>
<style scoped>
.full-tree { display:none; }
@media(min-width:1024px) {
  .compact-tree { display:none; }
  .full-tree { display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:14px; position:relative; padding-top:28px; }
  .full-tree::before { content:'';position:absolute;top:14px;left:8.33%;right:8.33%;border-top:2px solid #a4afe8; }
  .full-tree::after { content:'';position:absolute;top:0;left:50%;height:14px;border-left:2px solid #a4afe8; }
  .full-branch { min-width:0; }
  .full-tree .node { width:100%;max-width:none;font-size:12px;padding:10px 6px;min-height:60px; }
  .full-children { margin:16px 0 0 6px;padding-left:12px;border-left:2px solid #a4afe8;display:flex;flex-direction:column;gap:10px; }
  .full-children .node { flex:none;min-height:48px; }
  .full-children .node::before { left:-14px;top:50%;height:0;width:12px;border-left:0;border-top:2px solid #a4afe8; }
}
.diagram-scroll { overflow-x:auto; padding:3px 3px 8px; }
.diagram-branches,.diagram-leaves { position:relative; display:flex; gap:1rem; padding-top:1.5rem; width:max-content; min-width:100%; justify-content:center; }
.diagram-branches::before,.diagram-leaves::before { content:''; position:absolute; height:.75rem; left:50%; top:0; border-left:2px solid #a4afe8; }
.diagram-branches::after,.diagram-leaves::after { content:''; position:absolute; top:.75rem; left:70px; right:70px; border-top:2px solid #a4afe8; }
.node { position:relative; flex:1 0 140px; width:140px; max-width:180px; border:1px solid #bdcbe4; background:#f5f8fd; border-radius:12px; min-height:48px; padding:12px; font-size:14px; transition:background .2s,box-shadow .2s,transform .2s; }
.node::before { content:''; position:absolute; height:12px; top:-13px; left:50%; border-left:2px solid #a4afe8; }
.node:hover { transform:translateY(-2px); background:#e2e9f7; }
.node.selected { background:var(--study-gradient); box-shadow:0 0 0 2px #596da8; font-weight:700; }
.branch-enter-active,.branch-leave-active { transition:opacity .15s,transform .15s; }
.branch-enter-from,.branch-leave-to { opacity:0; transform:translateY(5px); }
@media(max-width:600px) { .node { font-size:13px; padding:10px; } }
</style>
