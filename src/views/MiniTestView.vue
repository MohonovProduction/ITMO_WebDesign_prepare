<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProgressStore } from '@/store/progress'
import { LEVELS, levelById } from '@/data/levels'
import MiniTest from '@/components/MiniTest.vue'

const route = useRoute()
const router = useRouter()
const store = useProgressStore()

const levelId = computed(() => {
  const param = route.params.level
  return levelById(param) ? param : store.currentLevel.id
})

function onComplete({ levelId: lvl, correct, total }) {
  store.saveMiniTest(lvl, correct, total)
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Выбор уровня -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="l in LEVELS"
        :key="l.id"
        class="rounded-full px-4 py-2 text-sm font-semibold transition"
        :class="levelId === l.id ? 'bg-brand-gradient text-slate-800 shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'"
        @click="router.replace(`/minitest/${l.id}`)"
      >
        {{ l.icon }} {{ l.title }}
      </button>
    </div>

    <!-- key перезапускает тест при смене уровня -->
    <MiniTest
      :key="levelId"
      :level-id="levelId"
      :count="5"
      @complete="onComplete"
      @cards="router.push('/flashcards')"
    />
  </div>
</template>
