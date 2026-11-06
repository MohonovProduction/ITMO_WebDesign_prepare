<script setup>
import { computed, ref } from 'vue'
import { LEVELS } from '@/data/levels'
import { useCheatsheet } from '@/composables/useCheatsheet'
import { useCheatsheetPrint } from '@/composables/useCheatsheetPrint'
import { compactItemsFromTheory } from '@/data/cheatsheetCompact'
import { theory } from '@/data/theory'
import { enrichTheoryItem } from '@/data/theoryEnrichment'
import CheatsheetTable from '@/components/CheatsheetTable.vue'
import CheatsheetPrintLayout from '@/components/CheatsheetPrintLayout.vue'

const { query, activeLevel, items } = useCheatsheet()
const levelOptions = [{ id: 'all', title: 'Все' }, ...LEVELS]
const screenMode = ref('full') // 'full' | 'compact'

const compactPreview = computed(() => compactItemsFromTheory(theory.map(enrichTheoryItem)))

const { printMode, printItems, triggerPrint } = useCheatsheetPrint(() => items.value)

const displayItems = computed(() =>
  screenMode.value === 'compact' ? compactPreview.value.map((c) => ({
    id: c.theoryId,
    title: c.title,
    definition: c.lines?.join(' · ') || '',
    formulas: c.formulas || c.lines || [],
    mnemonic: c.mnemonic,
  })) : items.value,
)
</script>

<template>
  <div class="cheatsheet-print flex flex-col gap-5">
    <header>
      <h1 class="text-2xl font-extrabold text-slate-900">Шпаргалка</h1>
      <p class="text-slate-500">Все определения и формулы — из раздела «Теория», без дублирования.</p>
    </header>

    <div class="card flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="btn-primary text-sm"
          @click="triggerPrint('compact')"
        >
          Скачать компактную (1 стр.)
        </button>
        <button
          type="button"
          class="btn-secondary text-sm"
          @click="triggerPrint('full')"
        >
          Скачать полную
        </button>
      </div>
      <p class="text-xs text-slate-500">Откроется диалог печати → «Сохранить как PDF». Для компактной выберите альбомную ориентацию.</p>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="rounded-full px-3 py-1.5 text-sm font-semibold"
        :class="screenMode === 'full' ? 'bg-brand-gradient text-slate-800' : 'bg-white ring-1 ring-slate-200'"
        @click="screenMode = 'full'"
      >
        На экране: полная
      </button>
      <button
        type="button"
        class="rounded-full px-3 py-1.5 text-sm font-semibold"
        :class="screenMode === 'compact' ? 'bg-brand-gradient text-slate-800' : 'bg-white ring-1 ring-slate-200'"
        @click="screenMode = 'compact'"
      >
        На экране: компактная
      </button>
    </div>

    <template v-if="screenMode === 'full'">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="l in levelOptions"
          :key="l.id"
          class="rounded-full px-3 py-1.5 text-sm font-semibold"
          :class="activeLevel === l.id ? 'bg-brand-gradient text-slate-800' : 'bg-white ring-1 ring-slate-200'"
          @click="activeLevel = l.id"
        >
          {{ l.title }}
        </button>
      </div>
      <input v-model="query" type="search" placeholder="Поиск…" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
    </template>

    <p class="text-sm text-slate-400">Тем: {{ displayItems.length }}</p>
    <CheatsheetTable :items="displayItems" :compact="screenMode === 'compact'" />

    <CheatsheetPrintLayout
      v-if="printMode"
      :mode="printMode"
      :items="printItems"
      :title="printMode === 'compact' ? 'Шпаргалка · компакт' : 'Шпаргалка · полная'"
    />
  </div>
</template>
