<script setup>
import RichText from './RichText.vue'
defineProps({ kind:{type:String,default:'plain'}, text:{type:String,default:''}, items:{type:Array,default:() => []} })
</script>
<template>
  <aside class="study-note" :class="kind === 'errors' ? 'note-errors' : 'note-plain'"><h3 class="mb-2 flex items-center gap-2 text-sm font-bold"><span aria-hidden="true" class="material-symbols-rounded">{{ kind === 'errors' ? 'warning' : 'lightbulb' }}</span>{{ kind === 'errors' ? 'Частые ошибки' : 'На пальцах' }}</h3><div v-if="text" class="text-sm leading-relaxed"><RichText :text="text" /></div><ul v-if="items.length" class="list-disc space-y-2 pl-5 text-sm leading-relaxed"><li v-for="item in items" :key="item"><RichText :text="item" /></li></ul></aside>
</template>
<style scoped>
.study-note { padding:16px 18px;border-radius:14px;border-left:4px solid; }
.note-errors { background:#fff7e8;border-color:#c68b24;color:#694b18; }
.note-plain { background:#edf8f7;border-color:#4e948b;color:#2c5e5b; }
.material-symbols-rounded { font-size:20px;flex:none; }
</style>
