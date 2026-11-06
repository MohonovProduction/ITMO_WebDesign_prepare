<script setup>
import { useRouter } from 'vue-router'
import { useFunnel } from '@/composables/useFunnel'
import FunnelLevel from '@/components/FunnelLevel.vue'

const router = useRouter()
const { levels, currentLevel, threshold } = useFunnel()

function goMiniTest(levelId) {
  router.push(`/minitest/${levelId}`)
}
function goCards() {
  router.push('/flashcards')
}
function goTheory() {
  router.push('/theory')
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <header>
      <h1 class="text-2xl font-extrabold text-slate-900">Воронка подготовки</h1>
      <p class="text-slate-500">
        Три уровня. Чтобы открыть следующий, наберите не менее {{ threshold }}% в мини-тесте текущего.
      </p>
    </header>

    <div class="rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
      Текущий уровень: <strong>{{ currentLevel.icon }} {{ currentLevel.title }}</strong>
    </div>

    <!-- Уровни «воронкой»: сверху шире, вниз уже -->
    <div class="flex flex-col items-stretch gap-4">
      <div
        v-for="(l, i) in levels"
        :key="l.id"
        class="mx-auto w-full transition-all"
        :style="{ maxWidth: `${100 - i * 8}%` }"
      >
        <FunnelLevel
          :level="l"
          :threshold="threshold"
          @minitest="goMiniTest(l.id)"
          @cards="goCards"
          @theory="goTheory"
        />
      </div>
    </div>
  </div>
</template>
