<template>
  <!-- 加载动画 -->
  <div class="loading-container" v-if="loading">
    <div class="loading-spinner"></div>
    <div class="loading-text">正在加载文章...</div>
  </div>

  <!-- 滚动进度条 -->
  <div class="scroll-progress"></div>

  <!-- 文章页面内容 -->
  <div class="article-page-container" v-if="!loading">
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
        <li><router-link to="/chat" :class="{ active: $route.path === '/chat' }">
          <img src="../assets/img/Ai聊天.svg" class="nav-icon" alt="AI聊天" />
          <span>AI聊天</span>
        </router-link></li>
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
    <main class="article-main-content">
      <div class="article-container">
        <!-- 左侧文章内容 -->
        <div class="article-left">
          <!-- 返回按钮 -->
          <button class="back-btn" @click="goBack">
            <font-awesome-icon icon="fa-solid fa-arrow-left"></font-awesome-icon>
            <span>返回</span>
          </button>
          
          <!-- 文章内容 -->
          <div class="article-content-container" v-if="article">
            <div class="article-header">
              <h1 class="article-title">{{ article.title }}</h1>
              <div class="article-meta">
                <span class="article-date">发布时间: {{ formatDate(article.created) }}</span>
                <span class="article-views">游览量: {{ article.views }}</span>
                <span class="article-comments">评论: {{ article.comments_num }}</span>
                <span class="article-comments">点赞：{{ likeCount }}</span>
              </div>
            </div>
            
            <div class="article-body">
              <div class="article-text" v-html="renderedContent"></div>
            </div>
            
            <!-- 评论区域 -->
            <div class="article-comments-section">
              <h3 class="comments-title">评论</h3>
              <div class="comments-list">
                <template v-if="comments.length > 0">
                  <div v-for="comment in comments" :key="comment.coid" class="comment-item">
                    <div class="comment-author">{{ comment.author }}</div>
                    <div class="comment-time">{{ formatDate(comment.created) }}</div>
                    <div class="comment-content">{{ comment.text }}</div>
                  </div>
                </template>
                <div v-else class="no-comments">暂无评论</div>
              </div>
              
              <!-- 评论表单 -->
              <div class="comment-form">
                <textarea v-model="commentText" placeholder="写下你的评论..." maxlength="5000"></textarea>
                <button @click="submitComment" class="submit-comment-btn">提交评论</button>
              </div>
            </div>
          </div>
          
          <!-- 文章不存在 -->
          <div class="article-not-found" v-else>
            <font-awesome-icon icon="fa-solid fa-exclamation-circle"></font-awesome-icon>
            <h2>文章不存在</h2>
            <p>抱歉，您访问的文章不存在或已被删除。</p>
            <router-link to="/new-home" class="back-btn">返回首页</router-link>
          </div>
        </div>
        
        <!-- 右侧边栏 -->
        <div class="article-right">
          <!-- 文章标签 -->
          <div class="article-tags">
            <h3 class="sidebar-title">文章标签</h3>
            <div class="tags-content">{{ article.category.name }}</div>
            <div class="article-author-info">
              <h4 class="sidebar-subtitle">文章撰写</h4>
              <div class="author-name">{{ article.author.name }}</div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="action-buttons">
              <button @click="toggleLike" class="action-btn">
                <font-awesome-icon :icon="isLiked ? 'fa-solid fa-thumbs-up' : 'fa-regular fa-thumbs-up'"></font-awesome-icon>
              </button>
              <button class="action-btn">
                <font-awesome-icon :icon="isBookmarked ? 'fa-solid fa-star' : 'fa-regular fa-star'"></font-awesome-icon>
              </button>
              <button @click="shareArticle" class="action-btn">
                <font-awesome-icon icon="fa-regular fa-share-from-square"></font-awesome-icon>
              </button>
            </div>
          </div>
          
          <!-- 相关文章 -->
            <div class="related-articles">
              <h3 class="sidebar-title">相关文章</h3>
              <template v-if="relatedArticles.length > 0">
                <div v-for="item in relatedArticles" :key="item.cid" class="related-article-item">
                  <router-link :to="`/article/${item.cid}`" class="related-article-link">
                    {{ item.title }}
                  </router-link>
                </div>
              </template>
              <div v-else class="no-related-articles">
                <img src="../assets/img/许愿墙.svg" alt="暂无相关文章" class="no-article-icon">
                <p>暂无相关标签文章</p>
              </div>
            </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faFolder, faCalendar, faEye, faComment, faThumbsUp, faBookmark, faShare, faExclamationCircle, faUsers, faStar, faShareFromSquare, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as farThumbsUp, faComment as farComment, faStar as farStar, faShareFromSquare as farShareFromSquare } from '@fortawesome/free-regular-svg-icons';
import { marked } from 'marked';

library.add(faUser, faFolder, faCalendar, faEye, faComment, faThumbsUp, faBookmark, faShare, faExclamationCircle, faUsers, faStar, faShareFromSquare, faArrowLeft, farThumbsUp, farComment, farStar, farShareFromSquare);

// 路由相关
const route = useRoute();

// 加载状态
const loading = ref(true);

// 文章数据
const article = ref(null);

// 评论数据
const comments = ref([]);

// 评论输入
const commentText = ref('');

// 点赞状态
const isLiked = ref(false);

// 点赞数量
const likeCount = ref(0);

// 收藏状态
const isBookmarked = ref(false);

// 相关文章
const relatedArticles = ref([]);

// 解析Markdown内容
const renderedContent = computed(() => {
  if (!article.value || !article.value.text) {
    return '';
  }
  // 先解析Markdown
  let html = marked(article.value.text);
  // 然后处理图片标签，添加内联样式
  html = html.replace(/<img src="([^"]+)" alt="([^"]*)" title="([^"]*)" \/>/g, '<img src="$1" alt="$2" title="$3" style="max-width: 100%; height: auto; display: block; margin: 1.5rem 0; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />');
  html = html.replace(/<img src="([^"]+)" alt="([^"]*)" \/>/g, '<img src="$1" alt="$2" style="max-width: 100%; height: auto; display: block; margin: 1.5rem 0; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />');
  return html;
});

// 用户登录状态管理
const userInfo = ref(null);

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

// 从API获取单篇文章
const fetchArticle = async () => {
  loading.value = true;
  try {
    const cid = route.params.cid;
    if (!cid) {
      throw new Error('文章ID不存在');
    }
    
    const API_BASE_URL = 'https://api.banana404.top';
    const response = await fetch(`${API_BASE_URL}/api/v1/content/${cid}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.data) {
      article.value = data.data;
      // 获取评论列表
      fetchComments();
      // 获取点赞状态
      fetchLikeStatus();
    } else {
      console.error('API返回数据结构不符合预期:', data);
      article.value = null;
    }
  } catch (error) {
    console.error('获取文章失败:', error);
    article.value = null;
  } finally {
    loading.value = false;
  }
};

// 获取评论列表
const fetchComments = async () => {
  try {
    const cid = route.params.cid;
    if (!cid) return;
    
    const API_BASE_URL = 'https://api.banana404.top';
    const response = await fetch(`${API_BASE_URL}/api/v1/comment/content/${cid}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.data) {
      comments.value = data.data;
    } else {
      console.error('API返回数据结构不符合预期:', data);
      comments.value = [];
    }
  } catch (error) {
    console.error('获取评论失败:', error);
    comments.value = [];
  }
};

// 提交评论
const submitComment = async () => {
  if (!commentText.value.trim()) {
    alert('请输入评论内容');
    return;
  }
  
  try {
    const cid = route.params.cid;
    if (!cid) return;
    
    const API_BASE_URL = 'https://api.banana404.top';
    const response = await fetch(`${API_BASE_URL}/api/v1/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cid: parseInt(cid),
        text: commentText.value.trim(),
        type: 'comment',
        parent: 0
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 200) {
      alert('评论已提交，等待审核');
      commentText.value = '';
      // 重新获取评论列表
      fetchComments();
    } else {
      console.error('API返回数据结构不符合预期:', data);
      alert('评论提交失败');
    }
  } catch (error) {
    console.error('提交评论失败:', error);
    alert('评论提交失败');
  }
};

// 获取点赞状态
const fetchLikeStatus = async () => {
  try {
    const cid = route.params.cid;
    if (!cid) return;
    
    const API_BASE_URL = 'https://api.banana404.top';
    const response = await fetch(`${API_BASE_URL}/api/v1/like/status?target_type=content&target_id=${cid}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.data) {
      isLiked.value = data.data.has_liked;
      likeCount.value = data.data.count;
    } else {
      console.error('API返回数据结构不符合预期:', data);
    }
  } catch (error) {
    console.error('获取点赞状态失败:', error);
  }
};

// 切换点赞状态
const toggleLike = async () => {
  try {
    const cid = route.params.cid;
    if (!cid) return;
    
    // 获取认证信息
    let authToken = '';
    try {
      const storedUser = localStorage.getItem('realUserInfo');
      console.log('存储的用户信息:', storedUser);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('解析后的用户信息:', parsedUser);
        // 检查不同可能的认证信息字段
        authToken = parsedUser.token || parsedUser.access_token || parsedUser.data?.token || parsedUser.data?.access_token || '';
        console.log('获取到的认证令牌:', authToken);
      }
    } catch (error) {
      console.error('获取认证信息失败:', error);
    }
    
    const API_BASE_URL = 'https://api.banana404.top';
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // 如果有认证信息，添加到请求头
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
      console.log('添加认证头:', headers['Authorization']);
    } else {
      console.log('没有找到认证信息');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/v1/like/toggle`, {
      method: 'POST',
      credentials: 'include',
      headers: headers,
      body: JSON.stringify({
        target_type: 'content',
        target_id: parseInt(cid)
      })
    });
    
    console.log('响应状态:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API返回数据:', data);
    
    if (data.code === 200 && data.data) {
      isLiked.value = data.data.liked;
      likeCount.value = data.data.count;
    } else {
      console.error('API返回数据结构不符合预期:', data);
      // 显示错误信息
      if (data.msg) {
        alert(data.msg);
      }
    }
  } catch (error) {
    console.error('切换点赞状态失败:', error);
  }
};

// 分享文章
const shareArticle = async () => {
  try {
    if (!article.value) return;
    
    const shareData = {
      title: article.value.title,
      text: article.value.text.substring(0, 100) + '...',
      url: window.location.href
    };
    
    // 检查浏览器是否支持原生分享 API
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // 对于不支持原生分享的浏览器，复制链接到剪贴板
      await navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  } catch (error) {
    console.error('分享失败:', error);
    // 分享失败时，也尝试复制链接到剪贴板
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    } catch (clipboardError) {
      console.error('复制到剪贴板失败:', clipboardError);
      alert('分享失败，请手动复制链接');
    }
  }
};

// 返回上一页
const goBack = () => {
  window.history.back();
};

// 滚动监听处理函数
const handleScroll = () => {
  const navbar = document.querySelector('.navbar');
  
  // 导航栏背景变化
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  
  // 滚动进度条
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = (scrollTop / scrollHeight) * 100;
  
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    progressBar.style.width = `${scrollProgress}%`;
  }
};



onMounted(() => {
  // 检查登录状态
  checkUserLogin();
  
  // 获取文章
  fetchArticle();
  
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* 加载动画 */
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--background-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(43, 113, 234, 0.3);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
  color: var(--primary-color);
  font-weight: 500;
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

/* 文章页面样式 */
.article-page-container {
  min-height: 100vh;
  font-family: 'YouSheShaYuFeiTe', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: var(--background-color);
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

.back-btn {
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
  margin-bottom: 1.5rem;
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
  box-shadow: 0 4px 6px -1px var(--shadow-color);
}

.btn-icon {
  font-size: 1rem;
  width: 1rem;
  height: 1rem;
}

.login-btn:hover {
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-color) 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px var(--shadow-color);
}

/* 主要内容区域 */
.article-main-content {
  padding: 8rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 文章容器 */
.article-container {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

/* 左侧文章内容 */
.article-left {
  flex: 1;
  min-width: 0;
}

/* 右侧边栏 */
.article-right {
  width: 300px;
  flex-shrink: 0;
}

/* 文章内容容器 */
.article-content-container {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease-out forwards;
  margin-bottom: 2rem;
}

/* 文章头部 */
.article-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.article-title {
  font-size: 1.5rem;
  color: #ff9776;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.4;
  text-align: left;
}

.article-meta {
  display: flex;
  gap: 2rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.article-meta span {
  display: inline-block;
}



/* 文章正文 */
.article-body {
  margin-bottom: 2rem;
}

.article-text {
  font-size: 1rem;
  line-height: 1.7;
  color: #374151;
}

.article-text :deep(p) {
  margin-bottom: 1.25rem;
}

.article-text :deep(h2) {
  font-size: 1.25rem;
  color: #6a1b9a;
  margin: 1.5rem 0 1rem;
  font-weight: 600;
}

.article-text :deep(h3) {
  font-size: 1.1rem;
  color: #6a1b9a;
  margin: 1.25rem 0 0.75rem;
  font-weight: 600;
}

.article-text :deep(img) {
  max-width: 100% !important;
  height: auto !important;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: block;
  width: 100%;
}

.article-text :deep(ul),
.article-text :deep(ol) {
  margin: 1.25rem 0;
  padding-left: 1.5rem;
}

.article-text :deep(li) {
  margin-bottom: 0.5rem;
}

.article-text :deep(blockquote) {
  border-left: 4px solid #6a1b9a;
  padding-left: 1rem;
  margin: 1.25rem 0;
  font-style: italic;
  color: #6b7280;
}

.article-text :deep(code) {
  background: rgba(106, 27, 154, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.article-text :deep(pre) {
  background: rgba(106, 27, 154, 0.1);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.25rem 0;
}

.article-text :deep(pre code) {
  background: none;
  padding: 0;
}

.article-text :deep(a) {
  color: #6a1b9a;
  text-decoration: none;
  transition: color 0.3s ease;
}

.article-text :deep(a:hover) {
  color: #8e24aa;
  text-decoration: underline;
}

/* 评论区域 */
.article-comments-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.comments-title {
  font-size: 1.25rem;
  color: #6a1b9a;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.comments-list {
  margin-bottom: 1.5rem;
}

.comment-item {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.comment-author {
  font-weight: 600;
  color: #6a1b9a;
  margin-bottom: 0.5rem;
}

.comment-time {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 0.75rem;
}

.comment-content {
  color: #374151;
  line-height: 1.6;
}

.no-comments {
  text-align: center;
  color: #9ca3af;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 0.5rem;
}

/* 评论表单 */
.comment-form {
  margin-top: 1.5rem;
}

.comment-form textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.submit-comment-btn {
  background: #65dbff;
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(83, 83, 83, 0.774);
}

.submit-comment-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(87, 87, 87, 0.771);
}

/* 右侧边栏 */
.article-tags {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.sidebar-title {
  font-size: 1.1rem;
  color: #6a1b9a;
  margin-bottom: 1rem;
  font-weight: 600;
}

.sidebar-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 1rem 0 0.5rem;
  font-weight: 500;
}

.tags-content {
  color: #374151;
  margin-bottom: 0.5rem;
}

.author-name {
  color: #374151;
  font-weight: 500;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.action-btn {
  background: white;
  border: 1px solid #e0e0e0;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.action-btn:hover {
  background: #f9f9f9;
  border-color: #d1d5db;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.action-btn :deep(.fa-solid),
.action-btn :deep(.fa-regular) {
  font-size: 1rem;
  color: #ff9776;
}

.action-btn.liked :deep(.fa-thumbs-up) {
  color: #1a62de;
}

/* 相关文章 */
.related-articles {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.related-article-item {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.related-article-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.related-article-link {
  color: #374151;
  text-decoration: none;
  font-size: 0.9rem;
  line-height: 1.4;
  transition: color 0.3s ease;
  display: block;
}

.related-article-link:hover {
  color: #6a1b9a;
  text-decoration: underline;
}

.no-related-articles {
  text-align: center;
  color: #9ca3af;
  padding: 2rem 1rem;
}

.no-article-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  opacity: 0.5;
}

.no-related-articles p {
  font-size: 0.9rem;
  margin: 0;
}

/* 文章不存在 */
.article-not-found {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  text-align: center;
  animation: fadeInUp 0.8s ease-out forwards;
}

.article-not-found :deep(.fa-exclamation-circle) {
  font-size: 3rem;
  color: #ff9776;
  margin-bottom: 1rem;
}

.article-not-found h2 {
  font-size: 1.5rem;
  color: #6a1b9a;
  margin-bottom: 1rem;
  font-weight: 600;
}

.article-not-found p {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

.back-btn {
  background: #65dbff;
  border: none;
  color: white;
  padding: 0.60rem 1.0rem;
    border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 4px 6px -1px rgba(83, 83, 83, 0.774);
}

.back-btn:hover {
  background: #65dbff;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(87, 87, 87, 0.771);
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

/* 响应式设计 */
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
  
  .article-main-content {
    padding: 7rem 1.5rem 3rem;
  }
  
  .article-content-container {
    padding: 2rem;
  }
  
  .article-title {
    font-size: 1.75rem;
  }
}

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
  .article-main-content {
    padding: 8rem 1rem 2rem;
  }
  
  .article-content-container {
    padding: 1.5rem;
  }
  
  .article-title {
    font-size: 1.5rem;
  }
  
  .article-meta {
    gap: 1rem;
    font-size: 0.75rem;
  }
  
  .article-text {
    font-size: 0.95rem;
  }
  
  .article-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }
}
</style>