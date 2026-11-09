import test from 'node:test'
import assert from 'node:assert/strict'
import { formatStudyText, studyTextBlocks } from '../src/utils/typography.js'
import { completionRows } from '../src/utils/trainingFeedback.js'

test('Russian prose receives quotes, dashes and nonbreaking spaces', () => {
  const result = formatStudyText('Это "пример" - он о тексте.')
  assert.ok(result.includes('«пример»'))
  assert.ok(result.includes('—'))
  assert.ok(result.includes('\u00a0'))
})
test('inline selectors, HTML attributes and fenced code remain literal', () => {
  const inline = 'input[type="email"]'
  const block = '<input name="x" value="a - b">\nconst text = "a -- b";'
  const text = `До \`${inline}\` после.\n\`\`\`html\n${block}\n\`\`\``
  const parts = studyTextBlocks(text)
  assert.equal(parts[0].parts.find(p => p.type === 'code').value, inline)
  assert.equal(parts.find(p => p.type === 'block').value, block)
  assert.ok(formatStudyText('Выберите type="email".').includes('type="email"'))
  assert.ok(parts[0].parts.find(p => p.type === 'text').value.endsWith('\u00a0'))
  assert.ok(parts[0].parts.at(-1).value.startsWith(' '))
})
test('completion toast shows dashboard totals and does not invent gains on repeats', () => {
  const before = {mastered:2,accuracy:50,attempts:4}
  const after = {mastered:4,accuracy:60,attempts:10}
  const rows = completionRows(before, after)
  assert.equal(rows[0].change,'+2 новых')
  assert.equal(rows[1].before,'50%')
  assert.equal(rows[1].after,'60%')
  assert.equal(rows[1].change,'Ответов за подход: 6')
  assert.equal(completionRows(after, after)[0].change,'Без новых решений')
  assert.equal(completionRows({mastered:0,accuracy:null,attempts:0},after)[1].before,'—')
})
