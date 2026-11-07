import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: 'Главная' } },
  {
    path: '/theory',
    name: 'theory',
    component: () => import('@/views/TheoryView.vue'),
    meta: { title: 'Теория' },
  },
  {
    path: '/tracks',
    name: 'tracks',
    component: () => import('@/views/TracksView.vue'),
    meta: { title: 'Карта экзамена' },
  },
  {
    path: '/flashcards',
    name: 'flashcards',
    component: () => import('@/views/FlashcardsView.vue'),
    meta: { title: 'Карточки' },
  },
  {
    path: '/practice',
    name: 'practice',
    component: () => import('@/views/PracticeView.vue'),
    meta: { title: 'Тренировка ответа' },
  },
  {
    path: '/semantics',
    name: 'semantics',
    component: () => import('@/views/SemanticsView.vue'),
    meta: { title: 'Семантика HTML' },
  },
  { path: '/css', name: 'css', component: () => import('@/views/CssReferenceView.vue'), meta: { title: 'CSS' } },
  { path: '/svg', name: 'svg', component: () => import('@/views/SvgReferenceView.vue'), meta: { title: 'SVG' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const base = 'Веб-проектирование · подготовка к экзамену'
  document.title = to.meta?.title ? `${to.meta.title} · ${base}` : base
})

export default router
