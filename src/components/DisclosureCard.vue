<script setup>
defineProps({ id: { type: String, required: true }, open: { type: Boolean, default: false } })
const emit = defineEmits(['toggle'])
</script>
<template>
  <article class="card overflow-hidden">
    <h2><button :id="`${id}-trigger`" type="button" :aria-expanded="open" :aria-controls="`${id}-content`" class="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left" @click="emit('toggle')"><span class="min-w-0"><slot name="heading" /></span><span aria-hidden="true" class="material-symbols-rounded shrink-0 text-slate-500 transition-transform" :class="{ 'rotate-180': open }">expand_more</span></button></h2>
    <Transition name="disclosure"><div v-show="open" :id="`${id}-content`" :aria-labelledby="`${id}-trigger`" class="border-t border-slate-100 px-5 py-4"><slot /></div></Transition>
  </article>
</template>
<style scoped>
.disclosure-enter-active,.disclosure-leave-active{transition:opacity 150ms ease,transform 150ms ease}.disclosure-enter-from,.disclosure-leave-to{opacity:0;transform:translateY(-4px)}
@media(prefers-reduced-motion:reduce){.disclosure-enter-active,.disclosure-leave-active{transition:none}}
</style>
