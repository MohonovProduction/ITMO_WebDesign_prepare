import { learningStats } from './learningStats.js'
import { webFlashcards } from '../data/webFlashcards.js'
import { theoryBranches } from '../data/theoryTopics.js'
import { exerciseIds } from '../data/trainers.js'
export function trainingSnapshot(progress) { return learningStats(progress, webFlashcards, theoryBranches.flatMap(b => b.children.map(t => t.id)), exerciseIds) }
export function completionRows(before, after) {
  return [
    { label:'Решено упражнений', before:`${before.mastered} / ${exerciseIds.length}`, after:`${after.mastered} / ${exerciseIds.length}`, change: after.mastered > before.mastered ? `+${after.mastered-before.mastered} новых` : 'Без новых решений' },
    { label:'Точность всех ответов', before:before.accuracy === null ? '—' : `${before.accuracy}%`, after:after.accuracy === null ? '—' : `${after.accuracy}%`, change:`Ответов за подход: ${after.attempts-before.attempts}` },
  ]
}
