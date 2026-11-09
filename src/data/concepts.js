import { expandedConcepts } from './expandedConcepts.js'
import { cssLearning } from './cssLearning.js'
// Единственный источник определений. ID учебных карточек остаются стабильными.
function concept(id, deck, question, definition, examRefs) {
  return { id, deck, question, definition, examRefs }
}
const studyConcepts = [
  ...cssLearning,
  ...expandedConcepts,
  concept('css-selectors', 'css', 'Что делает CSS-селектор?', 'Селектор выбирает HTML-элементы, к которым применяется правило. Например, `article p` выбирает абзацы внутри статьи, а `.lead` — элементы с классом `lead`.', ['tech-3', 'tech-5']),
  concept('css-class-id', 'css', 'Чем класс отличается от `id`?', 'Класс переиспользуется на нескольких элементах и подходит для стилизации группы. `id` должен быть уникален в документе; его удобно применять для якоря или связи с `label`.', ['tech-3', 'tech-5']),
  concept('css-font', 'css', 'Зачем у `font-family` нужен fallback?', 'Если основной шрифт не загрузился или не поддерживает символ, браузер возьмёт следующий вариант. В конце указывают обобщённое семейство, например `sans-serif`.', ['tech-5']),
  concept('css-box-model', 'css', 'Что входит в box model?', 'Размер блока складывается из content, `padding`, `border` и `margin`. `padding` — пространство внутри границы, `margin` — снаружи.', ['tech-3']),
  concept('css-layout', 'css', 'Зачем нужны `display: flex` и `gap`?', '`flex` управляет расположением дочерних элементов по одной оси, а `gap` задаёт расстояние между ними без хрупких отступов у каждого элемента.', ['tech-3', 'ux-9']),
  concept('css-hover', 'css', 'Что делает псевдокласс `:hover`?', 'Он применяет стиль, когда указатель находится над элементом. Hover не должен быть единственным способом получить важную информацию: на touch-устройствах его нет.', ['tech-3', 'ux-8', 'ux-9']),
  concept('css-media', 'css', 'Для чего используется `@media`?', 'Media query применяет CSS при определённом условии экрана или среды. Она помогает адаптировать компоновку, отступы и навигацию, но не заменяет продуманную структуру.', ['tech-3', 'ux-9']),
  concept('css-position', 'css', 'Как различаются `relative`, `absolute`, `fixed` и `sticky`?', '`relative` остаётся в потоке; `absolute` свободно лежит относительно контейнера; `fixed` приклеен к окну; `sticky` сначала в потоке, затем закрепляется. В Figma это похоже на Auto Layout, Absolute position и Fix position when scrolling.', ['tech-3']),
  concept('css-flex-axis', 'css', 'Что такое главная ось Flexbox?', 'Её задаёт `flex-direction`: `row` — горизонтальная, `column` — вертикальная. Это прямой аналог направления Auto Layout в Figma.', ['tech-3']),
  concept('css-grid', 'css', 'Когда выбрать CSS Grid?', 'Когда нужно управлять рядами и колонками одновременно — как сеткой фрейма в Figma. Flexbox удобнее, когда важна одна ось.', ['tech-3', 'ux-9']),
  concept('css-units', 'css', 'Какие единицы нужны веб-дизайнеру?', '`px` — фиксированный размер; `%` — доля родителя; `rem` — масштаб от корневого текста; `em` — от текущего текста; `vw`/`vh` — от окна; `fr` — доля Grid.', ['tech-3', 'tech-5', 'ux-9']),
  concept('semantic-header', 'semantic', 'Когда использовать `<header>`?', 'Для вводной части страницы или раздела: логотип, заголовок, навигация, служебная информация. Это не просто «верхняя полоска» сайта: у статьи или секции тоже может быть свой `<header>`.', ['tech-2', 'tech-3']),
  concept('semantic-nav', 'semantic', 'Что обозначает `<nav>`?', 'Самостоятельный блок навигации: обычно главное меню, оглавление или набор существенных ссылок. Не каждую одиночную ссылку нужно помещать в `<nav>`.', ['tech-2', 'tech-3']),
  concept('semantic-main', 'semantic', 'Для чего нужен `<main>`?', 'Он содержит уникальное основное содержание документа. На странице должен быть один `<main>`; повторяющиеся шапка, меню и футер в него не входят.', ['tech-2', 'tech-3']),
  concept('semantic-article', 'semantic', 'Что такое `<article>`?', 'Независимая самодостаточная единица контента, которую можно читать и распространять отдельно: статья, карточка новости, пост, комментарий или товар.', ['tech-2', 'tech-3']),
  concept('semantic-section', 'semantic', 'Когда уместен `<section>`?', 'Когда нужно объединить контент в тематический раздел, обычно с собственным заголовком. Не следует заменять им любой контейнер без смысловой группировки.', ['tech-2', 'tech-3']),
  concept('semantic-aside', 'semantic', 'Что помещают в `<aside>`?', 'Связанное, но не основное содержание: примечание, сайдбар, дополнительные ссылки, рекламный или справочный блок. Если его убрать, главная мысль материала не должна разрушиться.', ['tech-2', 'tech-3']),
  concept('semantic-footer', 'semantic', 'Роль `<footer>`?', 'Завершающая служебная часть страницы или ближайшего раздела: авторство, контакты, копирайт, юридические ссылки, навигация по материалу.', ['tech-2', 'tech-3']),
  concept('semantic-heading', 'semantic', 'Почему `h1`–`h6` нельзя выбирать по размеру шрифта?', 'Заголовки задают логическую иерархию документа для людей, поисковых систем и ассистивных технологий. Внешний размер настраивается CSS, а уровень выбирается по структуре смысла.', ['tech-5', 'tech-8']),
  concept('semantic-div', 'semantic', 'Когда использовать `<div>`?', 'Когда нужен нейтральный контейнер для группировки или стилизации, но подходящего семантического элемента нет. Сначала стоит проверить, не выражает ли смысл `header`, `main`, `section`, `article`, `aside` или `footer`.', ['tech-2', 'tech-3']),
  concept('semantic-button-link', 'semantic', 'Чем `<button>` отличается от `<a>`?', '`<a>` ведёт по адресу или к якорю — это навигация. `<button>` запускает действие на текущей странице: открывает меню, отправляет форму, меняет состояние интерфейса.', ['tech-2', 'tech-6', 'ux-8']),
  concept('semantic-label', 'semantic', 'Зачем форме нужен `<label>`?', 'Он связывает понятную подпись с полем ввода. Клик по подписи фокусирует поле, а скринридер сообщает назначение контрола. Связь делают вложенностью или `for`/`id`.', ['tech-6', 'tech-7', 'ux-8']),
  concept('svg-vector', 'svg', 'Что такое SVG?', 'Scalable Vector Graphics — XML-формат векторной графики. Изображение состоит из описаний фигур и путей, поэтому хорошо масштабируется и может быть стилизовано или анимировано кодом.', ['tech-3', 'tech-9']),
  concept('svg-raster', 'svg', 'Когда SVG предпочтительнее растра?', 'Для логотипов, иконок, схем и несложных иллюстраций с чёткими контурами. Для фотографий и очень сложной графики чаще рациональнее JPEG, WebP, AVIF или PNG.', ['tech-3', 'tech-9']),
  concept('svg-viewbox', 'svg', 'Что задаёт `viewBox` в SVG?', 'Внутреннюю систему координат и видимую область рисунка: `min-x min-y width height`. Он позволяет SVG масштабироваться, сохраняя пропорции содержимого.', ['tech-3']),
  concept('svg-img', 'svg', 'Что даёт вставка SVG через `<img>`?', 'Простое подключение отдельного файла: браузер загружает его как изображение. Это удобно, когда не нужно менять отдельные `path` через CSS или JavaScript.', ['tech-3', 'tech-9']),
  concept('svg-inline', 'svg', 'Зачем вставлять SVG inline в HTML?', 'Чтобы обращаться к его элементам из CSS и JavaScript: менять `fill`, реагировать на `:hover`, добавлять подписи и интерактивность. Компромисс — HTML становится объёмнее.', ['tech-3', 'tech-9']),
  concept('svg-path', 'svg', 'Что такое `<path>` в SVG?', 'Элемент с геометрией в атрибуте `d`. Он может описывать линии, кривые и сложные контуры; его можно стилизовать через `fill`, `stroke` и селекторы CSS.', ['tech-3']),
  concept('svg-group', 'svg', 'Для чего нужен `<g>` в SVG?', 'Для смысловой группировки графических элементов. Стили и трансформации, заданные группе, наследуются её дочерними фигурами — удобно для интерактивных узлов схемы.', ['tech-3']),
  concept('svg-example', 'svg', 'Как выглядит минимальный inline SVG с `viewBox`?', '```svg\n<svg viewBox="0 0 24 24" role="img">\n  <title>Звезда</title>\n  <path d="…" fill="currentColor" />\n</svg>\n```\n`viewBox` задаёт внутренние координаты, а `currentColor` позволяет иконке наследовать цвет текста из CSS.', ['tech-3', 'tech-9']),
  concept('svg-accessible', 'svg', 'Как сделать смысловой SVG понятнее?', 'Дать текстовую альтернативу: для содержательной графики — `title`, `desc` и доступное имя; для декоративной — скрыть от ассистивных технологий. Не полагаться только на цвет или hover.', ['tech-3', 'ux-8']),
  concept('def-site', 'definitions', 'Что такое веб-сайт?', 'Совокупность связанных гипертекстовых документов и ресурсов, объединённых тематикой, навигацией и адресным пространством. Браузер получает ресурсы по сети и отображает их пользователю.', ['tech-1', 'tech-2']),
  concept('def-ux', 'definitions', 'Что такое UX?', 'User Experience — опыт человека при взаимодействии с продуктом: насколько он понимает задачу, достигает цели, что чувствует до, во время и после использования.', ['ux-1']),
  concept('def-ui', 'definitions', 'Что такое UI?', 'User Interface — конкретные средства взаимодействия: элементы, состояния, визуальная иерархия, тексты, управление. UI обслуживает UX, а не существует только ради оформления.', ['ux-1']),
  concept('def-design', 'definitions', 'Что в курсе понимается под дизайном?', 'Проектирование решения, а не только визуальное оформление. Сначала определяют цель, аудиторию, содержание и структуру, а затем выбирают визуальные средства.', ['tech-4', 'ux-1', 'ux-7']),
  concept('def-research', 'definitions', 'Зачем нужны пользовательские исследования?', 'Чтобы снизить неопределённость о людях, их задачах, контексте и проблемах до принятия решений. Исследование выбирают по вопросу, а не «на всякий случай».', ['ux-3']),
  concept('def-qualitative', 'definitions', 'Что такое качественное исследование?', 'Подход, который отвечает на «почему» и «как»: интервью, наблюдение, usability-тестирование. Он раскрывает мотивацию и контекст, но не предназначен для статистической оценки рынка.', ['ux-3', 'ux-4']),
  concept('def-quantitative', 'definitions', 'Что такое количественное исследование?', 'Подход, который измеряет распространённость явления на достаточной выборке: опросы, продуктовые метрики, эксперименты. Он отвечает на «сколько» и «как часто».', ['ux-3']),
  concept('def-persona', 'definitions', 'Что такое персона?', 'Архетип важного сегмента аудитории, основанный на данных: его цели, контекст, боли и поведение. Это не вымышленный портрет «среднего пользователя» и не набор демографии ради демографии.', ['ux-5']),
  concept('def-cjm', 'definitions', 'Что показывает CJM?', 'Customer Journey Map показывает путь пользователя к цели: шаги, точки контакта, ожидания, эмоции, барьеры и возможности улучшения.', ['ux-6']),
  concept('def-user-story', 'definitions', 'Из чего состоит User Story?', 'Короткая формула потребности: «Как [роль], я хочу [действие], чтобы [ценность]». Она удерживает фокус на пользователе и ожидаемом результате, а не на преждевременном решении.', ['ux-6']),
  concept('def-wireframe', 'definitions', 'Что такое вайрфрейм?', 'Схематичный макет структуры интерфейса: блоки, иерархия, сценарии и ключевые состояния без преждевременной визуальной полировки. Он помогает проверить логику до детализации UI.', ['ux-7']),
  concept('def-accessibility', 'definitions', 'Что такое accessibility?', 'Доступность цифрового продукта для людей с разными возможностями и в разных условиях. Она включает семантику, контраст, управление с клавиатуры, понятные подписи и альтернативы медиа.', ['ux-8', 'tech-6']),
  concept('svg-circle', 'svg', 'Что задаёт элемент `<circle>`?', 'Круг в SVG: `cx` и `cy` задают центр, а `r` — радиус. Цвет внутри определяет `fill`, линию вокруг — `stroke`.', ['tech-3']),
]
const mdn = tag => `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/${tag}`
const htmlMetadata = [
  { tag: 'html', parent: null, category: 'document', role: 'Корневой элемент HTML-документа.', when: 'Один раз в начале каждого HTML-документа; содержит `head` и `body`.', path: ['html'], mdn: mdn('html') },
  { tag: 'head', parent: 'html', category: 'metadata', role: 'Метаданные документа: то, что помогает браузеру и поисковым системам, но не является видимым содержимым страницы.', when: 'Внутри `html`, перед `body`.', path: ['html', 'head'], mdn: mdn('head') },
  { tag: 'title', parent: 'head', category: 'metadata', role: 'Название документа во вкладке браузера и закладках.', when: 'Один раз внутри `head`; текст должен описывать конкретную страницу.', path: ['html', 'head', 'title'], mdn: mdn('title') },
  { tag: 'body', parent: 'html', category: 'document', role: 'Всё содержимое документа, которое браузер отображает пользователю.', when: 'Один раз внутри `html` после `head`.', path: ['html', 'body'], mdn: mdn('body') },
  { tag: 'header', parent: 'body', category: 'landmark', role: 'Вводный блок страницы или раздела: логотип, заголовок, поиск, навигационные подсказки.', when: 'Для шапки всей страницы или конкретного раздела; это не синоним верхней визуальной полосы.', path: ['html', 'body', 'header'], mdn: mdn('header') },
  { tag: 'nav', parent: 'header', category: 'landmark', role: 'Значимый блок навигационных ссылок по сайту или документу.', when: 'Для главного меню, оглавления или другой существенной навигации; не для каждой одиночной ссылки.', path: ['html', 'body', 'header', 'nav'], mdn: mdn('nav') },
  { tag: 'main', parent: 'body', category: 'landmark', role: 'Доминирующее, уникальное содержание страницы.', when: 'Обычно один раз на странице; не включает повторяющиеся шапку, меню и футер.', path: ['html', 'body', 'main'], mdn: mdn('main') },
  { tag: 'article', parent: 'main', category: 'sectioning', role: 'Самостоятельная единица контента, которую можно читать или распространять отдельно.', when: 'Для статьи, новости, карточки товара, поста или комментария.', path: ['html', 'body', 'main', 'article'], mdn: mdn('article') },
  { tag: 'h1', parent: 'article', category: 'text', role: 'Заголовок первого уровня; часть смысловой иерархии документа.', when: 'Для главного заголовка статьи или страницы — уровень определяется структурой, а не размером шрифта.', path: ['html', 'body', 'main', 'article', 'h1'], mdn: mdn('h1') },
  { tag: 'section', parent: 'article', category: 'sectioning', role: 'Тематический раздел документа.', when: 'Когда есть самостоятельная тема и обычно собственный заголовок; не как универсальная замена `div`.', path: ['html', 'body', 'main', 'article', 'section'], mdn: mdn('section') },
  { tag: 'p', parent: 'section', category: 'text', role: 'Абзац связного текста.', when: 'Для текстового абзаца, а не для контейнера с другими блочными элементами.', path: ['html', 'body', 'main', 'article', 'section', 'p'], mdn: mdn('p') },
  { tag: 'a', parent: 'p', category: 'text', role: 'Гиперссылка на другой адрес или якорь.', when: 'Когда действие пользователя — перейти к ресурсу; для действия на текущей странице используют `button`.', path: ['html', 'body', 'main', 'article', 'section', 'p', 'a'], mdn: mdn('a') },
  { tag: 'ul', parent: 'section', category: 'sectioning', role: 'Неупорядоченный список однотипных пунктов.', when: 'Когда порядок пунктов не меняет смысл; для последовательности шагов используют `ol`.', path: ['html', 'body', 'main', 'article', 'section', 'ul'], mdn: mdn('ul') },
  { tag: 'ol', parent: 'section', category: 'sectioning', role: 'Упорядоченный список, в котором порядок элементов значим.', when: 'Для шагов инструкции, рейтинга или другой последовательности.', path: ['html', 'body', 'main', 'article', 'section', 'ol'], mdn: mdn('ol') },
  { tag: 'li', parent: 'ul', category: 'sectioning', role: 'Один пункт списка.', when: 'Только внутри `ul`, `ol` или `menu`; это не универсальный контейнер.', path: ['html', 'body', 'main', 'article', 'section', 'ul', 'li'], mdn: mdn('li') },
  { tag: 'img', parent: 'section', category: 'embedded', role: 'Встраивает растровое или векторное изображение в документ.', when: 'Для содержательного изображения обязательно дать осмысленный `alt`; для декоративного — пустой `alt=""`.', path: ['html', 'body', 'main', 'article', 'section', 'img'], mdn: mdn('img') },
  { tag: 'svg', parent: 'section', category: 'embedded', role: 'Контейнер для масштабируемой векторной графики SVG.', when: 'Для иконок, схем и интерактивной векторной графики; важным изображениям нужны название и доступное описание.', path: ['html', 'body', 'main', 'article', 'section', 'svg'], mdn: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/svg' },
  { tag: 'aside', parent: 'main', category: 'landmark', role: 'Содержание, косвенно связанное с основным: справка, связанные ссылки, врезка.', when: 'Если блок можно убрать без разрушения основного материала.', path: ['html', 'body', 'main', 'aside'], mdn: mdn('aside') },
  { tag: 'form', parent: 'aside', category: 'interactive', role: 'Форма для сбора и отправки пользовательских данных.', when: 'Когда несколько полей образуют единое действие: поиск, обратная связь, заказ, вход.', path: ['html', 'body', 'main', 'aside', 'form'], mdn: mdn('form') },
  { tag: 'label', parent: 'form', category: 'interactive', role: 'Текстовая подпись, связанная с полем ввода.', when: 'У каждого поля, которое требует объяснения; связывается через `for`/`id` или вложенность.', path: ['html', 'body', 'main', 'aside', 'form', 'label'], mdn: mdn('label') },
  { tag: 'input', parent: 'form', category: 'interactive', role: 'Интерактивное поле ввода с типом, именем и ограничениями.', when: 'Для коротких данных: текст, email, пароль, дата, флажок и т. д.; выбирайте подходящий `type`.', path: ['html', 'body', 'main', 'aside', 'form', 'input'], mdn: mdn('input') },
  { tag: 'button', parent: 'form', category: 'interactive', role: 'Элемент, запускающий действие в текущем интерфейсе.', when: 'Для отправки формы, открытия меню, переключения состояния; ссылку не заменяет.', path: ['html', 'body', 'main', 'aside', 'form', 'button'], mdn: mdn('button') },
  { tag: 'footer', parent: 'body', category: 'landmark', role: 'Завершающая служебная часть страницы или раздела.', when: 'Для авторства, копирайта, контактов и связанных документов.', path: ['html', 'body', 'footer'], mdn: mdn('footer') },
]
const htmlConceptIds = {
  "header": "semantic-header",
  "nav": "semantic-nav",
  "main": "semantic-main",
  "article": "semantic-article",
  "h1": "semantic-heading",
  "section": "semantic-section",
  "a": "semantic-button-link",
  "button": "semantic-button-link",
  "aside": "semantic-aside",
  "footer": "semantic-footer",
  "label": "semantic-label",
  "svg": "svg-vector"
}
const registry = Object.fromEntries(studyConcepts.map(item => [item.id, item]))
for (const entry of htmlMetadata) {
  const id = htmlConceptIds[entry.tag] || `html-${entry.tag}`
  const existing = registry[id]
  if (!existing) registry[id] = { id, definition: entry.role, examRefs: ['tech-2', 'tech-3'] }
}
export const concepts = Object.freeze(registry)
export function getConcept(id) {
  const item = concepts[id]
  if (!item) throw new Error(`Unknown learning concept: ${id}`)
  return item
}
export const flashcardConcepts = studyConcepts
export const htmlReferenceEntries = htmlMetadata.map(({ role, when, ...entry }) => ({
  ...entry,
  conceptId: htmlConceptIds[entry.tag] || `html-${entry.tag}`,
  summary: role,
  usage: when,
}))
