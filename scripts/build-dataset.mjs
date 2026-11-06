import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const csvPath = path.join(__dirname, '../public/data/c15.csv')
const outPath = path.join(__dirname, '../src/data/c15-full.js')

const csv = fs.readFileSync(csvPath, 'utf8')
const lines = csv.trim().split('\n')
const header = lines[0].split(',')
const rows = lines.slice(1).map((line) => {
  const v = line.split(',')
  const o = {}
  header.forEach((h, i) => { o[h] = parseFloat(v[i]) })
  return o
})

fs.writeFileSync(
  outPath,
  `/** Полная выборка C-15 (${rows.length} строк) */\nexport const C15_COLUMNS = ${JSON.stringify(header)}\nexport const C15_ROWS = ${JSON.stringify(rows, null, 2)}\n`,
)
console.log('Wrote', outPath, rows.length, 'rows')
