<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const open = ref(false)
const referencesOpen = ref(false)
const references = [
  { to: '/semantics', label: 'HTML — семантика' },
  { to: '/css', label: 'CSS — лаборатории' },
  { to: '/svg', label: 'SVG — графика' },
]
watch(() => route.path, () => { open.value = false; referencesOpen.value = false })

const links = [
  { to: '/', label: 'Главная', icon: 'home' },
  { to: '/tracks', label: 'Карта экзамена', icon: 'account_tree' },
  { to: '/theory', label: 'Темы', icon: 'menu_book' },
  { to: '/flashcards', label: 'Карточки', icon: 'style' },
  { to: '/practice', label: 'Билет', icon: 'school' },
]

function isActive(to) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:p-4">Перейти к содержимому</a>
  <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur" @keydown.esc="open = false; referencesOpen = false">
    <div class="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
      <RouterLink to="/" class="flex items-center gap-2 font-extrabold">
        <span class="material-symbols-rounded text-gradient" style="font-size: 1.6rem">web</span>
        <span class="text-gradient hidden sm:inline">Веб-проектирование · Господин БаллОвский</span>
        <span class="text-gradient sm:hidden">Веб-проектирование</span>
      </RouterLink>

      <nav aria-label="Основная навигация" class="hidden items-center gap-1 xl:flex">
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
        <div class="relative" @focusout="event => { if (!event.currentTarget.contains(event.relatedTarget)) referencesOpen = false }">
          <button type="button" :aria-expanded="referencesOpen" aria-controls="desktop-references" class="min-h-11 rounded-lg px-2 text-sm font-medium text-slate-600" @click="referencesOpen = !referencesOpen">Справочники ▾</button>
          <Transition name="navigation"><div v-show="referencesOpen" id="desktop-references" class="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-slate-200">
            <RouterLink v-for="item in references" :key="item.to" :to="item.to" :aria-current="route.path === item.to ? 'page' : undefined" class="block rounded-lg px-3 py-3 text-sm text-slate-700 hover:bg-slate-50">{{ item.label }}</RouterLink>
          </div></Transition>
        </div>
      </nav>

      <button type="button" class="btn-secondary !px-3 xl:hidden" aria-label="Меню" :aria-expanded="open" aria-controls="mobile-navigation" @click="open = !open">
        <span class="material-symbols-rounded">{{ open ? 'close' : 'menu' }}</span>
      </button>
    </div>

    <Transition name="navigation"><nav v-show="open" id="mobile-navigation" aria-label="Мобильная навигация" class="max-h-[75dvh] overflow-y-auto border-t border-slate-100 bg-white px-4 py-2 xl:hidden">
      <RouterLink
        v-for="l in links"
        :key="l.to"
        :to="l.to"
        class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium"
        @click="open = false"
      >
        {{ l.label }}
      </RouterLink>
      <p class="px-3 pt-3 text-sm font-semibold text-slate-500">Справочники</p>
      <RouterLink v-for="item in references" :key="item.to" :to="item.to" :aria-current="route.path === item.to ? 'page' : undefined" class="block rounded-lg px-3 py-3 text-sm text-slate-700" @click="open = false">{{ item.label }}</RouterLink>
    </nav></Transition>
  </header>
</template>

<style scoped>
.navigation-enter-active,.navigation-leave-active{transition:opacity 150ms ease,transform 150ms ease}.navigation-enter-from,.navigation-leave-to{opacity:0;transform:translateY(-4px)}
</style>
