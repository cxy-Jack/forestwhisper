import { createRouter, createWebHashHistory, createMemoryHistory } from 'vue-router'
import HomeComponent from './components/HomeComponent.vue'
import NewHomePage from './components/NewHomePage.vue'
import FeedbackPage from './components/FeedbackPage.vue'
import TestPage from './components/TestPage.vue'
import WishWall from './components/WishWall.vue'
import AuthPage from './components/AuthPage.vue'
import UserPanel from './components/UserPanel.vue'
import Meditation from './components/Meditation.vue'
import ArticlePage from './components/ArticlePage.vue'
import ArticleCategoryPage from './components/ArticleCategoryPage.vue'
import AiChatPage from "./components/AiChatPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeComponent,
  },
  {
    path: "/new-home",
    name: "NewHome",
    component: NewHomePage,
  },
  {
    path: "/auth",
    name: "Auth",
    component: AuthPage,
  },
  {
    path: "/login",
    name: "Login",
    component: AuthPage,
  },
  {
    path: "/register",
    name: "Register",
    component: AuthPage,
  },
  {
    path: "/feedback",
    name: "Feedback",
    component: FeedbackPage,
  },
  {
    path: "/test",
    name: "Test",
    component: TestPage,
  },
  {
    path: "/wish-wall",
    name: "WishWall",
    component: WishWall,
  },
  {
    path: "/user-panel",
    name: "UserPanel",
    component: UserPanel,
  },
  {
    path: "/meditation",
    name: "Meditation",
    component: Meditation,
  },
  {
    path: "/article/:cid",
    name: "Article",
    component: ArticlePage,
  },
  {
    path: "/article-category/:mid",
    name: "ArticleCategory",
    component: ArticleCategoryPage,
  },
  {
    path: "/chat",
    name: "AiChat",
    component: AiChatPage,
  },
];

// 根据环境选择合适的历史模式
const createHistory = process.env.SSR ? createMemoryHistory : createWebHashHistory

const router = createRouter({
  history: createHistory(),
  routes
})

export default router