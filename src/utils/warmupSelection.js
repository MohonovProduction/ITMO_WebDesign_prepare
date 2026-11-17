// Две трети выборов направляем на вопросы по карточкам «Нужно повторить».
export function chooseWarmup(questions, marks, random = Math.random) {
  if (!questions.length) return null
  const review = questions.filter(q => q.conceptId && marks[q.conceptId] === 'unknown')
  const pool = review.length && random() < 2/3 ? review : questions
  return pool[Math.min(pool.length-1, Math.floor(random()*pool.length))]
}
