import test from 'node:test'
import assert from 'node:assert/strict'
import {createCelebrator,celebrationOptions} from '../src/utils/celebration.js'
const env = (reduced = false) => ({matchMedia:() => ({matches:reduced}),document:{hidden:false,body:{isConnected:true}},innerWidth:390,innerHeight:844})
test('reduced motion and missing browser skip loading the decorative library',async () => {
  let loads = 0
  const load = async () => {loads++;throw Error('should not load')}
  assert.equal(await createCelebrator(load,() => env(true)).celebrate('answer'),false)
  assert.equal(await createCelebrator(load,() => null).celebrate('answer'),false)
  assert.equal(loads,0)
})
test('navigation cancels an effect waiting for its lazy import',async () => {
  let resolve
  let creates = 0
  const controller = createCelebrator(() => new Promise(done => {resolve = done}),() => env())
  const pending = controller.celebrate('answer')
  controller.stop()
  resolve({default:{create(){creates++}}})
  assert.equal(await pending,false)
  assert.equal(creates,0)
})
test('failed imports never reject into answer or progress handlers',async () => {
  const controller = createCelebrator(async () => {throw Error('offline')},() => env())
  assert.equal(await controller.celebrate('topic'),false)
})
test('mobile uses fewer particles, stars stay local and all presets respect motion preference',() => {
  for (const kind of ['answer','topic','complete']) {
    const mobile = celebrationOptions(kind,true,{x:.2,y:.3})
    assert.ok(mobile.particleCount < celebrationOptions(kind,false,{}).particleCount)
    assert.equal(mobile.disableForReducedMotion,true)
    assert.deepEqual(mobile.origin,{x:.2,y:.3})
  }
  assert.deepEqual(celebrationOptions('answer',false,{}).shapes,['star'])
})
test('successful effects attach a noninteractive canvas, use button coordinates and clean up',async () => {
  let options
  let removed = 0
  const canvas = {dataset:{},style:{},setAttribute(){},remove(){removed++;this.parentElement=null}}
  const win = env()
  win.document.createElement = () => canvas
  win.document.body.appendChild = element => {element.parentElement=win.document.body}
  const render = async value => {options=value}
  render.reset = () => {}
  const controller = createCelebrator(async () => ({default:{create:() => render}}),() => win)
  assert.equal(await controller.celebrate('answer',{getBoundingClientRect:() => ({left:0,top:0,width:390,height:844})}),true)
  assert.deepEqual(options.origin,{x:.5,y:.5})
  assert.equal(options.particleCount,12)
  assert.ok(canvas.style.cssText.includes('pointer-events:none'))
  assert.equal(removed,1)
})
test('closed daily dialogs suppress delayed decorative effects',async () => {
  const win = env()
  const controller = createCelebrator(async () => ({default:{}}),() => win)
  assert.equal(await controller.celebrate('answer',{closest:() => ({localName:'dialog',isConnected:true,open:false})}),false)
})
