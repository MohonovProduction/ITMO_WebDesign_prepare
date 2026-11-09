export const topicBranches = [
  { id: 'html', deck: 'semantic', label: 'HTML', children: [{ id: 'html.structure', label: 'Структура страницы' }, { id: 'html.forms', label: 'Формы и поля ввода' }] },
  { id: 'css', deck: 'css', label: 'CSS', children: [{ id: 'css.selectors', label: 'Селекторы' }, { id: 'css.appearance', label: 'Цвет и фон' }, { id: 'css.box', label: 'Box model' }, { id: 'css.type', label: 'Типографика' }, { id: 'css.states', label: 'Состояния' }, { id: 'css.layout', label: 'Position, Flex, Grid' }, { id: 'css.units', label: 'Единицы и адаптив' }] },
  { id: 'svg', deck: 'svg', label: 'SVG', children: [{ id: 'svg.shapes', label: 'Фигуры и пути' }, { id: 'svg.structure', label: 'Группы и координаты' }, { id: 'svg.embedding', label: 'Вставка и доступность' }] },
  { id: 'ux', deck: 'definitions', label: 'UX/UI', children: [{ id: 'ux.definitions', label: 'Основы UX/UI' }, { id: 'ux.research', label: 'Аудитория и исследования' }, { id: 'ux.structure', label: 'Сценарии и структура' }, { id: 'ux.accessibility', label: 'Доступность и мобильный дизайн' }, { id: 'ux.handoff', label: 'Передача в разработку' }] },
]
export function topicForConcept(item) {
  if (item.topic) return item.topic
  if (item.deck === 'semantic') return ['semantic-label', 'semantic-button-link'].includes(item.id) ? 'html.forms' : 'html.structure'
  if (item.deck === 'definitions') {
    if (/research|qualitative|quantitative|persona/.test(item.id)) return 'ux.research'
    if (/cjm|user-story|wireframe/.test(item.id)) return 'ux.structure'
    if (/accessibility/.test(item.id)) return 'ux.accessibility'
    return 'ux.definitions'
  }
  if (item.deck === 'svg') return /circle|path/.test(item.id) ? 'svg.shapes' : /vector|viewbox|group/.test(item.id) ? 'svg.structure' : 'svg.embedding'
  if (/selectors|class-id/.test(item.id)) return 'css.selectors'
  if (/font/.test(item.id)) return 'css.type'
  if (/box-model/.test(item.id)) return 'css.box'
  if (/hover/.test(item.id)) return 'css.states'
  if (/media|units/.test(item.id)) return 'css.units'
  return 'css.layout'
}
export function matchesTopic(card, id) { return id === 'all' || card.topic === id || card.topic.startsWith(`${id}.`) }
