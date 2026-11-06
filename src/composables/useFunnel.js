import { computed } from 'vue'
import { useProgressStore } from '@/store/progress'
import { LEVELS, PASS_THRESHOLD } from '@/data/levels'

/**
 * Состояние воронки подготовки: уровни, их прогресс и доступность.
 */
export function useFunnel() {
  const store = useProgressStore()

  const levels = computed(() =>
    LEVELS.map((level) => ({
      ...level,
      score: store.levelScore(level.id),
      cardsPercent: store.cardStats('terms').percent, // общий ориентир, детально — на странице карточек
      unlocked: store.isLevelUnlocked(level.id),
      passed: store.isLevelPassed(level.id),
    })),
  )

  const currentLevel = computed(() => store.currentLevel)
  const threshold = PASS_THRESHOLD

  return { levels, currentLevel, threshold }
}
