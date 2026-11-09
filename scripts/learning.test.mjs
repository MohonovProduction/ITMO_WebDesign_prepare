import test from 'node:test'
import assert from 'node:assert/strict'
import { theoryBranches, theoryForTopic } from '../src/data/theoryTopics.js'
import { webTheory } from '../src/data/webTheory.js'
import { selectorExercises, selectorMarkup, cssLearning } from '../src/data/cssLearning.js'
import { webFlashcards } from '../src/data/webFlashcards.js'

test('thematic theory includes every prepared exam lesson and preserves its original block', () => {
  const lessons = theoryBranches.flatMap(b => theoryForTopic(b.id).lessons)
  const ready = webTheory.filter(t => t.status === 'ready')
  assert.deepEqual([...new Set(lessons.map(t => t.id))].sort(), ready.map(t => t.id).sort())
  for (const lesson of lessons) assert.equal(lesson, webTheory.find(t => t.id === lesson.id))
  assert.ok(theoryForTopic('css.selectors').concepts.some(c => c.id === 'css-compound'))
  for (const concept of cssLearning) assert.equal(webFlashcards.find(c => c.id === concept.id).back, concept.definition)
})
test('selector exercises have one designated answer and valid highlighted code lines', () => {
  const lines = selectorMarkup.split('\n')
  for (const task of selectorExercises) {
    assert.equal(task.options.filter(o => o === task.answer).length, 1)
    assert.equal(task.options.length, task.matches.length)
    assert.deepEqual(task.matches[task.options.indexOf(task.answer)], task.target)
    assert.equal(task.matches.filter(lines => JSON.stringify(lines) === JSON.stringify(task.target)).length, 1)
    for (const line of [...task.target, ...task.matches.flat()]) assert.ok(line >= 0 && line < lines.length)
  }
})
