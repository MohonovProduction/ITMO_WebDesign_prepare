<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { useWebProgressStore } from '@/store/webProgress'

const store = useWebProgressStore()

onMounted(() => {
  store.recordPrepDay()
  store.persist()
})
</script>

<template>
  <AppHeader />
  <p v-if="store.storageError" role="status" class="mx-auto mt-4 w-full max-w-5xl rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{{ store.storageError }}</p>

  <main id="main-content" tabindex="-1" class="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 sm:px-6">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>

  <footer class="border-t border-slate-200/70 bg-white/50 backdrop-blur-sm">
    <div class="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-4 py-6 text-center sm:px-6">
      <p class="text-sm font-medium text-slate-600">Разработано с любовью к дизайну <span class="material-symbols-rounded text-gradient" style="font-size: 1.6rem">favorite</span></p>
      <p class="text-xs text-slate-400">Университет ИТМО, Санкт-Петербург, 2026</p>
      <p class="mt-1 text-[11px] text-slate-300">Черновой этап · структура экзамена и карта тем</p>
    </div>
  </footer>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
