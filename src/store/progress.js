import { defineStore } from 'pinia'
import { LEVELS, levelById, PASS_THRESHOLD } from '@/data/levels'
import { flashcards, DECKS } from '@/data/flashcards'

const STORAGE_KEY_V2 = 'mathstat_progress_v2'
const STORAGE_KEY_V1 = 'mathstat_progress_v1'

export function todayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function defaultFlashcards() {
  const decks = {}
  for (const d of DECKS) decks[d.id] = {}
  return decks
}

function defaultState() {
  return {
    version: 2,
    flashcards: defaultFlashcards(),
    miniTests: Object.fromEntries(
      LEVELS.map((l) => [l.id, { best: 0, attempts: 0, lastScore: 0, lastTotal: 0 }]),
    ),
    funnel: { unlocked: [LEVELS[0].id] },
    exam: { best: 0, attempts: 0, lastPercent: 0, lastWrong: [] },
    examTanchenko: { attempts: 0, lastSelfScore: 0, history: [] },
    methodPicker: { seenCaseIds: [], correct: 0, total: 0 },
    prepDays: [],
  }
}

function mergeFlashcards(base, parsed) {
  const out = { ...base }
  for (const key of Object.keys(base)) {
    out[key] = { ...base[key], ...(parsed?.[key] || {}) }
  }
  if (parsed) {
    for (const key of Object.keys(parsed)) {
      if (!out[key]) out[key] = { ...parsed[key] }
    }
  }
  return out
}

function loadState() {
  const base = defaultState()
  try {
    let raw = localStorage.getItem(STORAGE_KEY_V2)
    if (!raw) {
      raw = localStorage.getItem(STORAGE_KEY_V1)
      if (raw) {
        const v1 = JSON.parse(raw)
        const migrated = {
          ...base,
          flashcards: mergeFlashcards(base.flashcards, v1.flashcards),
          miniTests: { ...base.miniTests, ...(v1.miniTests || {}) },
          funnel: { ...base.funnel, ...(v1.funnel || {}) },
          exam: { ...base.exam, ...(v1.exam || {}) },
          prepDays: [],
        }
        localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated))
        return migrated
      }
      return base
    }
    const parsed = JSON.parse(raw)
    return {
      ...base,
      flashcards: mergeFlashcards(base.flashcards, parsed.flashcards),
      miniTests: { ...base.miniTests, ...(parsed.miniTests || {}) },
      funnel: { ...base.funnel, ...(parsed.funnel || {}) },
      exam: { ...base.exam, ...(parsed.exam || {}) },
      examTanchenko: { ...base.examTanchenko, ...(parsed.examTanchenko || {}) },
      methodPicker: { ...base.methodPicker, ...(parsed.methodPicker || {}) },
      prepDays: Array.isArray(parsed.prepDays) ? [...parsed.prepDays] : base.prepDays,
    }
  } catch (e) {
    console.warn('Не удалось прочитать прогресс', e)
    return base
  }
}

export const useProgressStore = defineStore('progress', {
  state: () => loadState(),

  getters: {
    cardStats() {
      return (deck) => {
        const total = flashcards[deck]?.length ?? 0
        const marks = this.flashcards[deck] || {}
        const known = Object.values(marks).filter((s) => s === 'known').length
        const unknown = Object.values(marks).filter((s) => s === 'unknown').length
        const percent = total ? Math.round((known / total) * 100) : 0
        return { total, known, unknown, seen: known + unknown, percent }
      }
    },
    levelScore() {
      return (levelId) => this.miniTests[levelId]?.best ?? 0
    },
    isLevelPassed() {
      return (levelId) => (this.miniTests[levelId]?.best ?? 0) >= PASS_THRESHOLD
    },
    isLevelUnlocked() {
      return (levelId) => {
        const level = levelById(levelId)
        if (!level) return false
        if (level.order === 1) return true
        const prev = LEVELS.find((l) => l.order === level.order - 1)
        return prev ? this.isLevelPassed(prev.id) : false
      }
    },
    currentLevel() {
      const open = LEVELS.filter((l) => this.isLevelUnlocked(l.id))
      const firstUnpassed = open.find((l) => !this.isLevelPassed(l.id))
      return firstUnpassed || open[open.length - 1] || LEVELS[0]
    },
    overallProgress() {
      const decks = DECKS.map((d) => this.cardStats(d.id).percent)
      const cardsAvg = decks.length ? decks.reduce((a, b) => a + b, 0) / decks.length : 0
      const miniAvg =
        LEVELS.reduce((a, l) => a + (this.miniTests[l.id]?.best ?? 0), 0) / (LEVELS.length || 1)
      const examPart = this.exam.best
      const tanchenkoPart = this.examTanchenko.lastSelfScore || 0
      return Math.round(cardsAvg * 0.35 + miniAvg * 0.35 + examPart * 0.2 + tanchenkoPart * 0.1)
    },
    prepDaysCount() {
      return this.prepDays?.length ?? 0
    },
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(
          STORAGE_KEY_V2,
          JSON.stringify({
            version: 2,
            flashcards: this.flashcards,
            miniTests: this.miniTests,
            funnel: this.funnel,
            exam: this.exam,
            examTanchenko: this.examTanchenko,
            methodPicker: this.methodPicker,
            prepDays: this.prepDays,
          }),
        )
      } catch (e) {
        console.warn('Не удалось сохранить прогресс', e)
      }
    },
    recordPrepDay() {
      const key = todayKey()
      if (!this.prepDays) this.prepDays = []
      if (!this.prepDays.includes(key)) {
        this.prepDays = [...this.prepDays, key].sort()
      }
    },
    markCard(deck, cardId, status) {
      if (!this.flashcards[deck]) this.flashcards[deck] = {}
      this.flashcards[deck][cardId] = status
      this.recordPrepDay()
    },
    resetDeck(deck) {
      this.flashcards[deck] = {}
    },
    saveMiniTest(levelId, correct, total) {
      const entry = this.miniTests[levelId] || { best: 0, attempts: 0, lastScore: 0, lastTotal: 0 }
      const percent = total ? Math.round((correct / total) * 100) : 0
      entry.attempts += 1
      entry.lastScore = correct
      entry.lastTotal = total
      entry.best = Math.max(entry.best, percent)
      this.miniTests[levelId] = entry
      this.recomputeUnlocks()
      this.recordPrepDay()
      return percent
    },
    saveExam(percent, wrongIds) {
      this.exam.attempts += 1
      this.exam.lastPercent = percent
      this.exam.lastWrong = [...wrongIds]
      this.exam.best = Math.max(this.exam.best, percent)
      this.recordPrepDay()
    },
    saveTanchenkoAttempt({ defScores, thinkScores }) {
      const total = 4
      const sum = [...(defScores || []), ...(thinkScores || [])].reduce((a, b) => a + (b || 0), 0)
      const percent = Math.round((sum / total) * 100)
      this.examTanchenko.attempts += 1
      this.examTanchenko.lastSelfScore = percent
      this.examTanchenko.history = [
        { at: Date.now(), percent, defScores, thinkScores },
        ...(this.examTanchenko.history || []).slice(0, 9),
      ]
      this.recordPrepDay()
      return percent
    },
    saveMethodPicker(caseId, correct) {
      if (!this.methodPicker.seenCaseIds.includes(caseId)) {
        this.methodPicker.seenCaseIds.push(caseId)
      }
      this.methodPicker.total += 1
      if (correct) this.methodPicker.correct += 1
      this.recordPrepDay()
    },
    recomputeUnlocks() {
      const unlocked = new Set(this.funnel.unlocked)
      unlocked.add(LEVELS[0].id)
      for (const level of LEVELS) {
        if (this.isLevelUnlocked(level.id)) unlocked.add(level.id)
      }
      this.funnel.unlocked = [...unlocked]
    },
    resetProgress() {
      this.$patch(defaultState())
    },
  },
})

export function attachPersistence(store) {
  store.recomputeUnlocks()
  store.$subscribe(() => store.persist())
}
