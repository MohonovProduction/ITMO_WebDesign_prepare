<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
const props = defineProps({ modelValue:Boolean, title:{type:String,required:true} })
const emit = defineEmits(['update:modelValue'])
const dialog = ref(null)
let returnFocus
let closing = false
async function close() {
  if (closing) return
  closing = true
  const element = dialog.value
  if (element?.open && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) await element.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(60px)',opacity:0}],{duration:160,easing:'ease-in'}).finished.catch(() => {})
  element?.close(); emit('update:modelValue', false); closing = false
  returnFocus?.focus?.()
}
watch(() => props.modelValue, async value => {
  await nextTick()
  if (value && !dialog.value?.open) { returnFocus = document.activeElement; dialog.value?.showModal() }
  else if (!value && dialog.value?.open) close()
}, {immediate:true})
onBeforeUnmount(() => dialog.value?.close())
</script>
<template>
  <Teleport to="body"><dialog ref="dialog" class="sheet-dialog" :aria-label="title" @cancel.prevent="close" @click="event => { if(event.target === dialog) close() }" @close="$emit('update:modelValue', false)"><div class="sheet-inner"><div class="mb-4 flex items-start justify-between gap-4"><h2 class="text-xl font-bold">{{ title }}</h2><button class="btn-secondary" aria-label="Закрыть разминку" @click="close">Закрыть</button></div><slot :close="close" /></div></dialog></Teleport>
</template>
<style scoped>
.sheet-dialog { position:fixed;inset:auto 0 0;margin:0 auto;width:100%;max-width:720px;max-height:90dvh;border:0;border-radius:24px 24px 0 0;padding:0;background:#f8fafc;color:#334155;box-shadow:0 -8px 50px #0f172a30;overflow:auto;overscroll-behavior:contain; }
.sheet-inner { padding:24px 20px calc(24px + env(safe-area-inset-bottom)); }
.sheet-dialog::backdrop { background:#0f172a55;backdrop-filter:blur(3px); }
.sheet-dialog[open] { animation:open-sheet .24s cubic-bezier(.2,.8,.2,1); }
@keyframes open-sheet { from {opacity:0;transform:translateY(60px)} to {opacity:1;transform:translateY(0)} }
</style>
