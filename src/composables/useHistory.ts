import type { HistoryEntry } from '../types/question'

const HISTORY_KEY = 'devchallenge:history:v1'
const MAX_HISTORY = 5

export function useHistory() {
  function loadHistory(): HistoryEntry[] {
    try {
      const raw = localStorage.getItem(HISTORY_KEY)
      if (!raw) return []
      return JSON.parse(raw) as HistoryEntry[]
    } catch {
      return []
    }
  }

  function saveEntry(entry: HistoryEntry): HistoryEntry[] {
    const current = loadHistory()
    const updated = [entry, ...current].slice(0, MAX_HISTORY)

    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
    } catch {
      // localStorage unavailable
    }

    return updated
  }

  return {
    loadHistory,
    saveEntry,
  }
}
