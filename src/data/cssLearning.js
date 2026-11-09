const item = (id, topic, question, definition, path) => ({ id: `css-${id}`, deck: 'css', topic: `css.${topic}`, question, definition, examRefs: ['tech-3', 'tech-5'], mdn: `https://developer.mozilla.org/en-US/docs/Web/CSS/${path}` })
export const cssLearning = [
  item('system-fonts', 'type', 'Как использовать системный шрифт?', 'Укажите `font-family: system-ui, sans-serif`. Браузер использует интерфейсный шрифт устройства: скачивать файл не нужно, но на разных системах результат отличается.', 'Reference/Properties/font-family'),
  item('font-service', 'type', 'Как подключить шрифт через сервис?', 'Подключите предоставленную сервисом таблицу стилей через `<link rel="stylesheet" href="…">`, затем укажите семейство в CSS. Нужны сеть и доступность сервиса; проверьте лицензию и наличие кириллицы. Само название шрифта в CSS ничего не скачивает.', 'Reference/At-rules/@font-face'),
  item('font-face', 'type', 'Как подключить собственный файл шрифта?', 'Объявите семейство через `@font-face`, затем примените его к тексту. Файл должен существовать по указанному адресу. Для каждого начертания задавайте правильные вес и стиль.\n```css\n@font-face {\n  font-family: "Course";\n  src: url("/fonts/course.woff2") format("woff2");\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;\n}\nbody { font-family: "Course", sans-serif; }\n```', 'Reference/At-rules/@font-face'),
  item('font-display', 'type', 'Зачем нужен `font-display: swap`?', 'Пока веб-шрифт загружается, браузер почти сразу показывает запасной. Когда файл готов, заменяет его основным. Из-за разных размеров букв текст может сдвинуться — подбирайте похожий запасной шрифт.', 'Reference/At-rules/@font-face/font-display'),
  item('compound', 'selectors', 'Что такое составной селектор?', 'Несколько условий для одного элемента без пробела: `button.primary` выбирает кнопку с классом primary. `.card.active` — один элемент с обоими классами. Это как несколько фильтров, которые должны выполниться одновременно.', 'Guides/Selectors/Selector_structure'),
  item('descendant', 'selectors', 'Что означает пробел в `.card .title`?', 'Найти элемент с классом title где-то внутри card, на любой глубине. Это сложный селектор: части связаны комбинатором — здесь пробелом. Сам контейнер card не выбирается.', 'Reference/Selectors/Descendant_combinator'),
  item('child', 'selectors', 'Чем `>` отличается от пробела?', '`.card > p` выбирает только абзацы, чей непосредственный родитель — card. `.card p` найдёт и глубоко вложенные абзацы.', 'Reference/Selectors/Child_combinator'),
  item('adjacent', 'selectors', 'Как работает соседний селектор `+`?', '`h2 + p` выбирает абзац, который идёт непосредственно после h2 у того же родителя. Выбирается p, а не h2. Текстовые узлы между ними не мешают.', 'Reference/Selectors/Next-sibling_combinator'),
  item('subsequent', 'selectors', 'Как работает селектор `~`?', '`h2 ~ p` выбирает все следующие абзацы с тем же родителем. Между ними могут быть другие элементы; предыдущие абзацы не выбираются.', 'Reference/Selectors/Subsequent-sibling_combinator'),
  item('selector-list', 'selectors', 'Чем запятая отличается от пробела и отсутствия пробела?', '`.card.active` — один элемент с двумя классами. `.card .active` — active внутри card. `.card, .active` — две независимые группы: все card и все active.', 'Reference/Selectors/Selector_list'),
  item('attribute', 'selectors', 'Как выбрать поле по атрибуту?', '`input[type="email"]` выбирает input, у которого type равен email. `[required]` проверяет наличие атрибута. Можно сочетать с классами: `.form input[required]`.', 'Reference/Selectors/Attribute_selectors'),
  item('specificity', 'selectors', 'Почему одно CSS-правило побеждает другое?', 'Сначала каскад учитывает происхождение, важность и слои. Среди сопоставимых правил сравнивается специфичность: ID, затем классы/атрибуты/псевдоклассы, затем теги/псевдоэлементы. При равенстве выигрывает более позднее правило. Пробел, `>` и другие комбинаторы веса не добавляют.', 'Guides/Cascade/Specificity'),
]

export const selectorMarkup = `<section class="card active">
  <h2 class="title">Афиша</h2>
  <p class="lead">Сегодня</p>
  <div class="details">
    <p class="lead">Подробности</p>
  </div>
  <p class="note">Вход свободный</p>
  <a class="action" href="#tickets">Билеты</a>
</section>
<aside class="active">Архив</aside>`
// Номера строк соответствуют selectorMarkup; варианты содержат один точный ответ.
export const selectorExercises = [
  { id: 'compound', target: [0], options: ['.card .active', '.card.active', '.card, .active'], answer: '.card.active', matches: [[], [0], [0, 9]], explanation: 'Оба класса принадлежат section. Пробел искал бы потомка. Запятая выберет ещё и aside: у него есть active, но нет card.', requirement: 'Выберите только section, у которого одновременно есть классы card и active.' },
  { id: 'child', target: [2, 6], options: ['.card p', '.card > p', '.card > .details p'], answer: '.card > p', matches: [[2, 4, 6], [2, 6], [4]], explanation: 'Прямые дети section — «Сегодня» и «Вход свободный». «Подробности» вложены в div.', requirement: 'Выберите только два абзаца, которые являются прямыми детьми card.' },
  { id: 'descendant', target: [2, 4], options: ['.card > .lead', '.card .lead', '.card.lead'], answer: '.card .lead', matches: [[2], [2, 4], []], explanation: 'Пробел допускает любую глубину. Оба lead внутри card, но у второго непосредственный родитель — div.', requirement: 'Выберите оба элемента lead, включая вложенный.' },
  { id: 'adjacent', target: [2], options: ['h2 ~ p', 'h2 + p', 'p + h2'], answer: 'h2 + p', matches: [[2, 6], [2], []], explanation: 'После h2 непосредственно идёт первый p. Знак + выбирает только ближайшего следующего соседа нужного типа.', requirement: 'Выберите только абзац сразу после h2.' },
  { id: 'subsequent', target: [2, 6], options: ['h2 + p', 'h2 ~ p', 'h2 p'], answer: 'h2 ~ p', matches: [[2], [2, 6], []], explanation: 'Знак ~ находит следующие p с тем же родителем. Вложенный p имеет другого родителя.', requirement: 'Выберите все следующие абзацы на одном уровне с h2.' },
  { id: 'attribute', target: [7], options: ['a[href="#tickets"]', 'a .action', '.card > p'], answer: 'a[href="#tickets"]', matches: [[7], [], [2, 6]], explanation: 'Составной селектор проверяет одновременно тег a и значение href.', requirement: 'Выберите только ссылку с href="#tickets".' },
]
