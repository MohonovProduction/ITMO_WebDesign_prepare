export const PROGRESS_KEY = 'webdesign_progress_v1'
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value)
export function localDay(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` }
export function sanitizeProgress(value) {
  const data = object(value) ? value : {}
  return {
    version: 1,
    learnedTopics: Array.isArray(data.learnedTopics) ? [...new Set(data.learnedTopics.filter(id => typeof id === 'string'))] : [],
    exercises: object(data.exercises) ? Object.fromEntries(Object.entries(data.exercises).filter(([id, r]) => id && object(r) && Number.isInteger(r.attempts) && r.attempts > 0 && Number.isInteger(r.correctAttempts) && r.correctAttempts >= 0 && r.correctAttempts <= r.attempts && Number.isFinite(r.at)).map(([id, r]) => [id, { attempts: r.attempts, correctAttempts: r.correctAttempts, at: r.at }])) : {},
    warmupDay: typeof data.warmupDay === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.warmupDay) ? data.warmupDay : '',
    lastActivity: object(data.lastActivity) && typeof data.lastActivity.path === 'string' && /^\/(theory|trainers|flashcards|practice)(?:\?|$)/.test(data.lastActivity.path) && typeof data.lastActivity.label === 'string' && Number.isFinite(data.lastActivity.at) ? { path: data.lastActivity.path, label: data.lastActivity.label, at: data.lastActivity.at } : null,
    cardSession: object(data.cardSession) && typeof data.cardSession.deck === 'string' ? { deck: data.cardSession.deck, ...(typeof data.cardSession.topicId === 'string' ? { topicId: data.cardSession.topicId } : {}), cardId: typeof data.cardSession.cardId === 'string' ? data.cardSession.cardId : null, filter: ['all', 'unknown', 'new'].includes(data.cardSession.filter) ? data.cardSession.filter : 'all' } : null,
    marks: object(data.marks) ? Object.fromEntries(Object.entries(data.marks).filter(([id, status]) => id && ['known', 'unknown'].includes(status))) : {},
    attempts: Array.isArray(data.attempts) ? data.attempts.filter(item => object(item) && typeof item.id === 'string' && Number.isFinite(item.at) && Number.isFinite(item.score) && item.score >= 0 && item.score <= 4 && Array.isArray(item.topics) && item.topics.length > 0 && item.topics.every(id => typeof id === 'string')).filter((item, i, list) => list.findIndex(other => other.id === item.id) === i) : [],
    prepDays: Array.isArray(data.prepDays) ? [...new Set(data.prepDays.filter(day => typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day)))] : [],
  }
}
export function loadWebProgress(storage) {
  try {
    const current = storage.getItem(PROGRESS_KEY)
    if (current !== null) return { data: sanitizeProgress(JSON.parse(current)), error: '' }
    // Только предыдущие данные веб-проекта; ключи матстата не читаются.
    const parse = key => { try { return JSON.parse(storage.getItem(key)) } catch { return null } }
    const marks = parse('webdesign_flashcards_v1')
    const history = parse('webdesign_practice_v1')
    return { data: sanitizeProgress({ marks, attempts: Array.isArray(history) ? history.map((item, i) => ({ ...item, id: `legacy-${item?.at}-${i}` })) : [] }), error: '' }
  } catch {
    return { data: sanitizeProgress(null), error: 'Не удалось прочитать прогресс. Данные в браузере не перезаписаны.' }
  }
}
export function saveWebProgress(storage, data) {
  try { storage.setItem(PROGRESS_KEY, JSON.stringify(sanitizeProgress(data))); return '' }
  catch { return 'Не удалось сохранить прогресс. Он доступен в этой сессии, но может исчезнуть после закрытия страницы.' }
}
