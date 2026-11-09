export function learningStats(progress, cards, topicIds, exerciseIds) {
  const known = cards.filter(c => progress.marks[c.id] === 'known').length
  const unknown = cards.filter(c => progress.marks[c.id] === 'unknown').length
  const learned = topicIds.filter(id => progress.learnedTopics.includes(id)).length
  const results = exerciseIds.map(id => progress.exercises[id]).filter(Boolean)
  const attempts = results.reduce((sum, r) => sum + r.attempts, 0)
  const correctAttempts = results.reduce((sum, r) => sum + r.correctAttempts, 0)
  return { known, unknown, newCards:cards.length-known-unknown, learned, attempted:results.length, mastered:results.filter(r => r.correctAttempts > 0).length, attempts, accuracy:attempts ? Math.round(correctAttempts / attempts * 100) : null }
}
