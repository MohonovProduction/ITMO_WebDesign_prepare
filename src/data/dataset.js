/**
 * Сквозной датасет варианта C-15 (РГР-1).
 * v1: подмножество 50 строк в c15-subset.js; полный CSV — public/data/c15.csv (фаза E).
 */
import { C15_COLUMNS, C15_ROWS } from './c15-subset'

export const DATASET_C15 = {
  id: 'c15',
  title: 'РГР-1 · вариант C-15',
  description:
    'Генеральная совокупность из четырёх признаков X1–X4. Все практические примеры в тренажёре ссылаются на эту выборку.',
  columns: C15_COLUMNS.map((id) => ({
    id,
    label: `Признак ${id}`,
  })),
  rowCount: C15_ROWS.length,
  fullRowCount: 199,
}

/** @param {'X1'|'X2'|'X3'|'X4'} column */
export function getColumnValues(column) {
  return C15_ROWS.map((r) => r[column]).filter((v) => Number.isFinite(v))
}

/** Парсит ключ вида "c15.X1" */
export function parseDatasetRef(ref) {
  if (!ref || typeof ref !== 'string') return null
  const m = ref.match(/^c15\.(X[1-4])$/)
  if (!m) return null
  return { datasetId: 'c15', column: m[1] }
}

export { C15_ROWS, C15_COLUMNS }
