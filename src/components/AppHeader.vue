<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const open = ref(false)
const activeGroup = ref(null)
const header = ref(null)
const groups = [
  { id:'learn', label:'Теория', text:'Понять и связать темы', links:[
    {to:'/theory',label:'Темы и конспекты',description:'Диаграмма тем и два блока экзамена'},
    {to:'/tracks',label:'Карта экзамена',description:'Вопросы и структура подготовки'},
  ]},
  { id:'practice',label:'Тренажёры',text:'Закрепить и проверить',links:[
    {to:'/trainers',label:'Все тренажёры',description:'Селекторы, семантика и формы'},
    {to:'/flashcards',label:'Карточки',description:'Повторение незнакомого'},
    {to:'/practice',label:'Билет',description:'Устный ответ и самопроверка'},
  ]},
  { id:'references',label:'Справочники',text:'Попробовать на практике',links:[
    {to:'/semantics',label:'HTML',description:'Структура, формы и input'},
    {to:'/css',label:'CSS',description:'Основы, box model и раскладка'},
    {to:'/svg',label:'SVG',description:'Фигуры и интерактивные схемы'},
  ]},
]
function selected(group) { return group.links.some(item=>item.to === route.path) }
function close() { activeGroup.value=null; open.value=false }
function outside(event) { if (!header.value?.contains(event.target)) close() }
watch(()=>route.path, close)
onMounted(()=>document.addEventListener('pointerdown',outside))
onBeforeUnmount(()=>document.removeEventListener('pointerdown',outside))
</script>
<template>
  <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:p-4">Перейти к содержимому</a>
  <header ref="header" class="app-header" @keydown.esc="close" @focusout="event=>{ if (!event.currentTarget.contains(event.relatedTarget)) close() }">
    <div class="header-row">
      <RouterLink to="/" class="brand" aria-label="Веб-проектирование — главная"><span class="brand-icon material-symbols-rounded" aria-hidden="true">web</span><span><strong>Веб-проектирование</strong><small>Господин БаллОвский · ИТМО</small></span></RouterLink>
      <nav class="desktop-nav" aria-label="Основная навигация">
        <RouterLink to="/" class="home-link" :aria-current="route.path === '/' ? 'page' : undefined"><span class="material-symbols-rounded" aria-hidden="true">home</span><span class="sr-only">Главная</span></RouterLink>
        <div v-for="group in groups" :key="group.id" class="nav-group">
          <button type="button" :aria-expanded="activeGroup === group.id" :aria-controls="'nav-' + group.id" class="group-trigger" :class="{selected:selected(group)}" @click="activeGroup = activeGroup === group.id ? null : group.id">{{ group.label }}<span aria-hidden="true" :class="{'rotate-180':activeGroup === group.id}" class="material-symbols-rounded transition-transform">expand_more</span></button>
          <Transition name="nav-panel"><div v-show="activeGroup === group.id" :id="'nav-' + group.id" class="nav-panel"><p>{{ group.text }}</p><RouterLink v-for="link in group.links" :key="link.to" :to="link.to" :aria-current="route.path === link.to ? 'page' : undefined"><strong>{{ link.label }}</strong><small>{{ link.description }}</small></RouterLink></div></Transition>
        </div>
      </nav>
      <button type="button" class="btn-secondary mobile-trigger" :aria-expanded="open" aria-controls="mobile-navigation" @click="open = !open"><span aria-hidden="true" class="material-symbols-rounded">{{ open?'close':'menu' }}</span><span class="sr-only">Меню</span></button>
    </div>
    <Transition name="nav-panel"><nav v-show="open" id="mobile-navigation" class="mobile-nav" aria-label="Мобильная навигация"><RouterLink to="/" class="block px-3 py-3">Главная</RouterLink><section v-for="group in groups" :key="group.id"><h2>{{ group.label }}</h2><RouterLink v-for="link in group.links" :key="link.to" :to="link.to" :aria-current="route.path === link.to ? 'page' : undefined">{{ link.label }}</RouterLink></section></nav></Transition>
  </header>
</template>
<style scoped>
.app-header{position:sticky;top:0;z-index:20;background:#f7f9ffed;backdrop-filter:blur(18px);border-bottom:1px solid #a4afe84d}.header-row{max-width:1280px;margin:auto;padding:12px 24px;display:flex;align-items:center;justify-content:space-between;gap:24px}.brand{display:flex;align-items:center;gap:12px;color:var(--palette-ink)}.brand strong{display:block;font-size:17px}.brand small{display:block;font-size:11px;letter-spacing:.04em;color:#64748b}.brand-icon{padding:10px;border-radius:12px;background:var(--study-gradient);font-size:24px}.desktop-nav{display:flex;align-items:center;gap:8px}.home-link{padding:10px;display:flex;border-radius:12px}.home-link[aria-current=page]{background:#e2e9f7}.nav-group{position:relative}.group-trigger{display:flex;gap:8px;align-items:center;min-height:44px;padding:10px 16px;border-radius:12px;font-size:14px;font-weight:600;color:#475569;transition:background 160ms}.group-trigger:hover,.group-trigger.selected{background:#dfe7f4;color:#35485a}.nav-panel{position:absolute;right:0;top:calc(100% + 12px);width:290px;padding:12px;background:#fffffff5;border-radius:18px;box-shadow:0 12px 40px #35485a24;border:1px solid #cbd7f1}.nav-panel>p{font-size:12px;color:#64748b;padding:8px 12px}.nav-panel a{display:block;padding:12px;border-radius:12px;transition:background 160ms}.nav-panel a:hover,.nav-panel a[aria-current=page]{background:#edf2fa}.nav-panel strong{font-size:14px;font-weight:600}.nav-panel small{display:block;font-size:12px;color:#64748b;margin-top:2px}.mobile-trigger,.mobile-nav{display:none}.nav-panel-enter-active,.nav-panel-leave-active{transition:opacity 160ms,transform 160ms}.nav-panel-enter-from,.nav-panel-leave-to{opacity:0;transform:translateY(-6px)}
@media(max-width:767px){.header-row{padding:10px 16px;gap:12px}.brand strong{font-size:14px}.brand small{font-size:10px}.desktop-nav{display:none}.mobile-trigger{display:flex}.mobile-nav{display:block;max-height:75dvh;overflow:auto;padding:8px 16px 16px;background:#f7f9ff}.mobile-nav section{margin-top:12px}.mobile-nav h2{padding:6px 12px;color:#64748b;font-size:12px}.mobile-nav section a{display:block;padding:12px;border-radius:10px;font-size:14px}.mobile-nav a[aria-current=page]{background:#dfe7f4}}
</style>
