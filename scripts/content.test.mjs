import test from 'node:test'
import assert from 'node:assert/strict'
import { concepts, getConcept, flashcardConcepts } from '../src/data/concepts.js'
import { webFlashcards } from '../src/data/webFlashcards.js'
import { semanticTags } from '../src/data/semanticTags.js'
import { svgReference } from '../src/data/svgReference.js'
import { cssRules } from '../src/data/cssReference.js'
import { topicBranches, matchesTopic } from '../src/data/topics.js'
import { inputTypes, formTags } from '../src/data/expandedConcepts.js'

test('every card belongs to a selectable topic and branch counts partition the collection', () => {
  const leaves = new Set(topicBranches.flatMap(branch => branch.children.map(child => child.id)))
  for (const card of webFlashcards) assert.ok(leaves.has(card.topic), card.id)
  assert.equal(topicBranches.reduce((sum, branch) => sum + webFlashcards.filter(card => matchesTopic(card, branch.id)).length, 0), webFlashcards.length)
  const forms = webFlashcards.filter(card => matchesTopic(card, 'html.forms'))
  assert.ok(forms.length > inputTypes.length)
  assert.ok(forms.every(card => card.deck === 'semantic'))
  assert.ok(webFlashcards.every(card => matchesTopic(card, 'all')))
  assert.equal(matchesTopic({ topic: 'css.box' }, 'css.type'), false)
})

test('form reference and input types use the same definitions as repetition cards', () => {
  for (const item of [...formTags, ...inputTypes]) {
    const card = webFlashcards.find(card => card.conceptId === item.conceptId)
    assert.ok(card, item.conceptId)
    assert.equal(card.back, getConcept(item.conceptId).definition)
  }
})

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
