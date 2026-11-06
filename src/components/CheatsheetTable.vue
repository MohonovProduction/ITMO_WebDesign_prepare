<script setup>
import MathText from '@/components/MathText.vue'
import Formula from '@/components/Formula.vue'

defineProps({
  items: { type: Array, required: true },
  compact: { type: Boolean, default: false },
})
</script>

<template>
  <div class="card overflow-hidden p-0">
    <div class="overflow-x-auto">
      <table class="cheatsheet-table w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr class="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th class="w-10 px-3 py-2.5">№</th>
            <th class="min-w-[10rem] px-3 py-2.5">Тема</th>
            <th v-if="!compact" class="min-w-[14rem] px-3 py-2.5">Определение</th>
            <th class="min-w-[12rem] px-3 py-2.5">Формулы</th>
            <th v-if="!compact" class="min-w-[10rem] px-3 py-2.5">Мнемоника</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            class="border-b border-slate-100 align-top hover:bg-slate-50/80"
          >
            <td class="px-3 py-3 font-semibold text-brand-600">{{ item.id }}</td>
            <td class="px-3 py-3 font-semibold text-slate-900">
              <MathText :text="item.title" />
            </td>
            <td v-if="!compact" class="px-3 py-3 text-slate-700">
              <MathText v-if="item.definition" :text="item.definition" />
              <span v-else class="text-slate-400">—</span>
            </td>
            <td class="px-3 py-3">
              <div v-if="item.formulas?.length" class="flex flex-col gap-1.5">
                <template v-if="compact">
                  <p v-for="(f, i) in item.formulas" :key="i" class="leading-snug text-slate-800">
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
              <span v-else class="text-slate-400">—</span>
            </td>
            <td v-if="!compact" class="px-3 py-3 text-slate-600 italic">
              <MathText v-if="item.mnemonic" :text="item.mnemonic" />
              <span v-else class="text-slate-400 not-italic">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
