<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import AppNav from '@/components/AppNav.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const menuQuery = window.matchMedia('(max-width: 900px)')
const isMobile = ref(menuQuery.matches)
const sidebarOpen = ref(!isMobile.value && localStorage.getItem('lyxy:sidebar:open') !== 'false')

function syncViewport() {
  isMobile.value = menuQuery.matches
  sidebarOpen.value = isMobile.value ? false : localStorage.getItem('lyxy:sidebar:open') !== 'false'
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
  if (!isMobile.value) {
    localStorage.setItem('lyxy:sidebar:open', String(sidebarOpen.value))
  }
}

function closeMobileSidebar() {
  if (isMobile.value) sidebarOpen.value = false
}

onMounted(() => menuQuery.addEventListener('change', syncViewport))
onUnmounted(() => menuQuery.removeEventListener('change', syncViewport))
</script>

<template>
  <div class="app-shell">
    <AppNav @toggle-sidebar="toggleSidebar" />
    <button
      v-if="sidebarOpen && isMobile"
      class="sidebar-backdrop"
      type="button"
      aria-label="关闭侧边栏"
      @click="sidebarOpen = false"
    ></button>
    <AppSidebar :open="sidebarOpen" @close="closeMobileSidebar" />
    <main class="app-content" :class="{ 'sidebar-expanded': sidebarOpen }">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-content {
  min-height: 100vh;
  padding-top: var(--app-topbar-height);
  padding-left: 72px;
}

.app-content.sidebar-expanded {
  padding-left: var(--app-sidebar-width);
}

.sidebar-backdrop {
  display: none;
}

@media (max-width: 900px) {
  .app-content {
    padding-left: 0;
  }

  .sidebar-backdrop {
    position: fixed;
    inset: 0 0 0 var(--app-sidebar-width);
    z-index: 10;
    display: block;
    width: auto;
    height: auto;
    padding: 0;
    border: 0;
    background: rgb(0 0 0 / 0.34);
  }

  .app-content.sidebar-expanded {
    padding-left: 0;
  }
}
</style>
