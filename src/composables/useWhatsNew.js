const STORAGE_KEY = 'mathstat_whats_new_seen_v3'

export function hasSeenWhatsNew() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function markWhatsNewSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore */
  }
}
