<template>
  <div class="feedback-page">
    <!-- 漂浮爱心动画 -->
    <div class="floating-hearts"></div>

    <!-- 云朵装饰 -->
    <div class="cloud-decoration cloud-top-left"></div>
    <div class="cloud-decoration cloud-bottom-right"></div>
    <div class="cloud-decoration cloud-star-1"></div>
    <div class="cloud-decoration cloud-star-2"></div>

    <!-- 返回按钮 -->
    <button class="back-button" @click="goBack">
      <font-awesome-icon icon="fa-solid fa-arrow-left"></font-awesome-icon> 返回
    </button>

    <!-- 标题 -->
    <h1 class="feedback-title">你有什么好的建议或想法吗？</h1>

    <!-- 反馈按钮 -->
    <button class="feedback-btn" @click="showFeedbackModal = true">
      <font-awesome-icon icon="fa-solid fa-pen-to-square"></font-awesome-icon> 点击反馈
    </button>

    <!-- 收件箱 -->
    <div class="inbox-section">
      <h2 class="inbox-title">
        <font-awesome-icon icon="fa-solid fa-inbox"></font-awesome-icon> 收件箱
      </h2>

      <!-- 搜索框 -->
      <div class="search-container">
        <input 
          v-model="searchQuery" 
          class="search-input" 
          placeholder="搜索反馈内容..." 
          type="text"
        />
      </div>

      <!-- 反馈列表 -->
      <div class="feedback-list">
        <div class="feedback-item" v-for="feedback in paginatedFeedbacks" :key="feedback.id">
          <div class="feedback-header">
            <span class="username">{{ feedback.username }}</span>
            <span :class="['status', feedback.status]">{{ feedback.status === 'pending' ? '未处理' : '已处理' }}</span>
          </div>
          <div class="feedback-content">
            <span class="content-label">示例文本：</span>
            <span class="content-text">{{ feedback.content }}</span>
          </div>
          <div class="feedback-footer">
            <div class="rating">
              <font-awesome-icon 
                v-for="star in 5" 
                :key="star" 
                :icon="faStar" 
                :class="{'filled': star <= feedback.rating}"
              ></font-awesome-icon>
            </div>
            <button class="view-btn" @click="openDetailModal(feedback)">
              <font-awesome-icon icon="fa-solid fa-eye"></font-awesome-icon> 点击查看
            </button>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <div class="data-button">
          <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">
            <font-awesome-icon icon="fa-solid fa-chevron-left" />
            <span>上一页</span>
          </button>
          <div class="page-container">
            <div 
              v-for="page in totalPages" 
              :key="page" 
              class="box"
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
            >
              <span class="box-number">{{ page }}</span>
            </div>
          </div>
          <button class="page-btn2" @click="nextPage" :disabled="currentPage === totalPages">
            <span>下一页</span>
            <font-awesome-icon icon="fa-solid fa-chevron-right" />
          </button>
        </div>
      </div>
    </div>

    <!-- 反馈弹窗 -->
    <div class="modal-overlay" v-if="showFeedbackModal" @click="closeModal">
      <div class="feedback-modal" @click.stop>
        <h3 class="modal-title">你有什么好的建议或想法吗？</h3>
        
        <!-- 用户名输入框 -->
        <input 
          v-model="feedbackUsername" 
          class="username-input" 
          placeholder="请输入您的姓名（可选）"
        />
        
        <!-- 星级评分 -->
        <div class="rating-container">
          <font-awesome-icon 
            v-for="star in 5" 
            :key="star" 
            :icon="faStar" 
            :class="{'filled': star <= selectedRating}"
            @click="selectedRating = star"
            class="rating-star"
          ></font-awesome-icon>
        </div>
        
        <!-- 反馈输入框 -->
        <textarea 
          v-model="feedbackContent" 
          class="feedback-input" 
          placeholder="请输入您的反馈建议或想法..."
        ></textarea>
        
        <!-- 提交按钮 -->
        <button class="submit-btn" @click="submitFeedback">
          <font-awesome-icon icon="fa-solid fa-paper-plane"></font-awesome-icon> 提交反馈
        </button>
      </div>
    </div>

    <!-- 详细信息弹窗 -->
    <div class="modal-overlay" v-if="showDetailModal" @click="closeDetailModal">
      <div class="detail-modal" @click.stop>
        <!-- 关闭按钮 -->
        <button class="close-btn" @click="closeDetailModal">
          <font-awesome-icon icon="fa-solid fa-times"></font-awesome-icon>
        </button>
        
        <!-- 反馈信息标题 -->
        <h3 class="detail-title">反馈信息</h3>
        
        <!-- 反馈状态 -->
        <div class="detail-status">
          <span :class="['status-badge', selectedFeedback?.status]">
            {{ selectedFeedback?.status === 'pending' ? '未处理' : '已处理' }}
          </span>
        </div>
        
        <!-- 用户名 -->
        <div class="detail-item">
          <span class="detail-label">用户姓名</span>
          <span class="detail-value">{{ selectedFeedback?.username }}</span>
        </div>
        
        <!-- 评分 -->
        <div class="detail-item">
          <span class="detail-label">评分</span>
          <div class="detail-rating">
            <font-awesome-icon 
              v-for="star in 5" 
              :key="star" 
              :icon="faStar" 
              :class="{'filled': star <= selectedFeedback?.rating}"
            ></font-awesome-icon>
          </div>
        </div>
        
        <!-- 反馈内容 -->
        <div class="detail-item">
          <span class="detail-label">示例文本：</span>
          <div class="detail-content">
            {{ selectedFeedback?.content }}
            {{ selectedFeedback?.content }}
            {{ selectedFeedback?.content }}
          </div>
        </div>
        
        <!-- 提交时间 -->
        <div class="detail-item">
          <span class="detail-label">提交时间：</span>
          <span class="detail-value">{{ selectedFeedback?.submittedAt || '2024-01-15 14:30' }}</span>
        </div>
        
        <!-- 状态更新按钮 -->
        <div class="status-action">
          <button 
            :class="['status-btn', selectedFeedback?.status]" 
            @click="toggleFeedbackStatus(selectedFeedback)"
          >
            {{ selectedFeedback?.status === 'pending' ? '标记为已处理' : '标记为未处理' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
// eslint-disable-next-line no-unused-vars
import { faArrowLeft, faPenToSquare, faInbox, faStar, faEye, faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';

const router = useRouter();

// 返回上一页
const goBack = () => {
  router.go(-1);
};

// 本地存储键名
const STORAGE_KEY = 'feedback_data';

// 反馈数据
const feedbacks = ref([]);

// 搜索查询
const searchQuery = ref('');

// 从本地存储加载反馈数据
const loadFeedbacks = () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      feedbacks.value = JSON.parse(storedData);
    } else {
      // 如果没有数据，初始化一些示例数据
      feedbacks.value = [
        { id: 1, username: '用户姓名', status: 'pending', content: 'ASDFGHJKLLQWERTYUIOPI', rating: 4, submittedAt: '2024-01-15 14:30' },
        { id: 2, username: '匿名', status: 'processed', content: 'ASDFGHJKLLQWERTYUIOPI', rating: 3, submittedAt: '2024-01-16 10:20' },
        { id: 3, username: '张三', status: 'pending', content: '这是一个测试反馈内容，用于测试分页功能。', rating: 5, submittedAt: '2024-01-17 09:15' },
        { id: 4, username: '李四', status: 'processed', content: '反馈系统的用户体验还可以进一步优化。', rating: 2, submittedAt: '2024-01-18 15:45' },
        { id: 5, username: '王五', status: 'pending', content: '希望能够增加更多的反馈类型和分类。', rating: 4, submittedAt: '2024-01-19 11:20' },
        { id: 6, username: '赵六', status: 'processed', content: '这个反馈系统非常好用，感谢开发团队！', rating: 5, submittedAt: '2024-01-20 14:30' },
        { id: 7, username: '匿名', status: 'pending', content: '建议增加数据导出功能，方便统计分析。', rating: 3, submittedAt: '2024-01-21 10:15' },
        { id: 8, username: '钱七', status: 'processed', content: '界面设计简洁美观，操作流畅。', rating: 4, submittedAt: '2024-01-22 16:40' },
        { id: 9, username: '孙八', status: 'pending', content: '希望能够增加通知提醒功能。', rating: 3, submittedAt: '2024-01-23 09:50' },
        { id: 10, username: '周九', status: 'processed', content: '反馈提交后希望能够看到提交成功的提示。', rating: 5, submittedAt: '2024-01-24 13:25' },
        { id: 11, username: '吴十', status: 'pending', content: '建议增加图片上传功能，方便反馈问题。', rating: 2, submittedAt: '2024-01-25 11:10' }
      ];
      // 保存到本地存储
      saveFeedbacks();
    }
  } catch (error) {
    console.error('加载反馈数据失败:', error);
    feedbacks.value = [];
  }
};

// 保存反馈数据到本地存储
const saveFeedbacks = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks.value));
  } catch (error) {
    console.error('保存反馈数据失败:', error);
  }
};

// 监听反馈数据变化，自动保存到本地存储
watch(feedbacks, () => {
  saveFeedbacks();
}, { deep: true });

// 组件挂载时加载数据
let heartInterval = null;
onMounted(() => {
  loadFeedbacks();
  // 漂浮爱心动画初始化
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
  };
  heartInterval = initFloatingHearts();
});

onUnmounted(() => {
  if (heartInterval) clearInterval(heartInterval);
});

// 反馈弹窗相关状态
const showFeedbackModal = ref(false);
const selectedRating = ref(0);
const feedbackContent = ref('');
const feedbackUsername = ref('');

// 关闭反馈弹窗
const closeModal = () => {
  showFeedbackModal.value = false;
  // 重置表单
  selectedRating.value = 0;
  feedbackContent.value = '';
  feedbackUsername.value = '';
};

// 提交反馈
const submitFeedback = () => {
  // 验证表单
  if (!feedbackContent.value.trim()) {
    alert('请输入反馈内容');
    return;
  }
  
  // 创建新反馈
  const newFeedback = {
    id: Date.now(), // 使用时间戳作为唯一ID
    username: feedbackUsername.value.trim() || '匿名',
    status: 'pending',
    content: feedbackContent.value.trim(),
    rating: selectedRating.value,
    submittedAt: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  // 添加到反馈列表
  feedbacks.value.unshift(newFeedback);
  
  // 关闭弹窗
  closeModal();
};

// 详情弹窗相关状态
const showDetailModal = ref(false);
const selectedFeedback = ref(null);

// 打开详情弹窗
const openDetailModal = (feedback) => {
  selectedFeedback.value = feedback;
  showDetailModal.value = true;
};

// 关闭详情弹窗
const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedFeedback.value = null;
};

// 切换反馈状态
const toggleFeedbackStatus = (feedback) => {
  if (!feedback) return;
  
  // 更新状态
  feedback.status = feedback.status === 'pending' ? 'processed' : 'pending';
  
  // 保存到本地存储
  saveFeedbacks();
};

// 分页相关状态
const currentPage = ref(1);
const itemsPerPage = ref(3);

// 计算搜索过滤后的反馈数据
const filteredFeedbacks = computed(() => {
  if (!searchQuery.value) {
    return feedbacks.value;
  }
  const query = searchQuery.value.toLowerCase();
  return feedbacks.value.filter(feedback => 
    feedback.content.toLowerCase().includes(query) ||
    feedback.username.toLowerCase().includes(query)
  );
});

// 计算总页数（基于搜索结果）
const totalPages = computed(() => {
  return Math.ceil(filteredFeedbacks.value.length / itemsPerPage.value);
});

// 计算当前页显示的反馈数据（基于搜索结果）
const paginatedFeedbacks = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredFeedbacks.value.slice(startIndex, endIndex);
});

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// 跳转到指定页
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// 监听总页数变化，如果当前页超过总页数，跳转到最后一页
watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal && newTotal > 0) {
    currentPage.value = newTotal;
  } else if (newTotal === 0) {
    currentPage.value = 1;
  }
});

// 监听搜索查询变化，重置到第一页
watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
/* 基础样式 */
.feedback-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'YouSheShaYuFeiTe', Arial, sans-serif;
  background-color: var(--background-color);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 漂浮爱心动画 */
.floating-hearts {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
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

/* 云朵装饰（纯 CSS 造型） */
.cloud-decoration {
  position: fixed;
  pointer-events: none;
  z-index: 1;
  user-select: none;
}

.cloud-top-left,
.cloud-bottom-right {
  width: 96px;
  height: 30px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(233, 243, 255, 0.7));
  filter: drop-shadow(0 8px 16px rgba(43, 113, 234, 0.10));
}

.cloud-top-left::before,
.cloud-top-left::after,
.cloud-bottom-right::before,
.cloud-bottom-right::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: inherit;
}

.cloud-top-left::before,
.cloud-bottom-right::before {
  width: 40px;
  height: 40px;
  top: -20px;
  left: 18px;
}

.cloud-top-left::after,
.cloud-bottom-right::after {
  width: 28px;
  height: 28px;
  top: -14px;
  right: 20px;
}

.cloud-top-left {
  top: 60px;
  left: 30px;
  opacity: 0.8;
  animation: floatCloud 10s ease-in-out infinite;
}

.cloud-bottom-right {
  bottom: 40px;
  right: 30px;
  opacity: 0.65;
  transform: scale(1.3);
  animation: floatCloud 13s ease-in-out infinite reverse;
}

/* 微光点缀 */
.cloud-star-1 {
  top: 120px;
  right: 50px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 193, 7, 0.85) 0%, rgba(255, 193, 7, 0) 70%);
  animation: twinkle 3.4s ease-in-out infinite;
}

.cloud-star-2 {
  bottom: 200px;
  left: 40px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 151, 118, 0.8) 0%, rgba(255, 151, 118, 0) 70%);
  animation: twinkle 2.8s ease-in-out infinite 0.6s;
}

@keyframes floatCloud {
  0%, 100% { translate: 0 0; }
  50% { translate: 10px -15px; }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.35; transform: scale(0.9); }
  50% { opacity: 0.9; transform: scale(1.15); }
}

/* 返回按钮 */
.back-button {
  background-color: var(--white);
  border: 2px solid #2b71ea;
  border-radius: 25px;
  padding: 8px 16px;
  font-size: 14px;
  color: #2b71ea;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 标题 */
.feedback-title {
  font-size: 24px;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 40px;
  font-weight: bold;
  position: relative;
}

.feedback-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  margin: 8px auto 0;
  background: linear-gradient(90deg, #2b71ea, #43B0FA, #ff9776);
  border-radius: 2px;
}

/* 反馈按钮 */
.feedback-btn {
  display: block;
  margin: 0 auto 40px;
  background: linear-gradient(135deg, #2b71ea 0%, #43B0FA 100%);
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(43, 113, 234, 0.3);
}

/* 收件箱 */
.inbox-section {
  margin-top: 40px;
}

.inbox-title {
  font-size: 20px;
  color: var(--text-color);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.inbox-title :deep(.fa-solid) {
  color: #2b71ea;
}

/* 搜索容器 */
.search-container {
  margin-bottom: 20px;
  width: 100%;
}

/* 搜索输入框 */
.search-input {
  width: 100%;
  height: 45px;
  border: 1px solid var(--border-color);
  border-radius: 25px;
  padding: 10px 15px;
  font-size: 14px;
  color: var(--text-color);
  font-family: 'YouSheShaYuFeiTe', Arial, sans-serif;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #2b71ea;
  box-shadow: 0 0 0 3px rgba(43, 113, 234, 0.1);
  transform: translateY(-1px);
}

/* 反馈列表 */
.feedback-list {
  margin-bottom: 30px;
}

.feedback-item {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 15px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.username {
  font-weight: bold;
  color: #333;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status.pending {
  background-color: #ffebee;
  color: #ff6b81;
}

.status.processed {
  background-color: #e8f5e8;
  color: #4a90e2;
}

.feedback-content {
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.content-label {
  font-weight: bold;
}

.feedback-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 星级评分 */
.rating {
  display: flex;
  gap: 4px;
}

/* 查看按钮 */
.view-btn {
  background-color: transparent;
  border: none;
  color: #2b71ea;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
}

.total-pages {
  font-size: 14px;
  color: #666;
  margin-right: 10px;
}

/* 数据按钮样式 */
.data-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.page-btn, .page-btn2 {
  background-color: var(--white);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 16px;
  color: var(--text-color);
  font-size: 14px;
  font-weight: normal;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
}

.page-btn:hover, .page-btn2:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(43, 113, 234, 0.2);
}

.page-btn:active, .page-btn2:active {
  transform: translateY(0) scale(0.98);
}

.page-btn:disabled, .page-btn2:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:disabled:hover, .page-btn2:disabled:hover {
  background-color: var(--white);
  color: var(--text-color);
  border-color: var(--border-color);
  transform: none;
  box-shadow: none;
}

.page-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.box {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: normal;
  color: var(--text-color);
  background-color: var(--white);
  width: 28px;
  height: 28px;
}

.box:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(43, 113, 234, 0.2);
}

.box.active {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #2b71ea 0%, #43B0FA 100%);
  border-color: #2b71ea;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(43, 113, 234, 0.3);
}

.box-number {
  font-size: 16px;
}

/* Font Awesome 通用样式 */
:deep(.fa-solid) {
  color: #5ea6e5;
}

/* 分页按钮图标颜色 */
.page-btn .fa-solid,
.page-btn2 .fa-solid {
  color: var(--text-color);
  transition: color 0.3s ease;
}

.page-btn:hover .fa-solid,
.page-btn2:hover .fa-solid {
  color: var(--primary-color);
}

.page-btn:disabled .fa-solid,
.page-btn2:disabled .fa-solid {
  color: var(--text-color);
  opacity: 0.5;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease both;
}

.feedback-modal {
  background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%);
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 30px rgba(43, 113, 234, 0.15);
  animation: scaleIn 0.3s ease both;
}

.modal-title {
  font-size: 20px;
  color: #333;
  text-align: center;
  margin-bottom: 25px;
  font-weight: bold;
}

/* 用户名输入框 */
.username-input {
  width: 100%;
  height: 45px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 14px;
  color: #333;
  margin-bottom: 25px;
  font-family: Arial, sans-serif;
  transition: all 0.3s ease;
}

.username-input:focus {
  outline: none;
  border-color: #2b71ea;
  box-shadow: 0 0 0 3px rgba(43, 113, 234, 0.1);
  transform: translateY(-1px);
}

/* 弹窗星级评分 */
.rating-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
}

/* 反馈输入框 */
.feedback-input {
  width: 100%;
  height: 150px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  font-size: 14px;
  color: #333;
  resize: none;
  margin-bottom: 25px;
  font-family: Arial, sans-serif;
}

/* 提交按钮 */
.submit-btn {
  display: block;
  width: 100%;
  background: linear-gradient(135deg, #2b71ea 0%, #43B0FA 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(43, 113, 234, 0.3);
}

/* 详细信息弹窗样式 */
.detail-modal {
  background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%);
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 8px 30px rgba(43, 113, 234, 0.15);
  position: relative;
  animation: scaleIn 0.3s ease both;
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: transparent;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

/* 详情标题 */
.detail-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
}

/* 状态标签 */
.detail-status {
  margin-bottom: 20px;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-badge.pending {
  background-color: #ffebee;
  color: #ff6b81;
}

.status-badge.processed {
  background-color: #e8f5e8;
  color: #4a90e2;
}

/* 详情项 */
.detail-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

/* 详情标签 */
.detail-label {
  display: block;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

/* 详情值 */
.detail-value {
  color: #666;
  font-size: 14px;
}

/* 详情评分 */
.detail-rating {
  display: flex;
  gap: 5px;
}

/* 详情内容 */
.detail-content {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

/* 状态更新按钮 */
.status-action {
  margin-top: 25px;
  text-align: center;
}

.status-btn {
  background-color: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
}

.status-btn.pending {
  background-color: #ffebee;
  border-color: #ff6b81;
  color: #ff6b81;
}

.status-btn.processed {
  background-color: #e8f5e8;
  border-color: #4a90e2;
  color: #4a90e2;
}

.status-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 添加CSS动画 */
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* 页面元素入场动画 */
.back-button {
  animation: fadeInUp 0.5s ease-out 0.1s both;
}

.feedback-title {
  animation: fadeInUp 0.5s ease-out 0.2s both;
}

.feedback-btn {
  animation: fadeInUp 0.5s ease-out 0.3s both;
}

.inbox-section {
  animation: fadeInUp 0.5s ease-out 0.4s both;
}

/* 反馈列表项动画 */
.feedback-item {
  animation: fadeInUp 0.5s ease-out both;
}

.feedback-item:nth-child(1) { animation-delay: 0.5s; }
.feedback-item:nth-child(2) { animation-delay: 0.6s; }
.feedback-item:nth-child(3) { animation-delay: 0.7s; }
.feedback-item:nth-child(4) { animation-delay: 0.8s; }
.feedback-item:nth-child(5) { animation-delay: 0.9s; }

/* 按钮交互动画增强 */
.back-button:hover {
  background-color: #f5f5f5;
  border-color: #2b71ea;
  color: #2b71ea;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(43, 113, 234, 0.2);
}

.feedback-btn:hover {
  background: linear-gradient(135deg, #43B0FA 0%, #2b71ea 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(43, 113, 234, 0.4);
}

.view-btn:hover {
  background-color: #e3f0ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(43, 113, 234, 0.2);
}

.submit-btn:hover {
  background: linear-gradient(135deg, #43B0FA 0%, #2b71ea 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(43, 113, 234, 0.4);
}

.close-btn:hover {
  color: #666;
  background-color: #f5f5f5;
  transform: rotate(90deg);
}

/* 星级评分动画增强 */
.rating :deep(.fa-star),
.detail-rating :deep(.fa-star) {
  color: #e0e0e0;
  font-size: 14px;
  transition: color 0.3s ease, transform 0.2s ease;
}

.detail-rating :deep(.fa-star) {
  font-size: 16px;
}

.rating :deep(.fa-star.filled),
.detail-rating :deep(.fa-star.filled) {
  color: #ffc107;
  animation: pulse 0.6s ease;
}

.rating-star {
  font-size: 24px;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rating-star:hover,
.rating-star.filled {
  color: #ffc107;
  transform: scale(1.2);
  animation: pulse 0.5s ease;
}

/* 反馈列表项悬停动画 */
.feedback-item:hover {
  box-shadow: 0 8px 25px rgba(43, 113, 234, 0.15);
  transform: translateY(-2px);
}

/* 输入框聚焦动画 */
.feedback-input:focus {
  outline: none;
  border-color: #2b71ea;
  box-shadow: 0 0 0 3px rgba(43, 113, 234, 0.1);
  transform: translateY(-1px);
}

/* 分页按钮动画 */
.page-btn:hover {
  border-color: #2b71ea;
  color: #2b71ea;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(43, 113, 234, 0.2);
}

.page-btn.active {
  background: linear-gradient(135deg, #2b71ea 0%, #43B0FA 100%);
  border-color: #2b71ea;
  color: #fff;
  box-shadow: 0 2px 8px rgba(43, 113, 234, 0.3);
}

/* Font Awesome 特定元素样式 */
.submit-btn :deep(.fa-solid) {
  color: #fff;
  font-size: 14px;
}

.close-btn :deep(.fa-solid) {
  color: inherit;
}

.inbox-title :deep(.fa-solid) {
  color: #2b71ea;
}

.back-button :deep(.fa-solid) {
  font-size: 12px;
  color: #2b71ea;
}

.back-button:hover :deep(.fa-solid) {
  color: #2b71ea;
}

.view-btn :deep(.fa-solid) {
  font-size: 12px;
}

.feedback-btn :deep(.fa-solid) {
  font-size: 14px;
  color: #fff;
}

/* 响应式设计 - 平板设备 */
@media (max-width: 1024px) {
  .feedback-page {
    padding: 80px 20px 20px;
  }
  
  .feedback-title {
    font-size: 20px;
  }
  
  .feedback-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
  
  .inbox-title {
    font-size: 18px;
  }
  
  .feedback-item {
    padding: 12px;
  }
  
  .username {
    font-size: 14px;
  }
  
  .content-text {
    font-size: 13px;
  }
  
  .feedback-modal,
  .detail-modal {
    padding: 25px;
    width: 95%;
  }
  
  .modal-title,
  .detail-title {
    font-size: 18px;
  }
}

/* 响应式设计 - 手机设备 */
@media (max-width: 768px) {
  .feedback-page {
    padding: 70px 15px 15px;
  }
  
  .back-button {
    top: 15px;
    left: 15px;
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .feedback-title {
    font-size: 18px;
    margin-bottom: 30px;
  }
  
  .feedback-btn {
    padding: 10px 18px;
    font-size: 13px;
    margin-bottom: 30px;
  }
  
  .inbox-section {
    margin-top: 30px;
  }
  
  .inbox-title {
    font-size: 16px;
    margin-bottom: 15px;
  }
  
  .search-input {
    height: 40px;
    font-size: 13px;
  }
  
  .feedback-item {
    padding: 12px;
    margin-bottom: 12px;
  }
  
  .feedback-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 10px;
  }
  
  .username {
    font-size: 13px;
  }
  
  .status {
    font-size: 11px;
    padding: 3px 8px;
  }
  
  .feedback-content {
    flex-direction: column;
    gap: 5px;
  }
  
  .content-label {
    font-size: 12px;
  }
  
  .content-text {
    font-size: 12px;
  }
  
  .feedback-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .view-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .page-btn, .page-btn2 {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .feedback-modal,
  .detail-modal {
    padding: 20px;
    width: 95%;
    max-width: none;
  }
  
  .modal-title,
  .detail-title {
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .username-input,
  .feedback-input {
    height: 40px;
    font-size: 13px;
    margin-bottom: 15px;
  }
  
  .feedback-input {
    min-height: 100px;
  }
  
  .rating-star {
    font-size: 20px;
  }
  
  .submit-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
  
  .detail-item {
    margin-bottom: 12px;
    padding-bottom: 12px;
  }
  
  .detail-label {
    font-size: 13px;
  }
  
  .detail-value,
  .detail-content {
    font-size: 13px;
  }
  
  .status-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}

/* 响应式设计 - 小屏手机设备 */
@media (max-width: 480px) {
  .feedback-page {
    padding: 60px 10px 10px;
  }
  
  .back-button {
    top: 10px;
    left: 10px;
    padding: 5px 10px;
    font-size: 11px;
  }
  
  .feedback-title {
    font-size: 16px;
    margin-bottom: 25px;
  }
  
  .feedback-btn {
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .inbox-title {
    font-size: 14px;
  }
  
  .search-input {
    height: 38px;
    font-size: 12px;
  }
  
  .feedback-item {
    padding: 10px;
  }
  
  .username {
    font-size: 12px;
  }
  
  .content-text {
    font-size: 11px;
  }
  
  .feedback-modal,
  .detail-modal {
    padding: 15px;
  }
  
  .modal-title,
  .detail-title {
    font-size: 14px;
  }
  
  .username-input,
  .feedback-input {
    height: 38px;
    font-size: 12px;
  }
  
  .rating-star {
    font-size: 18px;
  }
  
  .submit-btn {
    padding: 8px 18px;
    font-size: 13px;
  }
  
  .detail-label,
  .detail-value,
  .detail-content {
    font-size: 12px;
  }
}
</style>