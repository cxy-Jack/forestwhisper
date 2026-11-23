import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { AssessRecord } from '@/data/types'
import { usePersisted } from './persist'

export const useAssessStore = defineStore('assess', () => {
  const records = usePersisted<AssessRecord[]>('lyxy:assess:records', [])
  const favorites = usePersisted<string[]>('lyxy:fav:articles', [])

  const latestByScale = computed(() => {
    const map = new Map<string, AssessRecord>()
    for (const r of records.value) {
      if (!map.has(r.scaleId)) map.set(r.scaleId, r)
    }
    return map
  })

  function addRecord(record: AssessRecord) {
    records.value.unshift(record)
    // 只保留最近 50 条
    if (records.value.length > 50) records.value.length = 50
  }

  function toggleFavorite(articleId: string) {
    const i = favorites.value.indexOf(articleId)
    if (i >= 0) favorites.value.splice(i, 1)
    else favorites.value.push(articleId)
  }

  function isFavorite(articleId: string) {
    return favorites.value.includes(articleId)
  }

  return {
    records,
    favorites,
    latestByScale,
    addRecord,
    toggleFavorite,
    isFavorite
  }
})
