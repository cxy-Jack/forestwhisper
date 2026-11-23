<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import type { Theme } from '@/composables/useTheme'
import { eventValue } from '@/maotaui'

const router = useRouter()
const { theme, setTheme } = useTheme()
const searchOpen = ref(false)
const settingsOpen = ref(false)
const query = ref('')
const emit = defineEmits<{ toggleSidebar: [] }>()

const destinations = [
  { to: '/', label: '首页' },
  { to: '/wishes', label: '心愿墙' },
  { to: '/assess', label: '心理测评' },
  { to: '/articles', label: '阅读与书籍' },
  { to: '/chat', label: '陪你聊聊' },
  { to: '/breathe', label: '呼吸与冥想' },
  { to: '/profile', label: '我的足迹' }
]

const results = computed(() => {
  const keyword = query.value.trim()
  if (!keyword) return destinations
  return destinations.filter((item) => item.label.includes(keyword))
})

function setQuery(event: Event) {
  query.value = eventValue(event).slice(0, 40)
}

function go(to: string) {
  searchOpen.value = false
  query.value = ''
  router.push(to)
}

function primaryAction() {
  emit('toggleSidebar')
}

function changeTheme(event: Event) {
  setTheme(eventValue(event) as Theme)
}
</script>

<template>
  <header class="app-nav">
    <div class="nav-inner">
      <mao-button
        variant="light"
        size="sm"
        icon
        aria-label="展开或收起侧边栏"
        @click="primaryAction"
      >
        <mao-icon name="menu" size="18"></mao-icon>
      </mao-button>

      <div class="actions">
        <mao-button variant="light" size="sm" icon aria-label="搜索" @click="searchOpen = true">
          <mao-icon name="search" size="18"></mao-icon>
        </mao-button>

        <mao-button
          variant="light"
          size="sm"
          icon
          aria-label="设置"
          @click="settingsOpen = true"
        >
          <mao-icon name="settings-2" size="18"></mao-icon>
        </mao-button>

        <mao-button color="primary" size="sm" @click="router.push('/profile')">
          登录
        </mao-button>
      </div>
    </div>

    <mao-dialog
      heading="搜索"
      size="sm"
      closable
      :open="searchOpen ? '' : undefined"
      @mt-close="searchOpen = false"
    >
      <mao-text-field
        label="查找页面"
        placeholder="输入名称"
        :value="query"
        @mt-input="setQuery"
      ></mao-text-field>

      <div class="search-results">
        <mao-button
          v-for="item in results"
          :key="item.to"
          block
          variant="light"
          @click="go(item.to)"
        >
          {{ item.label }}
        </mao-button>
        <mao-notice v-if="!results.length" tone="blue" title="没有找到">
          换一个关键词试试。
        </mao-notice>
      </div>
    </mao-dialog>

    <mao-dialog
      heading="设置"
      size="sm"
      closable
      :open="settingsOpen ? '' : undefined"
      @mt-close="settingsOpen = false"
    >
      <div class="settings-panel">
        <mao-segmented label="主题" :value="theme" @mt-change="changeTheme">
          <mao-segment value="light">浅色</mao-segment>
          <mao-segment value="dark">深色</mao-segment>
        </mao-segmented>
        <mao-notice tone="blue" title="主题偏好">
          主题设置会保存在当前浏览器中。
        </mao-notice>
      </div>
    </mao-dialog>
  </header>
</template>

<style scoped>
.app-nav {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 20;
  height: var(--app-topbar-height);
  background: color-mix(in srgb, var(--mt-bg) 72%, transparent);
  backdrop-filter: blur(18px) saturate(1.25);
  box-shadow: 0 10px 36px rgb(0 0 0 / 0.04);
}

.nav-inner {
  height: 100%;
  padding-inline: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 12px;
}

.settings-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 480px) {
  .nav-inner {
    padding: 0 10px;
  }

  .actions {
    gap: 0;
  }

  .actions :deep(mao-button) {
    font-size: var(--mt-fs-xs);
  }
}

</style>
