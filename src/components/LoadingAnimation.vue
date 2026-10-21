<template>
  <div id="loading-screen" v-if="isVisible">
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
        <div class="progress-text">{{ loadingText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

// 定义组件属性
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  },
  loadingText: {
    type: String,
    default: '正在加载...'
  },
  autoHide: {
    type: Boolean,
    default: true
  },
  hideDelay: {
    type: Number,
    default: 1500
  }
});

// 定义组件事件
const emit = defineEmits(['update:modelValue', 'hide']);

// 本地可见性状态
const isVisible = ref(props.modelValue);

// 监听外部可见性变化
watch(() => props.modelValue, (newVal) => {
  isVisible.value = newVal;
});

// 监听本地可见性变化，通知父组件
watch(isVisible, (newVal) => {
  emit('update:modelValue', newVal);
  if (!newVal) {
    emit('hide');
  }
});

// 隐藏动画
const hideAnimation = () => {
  isVisible.value = false;
};

// 组件挂载时初始化
onMounted(() => {
  // 如果设置了自动隐藏，监听页面加载事件
  if (props.autoHide) {
    // 页面加载完成后隐藏
    window.addEventListener('load', () => {
      setTimeout(hideAnimation, props.hideDelay);
    });
    
    // 同时考虑DOM内容加载完成的情况
    document.addEventListener('DOMContentLoaded', () => {
      // 如果页面已经加载完成（例如从缓存加载），直接隐藏
      if (document.readyState === 'complete') {
        setTimeout(hideAnimation, props.hideDelay);
      }
    });
  }
});
</script>

<style scoped>
/* 加载动画样式 */
#loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #a2a2a27e;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  gap: 50px;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}

/* 心跳动画 */
.beating-heart {
  position: relative;
  width: 100px;
  height: 100px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff9776'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") no-repeat center/contain;
  animation: heartBeat 1.2s infinite;
  will-change: transform;
}

.beating-heart::before,
.beating-heart::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff6b81'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") no-repeat center/contain;
  animation: orbit 3s linear infinite;
  will-change: transform, opacity;
}

.beating-heart::before {
  top: -30px;
  left: 40px;
  animation-delay: 0s;
}

.beating-heart::after {
  bottom: -30px;
  right: 40px;
  animation-delay: 1.5s;
}

.beating-heart span {
  position: absolute;
  width: 15px;
  height: 15px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2370a1ff'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") no-repeat center/contain;
  animation: orbit 4s linear infinite;
  will-change: transform, opacity;
}

.beating-heart span:nth-child(1) {
  top: 10px;
  left: -25px;
  animation-delay: 0.5s;
}

.beating-heart span:nth-child(2) {
  top: 10px;
  right: -25px;
  animation-delay: 2s;
}

/* ECG进度条 */
.ecg-progress-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}

.ecg-progress {
  width: 350px;
  height: 70px;
  position: relative;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #ff9776;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px rgba(255, 151, 118, 0.3);
  overflow: hidden;
}

.ecg-container {
  width: 300px;
  height: 40px;
  position: relative;
  overflow: hidden;
}

.ecg-wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,151,118,0) 0%, rgba(255,151,118,1) 50%, rgba(255,151,118,0) 100%);
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='40' viewBox='0 0 600 40'%3E%3Cpath d='M0,20 L50,20 L55,5 L60,20 L65,35 L70,20 L120,20 L125,15 L130,20 L135,25 L140,20 L190,20 L195,5 L200,20 L205,35 L210,20 L260,20 L265,15 L270,20 L275,25 L280,20 L330,20 L335,5 L340,20 L345,35 L350,20 L400,20 L405,15 L410,20 L415,25 L420,20 L470,20 L475,5 L480,20 L485,35 L490,20 L540,20 L545,15 L550,20 L555,25 L560,20 L600,20' stroke='white' stroke-width='2' fill='none'/%3E%3C/svg%3E");
  mask-size: 600px 40px;
  mask-repeat: repeat-x;
  animation: ecgWaveMove 1.5s linear infinite;
  will-change: background-position;
}

.ecg-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: #ff9776;
  opacity: 0.6;
  transform: translateY(-50%);
}

.ecg-container span {
  position: absolute;
  width: 3px;
  background: #ff9776;
  opacity: 0.8;
  top: 50%;
  transform: translateY(-50%);
  animation: ecgSpike 1.5s ease-in-out infinite;
  will-change: height, opacity;
}

.ecg-container span:nth-child(1) {
  left: 40px;
  height: 30px;
  animation-delay: 0s;
}

.ecg-container span:nth-child(2) {
  left: 190px;
  height: 30px;
  animation-delay: 0.75s;
}

.ecg-container span:nth-child(3) {
  left: 340px;
  height: 30px;
  animation-delay: 1.5s;
}

.progress-text {
  color: #ff9776;
  font-size: 14px;
  margin-top: 5px;
  letter-spacing: 2px;
  animation: pulse 1.5s ease-in-out infinite;
}

/* 关键帧动画 */
@keyframes heartBeat {
  0% { transform: scale(0.95); }
  5% { transform: scale(1.1); }
  39% { transform: scale(0.85); }
  45% { transform: scale(1); }
  60% { transform: scale(0.95); }
  100% { transform: scale(0.9); }
}

@keyframes orbit {
  0% {
    transform: rotate(0deg) translateY(-30px) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: rotate(180deg) translateY(-30px) rotate(-180deg);
    opacity: 0.5;
  }
  100% {
    transform: rotate(360deg) translateY(-30px) rotate(-360deg);
    opacity: 1;
  }
}

@keyframes ecgWaveMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 200px 0;
  }
}

@keyframes ecgSpike {
  0%, 100% {
    height: 8px;
    opacity: 0.4;
  }
  50% {
    height: 30px;
    opacity: 0.8;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>