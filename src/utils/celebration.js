const colors = ['#b5d4e9', '#a4afe8', '#bcebd9', '#afe2df']
export function celebrationOptions(kind, mobile, origin) {
  const presets = {
    answer: { particleCount:mobile ? 12 : 20, spread:55, startVelocity:16, ticks:65, scalar:.7, shapes:['star'] },
    topic: { particleCount:mobile ? 22 : 34, spread:75, startVelocity:23, ticks:85, scalar:.85, shapes:['star','circle'] },
    complete: { particleCount:mobile ? 44 : 72, spread:95, startVelocity:32, ticks:110, scalar:.9, shapes:['square','circle','star'] },
  }
  return { ...presets[kind], origin, colors, gravity:1.2, disableForReducedMotion:true }
}

export function createCelebrator(load = () => import('canvas-confetti'), environment = () => typeof window === 'undefined' ? null : window) {
  let library
  let canvas
  let renderer
  let generation = 0
  let lastRun = -Infinity
  function stop() {
    generation++
    renderer?.reset()
    canvas?.remove()
    lastRun = -Infinity
  }
  async function celebrate(kind, element) {
    const win = environment()
    if (!win || win.matchMedia('(prefers-reduced-motion: reduce)').matches || win.document.hidden) return false
    const now = Date.now()
    if (now-lastRun < 350) return false
    lastRun = now
    const token = ++generation
    // Сохраняем координаты до await: Vue может заменить кнопку после ответа.
    const rect = element?.getBoundingClientRect?.()
    const host = element?.closest?.('dialog[open]') || win.document.body
    const origin = rect ? { x:Math.max(0,Math.min(1,(rect.left+rect.width/2)/win.innerWidth)), y:Math.max(0,Math.min(1,(rect.top+rect.height/2)/win.innerHeight)) } : {x:.5,y:.65}
    try {
      library ||= load().catch(error => { library = null; throw error })
      const { default:confetti } = await library
      if (token !== generation || win.matchMedia('(prefers-reduced-motion: reduce)').matches || win.document.hidden || !host.isConnected || (host.localName === 'dialog' && !host.open)) return false
      if (!canvas) {
        canvas = win.document.createElement('canvas')
        canvas.setAttribute('aria-hidden','true')
        canvas.dataset.celebration = ''
        canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:55;'
        renderer = confetti.create(canvas, {resize:true,disableForReducedMotion:true})
      }
      if (canvas.parentElement && canvas.parentElement !== host) renderer.reset()
      host.appendChild(canvas)
      await renderer(celebrationOptions(kind, win.innerWidth < 640, origin))
      if (token === generation) canvas.remove()
      return true
    } catch {
      // Обратная связь и сохранение прогресса не зависят от декоративного эффекта.
      if (token === generation) stop()
      return false
    }
  }
  return { celebrate, stop }
}
const controller = createCelebrator()
export const celebrate = controller.celebrate
export const stopCelebration = controller.stop
