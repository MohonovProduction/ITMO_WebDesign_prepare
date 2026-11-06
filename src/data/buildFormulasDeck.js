import { theory } from './theory.js'
import { methodFunnels } from './methodFunnels.js'
import { RGR_STEPS } from './rgrWorkflow.js'
import { cheatsheetCompact } from './cheatsheetCompact.js'

/** Ключ theoryId-index → короткий промпт на лицевой стороне */
export const FORMULA_PROMPTS = {
  '1-0': 'Эмпирическая функция распределения $F_n(x)$',
  '1-1': 'Сходимость EDF (Гливенко–Кантелли)',
  '3-0': 'Высота столбика гистограммы',
  '3-1': 'Сумма площадей столбиков гистограммы',
  '5-0': 'Начальный выборочный момент',
  '5-1': 'Центральный выборочный момент',
  '6-0': 'Связь выборочных и теоретических моментов',
  '6-1': 'Несмещённость начального момента',
  '7-0': 'Выборочная дисперсия $S_0^2$',
  '7-1': 'Несмещённая выборочная дисперсия $S^2$',
  '7-2': 'Матожидание $S_0^2$ и $S^2$',
  '10-0': 'Квантиль (обобщённая обратная к $F$)',
  '10-1': 'Квантиль при непрерывном $F$',
  '35-0': 'Выборочное среднее $\\bar X$',
  '35-1': 'Матожидание и дисперсия $\\bar X$',
  '35-2': 'Несмещённая дисперсия $S^2$',
  '11-0': 'Метод моментов (общий вид)',
  '11-1': 'Метод моментов (первые моменты)',
  '12-0': 'Функция правдоподобия $L(\\theta)$',
  '12-1': 'Оценка ММП',
  '12-2': 'Уравнение правдоподобия',
  '15-0': 'Состоятельность оценки метода моментов',
  '15-1': 'Асимптотическая нормальность (метод моментов)',
  '16-0': 'Асимптотика ММП',
  '16-1': 'Инвариантность ММП',
  '17-0': 'MSE (разложение)',
  '17-1': 'Относительная эффективность',
  '18-0': 'Информация Фишера $i(\\theta)$',
  '18-1': 'Информация Фишера выборки $I_n(\\theta)$',
  '19-0': 'Неравенство Рао–Крамера',
  '19-1': 'Рао–Крамера для $g(\\theta)$',
  '20-0': 'Правило критерия (критическая область)',
  '20-1': 'Вероятность попадания в $S$ при $H_0$',
  '21-0': 'Ошибка I рода $\\alpha$',
  '21-1': 'Ошибка II рода и мощность',
  '22-0': 'Формулировка $H_0$ и $H_1$',
  '22-1': 'Критическая область уровня $\\alpha$',
  '23-0': 'z-статистика',
  '23-1': 'Распределение $Z$ при $H_0$',
  '24-0': 't-статистика Стьюдента',
  '24-1': 'Распределение $t$ при $H_0$',
  '30-0': 'ДИ для $\\mu$ ($\\sigma$ известна)',
  '30-1': 'ДИ для $\\mu$ ($\\sigma$ неизвестна, t)',
  '31-0': 'Асимптотический ДИ (общий вид)',
  '31-1': 'Асимптотический ДИ для $\\mu$',
  '27-0': 'Статистика Колмогорова $D_n$',
  '27-1': 'Асимптотика $\\sqrt n\\,D_n$',
  '28-0': 'Статистика Пирсона $\\chi^2$',
  '28-1': 'Распределение $\\chi^2$ при $H_0$',
  '36-0': 'Модель линейной регрессии',
  '36-1': 'Критерий МНК (минимизация)',
  '37-0': 'Нормальные уравнения МНК',
  '37-1': 'Явные $\\hat\\beta_0$, $\\hat\\beta_1$',
  '38-0': 'Регрессия через начало координат',
  '38-1': 'Оценка наклона без свободного члена',
  '39-0': 'Ковариация (выборочная)',
  '39-1': 'Корреляция (выборочная)',
  '39-2': 'Границы корреляции',
  '40-0': 'МНК: наклон $\\hat\\beta_1$',
  '40-1': 'МНК: свободный член $\\hat\\beta_0$',
  '41-0': 'ДИ для $\\beta_1$',
  '41-1': 'Стандартная ошибка наклона',
}

/** Формулы практики/РГР, которых нет в theory */
export const FORMULA_EXTRAS = [
  {
    id: 'extra-f-var',
    level: 'methods',
    front: 'F-критерий (сравнение двух дисперсий)',
    back: 'F=\\frac{S_1^2}{S_2^2}\\sim F_{n_1-1,\\,n_2-1}\\quad\\text{при }H_0:\\sigma_1^2=\\sigma_2^2',
    source: 'methods',
  },
  {
    id: 'extra-t-two',
    level: 'methods',
    front: 't-критерий (две независимые выборки, равные дисперсии)',
    back: 't=\\frac{\\bar X_1-\\bar X_2}{S_p\\sqrt{\\frac1{n_1}+\\frac1{n_2}}}\\sim T_{n_1+n_2-2}',
    source: 'methods',
  },
  {
    id: 'extra-ci-t',
    level: 'methods',
    front: 'ДИ для $\\mu$ при неизвестной $\\sigma^2$ (t)',
    back: '\\bar X\\pm t_{1-\\alpha/2,\\,n-1}\\,\\frac{S}{\\sqrt{n}}',
    source: 'methods',
  },
  {
    id: 'extra-moments-eq',
    level: 'methods',
    front: 'Метод моментов (приравнивание)',
    back: '\\alpha_k(\\theta)=\\widehat{\\alpha}_k',
    source: 'methods',
  },
]

function stripDollars(s) {
  let t = s.trim()
  if (t.startsWith('$') && t.endsWith('$')) t = t.slice(1, -1)
  return t.trim()
}

function normalizeExpr(expr) {
  return stripDollars(expr)
    .replace(/\s+/g, '')
    .replace(/\\dfrac/g, '\\frac')
    .replace(/\\tfrac/g, '\\frac')
    .replace(/\\text\{[^}]*\}/g, '')
    .toLowerCase()
}

function looksLikeFormula(s) {
  const t = stripDollars(s)
  if (!t || t.length < 4) return false
  if (/^[а-яА-Яa-zA-Z][а-яА-Яa-zA-Z\s.,;:—\-]+$/.test(t.replace(/\$/g, ''))) return false
  return /[=\\]|\\sim|\\pm|\\xrightarrow|\\sum|\\frac|\\bar|\\hat|\\sup|\\chi/.test(t)
}

function extractFormulaFromText(text) {
  const m = text.match(/\$([^$]+)\$/g)
  if (!m) return null
  for (const part of m) {
    const inner = stripDollars(part)
    if (looksLikeFormula(inner)) return inner
  }
  return null
}

function promptFromExpr(expr, topicTitle, index, topicId) {
  const key = `${topicId}-${index}`
  if (FORMULA_PROMPTS[key]) return FORMULA_PROMPTS[key]

  const left = expr.match(/^([^=]+)=/)
  if (left) {
    const lhs = left[1].trim()
    if (lhs.length > 0 && lhs.length < 48 && !/\\text\{/.test(lhs)) {
      return `Запишите: ${lhs}`
    }
  }

  if (topicTitle) return `${topicTitle} · формула ${index + 1}`
  return `Формула ${index + 1}`
}

function cardsFromTheory() {
  const cards = []
  for (const topic of theory) {
    const formulas = topic.formulas || []
    formulas.forEach((expr, i) => {
      const key = `${topic.id}-${i}`
      const multi = formulas.length > 1
      let front = FORMULA_PROMPTS[key]
      if (!front) {
        front = multi ? promptFromExpr(expr, topic.title, i, topic.id) : topic.title
      }
      cards.push({
        id: `theory-${topic.id}-${i}`,
        level: topic.level,
        theoryId: topic.id,
        front,
        back: expr,
        source: 'theory',
      })
    })
  }
  return cards
}

function cardsFromMethodFunnels(seen) {
  const cards = []
  let seq = 0
  for (const m of methodFunnels) {
    for (const step of m.steps || []) {
      const expr = extractFormulaFromText(step)
      if (!expr) continue
      const norm = normalizeExpr(expr)
      if (seen.has(norm)) continue
      seen.add(norm)
      cards.push({
        id: `methods-${m.id}-${seq++}`,
        level: m.level,
        theoryId: null,
        front: `${m.title}: запишите формулу`,
        back: expr,
        source: 'methods',
      })
    }
  }
  return cards
}

const BRANCH_LABELS = {
  'z-test': 'z-критерий',
  't-test': 't-критерий',
  kolmogorov: 'Колмогоров',
  pearson: 'Пирсон $\\chi^2$',
}

function cardsFromRgrWorkflow(seen) {
  const cards = []
  for (const step of RGR_STEPS) {
    for (const branch of step.branches || []) {
      const raw = branch.computes
      if (!raw) continue
      const expr = extractFormulaFromText(raw) || extractFormulaFromText(raw.replace(/\.$/, ''))
      if (!expr) continue
      const norm = normalizeExpr(expr)
      if (seen.has(norm)) continue
      seen.add(norm)
      cards.push({
        id: `rgr-${branch.goto}`,
        level: 'methods',
        theoryId: branch.theoryId ?? null,
        front: `РГР · ${BRANCH_LABELS[branch.goto] || branch.goto}`,
        back: expr,
        source: 'rgr',
      })
    }
  }
  return cards
}

function cardsFromCheatsheet(seen) {
  const cards = []
  let seq = 0
  for (const row of cheatsheetCompact) {
    for (const line of row.lines || []) {
      if (!looksLikeFormula(line)) continue
      const expr = stripDollars(line)
      const norm = normalizeExpr(expr)
      if (seen.has(norm)) continue
      seen.add(norm)
      cards.push({
        id: `cheat-${row.theoryId}-${seq++}`,
        level: 'basics',
        theoryId: row.theoryId,
        front: row.title,
        back: expr,
        source: 'cheatsheet',
      })
    }
  }
  return cards
}

function cardsFromExtras(seen) {
  const cards = []
  for (const item of FORMULA_EXTRAS) {
    const norm = normalizeExpr(item.back)
    if (seen.has(norm)) continue
    seen.add(norm)
    cards.push({ ...item })
  }
  return cards
}

/**
 * Полная колода формул: теория + практика/РГР/шпаргалка (без дублей).
 */
export function buildFormulasDeck() {
  const seen = new Set()
  const fromTheory = cardsFromTheory()
  for (const c of fromTheory) seen.add(normalizeExpr(c.back))

  return [
    ...fromTheory,
    ...cardsFromExtras(seen),
    ...cardsFromMethodFunnels(seen),
    ...cardsFromRgrWorkflow(seen),
    ...cardsFromCheatsheet(seen),
  ]
}
