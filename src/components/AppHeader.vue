<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const open = ref(false)

const links = [
  { to: '/', label: 'Главная', icon: 'home' },
  { to: '/tracks', label: 'Карта экзамена', icon: 'account_tree' },
  { to: '/theory', label: 'Темы', icon: 'menu_book' },
]

function isActive(to) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
      <RouterLink to="/" class="flex items-center gap-2 font-extrabold">
        <span class="material-symbols-rounded text-gradient" style="font-size: 1.6rem">web</span>
        <span class="text-gradient hidden sm:inline">Веб-проектирование · экзамен</span>
        <span class="text-gradient sm:hidden">Веб-проектирование</span>
      </RouterLink>

      <nav class="hidden items-center gap-1 md:flex">
        <RouterLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="link-gradient flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium"
          :class="isActive(l.to) ? 'is-active text-slate-900' : 'text-slate-600'"
        >
          <span class="material-symbols-rounded" style="font-size: 1.1rem">{{ l.icon }}</span>
          {{ l.label }}
        </RouterLink>
      </nav>

      <button class="btn-secondary !px-3 md:hidden" aria-label="Меню" @click="open = !open">
        <span class="material-symbols-rounded">{{ open ? 'close' : 'menu' }}</span>
      </button>
    </div>

    <nav v-if="open" class="border-t border-slate-100 bg-white px-4 py-2 md:hidden">
      <RouterLink
        v-for="l in links"
        :key="l.to"
        :to="l.to"
        class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium"
        @click="open = false"
      >
        {{ l.label }}
      </RouterLink>
    </nav>
  </header>
</template>
