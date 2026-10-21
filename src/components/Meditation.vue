<template>
  <div class="meditation-container" :style="backgroundStyle">
    <!-- 漂浮爱心动画容器 -->
    <div class="floating-hearts"></div>

    <!-- 角落装饰元素 -->
    <div class="decoration decoration-cloud-left"></div>
    <div class="decoration decoration-cloud-right"></div>
    <div class="decoration decoration-star-top"></div>
    <div class="decoration decoration-star-bottom"></div>

    <button @click="goBack" class="back-btn">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="back-icon">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <div class="duration-selector" :class="{ 'disabled': isMeditating }">
      <button 
        v-for="duration in durations" 
        :key="duration.value"
        :data-duration="duration.value"
        @click="selectDuration(duration.value)"
        class="duration-btn"
        :class="{ 
          'active': selectedDuration === duration.value
        }"
      >
        {{ duration.label }}
      </button>
    </div>

    <div class="meditation-icon" :class="{ 'breath-animation-active': isMeditating }">
      <img :src="currentIcon" alt="冥想图标" class="icon-image">
    </div>

    <div class="prompt-text">
      {{ promptText }}
    </div>

    <button @click="toggleMeditation" class="meditate-btn">
      {{ isMeditating ? '结束冥想' : '开始冥想' }}
    </button>

    <div v-if="isMeditating" class="countdown">
      剩余: <span>{{ formattedCountdown }}</span>
    </div>

    
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'MeditationPage',
  setup() {
    const router = useRouter()
    const isMeditating = ref(false)
    const selectedDuration = ref(3)
    const countdownInterval = ref(null)
    const totalSeconds = ref(180)
    const currentSeconds = ref(180)
    const promptText = ref('准备好开始冥想了吗？')
    const breathCycle = ref(0)

    const durations = [
      { value: 3, label: '3分钟' },
      { value: 5, label: '5分钟' },
      { value: 10, label: '10分钟' }
    ]



    const currentIcon = computed(() => {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 12) return require('../assets/img/云朵.png')
      else if (hour >= 12 && hour < 18) return require('../assets/img/太阳.png')
      else if (hour >= 18 && hour < 22) return require('../assets/img/月亮.png')
      else return require('../assets/img/星星.png')
    })

    const backgroundStyle = computed(() => {
      const hour = new Date().getHours()
      let gradient = ''

      if (hour >= 5 && hour < 12) {
        // 早晨：粉桃
        gradient = 'linear-gradient(135deg, #fff5f0 0%, #ffe4e6 100%)'
      } else if (hour >= 12 && hour < 18) {
        // 下午：奶油
        gradient = 'linear-gradient(135deg, #fffaf0 0%, #fff5e6 100%)'
      } else if (hour >= 18 && hour < 22) {
        // 傍晚：淡紫粉
        gradient = 'linear-gradient(135deg, #f5f3ff 0%, #faf0ff 100%)'
      } else {
        // 深夜：淡蓝
        gradient = 'linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)'
      }

      return {
        background: gradient
      }
    })

    const formattedCountdown = computed(() => {
      const minutes = Math.floor(currentSeconds.value / 60)
      const seconds = currentSeconds.value % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    })



    function selectDuration(duration) {
      if (isMeditating.value) return
      
      selectedDuration.value = duration
      totalSeconds.value = duration * 60
      currentSeconds.value = totalSeconds.value
    }

    function speakText(text) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'zh-CN'
        utterance.volume = 0.5
        utterance.rate = 0.9
        speechSynthesis.speak(utterance)
      } else {
        promptText.value = text
      }
    }

    function startMeditation() {
      isMeditating.value = true
      breathCycle.value = 0
      currentSeconds.value = totalSeconds.value
      
      speakText('深呼吸，慢慢吸气')
      promptText.value = '深呼吸，慢慢吸气'

      countdownInterval.value = setInterval(() => {
        currentSeconds.value--

        if (currentSeconds.value % 6 === 0) {
          breathCycle.value++
          if (breathCycle.value % 2 === 1) {
            speakText('慢慢吸气')
            promptText.value = '慢慢吸气'
          } else {
            speakText('缓缓呼气')
            promptText.value = '缓缓呼气'
          }
        }

        if (currentSeconds.value <= 0) {
          clearInterval(countdownInterval.value)
          speakText('冥想结束，感觉怎么样？')
          promptText.value = '冥想结束，感觉怎么样？'
          endMeditation()
        }

        if (currentSeconds.value === 10) {
          speakText('冥想即将结束，慢慢回到当下')
          promptText.value = '冥想即将结束，慢慢回到当下'
        }
      }, 1000)
    }

    function endMeditation() {
      isMeditating.value = false
      if (countdownInterval.value) {
        clearInterval(countdownInterval.value)
        countdownInterval.value = null
      }
      promptText.value = '准备好开始冥想了吗？'
    }

    function toggleMeditation() {
      if (isMeditating.value) {
        endMeditation()
      } else {
        startMeditation()
      }
    }

    function goBack() {
      router.back()
    }

    // 漂浮爱心动画初始化
    let heartInterval = null
    function initFloatingHearts() {
      const container = document.querySelector('.floating-hearts')
      if (!container) return
      let heartCount = 0
      const createHeart = () => {
        if (heartCount >= 4) return
        const heart = document.createElement('div')
        heart.className = 'floating-heart'
        heart.style.left = Math.random() * 100 + 'vw'
        const size = 10 + Math.random() * 8
        heart.style.width = heart.style.height = size + 'px'
        heart.style.opacity = 0.5 + Math.random() * 0.25
        heart.style.animation = `floatUp ${9 + Math.random() * 4}s ease-in-out forwards`
        heart.style.willChange = 'transform, opacity'
        container.appendChild(heart)
        heartCount++
        setTimeout(() => { heart.remove(); heartCount-- }, 14000)
      }
      return setInterval(createHeart, 3200)
    }

    onMounted(() => {
      heartInterval = initFloatingHearts()
    })

    onUnmounted(() => {
      if (countdownInterval.value) {
        clearInterval(countdownInterval.value)
      }
      if (heartInterval) {
        clearInterval(heartInterval)
      }
    })

    return {
      isMeditating,
      selectedDuration,
      durations,
      currentIcon,
      promptText,
      formattedCountdown,
      backgroundStyle,
      selectDuration,
      toggleMeditation,
      goBack
    }
  }
}
</script>

<style scoped>
.meditation-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  font-family: 'YouSheShaYuFeiTe', Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

.back-btn {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(43, 113, 234, 0.15);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateX(-3px);
  box-shadow: 0 12px 24px rgba(43, 113, 234, 0.3);
}

.back-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #2b71ea;
}



.duration-selector {
  position: absolute;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(4px);
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  box-shadow: 0 6px 16px rgba(43, 113, 234, 0.12);
  transition: all 0.3s;
  z-index: 10;
}

.duration-selector.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.duration-btn {
  padding: 0.4rem 1.25rem;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.85);
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
}

.duration-btn:hover {
  background: #fff;
  color: #2b71ea;
  box-shadow: 0 6px 14px rgba(43, 113, 234, 0.25);
  transform: translateY(-2px);
}

.duration-btn.active {
  background: linear-gradient(135deg, #2b71ea 0%, #43B0FA 100%);
  color: #fff;
  box-shadow: 0 8px 18px rgba(43, 113, 234, 0.4);
  transform: translateY(-1px);
}

.meditation-icon {
  width: 12rem;
  height: 12.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  animation: breath 6s ease-in-out infinite, gentle-float 4s ease-in-out infinite;
  filter: drop-shadow(0 12px 24px rgba(43, 113, 234, 0.18));
  z-index: 5;
}

.meditation-icon.breath-animation-active {
  animation: breath 3.5s ease-in-out infinite, gentle-float 4s ease-in-out infinite;
}

.icon-image {
  width: 80%;
  height: 80%;
  object-fit: contain;
  animation: icon-bobbing 3s ease-in-out infinite;
}

@keyframes breath {
  0% {
    transform: scale(1);
    opacity: 0.95;
  }
  50% {
    transform: scale(1.12);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.95;
  }
}

@keyframes gentle-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes icon-bobbing {
  0%, 100% {
    transform: rotate(-2deg);
  }
  50% {
    transform: rotate(2deg);
  }
}

.prompt-text {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 2rem;
  animation: text-fade 2s ease-in-out;
  position: relative;
  padding: 0 2.5rem;
  z-index: 5;
}

.prompt-text::before,
.prompt-text::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transform: translateY(-50%);
  animation: sparkle 2.4s ease-in-out infinite;
}

.prompt-text::before {
  left: 0;
  background: radial-gradient(circle, rgba(43, 113, 234, 0.5) 0%, rgba(43, 113, 234, 0) 70%);
}

.prompt-text::after {
  right: 0;
  background: radial-gradient(circle, rgba(255, 107, 129, 0.5) 0%, rgba(255, 107, 129, 0) 70%);
  animation-delay: 1.2s;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0.5;
    transform: translateY(-50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateY(-50%) scale(1.3);
  }
}

@keyframes text-fade {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.meditate-btn {
  padding: 0.85rem 2.5rem;
  border-radius: 30px;
  background: linear-gradient(135deg, #2b71ea 0%, #43B0FA 100%);
  color: #fff;
  font-size: 1.125rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(43, 113, 234, 0.35);
  transition: all 0.3s;
  z-index: 5;
  letter-spacing: 0.05em;
}

.meditate-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px rgba(43, 113, 234, 0.45);
}

.meditate-btn:active {
  transform: translateY(-1px);
}

.countdown {
  position: absolute;
  bottom: 2.5rem;
  font-size: 1.75rem;
  color: #2b71ea;
  font-weight: 700;
  z-index: 5;
  animation: text-fade 0.6s ease-out;
}

.countdown span {
  display: inline-block;
  margin: 0 0.35rem;
  padding: 0.15rem 0.75rem;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(43, 113, 234, 0.2);
}

.countdown::before,
.countdown::after {
  content: '';
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

/* 角落装饰元素（纯 CSS 造型） */
.decoration {
  position: fixed;
  pointer-events: none;
  z-index: 3;
}

.decoration-cloud-left,
.decoration-cloud-right {
  width: 96px;
  height: 30px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(233, 243, 255, 0.7));
  filter: drop-shadow(0 8px 16px rgba(43, 113, 234, 0.10));
}

.decoration-cloud-left::before,
.decoration-cloud-right::before {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  top: -20px;
  left: 18px;
  border-radius: 50%;
  background: inherit;
}

.decoration-cloud-left::after,
.decoration-cloud-right::after {
  content: '';
  position: absolute;
  width: 28px;
  height: 28px;
  top: -14px;
  right: 20px;
  border-radius: 50%;
  background: inherit;
}

.decoration-cloud-left {
  top: 15%;
  left: 6%;
  opacity: 0.8;
  animation: cloud-drift 10s ease-in-out infinite;
}

.decoration-cloud-right {
  top: 22%;
  right: 7%;
  opacity: 0.65;
  transform: scale(0.85);
  animation: cloud-drift 12s ease-in-out infinite 1.5s;
}

/* 微光点缀 */
.decoration-star-top {
  top: 12%;
  right: 18%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 193, 7, 0.85) 0%, rgba(255, 193, 7, 0) 70%);
  animation: twinkle 3.4s ease-in-out infinite;
}

.decoration-star-bottom {
  bottom: 12%;
  left: 14%;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 151, 118, 0.8) 0%, rgba(255, 151, 118, 0) 70%);
  animation: twinkle 2.8s ease-in-out infinite 1.2s;
}

@keyframes cloud-drift {
  0%, 100% {
    translate: 0 0;
  }
  50% {
    translate: 15px -8px;
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.35;
    transform: scale(0.9);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.15);
  }
}

/* 响应式设计 - 平板设备 */
@media (max-width: 1024px) {
  .meditation-container {
    padding: 1rem;
  }
  
  .back-btn {
    top: 1rem;
    left: 1rem;
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .duration-selector {
    top: 1rem;
    gap: 0.5rem;
    padding: 0.4rem 0.75rem;
  }
  
  .duration-btn {
    padding: 0.2rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .meditation-icon {
    width: 10rem;
    height: 10rem;
    margin-bottom: 1.5rem;
  }
  
  .prompt-text {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
  
  .meditate-btn {
    padding: 0.625rem 1.5rem;
    font-size: 1rem;
  }
  
  .countdown {
    font-size: 1.25rem;
    bottom: 2rem;
  }
}

/* 响应式设计 - 手机设备 */
@media (max-width: 768px) {
  .meditation-container {
    padding: 0.75rem;
  }
  
  .back-btn {
    top: 0.75rem;
    left: 0.75rem;
    width: 2.25rem;
    height: 2.25rem;
  }
  
  .back-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .duration-selector {
    top: 0.75rem;
    left: 50%;
    transform: translateX(-50%);
    gap: 0.4rem;
    padding: 0.3rem 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90%;
  }
  
  .duration-btn {
    padding: 0.2rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .meditation-icon {
    width: 8rem;
    height: 8rem;
    margin-bottom: 1rem;
  }
  
  .icon-image {
    width: 70%;
    height: 70%;
  }
  
  .prompt-text {
    font-size: 1.1rem;
    margin-bottom: 1.25rem;
    text-align: center;
    padding: 0 1rem;
  }
  
  .meditate-btn {
    padding: 0.625rem 1.5rem;
    font-size: 0.95rem;
  }
  
  .countdown {
    font-size: 1.1rem;
    bottom: 1.5rem;
  }
}

/* 响应式设计 - 小屏手机设备 */
@media (max-width: 480px) {
  .meditation-container {
    padding: 0.5rem;
  }
  
  .back-btn {
    top: 0.5rem;
    left: 0.5rem;
    width: 2rem;
    height: 2rem;
  }
  
  .back-icon {
    width: 1.1rem;
    height: 1.1rem;
  }
  
  .duration-selector {
    top: 0.5rem;
    gap: 0.3rem;
    padding: 0.25rem 0.4rem;
  }
  
  .duration-btn {
    padding: 0.15rem 0.5rem;
    font-size: 0.75rem;
  }
  
  .meditation-icon {
    width: 7rem;
    height: 7rem;
    margin-bottom: 0.875rem;
  }
  
  .icon-image {
    width: 65%;
    height: 65%;
  }
  
  .prompt-text {
    font-size: 1rem;
    margin-bottom: 1rem;
    padding: 0 0.75rem;
  }
  
  .meditate-btn {
    padding: 0.5rem 1.25rem;
    font-size: 0.9rem;
  }
  
  .countdown {
    font-size: 1rem;
    bottom: 1.25rem;
  }
}

@media (min-width: 768px) {
  .meditation-icon {
    width: 16rem;
    height: 16rem;
  }

  .prompt-text {
    font-size: 1.5rem;
  }
}
</style>
