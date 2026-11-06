import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useProgressStore, attachPersistence } from './store/progress'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Инициализируем стор прогресса и включаем автосохранение в localStorage
attachPersistence(useProgressStore(pinia))

app.mount('#app')
