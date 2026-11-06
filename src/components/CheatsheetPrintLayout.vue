<script setup>
import MathText from '@/components/MathText.vue'
import Formula from '@/components/Formula.vue'

defineProps({
  mode: { type: String, required: true }, // 'compact' | 'full'
  items: { type: Array, required: true },
  title: { type: String, default: 'Шпаргалка' },
})
</script>

<template>
  <div
    class="cheatsheet-print-root hidden print:block"
    :class="mode === 'compact' ? 'cheatsheet-compact-print' : 'cheatsheet-full-print'"
  >
    <header class="cheatsheet-print-header mb-2">
      <h1 class="text-sm font-bold text-slate-900">{{ title }}</h1>
      <p v-if="mode === 'compact'" class="text-[7pt] text-slate-500">Компактная · мат. статистика · C-15</p>
      <p v-else class="text-[8pt] text-slate-500">Полная · {{ items.length }} тем</p>
    </header>
    <table class="cheatsheet-print-table w-full border-collapse">
      <thead>
        <tr>
          <th class="cheatsheet-print-th">№</th>
          <th class="cheatsheet-print-th">Тема</th>
          <th v-if="mode === 'full'" class="cheatsheet-print-th">Определение</th>
          <th class="cheatsheet-print-th">Формулы</th>
          <th v-if="mode === 'full'" class="cheatsheet-print-th">Мнемоника</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.id + '-' + (item.theoryId || '')"
          class="cheatsheet-print-row"
        >
          <td class="cheatsheet-print-td font-semibold text-brand-700">{{ item.id }}</td>
          <td class="cheatsheet-print-td font-semibold">
            <MathText :text="item.title" />
          </td>
          <td v-if="mode === 'full'" class="cheatsheet-print-td">
            <MathText v-if="item.definition" :text="item.definition" />
          </td>
          <td class="cheatsheet-print-td">
            <div v-if="item.formulas?.length" class="flex flex-col gap-0.5">
              <template v-if="mode === 'compact'">
                <p v-for="(f, i) in item.formulas" :key="i">
                  <MathText :text="f" />
                </p>
              </template>
              <template v-else>
                <Formula
                  v-for="(f, i) in item.formulas"
                  :key="i"
                  :expr="f"
                  :display="false"
                />
              </template>
            </div>
          </td>
          <td v-if="mode === 'full'" class="cheatsheet-print-td cheatsheet-print-mnemonic">
            <MathText v-if="item.mnemonic" :text="item.mnemonic" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
