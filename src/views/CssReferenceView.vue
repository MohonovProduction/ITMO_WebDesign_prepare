<script setup>
import { computed, ref } from 'vue'
import { getConcept } from '@/data/concepts'
import RichText from '@/components/RichText.vue'
import ChoiceChips from '@/components/ChoiceChips.vue'
import LayoutLab from '@/components/LayoutLab.vue'
import PositionLab from '@/components/PositionLab.vue'
import UnitsLab from '@/components/UnitsLab.vue'
const tab = ref('position')
const currentConcept = computed(() => getConcept({ position: 'css-position', flex: 'css-flex-axis', grid: 'css-grid', units: 'css-units' }[tab.value]))
const tabs = [['position','Position'],['flex','Flexbox'],['grid','Grid'],['units','Единицы']]
</script>
<template><div class="flex flex-col gap-6"><header><h1 class="text-2xl font-extrabold text-slate-900">Справочник CSS</h1><p class="mt-1 text-slate-500">Меняйте свойства — схема и код обновляются плавно.</p></header><ChoiceChips v-model="tab" :options="tabs.map(([id, label]) => ({ id, label }))" label="Разделы CSS" />
<Transition name="css-panel" mode="out-in">
<PositionLab v-if="tab === 'position'" key="position" />
<LayoutLab v-else-if="tab === 'flex' || tab === 'grid'" :key="tab" :mode="tab" />
<UnitsLab v-else key="units" /></Transition><aside class="card p-5"><h2 class="font-semibold text-slate-800">{{ currentConcept.question }}</h2><div class="mt-2 text-sm leading-relaxed text-slate-600"><RichText :text="currentConcept.definition" /></div><p class="mt-3 text-xs text-slate-500">Это же определение используется в колоде CSS.</p></aside></div></template>

<style scoped>
.css-panel-enter-active,.css-panel-leave-active{transition:opacity 160ms ease,transform 160ms ease}.css-panel-enter-from,.css-panel-leave-to{opacity:0;transform:translateY(6px)}
@media(prefers-reduced-motion:reduce){.css-panel-enter-active,.css-panel-leave-active{transition:none} :deep(.transition-all){transition:none!important}}
</style>
