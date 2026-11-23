import { ref, watch } from 'vue'

// 轻量 localStorage 持久化：页面刷新后数据仍在
export function usePersisted<T>(key: string, initial: T) {
  const raw = localStorage.getItem(key)
  let data: T = initial
  if (raw) {
    try {
      data = JSON.parse(raw) as T
    } catch {
      data = initial
    }
  }
  const state = ref(data)
  watch(
    state,
    (val) => {
      try {
        localStorage.setItem(key, JSON.stringify(val))
      } catch {
        // 存储满时静默失败，不影响使用
      }
    },
    { deep: true }
  )
  return state
}
