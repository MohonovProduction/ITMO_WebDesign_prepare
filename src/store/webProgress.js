import { defineStore } from 'pinia'
import { loadWebProgress, saveWebProgress } from '../utils/webProgress'

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
      const date = new Date()
      const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      if (!this.prepDays.includes(day)) this.prepDays.push(day)
    },
    markCard(id, status) { this.marks[id] = status; this.recordPrepDay(); this.persist() },
    resetCards(ids) { ids.forEach(id => delete this.marks[id]); this.persist() },
    saveCardSession(session) { this.cardSession = session; this.persist() },
    saveAttempt(item) {
      if (this.attempts.some(attempt => attempt.id === item.id)) return false
      this.attempts.push(item)
      this.recordPrepDay()
      this.persist()
      return true
    },
  },
})
