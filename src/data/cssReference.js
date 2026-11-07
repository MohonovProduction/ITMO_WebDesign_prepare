const mdn = (path) => `https://developer.mozilla.org/en-US/docs/Web/CSS/${path}`

export const cssRules = [
  { id: 'selector', code: '.profile-card', title: 'Класс', description: 'Переиспользуемый селектор для группы элементов.', cardId: 'css-class-id', mdn: mdn('Reference/Selectors/Class_selectors') },
  { id: 'descendant', code: '.profile-card h2', title: 'Вложенный селектор', description: 'Выбирает `h2` внутри карточки.', cardId: 'css-selectors', mdn: mdn('Reference/Selectors/Descendant_combinator') },
  { id: 'font', code: 'font-family', title: 'Шрифт и fallback', description: 'Задаёт список гарнитур с запасным семейством.', cardId: 'css-font', mdn: mdn('Reference/Properties/font-family') },
  { id: 'layout', code: 'display: flex', title: 'Раскладка', description: 'Располагает прямых потомков по гибкой оси.', cardId: 'css-layout', mdn: mdn('Reference/Properties/display') },
  { id: 'gap', code: 'gap', title: 'Расстояние', description: 'Отступ между элементами flex/grid-контейнера.', cardId: 'css-layout', mdn: mdn('Reference/Properties/gap') },
  { id: 'hover', code: ':hover', title: 'Состояние', description: 'Стили элемента под указателем.', cardId: 'css-hover', mdn: mdn('Reference/Selectors/:hover') },
  { id: 'media', code: '@media', title: 'Адаптив', description: 'Условно применяет правила по характеристикам среды.', cardId: 'css-media', mdn: mdn('Guides/Media_queries') },
]
