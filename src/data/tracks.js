export const TRACKS = [
  {
    id: 'tech',
    title: 'Технология и реализация',
    shortTitle: 'Технология',
    teacher: 'Блок 1',
    icon: '⚙️',
    color: 'brand',
    points: 20,
    description: 'Как устроен, собирается, публикуется и поддерживается веб-продукт.',
  },
  {
    id: 'ux',
    title: 'UX/UI и проектирование',
    shortTitle: 'UX/UI',
    teacher: 'Блок 2',
    icon: '✳️',
    color: 'pink',
    points: 20,
    description: 'Как исследовать задачу и спроектировать понятный, доступный интерфейс.',
  },
]

export function trackById(id) {
  return TRACKS.find((track) => track.id === id) || null
}
