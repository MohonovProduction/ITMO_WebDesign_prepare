<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import ConceptMap from '@/components/ConceptMap.vue'
import TheorySection from '@/components/TheorySection.vue'
import { theory } from '@/data/theory'
import { enrichTheoryItem } from '@/data/theoryEnrichment'

const selectedTheoryId = ref(null)

const selectedItem = computed(() => {
  if (selectedTheoryId.value == null) return null
  const base = theory.find((t) => t.id === Number(selectedTheoryId.value))
  return base ? enrichTheoryItem(base) : null
})

function onSelect(id) {
  selectedTheoryId.value = id
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <header>
      <h1 class="text-2xl font-extrabold text-slate-900">Карта понятий</h1>
      <p class="text-slate-500">Связи между ключевыми темами курса. Теория открывается здесь же.</p>
    </header>

    <div class="grid gap-5 lg:grid-cols-2 lg:items-start">
      <ConceptMap :selected-theory-id="selectedTheoryId" @select="onSelect" />

      <div v-if="selectedItem" class="flex flex-col gap-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm font-semibold text-slate-700">Тема на карте</p>
          <RouterLink
            :to="{ path: '/theory', query: { q: String(selectedItem.id) } }"
            class="text-sm font-semibold text-brand-600 hover:underline"
          >
            Открыть в разделе «Теория» →
          </RouterLink>
        </div>
        <TheorySection :item="selectedItem" />
      </div>

      <div
        v-else
        class="card flex min-h-[12rem] items-center justify-center p-6 text-center text-sm text-slate-500 lg:min-h-[320px]"
      >
        Выберите узел на карте, чтобы увидеть определение, примеры и интерпретацию.
      </div>
    </div>
  </div>
</template>
