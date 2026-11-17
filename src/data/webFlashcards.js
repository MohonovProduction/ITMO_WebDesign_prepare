import { flashcardConcepts } from './concepts.js'
import { topicForConcept } from './topics.js'
export const WEB_DECKS = [
  { id: 'semantic', title: 'Семантика HTML', icon: '🏗️', hint: 'Теги и их роль' },
  { id: 'css', title: 'CSS', icon: '🎨', hint: 'Правила и адаптив' },
  { id: 'svg', title: 'SVG', icon: '✒️', hint: 'Вектор в вебе' },
  { id: 'definitions', title: 'Определения', icon: '🧠', hint: 'Термины и понятия' },
]

export const webFlashcards = flashcardConcepts.map(item => ({
  id: item.id,
  conceptId: item.id,
  topic: topicForConcept(item),
  deck: item.deck,
  front: item.question,
  back: item.definition,
  examRefs: item.examRefs,
  ...(item.supplemental ? { supplemental:true, example:item.example, pitfall:item.pitfall } : {}),
}))
export function cardsByDeck(deckId) {
  return webFlashcards.filter(item => item.deck === deckId)
}
