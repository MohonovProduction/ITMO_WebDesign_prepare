/** Шаблонные ответы/вопросы — не показывать в экзамене Танченко */
export const GENERIC_THINKING_PROMPT_PREFIX = 'Практический смысл «'
export const GENERIC_THINKING_PROMPT_SUFFIX = '» при проверке гипотез?'

export const GENERIC_MODEL_ANSWERS = new Set([
  'Вывод о параметре с контролем ошибок I/II рода и интерпретацией на бытовом языке.',
  'Когда выполнены предпосылки критерия и нужна проверка согласия или связи.',
])

export function isGenericThinkingItem(item) {
  if (!item?.thinkingPrompt) return true
  const p = item.thinkingPrompt
  if (p.startsWith(GENERIC_THINKING_PROMPT_PREFIX) && p.endsWith(GENERIC_THINKING_PROMPT_SUFFIX)) {
    return true
  }
  if (p.startsWith('Когда уместен подход «') && p.endsWith('»?')) {
    return true
  }
  if (item.modelAnswer && GENERIC_MODEL_ANSWERS.has(item.modelAnswer)) return true
  return false
}
