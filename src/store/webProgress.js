import { defineStore } from 'pinia'
import { loadWebProgress, saveWebProgress, localDay } from '../utils/webProgress'

export const useWebProgressStore = defineStore('webdesign-progress', {
  state: () => {
    const loaded = loadWebProgress({ getItem: key => window.localStorage.getItem(key) })
    return { ...loaded.data, storageError: loaded.error, readBlocked: Boolean(loaded.error) }
  },
  actions: {
    persist() {
      if (this.readBlocked) return
      this.storageError = saveWebProgress({ setItem: (key, value) => window.localStorage.setItem(key, value) }, this.$state)
    },
    recordPrepDay() {
      const day = localDay()
      if (!this.prepDays.includes(day)) this.prepDays.push(day)
    },
    markCard(id, status) { this.marks[id] = status; this.recordPrepDay(); this.persist() },
    resetCards(ids) { ids.forEach(id => delete this.marks[id]); this.persist() },
    saveCardSession(session) { this.cardSession = session; this.persist() },
    setLearned(ids, learned) {
      this.learnedTopics = learned ? [...new Set([...this.learnedTopics, ...ids])] : this.learnedTopics.filter(id => !ids.includes(id))
      this.recordPrepDay(); this.persist()
    },
    recordExercise(id, correct) {
      const previous = this.exercises[id] || { attempts: 0, correctAttempts: 0 }
      this.exercises[id] = { attempts: previous.attempts + 1, correctAttempts: previous.correctAttempts + Number(correct), at: Date.now() }
      this.recordPrepDay(); this.persist()
    },
    rememberActivity(path, label) { this.lastActivity = { path, label, at: Date.now() }; this.persist() },
    dismissWarmup(day = localDay()) { this.warmupDay = day; this.persist() },
    saveAttempt(item) {
      if (this.attempts.some(attempt => attempt.id === item.id)) return false
      this.attempts.push(item)
      this.recordPrepDay()
      this.persist()
      return true
    },
  },
})
