<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
defineProps({ title: { type: String, default: 'Настройки сцены' }, triggerLabel: { type: String, default: 'Настроить сцену' } })
const mobile = ref(false)
const dialog = ref(null)
const opened = ref(false)
let query
function sync() { close(); mobile.value = query.matches }
async function open() {
  opened.value = true
  await nextTick()
  dialog.value?.showModal()
}
async function close() {
  const element = dialog.value
  if (element?.open && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    await element.animate([{ transform:'translateY(0)', opacity:1 }, { transform:'translateY(100%)', opacity:0 }], { duration:180, easing:'ease-in', fill:'forwards' }).finished.catch(() => {})
  }
  element?.close()
  element?.getAnimations().forEach(animation => animation.cancel())
  opened.value = false
}
onMounted(() => { query = window.matchMedia('(max-width: 639px)'); mobile.value = query.matches; query.addEventListener('change', sync) })
onBeforeUnmount(() => { query?.removeEventListener('change', sync); dialog.value?.close() })
</script>

<template>
  <div v-if="!mobile"><slot /></div>
  <template v-else>
    <Teleport to="body">
      <button class="sheet-trigger" type="button" :aria-expanded="opened" @click="open">{{ triggerLabel }} <span aria-hidden="true">☷</span></button>
      <dialog ref="dialog" class="control-sheet" aria-label="Настройки учебной сцены" @cancel.prevent="close" @close="opened = false" @click="event => { if (event.target === dialog) close() }">
        <div class="sheet-content">
          <div class="sheet-heading"><h2>{{ title }}</h2><button type="button" aria-label="Закрыть настройки" @click="close">Готово</button></div>
          <slot />
        </div>
      </dialog>
    </Teleport>
  </template>
</template>

<style scoped>
.sheet-trigger { position:fixed; bottom:calc(16px + env(safe-area-inset-bottom)); left:50%; transform:translateX(-50%); z-index:30; background:#0f172a; color:white; border-radius:999px; padding:14px 24px; min-height:48px; box-shadow:0 6px 24px #0f172a40; white-space:nowrap; }
.sheet-trigger span { margin-left:12px; }
.control-sheet { position:fixed; inset:auto 0 0; margin:0; width:100%; max-width:none; max-height:50dvh; padding:0; border:0; border-radius:20px 20px 0 0; background:white; color:#334155; overflow:auto; box-shadow:0 -8px 40px #0f172a22; }
.control-sheet[open] { animation:sheet-in 240ms cubic-bezier(.2,.8,.2,1); }
.control-sheet::backdrop { background:#0f172a20; }
.sheet-content { padding:20px 20px calc(24px + env(safe-area-inset-bottom)); }
.sheet-heading { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:20px; }
.sheet-heading h2 { font-size:16px; font-weight:700; }
.sheet-heading button { min-height:44px; padding:8px 16px; border-radius:10px; background:#f1f5f9; font-weight:600; }
@keyframes sheet-in { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
@media(prefers-reduced-motion:reduce) { .control-sheet[open] { animation:none; } }
</style>
