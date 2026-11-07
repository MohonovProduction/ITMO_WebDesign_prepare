<script setup>
import { topicBranches, matchesTopic } from '@/data/topics'
import { webFlashcards } from '@/data/webFlashcards'
defineProps({ modelValue: { type: String, default: 'all' } })
const emit = defineEmits(['update:modelValue'])
const count = id => webFlashcards.filter(card => matchesTopic(card, id)).length
</script>
<template>
  <nav class="topic-tree" aria-label="Дерево тем карточек">
    <button type="button" :aria-pressed="modelValue === 'all'" @click="emit('update:modelValue', 'all')">Все темы <span>{{ count('all') }}</span></button>
    <ul><li v-for="branch in topicBranches" :key="branch.id">
      <button type="button" :aria-pressed="modelValue === branch.id" @click="emit('update:modelValue', branch.id)">{{ branch.label }} <span>{{ count(branch.id) }}</span></button>
      <ul><li v-for="leaf in branch.children" :key="leaf.id"><button type="button" :aria-pressed="modelValue === leaf.id" @click="emit('update:modelValue', leaf.id)">{{ leaf.label }} <span>{{ count(leaf.id) }}</span></button></li></ul>
    </li></ul>
  </nav>
</template>
<style scoped>
ul{padding-left:16px;margin:8px 0;border-left:1px solid var(--palette-periwinkle,#a4afe8)}li{position:relative}li::before{content:'';position:absolute;left:-16px;top:22px;width:12px;border-top:1px solid var(--palette-periwinkle,#a4afe8)}button{width:100%;display:flex;justify-content:space-between;gap:12px;text-align:left;padding:10px 12px;min-height:44px;border-radius:10px;font-size:14px;transition:background-color 160ms}button[aria-pressed=true]{background:#35485a;color:white}button:hover{background:#e8edf7;color:#243746}span{font-variant-numeric:tabular-nums;opacity:.7}
</style>
