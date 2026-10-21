<template>
  <!-- 漂浮爱心动画容器 -->
  <div class="floating-hearts"></div>
  
  <!-- 滚动进度条 -->
  <div class="scroll-progress"></div>

  <!-- 顶部导航栏 -->
  <nav class="navbar">
    <div class="logo">
      <img src="../assets/img/网站logo.png" alt="林影心语网站logo" class="logo-img">
      <span class="logo-text">林影心语</span>
      <div class="logo-decoration">
        <span class="decoration-heart">❤</span>
      </div>
    </div>
    <ul class="nav-links">
      <li><router-link to="/" :class="{ active: $route.path === '/' }">
        <img src="../assets/img/首页.svg" class="nav-icon" alt="首页" />
        <span>首页</span>
      </router-link></li>
      <li><router-link to="/feedback" :class="{ active: $route.path === '/feedback' }">
        <img src="../assets/img/反馈.svg" class="nav-icon" alt="反馈" />
        <span>反馈</span>
      </router-link></li>
      <li><router-link to="/test" :class="{ active: $route.path === '/test' }">
        <img src="../assets/img/检测.svg" class="nav-icon" alt="心理检测" />
        <span>心理检测</span>
      </router-link></li>
      <li><router-link to="/wish-wall" :class="{ active: $route.path === '/wish-wall' }">
        <img src="../assets/img/许愿墙.svg" class="nav-icon" alt="许愿墙" />
        <span>许愿墙</span>
      </router-link></li>
      <li><router-link to="/meditation" :class="{ active: $route.path === '/meditation' }">
        <img src="../assets/img/冥想.svg" class="nav-icon" alt="冥想" />
        <span>冥想</span>
      </router-link></li>
      <li><a href="https://banana404.top/shudong-ai/" target="_blank">
        <img src="../assets/img/Ai聊天.svg" class="nav-icon" alt="AI聊天" />
        <span>AI聊天</span>
      </a></li>
    </ul>
    <!-- 根据登录状态显示登录按钮或用户名 -->
    <template v-if="userInfo">
      <router-link to="/user-panel" class="login-btn">
        <font-awesome-icon icon="fa-solid fa-users" class="btn-icon" />
        <span>{{ userInfo.name || '登入' }}</span>
      </router-link>
    </template>
    <template v-else>
      <router-link to="/login" class="login-btn">
        <img src="../assets/img/登入.svg" class="nav-icon" alt="登入" />
        <span>登录</span>
      </router-link>
    </template>
  </nav>

  <!-- 主要内容区域 -->
  <main class="category-content">
    <!-- 返回按钮 -->
    <button class="back-btn" @click="goBack">
      <font-awesome-icon icon="fa-solid fa-arrow-left"></font-awesome-icon>
      <span>返回</span>
    </button>
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">{{ categoryName }}</h1>
      <p class="page-subtitle">共 {{ totalArticles }} 篇文章</p>
    </div>

    <!-- 文章列表 -->
    <div class="articles-container">
      <!-- 加载动画 -->
      <div v-if="loading" class="articles-loading">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载文章...</div>
      </div>
      
      <!-- 网络错误 -->
      <div v-else-if="articles.length === 0" class="network-error">
        <font-awesome-icon icon="fa-solid fa-exclamation-circle" class="error-icon"></font-awesome-icon>
        <div class="error-text">网络错误，请检查网络连接后刷新页面</div>
      </div>
      
      <!-- 文章列表 -->
      <template v-else>
        <div v-for="article in articles" :key="article.cid" class="article-card">
          <div class="article-image">
            <img :src="article.image" alt="文章图片" style="width: 100%; height: auto;">
          </div>
          <div class="article-content">
            <div class="article-meta">
              <div class="article-date">
                <font-awesome-icon icon="fa-solid fa-calendar"></font-awesome-icon> {{ formatDate(article.created) }}
              </div>
              <div class="article-author">
                <font-awesome-icon icon="fa-solid fa-user"></font-awesome-icon> {{ article.author.name }}
              </div>
            </div>
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-excerpt">{{ extractExcerpt(article.text) }}</p>
            <div class="article-stats">
              <span class="stat-item">
                <font-awesome-icon icon="fa-solid fa-eye"></font-awesome-icon> {{ article.views }} 浏览
              </span>
              <span class="stat-item">
                <font-awesome-icon icon="fa-solid fa-comment"></font-awesome-icon> {{ article.comments_num }} 评论
              </span>
            </div>
            <router-link :to="`/article/${article.cid}`" class="read-more">
              点击阅读 <font-awesome-icon icon="fa-solid fa-arrow-right"></font-awesome-icon>
            </router-link>
          </div>
        </div>
      </template>
    </div>

    <!-- 分页 -->
    <div v-if="!loading && articles.length > 0" class="pagination">
      <button 
        class="page-btn" 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <font-awesome-icon icon="fa-solid fa-chevron-left"></font-awesome-icon> 上一页
      </button>
      <span class="page-info">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
      </span>
      <button 
        class="page-btn" 
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        下一页 <font-awesome-icon icon="fa-solid fa-chevron-right"></font-awesome-icon>
      </button>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCalendar, faUser, faEye, faComment, faArrowRight, faExclamationCircle, faChevronLeft, faChevronRight, faUsers, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

library.add(faCalendar, faUser, faEye, faComment, faArrowRight, faExclamationCircle, faChevronLeft, faChevronRight, faUsers, faArrowLeft);

// 路由实例
const route = useRoute();

// 用户登录状态管理
const userInfo = ref(null);

// 文章数据
const articles = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const totalArticles = ref(0);
const categoryName = ref('');

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(totalArticles.value / 10);
});

// 从localStorage获取用户信息
const checkUserLogin = () => {
  try {
    const storedUser = localStorage.getItem('realUserInfo');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      userInfo.value = parsedUser.data || parsedUser;
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    userInfo.value = null;
  }
};

// 格式化时间戳为日期字符串
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
};

// 从MD文本中移除图片标记并截取摘要
const extractExcerpt = (text) => {
  if (!text) return '';
  // 移除所有MD图片语法
  const textWithoutImages = text.replace(/![.*?]\((.*?)\)/g, '');
  // 截取前100个字符
  return textWithoutImages.substring(0, 100) + '...';
};

// 从API获取分类文章列表
const fetchCategoryArticles = async () => {
  const mid = route.params.mid;
  loading.value = true;
  
  try {
    const API_BASE_URL = 'https://api.banana404.top';
    const response = await fetch(`${API_BASE_URL}/api/v1/content/category/${mid}?page=${currentPage.value}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.data) {
      const articleList = data.data.items || [];
      
      // 处理文章数据，添加image字段
      const processedArticles = articleList.map(article => ({
        ...article,
        image: article.image || require('../assets/img/背景2.jpg')
      }));
      
      articles.value = processedArticles;
      totalArticles.value = data.data.total || 0;
      
      // 设置分类名称
      if (articleList.length > 0) {
        categoryName.value = articleList[0].category.name || '文章分类';
      } else {
        // 根据mid设置默认分类名称
        const categoryMap = {
          '1': '普遍心理现象',
          '2': '神经症性障碍',
          '3': '精神心理疾病',
          '4': '情感障碍/心境障碍',
          '5': '解离性障碍',
          '6': '人格障碍'
        };
        categoryName.value = categoryMap[mid] || '文章分类';
      }
    } else {
      console.error('API返回数据结构不符合预期:', data);
      articles.value = [];
      totalArticles.value = 0;
    }
  } catch (error) {
    console.error('获取分类文章失败:', error);
    articles.value = [];
    totalArticles.value = 0;
  } finally {
    loading.value = false;
  }
};

// 切换页码
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchCategoryArticles();
};

// 返回上一页
const goBack = () => {
  window.history.back();
};

// 组件挂载时获取数据
onMounted(() => {
  checkUserLogin();
  fetchCategoryArticles();
});
</script>

<style scoped>
/* 基础样式 */
.category-content {
  font-family: 'YouSheShaYuFeiTe', Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  min-height: 100vh;
  padding: 8rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

/* 返回按钮样式 */
.back-btn {
  position: absolute;
  top: 15%;
  background: var(--white-transparent);
  border: 1px solid rgba(43, 113, 234, 0.2);
 padding: 0.60rem 1.0rem;
    border-radius: 50px;
  font-size: 0.875rem;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 50;
}

.back-btn:hover {
  background: rgba(43, 113, 234, 0.1);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.back-btn :deep(.fa-solid) {
  font-size: 1rem;
  color: var(--primary-color);
  margin: 0;
}

/* 爱心动画容器 */
.floating-hearts {
  position: fixed;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

/* 爱心样式 */
.floating-heart {
  position: fixed;
  bottom: -50px;
  width: 20px;
  height: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff9776'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") no-repeat center/contain;
  pointer-events: none;
  z-index: 9999;
  will-change: transform, opacity;
}

/* 漂浮动画 */
@keyframes floatUp {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* 滚动进度条 */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  z-index: 1000;
  width: 0%;
  transition: width 0.1s ease;
}

/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 100;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  height: 40px;
  width: auto;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  font-family: 'Courier New', monospace;
}

.logo-decoration {
  display: flex;
  align-items: center;
}

.decoration-heart {
  color: var(--primary-color);
  font-size: 1rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.nav-links {
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-color);
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-icon {
  width: 1rem;
  height: 1rem;
  color: var(--text-color);
  transition: color 0.3s ease;
}

.nav-links a:hover {
  background: rgba(43, 113, 234, 0.1);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.nav-links a:hover .nav-icon {
  color: var(--primary-color);
}

.nav-links a.active,
.nav-links a.router-link-active {
  background: rgba(43, 113, 234, 0.2);
  color: var(--primary-color);
  font-weight: 500;
}

.nav-links a.active .nav-icon,
.nav-links a.router-link-active .nav-icon {
  color: var(--primary-color);
}

.login-btn {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border: none;
  color: white;
  padding: 0.625rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 1rem;
  width: 1rem;
  height: 1rem;
}

.login-btn:hover {
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-color) 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInUp 0.8s ease-out forwards;
}

.page-title {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(43, 113, 234, 0.1);
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-color);
  font-weight: 500;
}

/* 文章容器样式 */
.articles-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

/* 文章加载动画 */
.articles-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 3rem 0;
}

.articles-loading .loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(43, 113, 234, 0.3);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.articles-loading .loading-text {
  font-size: 1rem;
  color: var(--primary-color);
  font-weight: 500;
}

/* 网络错误样式 */
.network-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 3rem 0;
  text-align: center;
}

.network-error .error-icon {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.network-error .error-text {
  font-size: 1rem;
  color: var(--text-color);
  font-weight: 500;
  max-width: 300px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.article-card {
  flex: 1;
  min-width: 280px;
  max-width: 320px;
  background: var(--white-transparent);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px var(--shadow-color);
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-out forwards;
  border: 1px solid rgba(43, 113, 234, 0.1);
}

/* 为每个卡片设置不同的动画延迟 */
.article-card:nth-child(1) { animation-delay: 0.3s; }
.article-card:nth-child(2) { animation-delay: 0.4s; }
.article-card:nth-child(3) { animation-delay: 0.5s; }

.article-card:hover {
  box-shadow: 0 20px 25px -5px rgba(43, 113, 234, 0.2), 0 10px 10px -5px rgba(43, 113, 234, 0.1);
  transform: translateY(-10px);
  border-color: var(--primary-color);
}

.article-image {
  height: 160px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.1);
}

.article-content {
  padding: 1.5rem;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-color);
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.article-date,
.article-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-date :deep(.fa-solid),
.article-author :deep(.fa-solid) {
  font-size: 0.75rem;
  color: var(--primary-color);
  margin: 0;
}

.article-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.75rem;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.article-card:hover .article-title {
  color: var(--primary-light);
}

.article-excerpt {
  font-size: 0.875rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-item :deep(.fa-solid) {
  font-size: 0.75rem;
  color: var(--primary-color);
  margin: 0;
}

.read-more {
  display: inline-block;
  font-size: 0.875rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-card:hover .read-more {
  color: var(--primary-light);
  transform: translateX(5px);
}

.read-more :deep(.fa-solid) {
  font-size: 0.75rem;
  margin: 0;
  transition: transform 0.3s ease;
}

.article-card:hover .read-more :deep(.fa-solid) {
  transform: translateX(3px);
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
  animation: fadeInUp 0.8s ease-out 0.2s forwards;
}

.page-btn {
  background: var(--white-transparent);
  border: 1px solid rgba(43, 113, 234, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-btn:hover:not(:disabled) {
  background: rgba(43, 113, 234, 0.1);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  color: var(--text-color);
  font-weight: 500;
}

/* 动画关键帧 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 - 平板设备 */
@media (max-width: 1024px) {
  .navbar {
    padding: 1rem 1.5rem;
  }
  
  .nav-links {
    gap: 0.5rem;
  }
  
  .nav-links a {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
  
  .category-content {
    padding: 7rem 1.5rem 3rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .article-card {
    min-width: 240px;
    max-width: 280px;
  }
}

/* 响应式设计 - 手机设备 */
@media (max-width: 768px) {
  /* 导航栏移动端优化 */
  .navbar {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
  }
  
  .logo-img {
    height: 32px;
  }
  
  .logo-text {
    font-size: 1rem;
  }
  
  .decoration-heart {
    font-size: 0.75rem;
  }
  
  .nav-links {
    gap: 0.4rem;
    flex-wrap: wrap;
    justify-content: center;
    order: 3;
    width: 100%;
    margin-top: 0.5rem;
  }
  
  .nav-links a {
    font-size: 0.7rem;
    padding: 0.3rem 0.6rem;
    gap: 0.25rem;
  }
  
  .nav-icon {
    width: 0.75rem;
    height: 0.75rem;
  }
  
  .login-btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    order: 2;
  }
  
  .btn-icon {
    font-size: 0.875rem;
  }
  
  /* 主内容区域移动端优化 */
  .category-content {
    padding: 8rem 1rem 2rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .articles-container {
    gap: 1rem;
  }
  
  .article-card {
    min-width: 100%;
    max-width: 100%;
  }
  
  .article-image {
    height: 140px;
  }
  
  .article-content {
    padding: 1rem;
  }
  
  .article-title {
    font-size: 1rem;
  }
  
  .article-excerpt {
    font-size: 0.8rem;
  }
  
  .pagination {
    gap: 1rem;
  }
  
  .page-btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
  
  .page-info {
    font-size: 0.75rem;
  }
}

/* 响应式设计 - 小屏手机设备 */
@media (max-width: 480px) {
  .navbar {
    padding: 0.5rem 0.75rem;
  }
  
  .logo-img {
    height: 28px;
  }
  
  .logo-text {
    font-size: 0.875rem;
  }
  
  .nav-links a {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
  }
  
  .login-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.7rem;
  }
  
  .category-content {
    padding: 7rem 0.75rem 2rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .article-image {
    height: 120px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>