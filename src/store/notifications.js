import { shallowRef } from 'vue'
export const notification = shallowRef(null)
let serial = 0
export function notifyProgress(title, rows) { notification.value = { id:++serial, title, rows } }
export function dismissNotification() { notification.value = null }
