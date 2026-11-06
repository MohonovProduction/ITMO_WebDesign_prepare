export function mean(values) {
  if (!values.length) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

export function sampleVariance(values) {
  const n = values.length
  if (n < 2) return 0
  const m = mean(values)
  return values.reduce((s, x) => s + (x - m) ** 2, 0) / (n - 1)
}

export function sturgesBins(n) {
  return Math.max(1, Math.ceil(1 + Math.log2(Math.max(n, 2))))
}

export function histogramBins(values, k = null) {
  const sorted = [...values].filter(Number.isFinite).sort((a, b) => a - b)
  const n = sorted.length
  if (!n) return { bins: [], min: 0, max: 0 }
  const numBins = k ?? sturgesBins(n)
  const min = sorted[0]
  const max = sorted[n - 1]
  const width = max === min ? 1 : (max - min) / numBins
  const counts = Array(numBins).fill(0)
  for (const x of sorted) {
    let idx = Math.floor((x - min) / width)
    if (idx >= numBins) idx = numBins - 1
    counts[idx]++
  }
  const bins = counts.map((count, i) => {
    const lo = min + i * width
    const hi = i === numBins - 1 ? max : lo + width
    const w = hi - lo || 1
    return { lo, hi, count, density: count / n / w }
  })
  return { bins, min, max }
}

export function summary(values) {
  const sorted = [...values].filter(Number.isFinite).sort((a, b) => a - b)
  const n = sorted.length
  const med = n % 2 === 1 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2
  return { n, mean: mean(sorted), variance: sampleVariance(sorted), median: med, min: sorted[0] ?? 0, max: sorted[n - 1] ?? 0 }
}
