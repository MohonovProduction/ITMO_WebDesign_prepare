import { topicBranches, topicForConcept, matchesTopic } from './topics.js'
import { flashcardConcepts } from './concepts.js'
import { webTheory } from './webTheory.js'

const lesson = (id, label, tickets) => ({ id, label, tickets })
export const theoryBranches = [
  ...topicBranches.map(branch => ({ ...branch, children: branch.children.map(child => ({ ...child, tickets: [] })) })),
  { id: 'web', label: 'Устройство веба', children: [lesson('web.environment', 'Браузер, сеть и сервер', ['tech-1', 'tech-2', 'tech-3']), lesson('web.quality', 'Качество и публикация', ['tech-8', 'tech-9', 'tech-14', 'tech-15', 'tech-16'])] },
  { id: 'product', label: 'Продукт и команда', children: [lesson('product.design', 'Дизайн-концепция', ['tech-4']), lesson('product.process', 'Процесс и развитие', ['tech-10', 'tech-11', 'tech-12', 'tech-13'])] },
]
const ticketTopics = {
  'css.type': ['tech-5'], 'html.forms': ['tech-6', 'tech-7'],
  'ux.definitions': ['ux-1'], 'ux.research': ['ux-2', 'ux-3', 'ux-4', 'ux-5'],
  'ux.structure': ['ux-6', 'ux-7'], 'ux.accessibility': ['ux-8', 'ux-9'], 'ux.handoff': ['ux-10'],
}
// Сохраняем исходный текст двух блоков конспектов; тематические связи — отдельный слой.
export function theoryForTopic(id) {
  const branches = theoryBranches.filter(b => b.id === id || b.children.some(c => c.id === id))
  const leaves = branches.flatMap(b => b.id === id ? b.children : b.children.filter(c => c.id === id))
  const tickets = new Set(leaves.flatMap(c => [...c.tickets, ...(ticketTopics[c.id] || [])]))
  return {
    concepts: flashcardConcepts.filter(c => matchesTopic({ topic: topicForConcept(c) }, id)),
    lessons: webTheory.filter(t => tickets.has(t.id)),
  }
}
export function topicsForTicket(ticketId) { return theoryBranches.flatMap(b => b.children).filter(c => [...c.tickets, ...(ticketTopics[c.id] || [])].includes(ticketId)) }
