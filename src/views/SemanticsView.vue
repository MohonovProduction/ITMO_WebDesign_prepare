<script setup>
import { computed, ref } from 'vue'
import { semanticCodeLines, semanticTags, tagCategoryStyles } from '@/data/semanticTags'

const activeTag = ref(null)
const openTag = ref(null)
const selected = computed(() => semanticTags.find((item) => item.tag === activeTag.value) || null)
const tagByName = Object.fromEntries(semanticTags.map((item) => [item.tag, item]))

function selectTag(tag) {
  if (activeTag.value === tag) {
    clearSelection()
    return
  }
  activeTag.value = tag
  openTag.value = tag
}

function clearSelection() { activeTag.value = null; openTag.value = null }

function isRelated(item) {
  return selected.value?.path.includes(item.tag) || item.path.includes(selected.value?.tag)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <header>
      <h1 class="text-2xl font-extrabold text-slate-900">Справочник семантики HTML</h1>
      <p class="mt-1 max-w-3xl text-slate-500">Откройте карточку тега — он и путь к нему подсветятся в дереве страницы. Цвет отражает группу, как в IDE.</p>
    </header>

    <div v-if="selected" class="sticky top-20 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
      <span><code class="font-mono text-brand-100">&lt;{{ selected.tag }}&gt;</code><span class="mx-2 text-slate-500">·</span><span class="font-mono text-slate-200">{{ selected.path.join(' > ') }}</span></span>
      <button type="button" class="rounded-lg bg-white/10 px-3 py-1.5 font-semibold text-white hover:bg-white/20" @click="clearSelection">Снять выделение</button>
    </div>

    <section class="card overflow-hidden">
      <div class="border-b border-slate-200 bg-slate-900 px-5 py-3 font-mono text-sm text-slate-300">
        page.html <span class="text-slate-500">· интерактивная схема</span>
      </div>
      <div class="overflow-x-auto bg-slate-950 p-5 font-mono text-sm leading-7">
        <div v-for="(line, index) in semanticCodeLines" :key="`${line.tag}-${index}`" class="whitespace-nowrap" :style="{ paddingLeft: `${line.indent * 1.25}rem` }">
          <button type="button" class="rounded px-1 text-left transition hover:bg-slate-800" :class="[tagCategoryStyles[tagByName[line.tag].category], activeTag === line.tag ? 'bg-slate-700 ring-1 ring-white/40' : '', activeTag && isRelated(tagByName[line.tag]) ? 'opacity-100' : activeTag ? 'opacity-40' : '']" @click="selectTag(line.tag)">
            <span class="text-slate-500">&lt;{{ line.closing ? '/' : '' }}</span>{{ line.tag }}<span v-if="line.attributes" class="text-slate-400">{{ line.attributes }}</span><span class="text-slate-500">{{ line.void ? ' /' : '' }}&gt;</span><span v-if="line.text" class="text-slate-300">{{ line.text }}</span><span v-if="line.inline" class="text-slate-500">&lt;/{{ line.tag }}&gt;</span>
          </button>
        </div>
      </div>
      <div v-if="selected" class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 text-sm">
        <div>
        <span class="font-semibold text-slate-500">Путь в DOM:</span>
        <span class="ml-2 font-mono text-slate-800">{{ selected.path.join(' > ') }}</span>
        </div>
        <button type="button" class="text-sm font-semibold text-slate-500 hover:text-slate-800 hover:underline" @click="clearSelection">Снять выделение</button>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <article v-for="item in semanticTags" :key="item.tag" class="card overflow-hidden">
        <button type="button" class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left" @click="selectTag(item.tag)">
          <span class="flex items-center gap-3"><code class="rounded bg-slate-100 px-2 py-1 font-mono text-sm" :class="tagCategoryStyles[item.category]">&lt;{{ item.tag }}&gt;</code><span class="font-semibold text-slate-800">{{ item.role }}</span></span>
          <span class="material-symbols-rounded text-slate-400">{{ openTag === item.tag ? 'expand_less' : 'expand_more' }}</span>
        </button>
        <div v-if="openTag === item.tag" class="border-t border-slate-100 px-5 py-4">
          <p class="text-sm leading-relaxed text-slate-600"><span class="font-semibold text-slate-700">Когда использовать:</span> {{ item.when }}</p>
          <p class="mt-3 text-sm"><span class="font-semibold text-slate-500">DOM-путь:</span> <code class="ml-1 font-mono text-slate-700">{{ item.path.join(' > ') }}</code></p>
          <a class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline" :href="item.mdn" target="_blank" rel="noreferrer">Подробнее на MDN Web Docs <span class="material-symbols-rounded text-base">open_in_new</span></a>
        </div>
      </article>
    </section>
  </div>
</template>
