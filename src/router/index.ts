import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '林影心语' }
  },
  {
    path: '/assess',
    name: 'assess',
    component: () => import('@/views/AssessListView.vue'),
    meta: { title: '心理测评' }
  },
  {
    path: '/assess/:id',
    name: 'assess-quiz',
    component: () => import('@/views/AssessQuizView.vue'),
    meta: { title: '测评进行中' }
  },
  {
    path: '/assess/:id/report',
    name: 'assess-report',
    component: () => import('@/views/AssessReportView.vue'),
    meta: { title: '测评报告' }
  },
  {
    path: '/wishes',
    name: 'wishes',
    component: () => import('@/views/WishesView.vue'),
    meta: { title: '心愿墙' }
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('@/views/ArticlesView.vue'),
    meta: { title: '阅读与书籍' }
  },
  {
    path: '/articles/:id',
    name: 'article-detail',
    component: () => import('@/views/ArticleDetailView.vue'),
    meta: { title: '阅读' }
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/ChatView.vue'),
    meta: { title: '陪你聊聊' }
  },
  {
    path: '/breathe',
    name: 'breathe',
    component: () => import('@/views/BreatheView.vue'),
    meta: { title: '呼吸与冥想' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: '我的足迹' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  }
})

router.afterEach((to) => {
  const title = (to.meta.title as string) || ''
  document.title = title === '林影心语' ? '林影心语 · 守护你的情绪' : `${title} · 林影心语`
})

export default router
