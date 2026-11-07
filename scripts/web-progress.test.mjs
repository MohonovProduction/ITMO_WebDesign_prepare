import test from 'node:test'
import assert from 'node:assert/strict'
import { loadWebProgress, saveWebProgress, PROGRESS_KEY } from '../src/utils/webProgress.js'
import { webFlashcards } from '../src/data/webFlashcards.js'

test('migrates web progress without reading or removing mathstat data', () => {
  const values = new Map([
    ['webdesign_flashcards_v1', JSON.stringify({ 'css-position': 'known', broken: 'invalid' })],
    ['webdesign_practice_v1', JSON.stringify([{ at: 100, score: 3, topics: ['tech-1'] }])],
    ['mathstat_progress_v2', 'must not be accessed'],
  ])
  const reads = []
  const storage = { getItem(key) { reads.push(key); return values.get(key) ?? null }, setItem(key, value) { values.set(key, value) } }
  const result = loadWebProgress(storage)
  assert.deepEqual(result.data.marks, { 'css-position': 'known' })
  assert.equal(result.data.attempts.length, 1)
  assert.equal(saveWebProgress(storage, result.data), '')
  assert.equal(loadWebProgress(storage).data.attempts.length, 1)
  assert.equal(reads.some(key => key.startsWith('mathstat')), false)
  assert.equal(values.get('mathstat_progress_v2'), 'must not be accessed')
  assert.ok(values.has('webdesign_practice_v1'))
})
test('rejects malformed shapes and invalid attempt scores', () => {
  const { data } = loadWebProgress({ getItem: () => JSON.stringify({ marks: [], attempts: [{ score: 99 }], prepDays: [null, 42] }) })
  assert.deepEqual(data.marks, {})
  assert.deepEqual(data.attempts, [])
  assert.deepEqual(data.prepDays, [])
})
test('reports inaccessible storage and broken JSON without writing', () => {
  assert.ok(loadWebProgress({ getItem() { throw Error('disabled') } }).error)
  assert.ok(loadWebProgress({ getItem() { return '{' } }).error)
  assert.ok(saveWebProgress({ setItem() { throw Error('quota') } }, {}).length)
})
test('keeps more than twenty attempts and deduplicates attempt identifiers', () => {
  const attempts = Array.from({ length: 25 }, (_, i) => ({ id: String(i), at: i, score: 4, topics: ['ux-1'] }))
  const { data } = loadWebProgress({ getItem: () => JSON.stringify({ attempts: [...attempts, attempts[0]] }) })
  assert.equal(data.attempts.length, 25)
})
test('all flashcards have unique persistent identifiers', () => {
  assert.equal(new Set(webFlashcards.map(card => card.id)).size, webFlashcards.length)
})

test('restores a filtered card session and per-topic scores including fractional ticket averages', () => {
  let persisted
  const storage = { setItem(key, value) { persisted = value }, getItem() { return persisted } }
  const progress = {
    cardSession: { deck: 'css', filter: 'unknown', cardId: 'css-grid' },
    attempts: [{ id: 'mixed', at: 123, score: 2.5, topics: ['tech-1', 'ux-1'], topicScores: [{ topicId: 'tech-1', score: 4 }, { topicId: 'ux-1', score: 1 }] }],
  }
  assert.equal(saveWebProgress(storage, progress), '')
  const { data } = loadWebProgress(storage)
  assert.deepEqual(data.cardSession, progress.cardSession)
  assert.equal(data.attempts[0].score, 2.5)
  assert.deepEqual(data.attempts[0].topicScores, progress.attempts[0].topicScores)
})
