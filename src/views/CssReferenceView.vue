<script setup>
import { computed, ref } from 'vue'
import { cssRules } from '@/data/cssReference'

const active = ref(null)
const item = computed(() => cssRules.find((rule) => rule.id === active.value))
function select(id) { active.value = active.value === id ? null : id }
</script>

<template>
  <div class="flex flex-col gap-6">
    <header><h1 class="text-2xl font-extrabold text-slate-900">Справочник CSS</h1><p class="mt-1 text-slate-500">Селекторы, типографика, раскладка, состояния и адаптив из конспекта.</p></header>
    <div v-if="item" class="sticky top-20 z-10 flex items-center justify-between gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg"><code>{{ item.code }}</code><button class="rounded-lg bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20" @click="active = null">Снять выделение</button></div>
    <section class="card overflow-hidden"><div class="border-b border-slate-200 bg-slate-900 px-5 py-3 font-mono text-sm text-slate-300">styles.css</div><pre class="overflow-x-auto bg-slate-950 p-5 text-sm leading-7 text-slate-300"><code><button class="text-sky-300" :class="active === 'selector' || active === 'descendant' ? 'rounded bg-slate-700' : ''" @click="select('selector')">.profile-card</button> {
  <button class="text-violet-300" :class="active === 'layout' ? 'rounded bg-slate-700' : ''" @click="select('layout')">display: flex</button>;
  <button class="text-violet-300" :class="active === 'gap' ? 'rounded bg-slate-700' : ''" @click="select('gap')">gap</button>: 1rem;
  <button class="text-violet-300" :class="active === 'font' ? 'rounded bg-slate-700' : ''" @click="select('font')">font-family</button>: Inter, sans-serif;
}
<button class="text-sky-300" :class="active === 'hover' ? 'rounded bg-slate-700' : ''" @click="select('hover')">.profile-card:hover</button> { transform: translateY(-2px); }
<button class="text-amber-300" :class="active === 'media' ? 'rounded bg-slate-700' : ''" @click="select('media')">@media</button> (max-width: 720px) { .profile-card { display: block; } }</code></pre></section>
    <section class="flex flex-col gap-3"><article v-for="rule in cssRules" :key="rule.id" class="card overflow-hidden"><button class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left" @click="select(rule.id)"><span><code class="rounded bg-slate-100 px-2 py-1 font-mono text-sm text-violet-700">{{ rule.code }}</code><span class="ml-3 font-semibold text-slate-800">{{ rule.title }}</span></span><span class="material-symbols-rounded text-slate-400">{{ active === rule.id ? 'expand_less' : 'expand_more' }}</span></button><div v-if="active === rule.id" class="border-t border-slate-100 px-5 py-4"><p class="text-sm text-slate-600">{{ rule.description }}</p><p class="mt-3 text-sm text-slate-500">Связанная карточка: <code class="font-mono">{{ rule.cardId }}</code></p><a class="mt-4 inline-flex text-sm font-semibold text-brand-700 hover:underline" :href="rule.mdn" target="_blank" rel="noreferrer">Подробнее на MDN Web Docs →</a></div></article></section>
  </div>
</template>
