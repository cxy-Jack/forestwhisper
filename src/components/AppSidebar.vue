<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const emit = defineEmits<{ close: [] }>()
defineProps<{ open?: boolean }>()

const groups = [
  {
    label: '',
    links: [
      { to: '/', label: '首页', icon: 'house' },
      { to: '/wishes', label: '心愿墙', icon: 'heart' }
    ]
  },
  {
    label: '探索',
    links: [
      { to: '/assess', label: '测评', icon: 'clipboard-check' },
      { to: '/articles', label: '阅读', icon: 'bookmark' },
      { to: '/chat', label: '聊聊', icon: 'message-square' },
      { to: '/breathe', label: '呼吸', icon: 'wind' }
    ]
  },
  {
    label: '我的',
    links: [{ to: '/profile', label: '我的足迹', icon: 'clock' }]
  }
]

function isActive(path: string) {
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}

function navigate(to: string) {
  router.push(to)
  emit('close')
}
</script>

<template>
  <aside class="app-sidebar" :class="{ 'is-open': open }" aria-label="功能导航">
    <div v-for="(group, index) in groups" :key="group.label || index" class="sidebar-group">
      <p v-if="group.label" class="group-label">{{ group.label }}</p>

      <mao-button
        v-for="link in group.links"
        :key="link.to"
        block
        size="sm"
        :aria-label="link.label"
        :aria-current="isActive(link.to) ? 'page' : undefined"
        :color="isActive(link.to) ? 'primary' : 'neutral'"
        :variant="isActive(link.to) ? 'flat' : 'light'"
        class="sidebar-link"
        @click="navigate(link.to)"
      >
        <mao-icon :name="link.icon" size="18"></mao-icon>
        <span class="full-label">{{ link.label }}</span>
      </mao-button>
    </div>
  </aside>
</template>

<style scoped>
.app-sidebar {
  position: fixed;
  inset: var(--app-topbar-height) auto 0 0;
  z-index: 15;
  width: 72px;
  padding: 18px 12px 24px;
  background: var(--mt-bg);
  overflow-y: auto;
  transition:
    width var(--mt-dur) var(--mt-ease),
    transform var(--mt-dur) var(--mt-ease);
  scrollbar-width: thin;
  scrollbar-color: var(--mt-border) transparent;
}

.app-sidebar.is-open {
  width: var(--app-sidebar-width);
  transform: translateX(0);
}

.app-sidebar:not(.is-open) .group-label,
.app-sidebar:not(.is-open) .full-label {
  display: none;
}

.app-sidebar::-webkit-scrollbar {
  width: 6px;
}

.app-sidebar::-webkit-scrollbar-thumb {
  border-radius: var(--mt-radius-pill);
  background: var(--mt-border);
}

.app-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-group + .sidebar-group {
  margin-top: 12px;
}

.group-label {
  padding: 12px 12px 6px;
  color: var(--mt-muted);
  font-size: var(--mt-fs-sm);
  font-weight: 600;
}

.sidebar-link {
  justify-content: flex-start;
  min-height: 38px;
  gap: 12px;
  padding-inline: 12px;
  border-radius: var(--mt-radius-lg);
}

.app-sidebar:not(.is-open) .sidebar-link {
  width: 48px;
  justify-content: center;
  padding-inline: 0;
}

@media (max-width: 900px) {
  .app-sidebar {
    width: var(--app-sidebar-width);
    transform: translateX(-100%);
    box-shadow: var(--mt-shadow-overlay);
  }

  .app-sidebar.is-open {
    transform: translateX(0);
  }

  .app-sidebar:not(.is-open) .group-label {
    display: block;
  }

  .app-sidebar:not(.is-open) .full-label {
    display: inline;
  }

  .app-sidebar:not(.is-open) .sidebar-link {
    width: auto;
    justify-content: flex-start;
    padding-inline: 12px;
  }
}
</style>
