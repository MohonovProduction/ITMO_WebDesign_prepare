// Пользовательский селектор применяется только к отдельному учебному документу.
export function createSelectorMatcher(markup, Parser = DOMParser) {
  const doc = new Parser().parseFromString(markup, 'text/html')
  const elements = [...doc.body.querySelectorAll('*')]
  const lineNumbers = markup.split('\n').flatMap((line, i) => /^\s*<[a-z][\w-]*(?:\s|>)/i.test(line) ? [i] : [])
  const lines = new Map(elements.map((element, i) => [element, lineNumbers[i]]))
  return selector => {
    if (!selector.trim()) return { lines: [], error:'', total:0 }
    try {
      const matched = [...doc.body.querySelectorAll(selector)]
      return { lines: matched.filter(e => lines.has(e)).map(e => lines.get(e)).sort((a,b) => a-b), total: matched.length, error:'' }
    } catch { return { lines:[], total:0, error:'Селектор пока не удаётся прочитать. Проверьте скобки, кавычки и знаки между частями.' } }
  }
}
