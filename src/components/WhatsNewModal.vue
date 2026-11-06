<script setup>
const emit = defineEmits(['close'])

const items = [
  {
    icon: '∑',
    title: 'Карточки «Формулы»',
    text: 'Полная колода из теории, практики и РГР (~80+ карточек). Задание на лице — запишите на бумаге, переверните и сверьте. Фильтр по уровню и перемешивание.',
  },
  {
    icon: '📋',
    title: 'Шпаргалка',
    text: 'Таблица вместо аккордеона: тема, определение, формулы и мнемоника сразу видны. Компактный и полный вид на экране. Кнопки «Скачать PDF» (1 лист или полная версия).',
  },
  {
    icon: '📐',
    title: 'Схема РГР',
    text: 'У каждого шага — что делаем и зачем. На выборе критерия: что считаем, зачем проверка закона (Колмогоров / Пирсон vs z/t) и ссылки в теорию.',
  },
  {
    icon: '🗺️',
    title: 'Карта понятий',
    text: 'Клик по узлу открывает тему с примерами и интерпретацией прямо на странице карты, без перехода в «Теорию».',
  },
  {
    icon: '⚗️',
    title: 'Методы анализа',
    text: 'У каждого метода строка «Для чего» — когда и зачем применять z, t, Пирсона, Колмогорова, МНК и др.',
  },
  {
    icon: '🔤',
    title: 'Карточки «Методы»',
    text: 'На лице — кратко о назначении, на обороте — «Нужен для…» и условия применения.',
  },
  {
    icon: '📝',
    title: 'Экзамен Танченко',
    text: 'Конкретные вопросы «на подумать» и развёрнутые эталоны вместо шаблонных фраз; ссылка на тему в теории.',
  },
  {
    icon: '📊',
    title: 'Теория',
    text: 'Примеры на датасете C-15 и блок интерпретации (хорошо / плохо / что улучшить) в каждой теме.',
  },
]
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
    role="dialog"
    aria-labelledby="whats-new-title"
    @click.self="emit('close')"
  >
    <div
      class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6"
    >
      <h2 id="whats-new-title" class="text-xl font-bold text-slate-900">Что нового</h2>
      <p class="mt-1 text-sm text-slate-500">
        Обновление v3 · июнь 2026. Прогресс по-прежнему сохраняется в этом браузере.
      </p>

      <ul class="mt-4 flex flex-col gap-3">
        <li
          v-for="(item, i) in items"
          :key="i"
          class="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3"
        >
          <span class="text-2xl" aria-hidden="true">{{ item.icon }}</span>
          <div>
            <div class="font-semibold text-slate-900">{{ item.title }}</div>
            <p class="mt-0.5 text-sm text-slate-600">{{ item.text }}</p>
          </div>
        </li>
      </ul>

      <button type="button" class="btn-primary mt-5 w-full min-h-[44px]" @click="emit('close')">
        Понятно, начать
      </button>
    </div>
  </div>
</template>
