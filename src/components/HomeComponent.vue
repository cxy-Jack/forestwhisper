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
      <li><a href="#home" @click="smoothScroll($event, 'home')" :class="{ active: currentSection === 'home' }">
        <img src="../assets/img/首页.svg" class="nav-icon" alt="首页" />
        <span>首页</span>
      </a></li>
      <li><a href="#about" @click="smoothScroll($event, 'about')" :class="{ active: currentSection === 'about' }">
        <img src="../assets/img/网站介绍.svg" class="nav-icon" alt="网站介绍" />
        <span>网站介绍</span>
      </a></li>
      <li><a href="#us" @click="smoothScroll($event, 'us')" :class="{ active: currentSection === 'us' }">
        <img src="../assets/img/关于我们.svg" class="nav-icon" alt="关于我们" />
        <span>关于我们</span>
      </a></li>
      <li><a href="#data" @click="smoothScroll($event, 'data')" :class="{ active: currentSection === 'data' }">
        <img src="../assets/img/数据.svg" class="nav-icon" alt="数据" />
        <span>数据</span>
      </a></li>
    </ul>
    <!-- 根据登录状态显示登录按钮或用户名 -->
    <template v-if="userInfo">
      <router-link to="/user-panel" class="login-btn">
        <font-awesome-icon :icon="faUsers" class="btn-icon" />
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
  
  <!-- 主体内容 - 首页横幅 -->
  <section id="home" class="main-content">
    <div class="content-text">
      <h1 class="main-title typing-title">
        <span class="typing-line" v-for="(line, index) in textLines" :key="index">
          {{ displayedLines[index] || '' }}
        </span>
        <span class="typing-cursor">|</span>
      </h1>
      <p class="subtitle">让心灵找到归宿</p>
      <a href="#" class="cta-btn" @click.prevent="$router.push('/new-home')">立即进入</a>
    </div>
    <div class="stars-container">
      <img src="../assets/img/大星星.png" alt="大星星" class="big-star">
      <img src="../assets/img/小星星.png" alt="小星星" class="small-star">
      <img src="../assets/img/小星星.png" alt="小星星" class="small-star">
      <img src="../assets/img/小星星.png" alt="小星星" class="small-star">
      <img src="../assets/img/小星星.png" alt="小星星" class="small-star">
      <img src="../assets/img/小星星.png" alt="小星星" class="small-star">
    </div>
  </section>
  
  <!-- 底部装饰 -->
  <div class="bottom-decoration">
    <div class="clouds-container">
      <div class="cloud center-small">
        <img src="../assets/img/小云朵.svg" alt="中间小云朵">
      </div>
      <div class="cloud center-small1">
        <img src="../assets/img/小云朵.svg" alt="中间小云朵">
      </div>
      <div class="cloud center-small2">
        <img src="../assets/img/小云朵.svg" alt="中间小云朵">
      </div>
      <div class="cloud center-small3">
        <img src="../assets/img/小云朵.svg" alt="中间小云朵">
      </div>
      <div class="cloud center-small4">
        <img src="../assets/img/小云朵.svg" alt="中间小云朵">
      </div>
      <!-- 左侧衔接小云朵 -->
      <div class="cloud left-small">
        <img src="../assets/img/小云朵.svg" alt="左侧小云朵">
      </div>
      <div class="cloud left-small-one">
        <img src="../assets/img/小云朵.svg" alt="左侧小云朵">
      </div>
      <!-- 右侧衔接小云朵 -->
      <div class="cloud right-small">
        <img src="../assets/img/小云朵.svg" alt="右侧小云朵">
      </div>
      <div class="cloud right-small-one">
        <img src="../assets/img/小云朵.svg" alt="右侧小云朵">
      </div>
    </div>
    <a href="#about" @click="smoothScroll($event, 'about')"><img src="../assets/img/向下占行.png" alt="向下图标" class="down-icon"></a>
  </div>
  
  <!-- 网站介绍部分 - 展示平台核心功能 -->
  <section id="about" class="about-section">
    <div class="about-container">
      <div class="about-left">
        <div class="purple-character">
          <img src="../assets/img/网站logo.png" alt="紫色角色" style="width: 250px;">
          <div class="hearts">
            <img src="../assets/img/爱心.png" alt="爱心" class="heart">
            <img src="../assets/img/爱心.png" alt="爱心" class="heart">
            <img src="../assets/img/爱心.png" alt="爱心" class="heart">
          </div>
        </div>
      </div>
      <div class="about-right">
        <h2>林影心语—<br>AI树洞心理辅导平台</h2>
        <p>基于 Vue3+TS+SCSS 前端与 Python+Rust 后端，集成扣子空间AI接口，打造集AI聊天、心理测评、文章推送、心愿墙、留言墙于一体的心理支持网站。</p>
        <div class="features-grid">
          <div class="feature-card">
            <img src="../assets/img/精神心理科.png" alt="心理检测">
            <span>心理检测</span>
          </div>
          <div class="feature-card">
            <img src="../assets/img/留言.png" alt="留言开导">
            <span>留言开导</span>
          </div>
          <div class="feature-card">
            <img src="../assets/img/人数.png" alt="AI聊天">
            <span>AI聊天</span>
          </div>
          <div class="feature-card">
            <img src="../assets/img/shending.png" alt="心理文章">
            <span>心理文章</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部装饰 -->
    <div class="bottom-decoration">
      <div class="clouds-container">
        <!-- 左边大云朵 -->
        <div class="cloud left-big">
          <img src="../assets/img/大云朵.svg" alt="左边大云朵">
        </div>
        <!-- 左侧衔接小云朵 -->
        <div class="cloud left-small">
          <img src="../assets/img/小云朵.svg" alt="左侧小云朵">
        </div>
        <div class="cloud left-small-one">
          <img src="../assets/img/小云朵.svg" alt="左侧小云朵">
        </div>
        <!-- 右侧衔接小云朵 -->
        <div class="cloud right-small">
          <img src="../assets/img/小云朵.svg" alt="右侧小云朵">
        </div>
      </div>
    </div>
  </section>
  <!-- 关于我们部分 - 展示团队或项目信息 -->
  <section id="us" class="us-section">
    <h1 class="us-title">关于我们</h1>
    
    <div class="us-container">
      <img :src="currentMember.star" alt="星星" class="us-star">
      
      <div class="us-content">
        <div class="us-avatar-container">
          <img :src="currentMember.avatar" :alt="currentMember.name" class="us-avatar">
        </div>
        
        <div class="us-info">
          <h2 class="us-name">{{ currentMember.name }}</h2>
          <p class="us-role">{{ currentMember.role }}</p>
          <p class="us-description">{{ currentMember.description }}</p>
          <p class="us-contact">{{ currentMember.sholl }}</p>
        </div>
      </div>
      
      <div class="us-controls">
        <button class="us-btn us-prev" @click="prevMember">
          <span>&#10094;</span>
        </button>
        <div class="us-indicators">
          <button 
            v-for="(member, index) in members" 
            :key="index"
            class="us-indicator"
            :class="{ active: currentIndex === index }"
            @click="goToMember(index)"
          ></button>
        </div>
        <button class="us-btn us-next" @click="nextMember">
          <span>&#10095;</span>
        </button>
      </div>
    </div>
     
  </section>
  
  <!-- 数据部分 -->
  <section id="data" class="data-section" style="padding: 5px;">
    <div class="DataContainer">
      <div class="text-container">
        <div class="data-header">
          <h2 class="data-title">数据统计</h2>
        </div>
        
        <div class='data-item' v-for="(item, index) in dataItems" :key="index" v-show="currentDataIndex === index">
          <div class="item-icon">
            <font-awesome-icon :icon="getDataIcon(index)" class="icon" />
          </div>
          <h4>{{ item.title }}</h4>
          <div class="value-container">
            <span class="value-number">{{ item.value }}</span>
            <span class="value-trend" :class="getTrendClass(item.change)">
              {{ item.change.includes('提升') || item.change.includes('增长') || item.change.includes('增加') ? '↑' : '↓' }}
            </span>
          </div>
          <p class="compare-text">{{ item.compare }}</p>
          <p class="change-text" :class="getTrendClass(item.change)">{{ item.change }}</p>
        </div>
        
        <div class="data-button">
          <button class="page-btn" @click="prevDataItem">
            <font-awesome-icon :icon="faChevronLeft" />
            <span>上一页</span>
          </button>
          <div class="page-container">
            <div 
              v-for="(item, index) in dataItems" 
              :key="index" 
              class="box"
              :class="{ active: currentDataIndex === index }"
              @click="goToDataItem(index)"
            >
              <span class="box-number">{{ index + 1 }}</span>
            </div>
          </div>
          <button class="page-btn2" @click="nextDataItem">
            <span>下一页</span>
            <font-awesome-icon :icon="faChevronRight" />
          </button>
        </div>
      </div>
      
      <div class="img-container" :style="{ backgroundImage: 'url(' + currentDataItem.image + ')' }">
        <div class="img-overlay">
          <div class="floating-elements">
            <div class="floating-circle circle-1"></div>
            <div class="floating-circle circle-2"></div>
            <div class="floating-circle circle-3"></div>
          </div>
          
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faComments, faUsers, faBook, faMessage, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { animate } from 'animejs';
import '../assets/home-style.css';

import xiaojieAvatar from '../assets/img/小杰头像.jpg';
import txiang from '../assets/img/布莫头像.jpg';
import starIcon from '../assets/img/星星.png';
import beijing1 from '../assets/img/背景1.jpg';
import beijing2 from '../assets/img/背景2.jpg';
import beijing3 from '../assets/img/背景3.jpg';



// 导航栏当前激活部分
const currentSection = ref('home');

// 用户登录状态管理
const userInfo = ref(null);

// 验证用户登录状态
const validateUserLogin = async () => {
  try {
    const API_BASE_URL = 'https://api.banana404.top';
    const response = await fetch(`${API_BASE_URL}/api/v1/user/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.code === 200) {
      // 登录有效，更新用户信息
      userInfo.value = data.data;
      localStorage.setItem('realUserInfo', JSON.stringify(data.data));
    } else if (data.code === 401 || data.code === 233) {
      // 登录无效，清除本地存储和跨子域cookie
      userInfo.value = null;
      localStorage.removeItem('realUserInfo');
      document.cookie = 'forestwhisper=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.hkmre.top;';
    }
  } catch (error) {
    console.error('验证用户登录状态失败:', error);
    // 网络错误时，尝试从localStorage获取用户信息
    const storedUser = localStorage.getItem('realUserInfo');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        userInfo.value = parsedUser.data || parsedUser;
      } catch (e) {
        userInfo.value = null;
        localStorage.removeItem('realUserInfo');
      }
    } else {
      userInfo.value = null;
    }
  }
};

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

// 监听storage事件，处理其他标签页的登录状态变化
const handleStorageChange = () => {
  checkUserLogin();
};

// 组件挂载时检查登录状态
onMounted(() => {
  validateUserLogin();
  window.addEventListener('storage', handleStorageChange);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange);
});

// 打字动画相关
const textLines = ['在这里', '每一个故事都值得被倾听', '每一份感受都应该被理解'];
const displayedLines = ref([]);
let typingTimer = null;
let isDeleting = false;
let currentLineIndex = 0;
let currentLineText = '';
let charIndex = 0;

const typeEffect = () => {
  if (!isDeleting) {
    if (currentLineIndex < textLines.length) {
      const currentLine = textLines[currentLineIndex];
      
      if (charIndex < currentLine.length) {
        currentLineText += currentLine[charIndex];
        charIndex++;
        
        displayedLines.value[currentLineIndex] = currentLineText;
        typingTimer = setTimeout(typeEffect, 80);
      } else {
        charIndex = 0;
        currentLineText = '';
        currentLineIndex++;
        
        if (currentLineIndex >= textLines.length) {
          isDeleting = true;
          currentLineIndex = textLines.length - 1;
          setTimeout(typeEffect, 800);
        } else {
          setTimeout(typeEffect, 200);
        }
      }
    }
  } else {
    if (currentLineIndex >= 0) {
      if (currentLineText.length > 0) {
        currentLineText = currentLineText.slice(0, -1);
        displayedLines.value[currentLineIndex] = currentLineText;
        typingTimer = setTimeout(typeEffect, 30);
      } else {
        displayedLines.value[currentLineIndex] = '';
        currentLineIndex--;
        
        if (currentLineIndex < 0) {
          isDeleting = false;
          currentLineIndex = 0;
          setTimeout(typeEffect, 300);
        } else {
          const prevLine = textLines[currentLineIndex];
          currentLineText = prevLine;
          displayedLines.value[currentLineIndex] = prevLine;
          typingTimer = setTimeout(typeEffect, 30);
        }
      }
    }
  }
};

// 关于我们成员数据
const members = reactive([
  { 
    name: '前端：小杰', 
    role: '我们的初心：让每一份情绪都被温柔以待',
    description: 'ui设计，前端开发，python，认知/人格心理学',
    sholl:'广州市工贸技师学院-网站开发',
    avatar: xiaojieAvatar,
    star: starIcon
  },
  { 
    name: '后端：布莫', 
    role: '我们的目标：让每一份情感都被理解',
    description: '全栈开发，php，AI算法，python',
    sholl:'广州大学附属中学美林湖学院',
    avatar: txiang,
    star: starIcon
  },
]);

// 当前成员索引
const currentIndex = ref(0);

// 计算当前成员
const currentMember = computed(() => {
  return members[currentIndex.value];
});

// 轮播定时器
let memberInterval = null;

// 数据部分轮播数据
const dataItems = reactive([
  {
    title: 'AI对话次数',
    value: '1028次',
    compare: '相较于上月',
    change: '提升20%',
    image: beijing1,
  },
  {
    title: '功能使用数量',
    value: '102次',
    compare: '相较于上月',
    change: '增长10%',
    image: beijing2,
  },
  {
    title: '文章阅读量',
    value: '8921次',
    compare: '相较于上月',
    change: '提升30%',
    image: beijing3,
  },
]);

// 数据部分当前索引
const currentDataIndex = ref(0);

// 计算当前数据项
const currentDataItem = computed(() => {
  return dataItems[currentDataIndex.value];
});

// 数据轮播定时器
let dataInterval = null;

// 数据轮播方法
const prevDataItem = () => {
  currentDataIndex.value = 
    (currentDataIndex.value - 1 + dataItems.length) % dataItems.length;
  resetDataInterval();
};

const nextDataItem = () => {
  currentDataIndex.value = 
    (currentDataIndex.value + 1) % dataItems.length;
  resetDataInterval();
};

const goToDataItem = (index) => {
  currentDataIndex.value = index;
  resetDataInterval();
  animateDataChange();
};

const startDataCarousel = () => {
  dataInterval = setInterval(nextDataItem, 5000);
};

const resetDataInterval = () => {
  clearInterval(dataInterval);
  startDataCarousel();
};

// 获取数据项对应的图标
const getDataIcon = (index) => {
  const icons = [faComments, faUsers, faBook, faMessage];
  return icons[index] || faComments;
};

// 获取趋势样式类
const getTrendClass = (change) => {
  if (change.includes('提升') || change.includes('增长') || change.includes('增加')) {
    return 'trend-up';
  } else {
    return 'trend-down';
  }
};

// 数据切换动画
const animateDataChange = () => {
  // 为当前显示的数据项添加动画
  const visibleDataItem = document.querySelector('.data-item[style*="display: block"]');
  if (visibleDataItem) {
    animate(visibleDataItem, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      easing: 'easeOutQuad'
    });
  }

  // 为数字添加动画
  const valueNumber = document.querySelector('.value-number');
  if (valueNumber) {
    animate(valueNumber, {
      scale: [0.8, 1],
      duration: 400,
      easing: 'easeOutBack'
    });
  }

  // 为激活的页面指示器添加动画
  const activeBox = document.querySelector('.box.active');
  if (activeBox) {
    animate(activeBox, {
      scale: [1, 1.3, 1.2],
      duration: 300,
      easing: 'easeOutQuad'
    });
  }
};

// 平滑滚动到指定部分
const smoothScroll = (event, targetId) => {
  event.preventDefault();
  const targetElement = document.getElementById(targetId);
  
  if (targetElement) {
    const navbarHeight = 100;
    const targetPosition = targetElement.offsetTop - navbarHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

// 滚动监听处理函数
const handleScroll = () => {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section, #home');
  
  // 导航栏背景变化
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  
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
  
  // 视差效果
  const aboutLeft = document.querySelector('.about-left');
  const aboutRight = document.querySelector('.about-right');
  
  if (aboutLeft && aboutRight) {
    const parallaxOffset = scrollTop * 0.1;
    aboutLeft.style.transform = `translateY(${parallaxOffset}px)`;
    aboutRight.style.transform = `translateY(${-parallaxOffset}px)`;
  }
};



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
  
  // 组件卸载时清理定时器
  onUnmounted(() => {
    clearInterval(heartInterval);
  });
};

// 关于我们轮播方法
const prevMember = () => {
  currentIndex.value = 
    (currentIndex.value - 1 + members.length) % members.length;
  resetMemberInterval();
};

const nextMember = () => {
  currentIndex.value = 
    (currentIndex.value + 1) % members.length;
  resetMemberInterval();
};

const goToMember = (index) => {
  currentIndex.value = index;
  resetMemberInterval();
};

const startMemberCarousel = () => {
  memberInterval = setInterval(nextMember, 3000);
};

const resetMemberInterval = () => {
  clearInterval(memberInterval);
  startMemberCarousel();
};

// 滚动触发动画
const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 为不同的元素设置不同的动画效果
        if (entry.target.classList.contains('about-section')) {
          // 紫色角色动画
          const hearts = document.querySelectorAll('.heart');
          
          // 先触发左侧角色动画
          document.querySelector('.about-left').classList.add('animate');
          
          // 0.3秒后触发右侧内容动画
          setTimeout(() => {
            document.querySelector('.about-right').classList.add('animate');
          }, 300);
          
          // 0.6秒后触发特性卡片动画
          setTimeout(() => {
            const featureCards = document.querySelectorAll('.feature-card');
            featureCards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate');
                // 卡片出现时的缩放效果
                card.style.animation = 'smoothScale 0.5s ease-out';
              }, index * 120);
            });
          }, 600);
          
          // 1.0秒后触发爱心动画
          setTimeout(() => {
            hearts.forEach((heart, index) => {
              setTimeout(() => {
                heart.style.animation = 'float-heart 3s ease-in-out infinite';
              }, index * 150);
            });
          }, 1000);
        } else if (entry.target.classList.contains('us-section')) {
          // 先触发容器动画
          document.querySelector('.us-container').classList.add('animate');
          
          // 0.2秒后触发星星动画
          setTimeout(() => {
            const usStar = document.querySelector('.us-star');
            usStar.style.animation = 'us-star-float 4s ease-in-out infinite';
          }, 200);
          
          // 0.4秒后触发头像动画
          setTimeout(() => {
            const usAvatar = document.querySelector('.us-avatar');
            usAvatar.style.opacity = '1';
            usAvatar.style.transform = 'scale(1)';
          }, 400);
          
          // 0.6秒后触发信息动画
          setTimeout(() => {
            const usInfo = document.querySelector('.us-info');
            usInfo.style.opacity = '1';
            usInfo.style.transform = 'translateX(0)';
          }, 600);
          
          // 0.8秒后触发控制按钮动画
          setTimeout(() => {
            const usControls = document.querySelector('.us-controls');
            usControls.style.opacity = '1';
            usControls.style.transform = 'translateY(0)';
          }, 800);
        } else if (entry.target.classList.contains('data-section')) {
          // 先触发容器动画
          document.querySelector('.DataContainer').classList.add('animate');
          
          // 0.2秒后触发文本容器动画
          setTimeout(() => {
            const textContainer = document.querySelector('.text-container');
            textContainer.style.opacity = '1';
            textContainer.style.transform = 'translateX(0)';
          }, 200);
          
          // 0.4秒后触发所有数据项动画
          setTimeout(() => {
            const dataItems = document.querySelectorAll('.data-item');
            dataItems.forEach((item, index) => {
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              }, index * 100);
            });
          }, 400);
          
          // 0.6秒后触发图片容器动画
          setTimeout(() => {
            const imgContainer = document.querySelector('.img-container');
            imgContainer.style.opacity = '1';
            imgContainer.style.transform = 'translateX(0)';
          }, 600);
          
          // 0.8秒后触发浮动圆圈动画
          setTimeout(() => {
            const floatingCircles = document.querySelectorAll('.floating-circle');
            floatingCircles.forEach((circle, index) => {
              setTimeout(() => {
                circle.style.animation = 'smoothFloat 3s ease-in-out infinite';
              }, index * 200);
            });
          }, 800);
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // 观察需要动画的 sections
  document.querySelectorAll('.about-section, .us-section, .data-section').forEach(section => {
    observer.observe(section);
  });
};

// 初始化数据部分动画
const initDataAnimations = () => {
  // 浮动圆圈动画
  const floatingCircles = document.querySelectorAll('.floating-circle');
  if (floatingCircles.length > 0) {
    animate('.floating-circle', {
      translateY: [0, -20, 0],
      translateX: [0, 10, 0],
      scale: [1, 1.1, 1],
      duration: 3000,
      delay: 'stagger(1000)',
      loop: true,
      easing: 'easeInOutSine'
    });
  }

  // 星星装饰动画
  const decorationStars = document.querySelectorAll('.decoration-star');
  if (decorationStars.length > 0) {
    animate('.decoration-star', {
      scale: [1, 1.3, 1],
      rotate: [0, 360],
      duration: 2000,
      delay: 'stagger(300)',
      loop: true,
      easing: 'easeInOutQuad'
    });
  }

};

// 组件挂载时初始化
onMounted(() => {
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll);
  
  // 初始化漂浮爱心
  initFloatingHearts();
  
  // 初始化关于我们成员轮播
  startMemberCarousel();
  
  // 初始化数据部分轮播
  startDataCarousel();
  
  // 启动打字动画
  typeEffect();
  
  // 初始化数据部分动画
  initDataAnimations();
  
  // 初始化滚动触发动画
  initScrollAnimations();
});

// 组件卸载时清理
onUnmounted(() => {
  // 移除滚动监听
  window.removeEventListener('scroll', handleScroll);
  
  // 清理成员轮播定时器
  clearInterval(memberInterval);
  
  // 清理数据轮播定时器
  clearInterval(dataInterval);
  
  // 清理打字动画定时器
  if (typingTimer) {
    clearTimeout(typingTimer);
    typingTimer = null;
  }
});
</script>

<style scoped>
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

.typing-title {
  font-size:  2.375em;
  font-weight: bold;
  margin-bottom: 20px;
  min-height: 190px;
}

.typing-line {
  display: block;
  line-height: 1.5;
}

.typing-cursor {
  display: inline-block;
  margin-left: 2px;
  color: var(--primary-color, #6a1b9a);
  animation: blink 0.7s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
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
</style>