import { ref } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'lyxy:theme'

const theme = ref<Theme>('dark')

function apply(next: Theme) {
  theme.value = next
  document.documentElement.dataset.theme = next
}

// 首屏由 index.html 的内联脚本先定好，这里只负责把状态同步进 Vue
export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'dark' || saved === 'light') {
    apply(saved)
    return
  }
  apply('dark')
}

export function useTheme() {
  function setTheme(next: Theme) {
    localStorage.setItem(STORAGE_KEY, next)
    apply(next)
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, setTheme, toggleTheme }
}
