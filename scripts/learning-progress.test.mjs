import test from 'node:test'
import assert from 'node:assert/strict'
import { sanitizeProgress, saveWebProgress, loadWebProgress, localDay } from '../src/utils/webProgress.js'
import { learningStats } from '../src/utils/learningStats.js'
import { exerciseIds, trainersForTopic } from '../src/data/trainers.js'
import { semanticsExercises, formsExercises } from '../src/data/htmlExercises.js'

test('new learning fields round-trip alongside existing card marks and exam attempts', () => {
  let saved
  const storage = { setItem(key, value) { saved = value }, getItem() { return saved } }
  const progress = sanitizeProgress({ marks:{'css-grid':'known'}, learnedTopics:['html.forms','html.forms'], exercises:{'forms:email':{attempts:2,correctAttempts:1,at:20}}, warmupDay:'2026-11-10', lastActivity:{path:'/trainers?exercise=forms',label:'Формы',at:20} })
  saveWebProgress(storage, progress)
  assert.deepEqual(loadWebProgress(storage).data, progress)
  assert.deepEqual(progress.learnedTopics, ['html.forms'])
  assert.equal(progress.marks['css-grid'], 'known')
})
test('malformed exercise data does not corrupt dashboard statistics', () => {
  const progress = sanitizeProgress({ exercises:{bad:{attempts:1,correctAttempts:2,at:10}, negative:{attempts:-2,correctAttempts:0,at:10}}, learnedTopics:null, warmupDay:10, lastActivity:{path:'https://example.com',label:'external',at:10} })
  assert.deepEqual(progress.exercises,{})
  assert.equal(progress.lastActivity,null)
  const stats = learningStats(progress,[{id:'a'}],['html.forms'],['forms:email'])
  assert.equal(stats.accuracy,null)
  assert.equal(stats.newCards,1)
})
test('dashboard separates unique solved tasks from accuracy across retries and excludes stale ids', () => {
  const progress = sanitizeProgress({ marks:{a:'known',b:'unknown',deleted:'known'}, learnedTopics:['html.forms','deleted'], exercises:{one:{attempts:3,correctAttempts:1,at:1},two:{attempts:1,correctAttempts:0,at:2},deleted:{attempts:100,correctAttempts:100,at:3}} })
  const stats = learningStats(progress,[{id:'a'},{id:'b'},{id:'c'}],['html.forms'],['one','two'])
  assert.deepEqual(stats,{known:1,unknown:1,newCards:1,learned:1,attempted:2,mastered:1,attempts:4,accuracy:25})
  progress.learnedTopics = []
  assert.equal(learningStats(progress,[],['html.forms'],[]).learned,0)
})
test('HTML tasks have one answer, stable progress ids and mostly input-type questions', () => {
  assert.equal(new Set(exerciseIds).size, exerciseIds.length)
  for (const task of [...semanticsExercises,...formsExercises]) assert.equal(task.options.filter(o => o === task.answer).length,1)
  assert.equal(formsExercises.length,12)
  assert.equal(trainersForTopic('html').length,2)
  assert.equal(trainersForTopic('css.selectors')[0].id,'selectors')
  assert.deepEqual(trainersForTopic('svg'),[])
})
test('daily warmup uses the local calendar date', () => {
  assert.equal(localDay(new Date(2026,10,10,0,1)),'2026-11-10')
  assert.equal(localDay(new Date(2026,10,11,0,1)),'2026-11-11')
})
