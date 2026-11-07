import { htmlReferenceEntries, getConcept } from './concepts.js'

export const semanticTags = htmlReferenceEntries.map(entry => ({
  ...entry,
  role: entry.summary,
  when: entry.usage,
  definition: getConcept(entry.conceptId).definition,
}))

export const tagCategoryStyles = {
  document: 'text-violet-700',
  metadata: 'text-amber-700',
  landmark: 'text-sky-700',
  sectioning: 'text-emerald-700',
  text: 'text-rose-700',
  interactive: 'text-orange-700',
  embedded: 'text-fuchsia-700',
}

// Порядок строк в наглядном, но сокращённом HTML-документе.
// `tag` связывает каждую строку с карточкой справочника.
export const semanticCodeLines = [
  { tag: 'html', indent: 0, attributes: ' lang="ru"' },
  { tag: 'head', indent: 1 },
  { tag: 'title', indent: 2, text: 'Учебная страница', inline: true },
  { tag: 'head', indent: 1, closing: true },
  { tag: 'body', indent: 1 },
  { tag: 'header', indent: 2 },
  { tag: 'nav', indent: 3 },
  { tag: 'nav', indent: 3, closing: true },
  { tag: 'header', indent: 2, closing: true },
  { tag: 'main', indent: 2 },
  { tag: 'article', indent: 3 },
  { tag: 'h1', indent: 4, text: 'Заголовок статьи', inline: true },
  { tag: 'section', indent: 4 },
  { tag: 'p', indent: 5 },
  { tag: 'a', indent: 6, attributes: ' href="#more"', text: 'Подробнее', inline: true },
  { tag: 'p', indent: 5, closing: true },
  { tag: 'ul', indent: 5 },
  { tag: 'li', indent: 6, text: 'Первый пункт', inline: true },
  { tag: 'li', indent: 6, text: 'Второй пункт', inline: true },
  { tag: 'ul', indent: 5, closing: true },
  { tag: 'img', indent: 5, attributes: ' src="cover.webp" alt="Обложка"', void: true },
  { tag: 'svg', indent: 5, attributes: ' viewBox="0 0 24 24"', text: '…', inline: true },
  { tag: 'section', indent: 4, closing: true },
  { tag: 'article', indent: 3, closing: true },
  { tag: 'aside', indent: 3 },
  { tag: 'form', indent: 4 },
  { tag: 'label', indent: 5, attributes: ' for="email"', text: 'Email', inline: true },
  { tag: 'input', indent: 5, attributes: ' id="email" type="email"', void: true },
  { tag: 'button', indent: 5, text: 'Отправить', inline: true },
  { tag: 'form', indent: 4, closing: true },
  { tag: 'aside', indent: 3, closing: true },
  { tag: 'main', indent: 2, closing: true },
  { tag: 'footer', indent: 2 },
  { tag: 'footer', indent: 2, closing: true },
  { tag: 'body', indent: 1, closing: true },
  { tag: 'html', indent: 0, closing: true },
]
