import { getConcept } from './concepts.js'

export const svgReference = [
  { id: 'svg', tag: 'svg', title: 'Контейнер SVG', conceptId: 'svg-vector' },
  { id: 'g', tag: 'g', title: 'Группа', conceptId: 'svg-group' },
  { id: 'path', tag: 'path', title: 'Маршрут', conceptId: 'svg-path' },
  { id: 'circle', tag: 'circle', title: 'Точка', conceptId: 'svg-circle' },
].map(item => {
  const concept = getConcept(item.conceptId)
  return { ...item, text: concept.definition, cardQuestion: concept.question, mdn: `https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/${item.tag}` }
})
