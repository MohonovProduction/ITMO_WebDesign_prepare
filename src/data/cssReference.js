import { getConcept } from './concepts.js'
const mdn = (path) => `https://developer.mozilla.org/en-US/docs/Web/CSS/${path}`

export const cssRules = [
  { id: 'selector', code: '.profile-card', title: 'Класс', cardId: 'css-class-id', mdn: mdn('Reference/Selectors/Class_selectors') },
  { id: 'descendant', code: '.profile-card h2', title: 'Вложенный селектор', cardId: 'css-selectors', mdn: mdn('Reference/Selectors/Descendant_combinator') },
  { id: 'font', code: 'font-family', title: 'Шрифт и fallback', cardId: 'css-font', mdn: mdn('Reference/Properties/font-family') },
  { id: 'layout', code: 'display: flex', title: 'Раскладка', cardId: 'css-layout', mdn: mdn('Reference/Properties/display') },
  { id: 'gap', code: 'gap', title: 'Расстояние', cardId: 'css-layout', mdn: mdn('Reference/Properties/gap') },
  { id: 'hover', code: ':hover', title: 'Состояние', cardId: 'css-hover', mdn: mdn('Reference/Selectors/:hover') },
  { id: 'media', code: '@media', title: 'Адаптив', cardId: 'css-media', mdn: mdn('Guides/Media_queries') },
].map(item => ({ ...item, conceptId: item.cardId, description: getConcept(item.cardId).definition }))
