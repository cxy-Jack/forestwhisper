<template>
  <!-- 漂浮爱心动画容器 -->
  <div class="floating-hearts"></div>
  <!-- 加载动画 -->
  <div id="loading-screen" ref="loadingScreen">
    <div class="beating-heart">
      <span></span>
      <span></span>
    </div>
    <div class="ecg-progress-container">
      <div class="ecg-progress">
        <div class="ecg-container">
          <div class="ecg-wave"></div>
          <div class="ecg-line"></div>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="progress-text">正在加载...</div>
      </div>
    </div>
  </div>

  <!-- 滚动进度条 -->
  <div class="scroll-progress"></div>

  <!-- 新首页内容 -->
  <div class="new-home-container">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="logo">
        <img src="../assets/img/网站logo.webp" alt="林影心语网站logo" class="logo-img">
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
        <li><a href="https://ai.hkmre.top/" target="_blank">
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
          <img src="../assets/img/登入.svg" class="btn-icon" alt="登入" />
          <span>登录</span>
        </router-link>
      </template>
    </nav>

    <!-- 主要内容区域 -->
    <main class="new-main-content">
      <!-- 顶部内容区域 - 包含卡通形象和内容卡片 -->
      <div class="top-content">
        <!-- 左侧卡通形象 -->
        <div class="cartoon-image">
          <img src="../assets/img/网站logo.webp" alt="卡通形象">
        </div>

        <!-- 右侧内容 -->
        <div class="content-section">
          <!-- 标题 -->
          <h1 class="main-title">
            你是需要那些类型的文章呢
          </h1>

          <!-- 文章类型按钮 -->
          <div class="article-types">
            <button class="type-btn" @click="handleArticleTypeClick(2)">
              <font-awesome-icon icon="fa-solid fa-lightbulb"></font-awesome-icon>
              神经症性障碍
            </button>
            <button class="type-btn" @click="handleArticleTypeClick(1)">
              <font-awesome-icon icon="fa-solid fa-heart"></font-awesome-icon>
              普遍心理现象
            </button>
            <button class="type-btn" @click="handleArticleTypeClick(3)">
              <font-awesome-icon icon="fa-solid fa-star"></font-awesome-icon>
              精神心理疾病
            </button>
            <button class="type-btn" @click="handleArticleTypeClick(4)">
              <font-awesome-icon icon="fa-solid fa-bolt"></font-awesome-icon>
              情感障碍/心境障碍
            </button>
            <button class="type-btn" @click="handleArticleTypeClick(5)">
              <font-awesome-icon icon="fa-solid fa-moon"></font-awesome-icon>
              解离性障碍
            </button>
            <button class="type-btn" @click="handleArticleTypeClick(6)">
              <font-awesome-icon icon="fa-solid fa-sun"></font-awesome-icon>
              人格障碍
            </button>
          </div>
        </div>
      </div>
      <!--推荐-->
      <div class="recommended-articles">
        <h2 class="section-title">
          <font-awesome-icon icon="fa-solid fa-thumbs-up"></font-awesome-icon> 推荐文章
        </h2>
        <div class="articles-container">
          <!-- 加载动画 -->
          <div v-if="articlesLoading" class="articles-loading">
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
            <div v-for="article in articles" :key="article.id" class="article-card">
              <div class="article-image">
                <div class="image-container">
                  <img 
                    :src="article.image" 
                    alt="文章图片" 
                    class="article-img"
                    @load="onImageLoad($event)"
                  >
                  <div class="image-placeholder"></div>
                </div>
              </div>
              <div class="article-content">
                <div class="article-date">
                  <font-awesome-icon icon="fa-solid fa-calendar"></font-awesome-icon> {{ article.date }}
                </div>
                <h3 class="article-title">{{ article.title }}</h3>
                <p class="article-excerpt">{{ article.excerpt }}</p>
                <router-link :to="`/article/${article.id}`" class="read-more">
                  点击阅读 <font-awesome-icon icon="fa-solid fa-arrow-right"></font-awesome-icon>
                </router-link>
              </div>
            </div>
          </template>
        </div>
      </div>
      <!-- 猜你需要 -->
      <div class="guess-you-need">
        <h2 class="section-title">
          <font-awesome-icon icon="fa-solid fa-compass"></font-awesome-icon> 猜你需要
        </h2>
        <!-- 内容将在后续添加 -->
         <div class="articles-container">
          <!-- 加载动画 -->
          <div v-if="articlesLoading" class="articles-loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">正在加载文章...</div>
          </div>
          <!-- 网络错误 -->
          <div v-else-if="recommendedArticles.length === 0" class="network-error">
            <font-awesome-icon icon="fa-solid fa-exclamation-circle" class="error-icon"></font-awesome-icon>
            <div class="error-text">网络错误，请检查网络连接后刷新页面</div>
          </div>
          <!-- 文章列表 -->
          <template v-else>
            <div v-for="article in recommendedArticles" :key="article.id" class="article-card">
              <div class="article-image">
                <div class="image-container">
                  <img 
                    :src="article.image" 
                    alt="文章图片" 
                    class="article-img"
                    @load="onImageLoad($event)"
                  >
                  <div class="image-placeholder"></div>
                </div>
              </div>
              <div class="article-content">
                <div class="article-date">
                  <font-awesome-icon icon="fa-solid fa-calendar"></font-awesome-icon> {{ article.date }}
                </div>
                <h3 class="article-title">{{ article.title }}</h3>
                <p class="article-excerpt">{{ article.excerpt }}</p>
                <router-link :to="`/article/${article.id}`" class="read-more">
                  点击阅读 <font-awesome-icon icon="fa-solid fa-arrow-right"></font-awesome-icon>
                </router-link>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLightbulb, faHeart, faStar, faBolt, faMoon, faSun, faThumbsUp, faCompass, faCalendar, faArrowRight, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faLightbulb, faHeart, faStar, faBolt, faMoon, faSun, faThumbsUp, faCompass, faCalendar, faArrowRight, faExclamationCircle);

// 加载动画控制
const loadingScreen = ref(null);

// 路由实例
const router = useRouter();

// 用户登录状态管理
const userInfo = ref(null);

// 导航栏当前激活部分
const currentSection = ref('home');

// 文章数据列表
const articles = ref([]);

// 猜你需要文章列表
const recommendedArticles = ref([]);

// 加载状态
const articlesLoading = ref(true);

// 从localStorage获取用户信息
const checkUserLogin = () => {
  try {
    const storedUser = localStorage.getItem('realUserInfo');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // 根据AuthPage.vue的存储结构，登录成功后存储的是data对象
      userInfo.value = parsedUser.data || parsedUser;
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    userInfo.value = null;
  }
};

// 监听storage事件，处理其他标签页的登录状态变化
const handleStorageChange = () => {
  checkUserLogin();
};

// 滚动监听处理函数
const handleScroll = () => {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section, #home');
  
  // 导航栏背景变化
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  
  // 当前部分链接高亮
  let current = '';
  sections.forEach(section => {
    const { offsetTop: sectionTop, clientHeight: sectionHeight } = section;
    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute('id');
    }
  });
  
  currentSection.value = current;
  
  // 滚动进度条
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = (scrollTop / scrollHeight) * 100;
  
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    progressBar.style.width = `${scrollProgress}%`;
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

// 文章类型点击处理函数
const handleArticleTypeClick = (mid) => {
  router.push(`/article-category/${mid}`);
};

// 从API获取文章列表
const fetchArticles = async () => {
  articlesLoading.value = true
  try {
    // 调用实际的API
    const API_BASE_URL = 'https://api.banana404.top';
    const response = await fetch(`${API_BASE_URL}/api/v1/content`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.code === 200 && data.data && (data.data.list || data.data.items)) {
      const articleList = data.data.list || data.data.items;
      
      // 从MD文本中提取第一个图片URL
      const extractFirstImage = (text) => {
        if (!text) return null;
        // 匹配MD图片语法：![alt](url)
        const imageMatch = text.match(/!\[.*?\]\((.*?)\)/);
        return imageMatch ? imageMatch[1] : null;
      };

      // 从MD文本中移除图片标记并截取摘要
      const extractExcerpt = (text) => {
        if (!text) return '';
        // 移除所有MD图片语法
        const textWithoutImages = text.replace(/!\[.*?\]\((.*?)\)/g, '');
        // 截取前100个字符
        return textWithoutImages.substring(0, 100) + '...';
      };

      // 处理文章数据，添加image字段和格式化日期
      const processedArticles = articleList.map(article => ({
        id: article.cid,
        date: formatDate(article.created),
        title: article.title,
        excerpt: extractExcerpt(article.text), // 除去MD图片的前100个字符作为摘要
        image: (article.image && article.image !== 'none') ? article.image : (extractFirstImage(article.text) || require('../assets/img/背景2.webp')), // 优先使用文章image（排除'none'值），其次提取MD中的第一张图片，最后使用默认图片
        views: article.views,
        created: article.created
      }));
      
      // 推荐文章：按浏览量从大到小排序，只取前3个
      articles.value = [...processedArticles].sort((a, b) => {
        if (b.views !== a.views) {
          return b.views - a.views;
        }
        // 浏览量相同则按顺序
        return a.id - b.id;
      }).slice(0, 3);
      
      // 猜你需要：按创建时间从新到旧排序，只取前3个
      recommendedArticles.value = [...processedArticles].sort((a, b) => {
        if (b.created !== a.created) {
          return b.created - a.created;
        }
        // 时间相同则按顺序
        return a.id - b.id;
      }).slice(0, 3);
    } else {
      console.error('API返回数据结构不符合预期:', data);
      // 清空数据，显示网络错误
      articles.value = [];
      recommendedArticles.value = [];
      // 可以在这里添加错误提示逻辑
    }
  } catch (error) {
    console.error('获取文章列表失败:', error);
    // 失败时清空数据，显示网络错误
    articles.value = [];
    recommendedArticles.value = [];
    // 可以在这里添加错误提示逻辑
  } finally {
    articlesLoading.value = false
  }
};

// 图片加载完成处理函数
const onImageLoad = (event) => {
  const img = event.target;
  const container = img.parentElement;
  if (container) {
    container.classList.add('image-loaded');
  }
};

onMounted(() => {
  // 模拟加载过程
  setTimeout(() => {
    if (loadingScreen.value) {
      loadingScreen.value.style.display = 'none';
    }
  }, 2000);
  
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll);
  
  // 初始化漂浮爱心
  initFloatingHearts();
  
  // 检查登录状态
  checkUserLogin();
  window.addEventListener('storage', handleStorageChange);
  
  // 获取文章列表
  fetchArticles();
});

// 漂浮爱心功能
const initFloatingHearts = () => {
  const floatingHearts = document.querySelector('.floating-hearts');
  let heartCount = 0;
  const maxHearts = 6; // 限制同时存在的心形数量，减少性能消耗
  
  function createHeart() {
    // 限制同时存在的心形数量
    if (heartCount >= maxHearts) return;
    
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animation = `floatUp ${6 + Math.random() * 2}s ease-in-out forwards`;
    heart.style.willChange = 'transform, opacity';
    
    floatingHearts.appendChild(heart);
    heartCount++;
    
    // 使用一次性的setTimeout移除元素
    setTimeout(() => {
      heart.remove();
      heartCount--;
    }, 8000);
  }
  
  // 降低创建频率以减少性能消耗
  const heartInterval = setInterval(createHeart, 1200);
  
  // 组件卸载时清理定时器和事件监听器
  onUnmounted(() => {
    clearInterval(heartInterval);
    // 移除滚动监听
    window.removeEventListener('scroll', handleScroll);
    // 移除storage事件监听
    window.removeEventListener('storage', handleStorageChange);
  });
};
</script>

<style scoped>
/* 基础样式 */
.new-home-container {
  font-family: 'YouSheShaYuFeiTe', Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
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

/* 新首页样式 - 参考HomeComponent风格 */
.new-home-container {
  min-height: 100vh;
  font-family: 'YouSheShaYuFeiTe', Arial, sans-serif;
  background-color: var(--background-color);
  position: relative;
  overflow: hidden;
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

/* 主要内容区域 */
.new-main-content {
  padding: 8rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* 顶部内容区域 - 包含卡通形象和内容卡片 */
.top-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: center;
}

/* 左侧卡通形象 */
.cartoon-image {
  flex: 0 0 auto;
  animation: float 6s ease-in-out infinite;
  z-index: 10;
}

.cartoon-image img {
  width: 200px;
  height: auto;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(10px, -10px);
  }
}

/* 内容部分 */
.content-section {
  flex: 1;
  min-width: 300px;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: fadeInUp 0.8s ease-out forwards;
}

.main-title {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
  font-weight: 600;
  text-align: center;
  text-shadow: 0 2px 4px rgba(43, 113, 234, 0.1);
  animation: typing 2s ease-out forwards;
}

@keyframes typing {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 文章类型按钮 */
.article-types {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
}

.type-btn {
  background: var(--white-transparent);
  border: 1px solid rgba(43, 113, 234, 0.2);
  padding: 1.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 6px -1px var(--shadow-color);
  animation: fadeInUp 0.5s ease-out forwards;
}

.type-btn :deep(.fa-solid) {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin: 0;
  transition: transform 0.3s ease;
}

.type-btn:hover :deep(.fa-solid) {
  transform: scale(1.2);
}

/* 为每个按钮设置不同的动画延迟 */
.type-btn:nth-child(1) { animation-delay: 0.3s; }
.type-btn:nth-child(2) { animation-delay: 0.4s; }
.type-btn:nth-child(3) { animation-delay: 0.5s; }
.type-btn:nth-child(4) { animation-delay: 0.6s; }
.type-btn:nth-child(5) { animation-delay: 0.7s; }
.type-btn:nth-child(6) { animation-delay: 0.8s; }

.type-btn:hover {
  background: rgba(43, 113, 234, 0.1);
  border-color: var(--primary-color);
  color: var(--primary-color);
  box-shadow: 0 10px 15px -3px rgba(43, 113, 234, 0.3);
  transform: translateY(-5px);
}

/* 推荐文章模块 */
.recommended-articles,
.guess-you-need {
  margin: 3rem 0;
  background: var(--white-transparent);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px var(--shadow-color), 0 10px 10px -5px var(--shadow-color);
  animation: fadeInUp 0.8s ease-out 0.2s forwards;
}

.section-title {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-shadow: 0 2px 4px rgba(43, 113, 234, 0.1);
}

.section-title :deep(.fa-solid) {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin: 0;
  animation: pulse 2s ease-in-out infinite;
}

/* 文章容器样式 */
.articles-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
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

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.article-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(20px);
  opacity: 0;
  transition: filter 0.5s ease-out, opacity 0.5s ease-out;
}

.image-loaded .article-img {
  filter: blur(0);
  opacity: 1;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%);
  transition: opacity 0.5s ease-out;
}

.image-loaded .image-placeholder {
  opacity: 0;
}

.article-card:hover .article-img {
  transform: scale(1.1);
}

.article-content {
  padding: 1.5rem;
}

.article-date {
  font-size: 0.75rem;
  color: var(--text-color);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-date :deep(.fa-solid) {
  font-size: 0.75rem;
  color: var(--primary-color);
  margin: 0;
}

.article-card .article-title {
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

.article-card .article-excerpt {
  font-size: 0.875rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card .read-more {
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

.article-card .read-more :deep(.fa-solid) {
  font-size: 0.75rem;
  margin: 0;
  transition: transform 0.3s ease;
}

.article-card:hover .read-more :deep(.fa-solid) {
  transform: translateX(3px);
}

/* 底部装饰 */
.bottom-decoration {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150px;
  background: linear-gradient(to top, rgba(106, 27, 154, 0.1), transparent);
  pointer-events: none;
  z-index: 1;
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
  
  .new-main-content {
    padding: 7rem 1.5rem 3rem;
  }
  
  .top-content {
    gap: 1.5rem;
  }
  
  .cartoon-image img {
    width: 150px;
  }
  
  .content-section {
    padding: 1.5rem;
  }
  
  .main-title {
    font-size: 1.75rem;
  }
  
  .article-types {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
  
  .type-btn {
    padding: 1rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .recommended-articles,
  .guess-you-need {
    padding: 1.5rem;
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
  .new-main-content {
    padding: 8rem 1rem 2rem;
    gap: 2rem;
  }
  
  .top-content {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  
  .cartoon-image {
    text-align: center;
    margin-bottom: 0;
  }
  
  .cartoon-image img {
    width: 120px;
  }
  
  .content-section {
    padding: 1.25rem;
    max-width: 100%;
    margin-left: 0;
  }
  
  .main-title {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
  
  /* 文章类型按钮移动端优化 */
  .article-types {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 2rem;
  }
  
  .type-btn {
    padding: 1rem 0.5rem;
    font-size: 0.75rem;
    gap: 0.5rem;
  }
  
  .type-btn :deep(.fa-solid) {
    font-size: 1.25rem;
  }
  
  /* 推荐文章移动端优化 */
  .recommended-articles,
  .guess-you-need {
    margin: 2rem 0;
    padding: 1.25rem;
  }
  
  .section-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .section-title :deep(.fa-solid) {
    font-size: 1.25rem;
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
  
  .read-more {
    font-size: 0.8rem;
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
  
  .new-main-content {
    padding: 7rem 0.75rem 2rem;
  }
  
  .cartoon-image img {
    width: 100px;
  }
  
  .content-section {
    padding: 1rem;
  }
  
  .main-title {
    font-size: 1.1rem;
  }
  
  .article-types {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .type-btn {
    padding: 0.875rem 0.5rem;
    font-size: 0.8rem;
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .recommended-articles,
  .guess-you-need {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .article-image {
    height: 120px;
  }
}
</style>