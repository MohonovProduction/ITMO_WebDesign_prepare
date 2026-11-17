import { createRouter, createWebHashHistory } from 'vue-router'
import { stopCelebration } from '@/utils/celebration'

import HomeView from '@/views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: 'Главная' } },
  {path:'/coursework',name:'coursework',component:() => import('@/views/CourseworkView.vue'),meta:{title:'Курсовая работа'}},
  { path:'/trainers', name:'trainers', component:() => import('@/views/TrainersView.vue'), meta:{title:'Тренажёры'} },
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
  { path:'/agile', name:'agile', component:() => import('@/views/AgileReferenceView.vue'), meta:{title:'Agile и Scrum'} },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from) => { if (to.path !== from.path || (from.path === '/trainers' && to.query.exercise !== from.query.exercise)) stopCelebration() })
router.afterEach((to) => {
  const base = 'Веб-проектирование · подготовка к экзамену'
  document.title = to.meta?.title ? `${to.meta.title} · ${base}` : base
})

export default router
