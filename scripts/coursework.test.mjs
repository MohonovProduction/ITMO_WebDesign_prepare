import test from 'node:test'
import assert from 'node:assert/strict'
import { courseworkSections, courseworkItems, courseworkProgress } from '../src/data/coursework.js'
import { sanitizeProgress, loadWebProgress, saveWebProgress } from '../src/utils/webProgress.js'
test('coursework preserves five source weights and unique checklist ids',() => {
  assert.deepEqual(courseworkSections.map(s => s.points),[35,10,35,15,5])
  assert.equal(courseworkSections.reduce((sum,s) => sum+s.points,0),100)
  assert.equal(new Set(courseworkItems.map(i => i.id)).size,courseworkItems.length)
  assert.ok(courseworkItems.some(i => i.id === 'design.interaction.links'))
  assert.ok(courseworkItems.some(i => i.id === 'mobile.interaction.links'))
})
test('old progress defaults to empty coursework and round-trip keeps learning intact',() => {
  const old = {marks:{'css-grid':'known'},learnedTopics:['css.box']}
  assert.deepEqual(sanitizeProgress(old).coursework,{})
  let raw
  const storage = {getItem:() => raw,setItem:(key,value) => {raw=value}}
  saveWebProgress(storage,{...old,coursework:{'design.screens.desktop':true,bad:'yes',off:false}})
  const data = loadWebProgress(storage).data
  assert.deepEqual(data.coursework,{'design.screens.desktop':true})
  assert.deepEqual(data.marks,old.marks)
  assert.deepEqual(data.learnedTopics,old.learnedTopics)
})
test('progress counts known checked items rather than points or stale entries',() => {
  const result = courseworkProgress({'design.screens.desktop':true,deleted:true})
  assert.equal(result.done,1)
  assert.equal(result.total,courseworkItems.length)
  assert.equal(courseworkProgress(Object.fromEntries(courseworkItems.map(i => [i.id,true]))).percent,100)
  assert.equal(courseworkProgress({}).done,0)
})
