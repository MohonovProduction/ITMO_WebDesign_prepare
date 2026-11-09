<script setup>
import { onBeforeUnmount, watch } from 'vue'
import { notification, dismissNotification } from '@/store/notifications'
let timer
function pause() { clearTimeout(timer) }
function resume() { pause(); if (notification.value) timer = setTimeout(dismissNotification, 12000) }
watch(notification, resume)
onBeforeUnmount(pause)
</script>
<template>
  <Teleport to="body"><div class="toast-region" role="status" aria-live="polite" aria-atomic="true"><Transition name="toast"><aside v-if="notification" :key="notification.id" class="progress-toast" @mouseenter="pause" @mouseleave="resume" @focusin="pause" @focusout="resume" @keydown.esc="dismissNotification"><div class="flex items-start justify-between gap-3"><h2 class="font-bold"><span aria-hidden="true" class="mr-2 text-teal-700">✓</span>{{ notification.title }}</h2><button type="button" class="min-h-11 min-w-11 rounded-lg text-slate-600 hover:bg-slate-100" aria-label="Закрыть уведомление" @click="dismissNotification">✕</button></div><dl class="space-y-3"><div v-for="row in notification.rows" :key="row.label"><dt class="text-xs text-slate-500">{{ row.label }}</dt><dd class="mt-1 text-sm"><span class="text-slate-500">{{ row.before }}</span><span aria-hidden="true" class="mx-2">→</span><span class="sr-only">стало</span><strong>{{ row.after }}</strong><span class="mt-1 block text-xs text-teal-800">{{ row.change }}</span></dd></div></dl><RouterLink to="/" class="mt-4 inline-block text-sm font-semibold text-brand-700 underline" @click="dismissNotification">Открыть дашборд →</RouterLink></aside></Transition></div></Teleport>
</template>
<style scoped>
.toast-region { position:fixed;top:88px;right:20px;z-index:60;width:min(380px,calc(100vw - 32px));pointer-events:none; }
.progress-toast { pointer-events:auto;background:#fffffff5;border:1px solid #bcebd9;border-radius:18px;padding:16px 20px 20px;box-shadow:0 12px 50px #35485a30;backdrop-filter:blur(12px); }
.toast-enter-active,.toast-leave-active { transition:opacity .22s,transform .22s; }
.toast-enter-from,.toast-leave-to { opacity:0;transform:translateY(-10px); }
@media(max-width:639px) { .toast-region { top:76px;right:16px; } }
</style>
