import test from 'node:test'
import assert from 'node:assert/strict'
import { agileReference, agileSources, workCycle } from '../src/data/agileReference.js'
import { teamTerms } from '../src/data/teamLanguage.js'
import { getConcept } from '../src/data/concepts.js'

test('Agile reference reuses exactly the six existing definitions and stable cards', () => {
  assert.equal(agileReference.length,6)
  for (const entry of agileReference) {
    assert.equal(entry.definition,teamTerms.find(t => t.slug === entry.slug).definition)
    assert.equal(entry.definition,getConcept(entry.conceptId).definition)
    assert.ok(entry.projectExample.length > 40)
    assert.ok(entry.pitfall)
  }
})
test('every term has one place in the simplified work cycle and official context links', () => {
  const slugs = workCycle.flatMap(s => s.terms)
  assert.deepEqual([...slugs].sort(),agileReference.map(t => t.slug).sort())
  for (const stage of workCycle) assert.ok(stage.terms.includes(stage.defaultTerm))
  assert.ok(workCycle.find(s => s.id === 'working').terms.includes('daily'))
  assert.equal(workCycle.find(s => s.id === 'improvement').defaultTerm,'retro')
  for (const source of agileSources) assert.ok(source.url.startsWith('https://'))
})
