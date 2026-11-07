import test from 'node:test'
import assert from 'node:assert/strict'
import { concepts, getConcept, flashcardConcepts } from '../src/data/concepts.js'
import { webFlashcards } from '../src/data/webFlashcards.js'
import { semanticTags } from '../src/data/semanticTags.js'
import { svgReference } from '../src/data/svgReference.js'
import { cssRules } from '../src/data/cssReference.js'

test('concept identifiers are unique and every card uses its canonical definition', () => {
  assert.equal(new Set(flashcardConcepts.map(item => item.id)).size, flashcardConcepts.length)
  for (const card of webFlashcards) {
    assert.equal(card.id, card.conceptId)
    assert.equal(card.back, getConcept(card.conceptId).definition)
    assert.ok(Array.isArray(card.examRefs) && card.examRefs.length)
  }
})
test('HTML, SVG and CSS references resolve the shared definitions', () => {
  for (const item of semanticTags) assert.equal(item.definition, getConcept(item.conceptId).definition)
  for (const item of svgReference) assert.equal(item.text, getConcept(item.conceptId).definition)
  for (const item of cssRules) assert.equal(item.description, getConcept(item.conceptId).definition)
  assert.equal(svgReference.find(item => item.id === 'circle').conceptId, 'svg-circle')
})
test('reference concepts with cards resolve existing stable card identifiers', () => {
  const ids = new Set(webFlashcards.map(item => item.id))
  for (const item of [...semanticTags, ...svgReference, ...cssRules]) {
    assert.ok(concepts[item.conceptId])
    if (getConcept(item.conceptId).question) assert.ok(ids.has(item.conceptId))
  }
  assert.throws(() => getConcept('missing-concept'), /Unknown learning concept/)
})
