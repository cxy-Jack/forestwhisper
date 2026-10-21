<template>
  <div class="user-panel">
    <!-- 漂浮爱心容器 -->
    <div class="floating-hearts"></div>
    <!-- 加载动画 -->
    <div class="loading-container" v-if="loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">正在加载用户信息...</div>
    </div>
    
    <!-- 主内容区域 -->
    <div class="panel-container" v-if="!loading">
      <!-- 顶部背景图片区域 -->
      <div class="user-background-section">
        <img 
          :src="backgroundImage" 
          alt="用户背景图" 
          class="background-image"
        >
        <!-- 功能按钮 -->
        <div class="function-buttons">
          <button class="function-btn" @click="toggleAccountSettings">
            <font-awesome-icon icon="cog" /> 账号设置
          </button>
          <button class="function-btn" @click="toggleBackgroundSettings">
            <font-awesome-icon icon="image" /> 更改背景
          </button>
        </div>
      </div>

      <!-- 用户信息区域 -->
      <div class="user-info-section">
        <div style="display: flex;">
         <div class="avatar-container">
          <img 
            :src="userAvatar" 
            alt="用户头像" 
            class="avatar-image"
          >
        </div>
        <div class="user-details">
          <h2 class="username">{{ userInfo.username || '未登录用户' }}</h2>
          <p class="user-identity">
            <font-awesome-icon icon="user" /> 示例身份：UI设计
          </p>
        </div> 
        </div>
        
        <!-- 用户元数据 -->
      <div class="user-meta-section">
        <span class="meta-item">年龄: {{ userInfo.age || '未知' }}</span>
        <span class="meta-item">性别: {{ userInfo.gender || '未知' }}</span>
        <span class="meta-item">账号创建: {{ userInfo.createdAt || '---' }}</span>
      </div>
      </div>

      <!-- 个性签名区域 -->
      <div class="signature-section" @click="changeSignature">
        <p class="signature-label">个性签名：</p>
        <p class="signature-text">{{ currentSignature }}</p>
      </div>

      

      <!-- 标签页导航 -->
      <div class="tabs-navigation">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-item"
          :class="{ 'active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <!-- 左侧主内容卡片 -->
        <div class="content-card main-card">
          <div class="card-content">
            <img 
              :src="mascotImage" 
              alt="紫色Q版小人" 
              class="mascot-image"
            >
            <p class="empty-message">暂无历史文章，去逛逛文章页吧</p>
          </div>
        </div>
        
        <!-- 右侧推荐数据卡片 -->
        <div class="content-card side-card">
          <h3 class="card-title">推荐数据分布</h3>
          <div class="card-content">
            <img 
              :src="mascotImageWithHeart" 
              alt="紫色Q版小人爱心版" 
              class="mascot-image heart-version"
            >
            <p class="empty-message">暂无数据哦~请去测试</p>
          </div>
        </div>
      </div>

      <!-- 返回按钮 -->
      <button class="back-btn" @click="goBack">
        <font-awesome-icon icon="arrow-left" />
      </button>
    </div>

    <!-- 账号设置面板 -->
    <div v-if="showAccountSettings" class="settings-overlay" @click="closeAllPanels">
      <div class="settings-panel" @click.stop>
        <div class="settings-header">
          <h3>账号设置</h3>
          <button class="close-btn" @click="closeAllPanels">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="settings-content">
          <!-- 头像设置 -->
          <div class="setting-group">
            <label class="setting-label">头像设置</label>
            <div class="avatar-setting">
              <img :src="userAvatar" alt="当前头像" class="setting-avatar">
              <button class="upload-btn">
                <font-awesome-icon icon="upload" /> 上传新头像
              </button>
            </div>
          </div>

          <!-- 用户名设置 -->
          <div class="setting-group">
            <label class="setting-label">用户名</label>
            <input type="text" class="setting-input" v-model="userInfo.username">
          </div>
          
          <!-- 个人描述设置 -->
          <div class="setting-group">
            <label class="setting-label">个人描述</label>
            <textarea class="setting-textarea" v-model="userInfo.description" placeholder="输入个人描述" rows="3"></textarea>
          </div>

          <!-- 用户身份设置 -->
          <div class="setting-group">
            <label class="setting-label">用户身份</label>
            <input type="text" class="setting-input" placeholder="输入身份信息">
          </div>

          <!-- 年龄设置 -->
          <div class="setting-group">
            <label class="setting-label">年龄</label>
            <input type="number" class="setting-input" v-model="userInfo.age">
          </div>

          <!-- 性别设置 -->
          <div class="setting-group">
            <label class="setting-label">性别</label>
            <select class="setting-select" v-model="userInfo.gender">
              <option value="未知">未知</option>
              <option value="男">男</option>
              <option value="女">女</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <!-- 退出账号按钮 -->
          <div class="setting-group logout-group">
            <button class="logout-btn" @click="logout">
              <font-awesome-icon icon="sign-out-alt" /> 退出账号
            </button>
            <button class="save-btn" @click="updateUserInfo">
              <font-awesome-icon icon="save" /> 保存更改信息
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 背景更改面板 -->
    <div v-if="showBackgroundSettings" class="settings-overlay" @click="closeAllPanels">
      <div class="settings-panel background-panel" @click.stop>
        <div class="settings-header">
          <h3>更改背景</h3>
          <button class="close-btn" @click="closeAllPanels">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="settings-content">
          <div class="setting-group">
            <label class="setting-label">背景地址</label>
            <input type="text" class="setting-input" v-model="backgroundUrl" placeholder="输入背景图片URL">
          </div>
          <div class="background-actions">
            <button class="upload-btn">
              <font-awesome-icon icon="cloud-upload-alt" /> 上传背景
            </button>
            <button class="save-btn" @click="closeAllPanels">
              <font-awesome-icon icon="save" /> 保存背景
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'UserPanel',
  setup() {
    const router = useRouter()

    let heartInterval = null
    const initFloatingHearts = () => {
      const container = document.querySelector('.floating-hearts');
      if (!container) return;
      let heartCount = 0;
      const createHeart = () => {
        if (heartCount >= 4) return;
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.style.left = Math.random() * 100 + 'vw';
        const size = 10 + Math.random() * 8;
        heart.style.width = heart.style.height = size + 'px';
        heart.style.opacity = 0.5 + Math.random() * 0.25;
        heart.style.animation = `floatUp ${9 + Math.random() * 4}s ease-in-out forwards`;
        heart.style.willChange = 'transform, opacity';
        container.appendChild(heart);
        heartCount++;
        setTimeout(() => { heart.remove(); heartCount--; }, 14000);
      };
      return setInterval(createHeart, 3200);
    }

    const backgroundImage = require('@/assets/img/用户面板默认背景.jpg')
    const userAvatar = ref(require('@/assets/img/用户面板默认头像.jpg'))
    const mascotImage = require('@/assets/img/网站logo.png')
    const mascotImageWithHeart = require('@/assets/img/透明背景爱心.png')
    
    const userInfo = reactive({
      username: '未登录用户',
      id: '---',
      email: '',
      age: '未知',
      gender: '未知',
      createdAt: '---',
      uid: '---',
      group: '',
      description: ''
    })
    
    const tabs = ref([
      { id: 'history', name: '历史文章' },
      { id: 'test', name: '测试数据' },
      { id: 'feedback', name: '留言记录' },
      { id: 'report', name: '反馈信息' }
    ])
    
    const activeTab = ref('history')
    
    // 面板状态管理
    const showAccountSettings = ref(false)
    const showBackgroundSettings = ref(false)
    const backgroundUrl = ref('')
    
    // 加载状态
    const loading = ref(true)
    
    // 个性签名功能
    const greetings = [
      '也只有摔倒在地，无人扶起的时候，愚者才能领悟如何站起。',
      '答案并不重要，重要的是你已作出决定。',
      '庸人只得学着独立行走，在跌倒爬起中度过碌碌一生。',
      '历史或许不会留下逝者的名字，但群星会见证他们的足迹。',
      '在长夜中到来的第一束光，往往无法照亮什么，因为它转瞬即逝，而黑夜太过漫长。',
      '小杰是大帅哥！网站作者太帅了！'
    ]
    const currentSignature = ref('默认帅气的简介词送给每位小可爱~点击一下我有惊喜')
    
    const changeSignature = () => {
      const randomIndex = Math.floor(Math.random() * greetings.length)
      currentSignature.value = greetings[randomIndex]
    }
    
    const goBack = () => {
      router.back()
    }
    
    // 切换面板显示状态
    const toggleAccountSettings = () => {
      showAccountSettings.value = !showAccountSettings.value
      showBackgroundSettings.value = false
    }
    
    const toggleBackgroundSettings = () => {
      showBackgroundSettings.value = !showBackgroundSettings.value
      showAccountSettings.value = false
    }
    
    // 关闭所有面板
    const closeAllPanels = () => {
      showAccountSettings.value = false
      showBackgroundSettings.value = false
    }
    
    const API_BASE_URL = 'https://api.banana404.top'
    
    // 退出账号功能
    const logout = async () => {
      try {
        await fetch(`${API_BASE_URL}/api/v1/user/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        localStorage.removeItem('realUserInfo')
        
        // 清除跨子域cookie
        document.cookie = 'forestwhisper=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.hkmre.top;';
        
        router.push('/login')
      } catch (error) {
        console.error('退出账号失败:', error)
      }
    }
    
    // 获取用户信息函数
    const fetchUserInfo = async () => {
      loading.value = true
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/user/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        const data = await response.json()
        
        if (data.code === 401 || data.code === 233) {
          // 清除本地存储和cookie
          localStorage.removeItem('realUserInfo')
          document.cookie = 'forestwhisper=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          // 跳转到登录页面
          router.push('/login')
        } else if (data.code === 200) {
          userInfo.username = data.data.name || '未知用户'
          userInfo.id = data.data.uid || '---'
          userInfo.uid = data.data.uid || '---'
          userInfo.email = data.data.email || ''
          
          localStorage.setItem('realUserInfo', JSON.stringify(data.data))
        } else {
          console.error('获取用户信息失败:', data.msg)
          alert('无法连接到服务器，请检查网络连接或稍后再试。')
        }
      } catch (error) {
        console.error('获取用户信息出错:', error)
        alert('无法连接到服务器，请检查网络连接或稍后再试。')
      } finally {
        loading.value = false
      }
    }
    
    // 更新用户信息函数
    const updateUserInfo = async () => {
      try {
        const updateData = {
          name: userInfo.username,
          gender: userInfo.gender,
          bio: userInfo.description
        }
        
        const response = await fetch(`${API_BASE_URL}/api/v1/user/me/update`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        })
        
        const data = await response.json()
        
        if (data.code === 200) {
          localStorage.setItem('realUserInfo', JSON.stringify(userInfo))
          closeAllPanels()
          alert('用户信息更新成功！')
        } else {
          alert('更新用户信息失败: ' + (data.msg || '未知错误'))
        }
      } catch (error) {
        console.error('更新用户信息出错:', error)
        alert('更新用户信息出错，请检查网络连接')
      }
    }
    
    // 组件加载时自动获取用户信息
    onMounted(() => {
      fetchUserInfo()
      heartInterval = initFloatingHearts()
    })

    onUnmounted(() => {
      if (heartInterval) clearInterval(heartInterval)
    })
    
    return {
      backgroundImage,
      userAvatar,
      mascotImage,
      mascotImageWithHeart,
      userInfo,
      tabs,
      activeTab,
      goBack,
      showAccountSettings,
      showBackgroundSettings,
      backgroundUrl,
      currentSignature,
      toggleAccountSettings,
      toggleBackgroundSettings,
      closeAllPanels,
      logout,
      updateUserInfo,
      changeSignature,
      loading
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.user-panel {
  min-height: 100vh;
  background: #faf4f1;
  font-family: 'YouSheShaYuFeiTe', Arial, sans-serif;
  position: relative;
  overflow: hidden;
}

/* 云朵装饰（纯 CSS 造型） */
.user-panel::before,
.user-panel::after {
  content: '';
  position: absolute;
  width: 96px;
  height: 30px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(233, 243, 255, 0.7));
  filter: drop-shadow(0 8px 16px rgba(43, 113, 234, 0.10));
  pointer-events: none;
  z-index: 1;
  animation: drift 22s ease-in-out infinite;
}

.user-panel::before {
  top: 60px;
  left: 40px;
  opacity: 0.8;
}

.user-panel::after {
  top: 120px;
  right: 60px;
  opacity: 0.6;
  transform: scale(1.3);
  animation-duration: 28s;
  animation-direction: reverse;
}

@keyframes drift {
  0%, 100% { translate: 0 0; }
  50% { translate: 30px -15px; }
}

/* 加载动画 */
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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
  border-top: 3px solid #2b71ea;
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
  color: #2b71ea;
  font-weight: 500;
}

.panel-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.user-background-section {
  width: 100%;
  height: 300px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.function-buttons {
  position: absolute;
  top: 20px;
  right: 30px;
  display: flex;
  gap: 10px;
}

.function-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.9);
  color: #2b71ea;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.function-btn:hover {
  background: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(43, 113, 234, 0.25);
}

.user-info-section {
  display: flex;
  height: 150px;
  align-items: flex-start;
  margin-top: -60px;
  padding: 0 30px;
  position: relative;
  justify-content: space-between;
  background-color: rgb(255, 255, 255);
  margin-bottom: 40px;
  border-radius: 15px;
}

.avatar-container {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  border: 4px solid #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background: #fff;
  flex-shrink: 0;
  margin-top: -50px;

}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  padding-bottom: 10px;
  margin: 0px 10px;
}

.username {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.user-identity {
  font-size: 16px;
  color: #666;
  display: flex;
  background: #ffffffe5;
  align-items: center;
  border-radius: 12px;
  /*阴影 */
  box-shadow: 0 4px 15px rgb(0 0 0 / 39%); 
  gap: 5px;
  padding: 5px;
}

.user-meta-section {
  padding: 20px 30px;
  display: flex;
  gap: 30px;
  font-size: 14px;
  color: #666;
}

.signature-section {
  background: linear-gradient(135deg, rgba(43, 113, 234, 0.08) 0%, rgba(255, 107, 129, 0.08) 100%);
  border-radius: 20px;
  padding: 10px 0;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.signature-section:hover {
  background: linear-gradient(135deg, rgba(43, 113, 234, 0.15) 0%, rgba(255, 107, 129, 0.15) 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(43, 113, 234, 0.15);
}

.signature-label {
  text-align: center;
  font-size: 20px;
  color: rgba(51, 51, 51, 0.5);
  font-weight: 800;
  margin: 5px 0;
  transition: all 0.3s ease;
}

.signature-section:hover .signature-label {
  color: #2b71ea;
}

.signature-text {
  text-align: center;
  font-size: 20px;
  color: rgba(51, 51, 51, 0.5);
  font-weight: 800;
  margin: 5px 0;
  transition: all 0.3s ease;
}

.signature-section:hover .signature-text {
  color: #2b71ea;
}

.tabs-navigation {
  display: flex;
  gap: 40px;
  padding: 0 30px;
  border-bottom: 2px solid #e0e0e0;
  background: #fff;
  border-radius: 15px;
}

.tab-item {
  padding: 20px 0;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.3s ease;
}

.tab-item:hover {
  color: #2b71ea;
}

.tab-item.active {
  color: #2b71ea;
  border-bottom-color: #2b71ea;
}

.content-area {
  display: flex;
  gap: 20px;
  padding: 30px 0px;
  background: #faf4f1;
  border-radius: 0 0 12px 12px;
}

.content-card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(43, 113, 234, 0.2);
}

.main-card {
  flex: 2;
  min-height: 350px;
}

.side-card {
  flex: 1;
}

.card-title {
  padding: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.card-content {
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 280px;
}

.mascot-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.mascot-image.heart-version {
  width: 100px;
  height: 100px;
}

.empty-message {
  font-size: 14px;
  color: #666;
  text-align: center;
  line-height: 1.6;
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: #fff;
  color: #2b71ea;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 100;
}

.back-btn:hover {
  background: #2b71ea;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(43, 113, 234, 0.3);
}

@media (max-width: 992px) {
  .content-area {
    flex-direction: column;
  }
  
  .user-info-section {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 20px;
  }
  
  .user-meta-section {
    flex-wrap: wrap;
    padding: 15px 20px;
  }
  
  .tabs-navigation {
    margin: 0 20px;
    padding: 0 20px;
    gap: 20px;
  }
  
  .content-area {
    margin: 0 20px 20px;
    padding: 20px;
  }
  
  .user-background-section {
    height: 250px;
  }
}

@media (max-width: 768px) {
  .panel-container {
    padding: 15px;
  }
  
  .user-background-section {
    height: 200px;
    border-radius: 8px;
  }
  
  .function-buttons {
    top: 15px;
    right: 15px;
  }
  
  .function-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .avatar-container {
    width: 100px;
    height: 100px;
    margin-top: -50px;
  }
  
  .user-info-section {
    padding: 0 20px;
    margin-top: -50px;
  }
  
  .username {
    font-size: 24px;
  }
  
  .tabs-navigation {
    overflow-x: auto;
    white-space: nowrap;
    padding: 0 15px;
  }
  
  .tab-item {
    padding: 18px 0;
    font-size: 14px;
  }
  
  .content-area {
    margin: 0 15px 15px;
    padding: 15px;
  }
  
  .main-card {
    min-height: 300px;
  }
  
  .card-content {
    padding: 30px 20px;
  }
  
  .mascot-image {
    width: 120px;
    height: 120px;
  }
  
  .mascot-image.heart-version {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .function-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .user-meta-section {
    gap: 15px;
    font-size: 13px;
  }
  
  .avatar-container {
    width: 80px;
    height: 80px;
  }
  
  .username {
    font-size: 20px;
  }
  
  .user-identity {
    font-size: 14px;
  }
}

/* 设置面板样式 */
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.settings-panel {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

.settings-panel.background-panel {
  max-width: 400px;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.settings-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.settings-content {
  padding: 20px;
}

.setting-group {
  margin-bottom: 25px;
}

.setting-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.setting-input, .setting-select, .setting-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.setting-input:focus, .setting-select:focus, .setting-textarea:focus {
  outline: none;
  border-color: #2b71ea;
  box-shadow: 0 0 0 2px rgba(43, 113, 234, 0.1);
}

/* 文本区域额外样式 */
.setting-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 头像设置样式 */
.avatar-setting {
  display: flex;
  align-items: center;
  gap: 20px;
}

.setting-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;
}

.upload-btn {
  background: #2b71ea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: #1a5fc7;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(43, 113, 234, 0.35);
}

/* 退出按钮样式 */
.logout-group {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.logout-btn {
  width: 100%;
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 12px;
  margin: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #ff5252;
  transform: translateY(-1px);
}

/* 背景设置面板样式 */
.background-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.background-actions .upload-btn, .background-actions .save-btn {
  flex: 1;
  padding: 10px;
  font-size: 14px;
}

.save-btn {
  background: linear-gradient(135deg, #2b71ea 0%, #43B0FA 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(43, 113, 234, 0.4);
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 漂浮爱心动画 */
.floating-hearts {
  position: fixed;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.floating-heart {
  position: fixed;
  bottom: -50px;
  width: 20px;
  height: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff9776'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") no-repeat center/contain;
  pointer-events: none;
  z-index: 9999;
}

@keyframes floatUp {
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
}
</style>
