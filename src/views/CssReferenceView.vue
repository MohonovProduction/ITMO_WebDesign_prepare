<script setup>
import { ref } from 'vue'
import LayoutLab from '@/components/LayoutLab.vue'
import PositionLab from '@/components/PositionLab.vue'
import UnitsLab from '@/components/UnitsLab.vue'
const tab = ref('position')
const tabs = [['position','Position'],['flex','Flexbox'],['grid','Grid'],['units','Единицы']]
</script>
<template><div class="flex flex-col gap-6"><header><h1 class="text-2xl font-extrabold text-slate-900">Справочник CSS</h1><p class="mt-1 text-slate-500">Меняйте свойства — схема и код обновляются плавно.</p></header><nav class="flex flex-wrap gap-2"><button v-for="item in tabs" :key="item[0]" class="rounded-full px-4 py-2 text-sm font-semibold transition" :class="tab===item[0]?'bg-brand-gradient text-slate-800 shadow-sm':'bg-white text-slate-600 ring-1 ring-slate-200'" @click="tab=item[0]">{{ item[1] }}</button></nav>
<Transition name="css-panel" mode="out-in">
<PositionLab v-if="tab === 'position'" key="position" />
<LayoutLab v-else-if="tab === 'flex' || tab === 'grid'" :key="tab" :mode="tab" />
<UnitsLab v-else key="units" /></Transition></div></template>

<style scoped>
.css-panel-enter-active,.css-panel-leave-active{transition:opacity 160ms ease,transform 160ms ease}.css-panel-enter-from,.css-panel-leave-to{opacity:0;transform:translateY(6px)}
@media(prefers-reduced-motion:reduce){.css-panel-enter-active,.css-panel-leave-active{transition:none} :deep(.transition-all){transition:none!important}}
</style>
