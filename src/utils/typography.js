import Typograf from 'typograf'
const tp = new Typograf({locale:['ru','en-US']})
tp.addSafeTag(/```[\s\S]*?```|`[^`\n]+`/g)
// Старые вопросы иногда содержат атрибуты без Markdown-разметки.
tp.addSafeTag(/\b[\w-]+=(?:"[^"]*"|'[^']*')/g)
const cache = new Map()
export function formatStudyText(text = '') {
  if (cache.has(text)) return cache.get(text)
  const result = tp.execute(text)
  if (cache.size >= 512) cache.clear()
  cache.set(text,result)
  return result
}
export function studyTextBlocks(text = '') {
  const formatted = formatStudyText(text)
  const result = []
  const inlineParts = value => value.split(/(`[^`]+`)/g).filter(Boolean).map(part => ({ type:part.startsWith('`') && part.endsWith('`') ? 'code' : 'text', value:part.startsWith('`') && part.endsWith('`') ? part.slice(1,-1) : part }))
  const pattern = /```(?:[\w+-]+)?\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match
  while ((match = pattern.exec(formatted)) !== null) {
    if (match.index > lastIndex) result.push({type:'text',parts:inlineParts(formatted.slice(lastIndex,match.index))})
    result.push({type:'block',value:match[1].trim()})
    lastIndex = pattern.lastIndex
  }
  if (lastIndex < formatted.length) result.push({type:'text',parts:inlineParts(formatted.slice(lastIndex))})
  return result
}
