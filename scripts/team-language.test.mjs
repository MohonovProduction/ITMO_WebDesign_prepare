import test from 'node:test'
import assert from 'node:assert/strict'
import { teamTerms, teamConcepts, teamExercises } from '../src/data/teamLanguage.js'
import { webFlashcards } from '../src/data/webFlashcards.js'
import { theoryForTopic, theoryBranches } from '../src/data/theoryTopics.js'
import { trainersForTopic, exerciseIds } from '../src/data/trainers.js'
import { chooseWarmup } from '../src/utils/warmupSelection.js'

test('team theory, cards and exercises resolve canonical concepts without duplicate branches', () => {
  assert.equal(teamTerms.length,6)
  assert.equal(teamConcepts.length,9)
  assert.equal(theoryForTopic('product.language').concepts.length,9)
  assert.equal(new Set(theoryBranches.map(b => b.id)).size,theoryBranches.length)
  for (const concept of teamConcepts) {
    assert.equal(webFlashcards.find(c => c.id === concept.id).back,concept.definition)
    assert.equal(concept.supplemental,true)
  }
  assert.equal(trainersForTopic('product')[0].id,'team')
  assert.equal(trainersForTopic('product.language')[0].questions.length,12)
  for (const term of teamTerms) {
    const tasks = teamExercises.filter(q => q.conceptId === `team-${term.slug}`)
    assert.equal(tasks.length,2)
    assert.equal(new Set(tasks.map(q => q.format)).size,2)
    for (const q of tasks) {
      assert.equal(q.options.filter(o => o === q.answer).length,1)
      assert.ok(exerciseIds.includes(`team:${q.id}`))
    }
  }
})
test('warmup prioritizes unknown concepts without changing marks and retains general questions', () => {
  const questions = [{id:'html'},...teamExercises]
  const marks = {'team-daily':'unknown','team-retro':'known'}
  const original = {...marks}
  assert.equal(chooseWarmup(questions,marks,() => 0).conceptId,'team-daily')
  const values = [0.99,0]
  assert.equal(chooseWarmup(questions,marks,() => values.shift()).id,'html')
  assert.deepEqual(marks,original)
  assert.equal(chooseWarmup(questions,{},() => 0).id,'html')
  assert.equal(chooseWarmup([],marks),null)
})
