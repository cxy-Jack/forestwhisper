import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { Wish } from '@/data/types'
import { seedWishes } from '@/data/wishes'
import { usePersisted } from './persist'

let uid = 100
const nextId = (p: string) => `${p}${Date.now().toString(36)}${uid++}`

export const useWishesStore = defineStore('wishes', () => {
  const customWishes = usePersisted<Wish[]>('lyxy:wishes:custom', [])
  const huggedIds = usePersisted<string[]>('lyxy:wishes:hugged', [])

  // 种子心愿在后，用户发布的在前
  const wishes = computed<Wish[]>(() =>
    [...customWishes.value, ...seedWishes].map((w) => ({
      ...w,
      hugged: huggedIds.value.includes(w.id)
    }))
  )

  function addWish(content: string, mood: Wish['mood']) {
    customWishes.value.unshift({
      id: nextId('w'),
      content,
      mood,
      hugs: 0,
      replies: [],
      createdAt: '刚刚'
    })
  }

  function toggleHug(id: string) {
    const i = huggedIds.value.indexOf(id)
    const target =
      customWishes.value.find((w) => w.id === id) ?? seedWishes.find((w) => w.id === id)
    if (!target) return
    if (i >= 0) {
      huggedIds.value.splice(i, 1)
      target.hugs = Math.max(0, target.hugs - 1)
    } else {
      huggedIds.value.push(id)
      target.hugs += 1
    }
  }

  return { wishes, addWish, toggleHug }
})
