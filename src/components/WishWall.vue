<template>
  <div id="starry-background" ref="starryBackground" @click="handleBackgroundClick"></div>

  <div class="floating-hearts"></div>

  <div class="cloud-decoration cloud-1"></div>
  <div class="cloud-decoration cloud-2"></div>
  <div class="cloud-decoration cloud-3"></div>

  <div class="container">
    <button @click="returnToHome" class="return-button">
      <font-awesome-icon icon="home"></font-awesome-icon>
      返回
    </button>
    <header>
      <h1>星空许愿墙</h1>
      <p>写下你的愿望，让它们在温柔的夜空里轻轻发亮</p>
    </header>

    <div class="button-container">
      <button @click="showModal = true" class="wish-button">
        <font-awesome-icon icon="magic"></font-awesome-icon>
        发布我的愿望
      </button>
    </div>

    <div class="wishes-container">
      <div 
        v-for="wish in displayedWishes" 
        :key="wish.id" 
        class="wish-card floating"
        @click="handleCardClick"
      >
        <div class="wish-card-header">
          <div class="avatar glowing">{{ wish.name.charAt(0) }}</div>
          <div class="wish-info">
            <h3>{{ wish.name }}</h3>
            <div class="wish-tags">
              <span 
                v-for="tag in getRandomTags()" 
                :key="tag" 
                class="wish-tag"
              >{{ tag }}</span>
            </div>
          </div>
          <div class="time-tag">{{ formatTime(new Date(wish.timestamp)) }}</div>
        </div>
        <div class="wish-content">
          <p>{{ wish.wish }}</p>
        </div>
        <div class="wish-card-footer">
          <div 
            class="wish-stat" 
            :class="{ active: wish.isLiked }"
            @click.stop="toggleLike(wish, $event)"
          >
            <font-awesome-icon icon="heart" class="heart-icon" :class="{ active: wish.isLiked }"></font-awesome-icon>
            <span>{{ wish.likes }}</span>
          </div>
          <div 
            class="wish-stat" 
            :class="{ active: wish.isStarred }"
            @click.stop="toggleStar(wish, $event)"
          >
            <font-awesome-icon icon="star" class="star-icon" :class="{ active: wish.isStarred }"></font-awesome-icon>
            <span>{{ wish.stars }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="hint-text">
      点击星空背景10次触发烟花效果
    </div>
  </div>

  <div 
    id="wish-modal" 
    class="modal" 
    :class="{ show: showModal }"
    @click="showModal = false"
  >
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>写下你的愿望</h2>
      </div>
      <div class="form-group">
        <label for="name-input">你的名字</label>
        <input 
          type="text" 
          id="name-input" 
          class="form-control" 
          v-model="newWish.name"
          placeholder="输入你的名字" 
          maxlength="20"
        >
      </div>
      <div class="form-group">
        <label for="wish-input">你的愿望</label>
        <textarea 
          id="wish-input" 
          class="form-control" 
          v-model="newWish.wish"
          placeholder="写下你的愿望..." 
          maxlength="200"
        ></textarea>
      </div>
      <button @click="submitWish" class="submit-button">
        <font-awesome-icon icon="paper-plane"></font-awesome-icon>
        发送到星空
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const router = useRouter()

const starryBackground = ref(null)
const showModal = ref(false)
const clickCount = ref(0)
const lastClickTime = ref(0)

const newWish = reactive({
  name: '',
  wish: ''
})

// Three.js相关变量
let scene, camera, renderer, stars, controls, animationId
let floatingHeartsInterval = null

// 初始愿望数据
const initialWishes = [
  { id: 1, name: "张三", wish: "希望能够找到一份满意的工作", timestamp: new Date().toISOString(), likes: 15, stars: 8, isLiked: false, isStarred: false },
  { id: 2, name: "李四", wish: "希望家人健康平安", timestamp: new Date(Date.now() - 86400000).toISOString(), likes: 23, stars: 12, isLiked: false, isStarred: false },
  { id: 3, name: "王五", wish: "希望能够环游世界", timestamp: new Date(Date.now() - 172800000).toISOString(), likes: 31, stars: 18, isLiked: false, isStarred: false },
  { id: 4, name: "赵六", wish: "希望能够学会一门新的语言", timestamp: new Date(Date.now() - 259200000).toISOString(), likes: 12, stars: 6, isLiked: false, isStarred: false },
  { id: 5, name: "钱七", wish: "希望能够拥有自己的房子", timestamp: new Date(Date.now() - 345600000).toISOString(), likes: 28, stars: 15, isLiked: false, isStarred: false }
]

// 愿望数据响应式
const wishes = reactive([...initialWishes])
const displayedWishes = ref([])

// 初始化Three.js
const initThreeJS = () => {
  if (!starryBackground.value) {
    console.warn("星空背景容器未找到")
    return
  }

  // 清理可能已存在的渲染器
  if (renderer) {
    const canvas = starryBackground.value.querySelector('canvas')
    if (canvas) {
      starryBackground.value.removeChild(canvas)
    }
    renderer.dispose()
  }

  try {
    // 创建场景
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xfaf4f1)
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    )
    camera.position.z = 50
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0xfaf4f1, 0.3)
    
    // 清除容器内容并添加渲染器
    while (starryBackground.value.firstChild) {
      starryBackground.value.removeChild(starryBackground.value.firstChild)
    }
    starryBackground.value.appendChild(renderer.domElement)
    
    // 创建环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    
    // 创建星空几何体
    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.PointsMaterial({
      color: 0x2b71ea,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    })

    // 创建星空粒子
    const starCount = 2000
    const starVertices = new Float32Array(starCount * 3)
    
    for (let i = 0; i < starCount * 3; i += 3) {
      starVertices[i] = (Math.random() - 0.5) * 2000
      starVertices[i + 1] = (Math.random() - 0.5) * 2000
      starVertices[i + 2] = (Math.random() - 0.5) * 2000
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starVertices, 3))
    stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)
    
    // 创建轨道控制
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    
    // 开始动画循环
    animate()
    console.log("Three.js初始化成功")
  } catch (error) {
    console.error("Three.js初始化失败:", error)
  }
}

// 动画循环
const animate = () => {
  // 确保渲染循环只运行一次
  if (!renderer || !scene || !camera) {
    return
  }
  
  animationId = requestAnimationFrame(animate)

  // 更新星空旋转
  if (stars) {
    stars.rotation.y += 0.0002
    stars.rotation.x += 0.0001
  }
  
  // 更新控制器
  if (controls) {
    controls.update()
  }
  
  // 渲染场景
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

// 窗口大小改变
const onWindowResize = () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

// 格式化时间
const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

// 获取随机标签
const getRandomTags = () => {
  const tags = ['心愿', '梦想', '期待']
  return tags.sort(() => Math.random() - 0.5).slice(0, 2)
}

// 创建爱心爆炸效果
const createHeartBurst = (element) => {
  const hearts = ['❤️', '💖', '💝', '💕', '💗']
  
  for (let i = 0; i < 5; i++) {
    const heart = document.createElement('span')
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)]
    heart.style.position = 'absolute'
    heart.style.left = '50%'
    heart.style.top = '50%'
    heart.style.fontSize = '1.5rem'
    heart.style.pointerEvents = 'none'
    heart.style.zIndex = '1000'
    heart.style.transform = 'translate(-50%, -50%)'
    heart.style.willChange = 'transform, opacity'
    element.appendChild(heart)
    
    const startX = 0
    const startY = 0
    const endX = Math.random() * 80 - 40
    const endY = Math.random() * -60 - 20
    
    // 创建动画并确保在完成时删除元素
    const animation = heart.animate([
      { 
        transform: `translate(calc(-50% + ${startX}px), calc(-50% + ${startY}px)) scale(1)`, 
        opacity: 1 
      },
      { 
        transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0)`, 
        opacity: 0 
      }
    ], {
      duration: 1200,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    })
    
    animation.onfinish = () => {
      if (element.contains(heart)) {
        element.removeChild(heart)
      }
    }
    
    animation.oncancel = () => {
      if (element.contains(heart)) {
        element.removeChild(heart)
      }
    }
  }
}

// 创建星星爆炸效果
const createStarBurst = (element) => {
  const stars = ['⭐', '✨', '🌟', '💫', '⚡']
  
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('span')
    star.textContent = stars[Math.floor(Math.random() * stars.length)]
    star.style.position = 'absolute'
    star.style.left = '50%'
    star.style.top = '50%'
    star.style.fontSize = '1.5rem'
    star.style.pointerEvents = 'none'
    star.style.zIndex = '1000'
    star.style.transform = 'translate(-50%, -50%)'
    star.style.willChange = 'transform, opacity'
    element.appendChild(star)
    
    const startX = 0
    const startY = 0
    const endX = Math.random() * 80 - 40
    const endY = Math.random() * -60 - 20
    const rotation = Math.random() * 180 - 90
    
    // 创建动画并确保在完成时删除元素
    const animation = star.animate([
      { 
        transform: `translate(calc(-50% + ${startX}px), calc(-50% + ${startY}px)) rotate(0deg) scale(1)`, 
        opacity: 1 
      },
      { 
        transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) rotate(${rotation}deg) scale(0)`, 
        opacity: 0 
      }
    ], {
      duration: 1200,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    })
    
    animation.onfinish = () => {
      if (element.contains(star)) {
        element.removeChild(star)
      }
    }
    
    animation.oncancel = () => {
      if (element.contains(star)) {
        element.removeChild(star)
      }
    }
  }
}

// 切换点赞
const toggleLike = (wish, event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  try {
    if (!wish.isLiked && event?.currentTarget) {
      createHeartBurst(event.currentTarget.closest('.wish-stat') || event.currentTarget)
    }
    
    wish.isLiked = !wish.isLiked
    wish.likes = Math.max(0, wish.likes + (wish.isLiked ? 1 : -1))
    
    // 添加触觉反馈（如果支持）
    if (navigator.vibrate && wish.isLiked) {
      navigator.vibrate(50)
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
  }
}

// 切换收藏
const toggleStar = (wish, event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  try {
    if (!wish.isStarred && event?.currentTarget) {
      createStarBurst(event.currentTarget.closest('.wish-stat') || event.currentTarget)
    }
    
    wish.isStarred = !wish.isStarred
    wish.stars = Math.max(0, wish.stars + (wish.isStarred ? 1 : -1))
    
    // 添加触觉反馈（如果支持）
    if (navigator.vibrate && wish.isStarred) {
      navigator.vibrate(50)
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
  }
}

// 随机排列愿望
const shuffleWishes = () => {
  const shuffled = [...wishes].sort(() => Math.random() - 0.5)
  displayedWishes.value = shuffled.slice(0, 3)
}

// 显示成功提示
const showSuccessMessage = (message) => {
  // 移除现有的提示框
  const existingMessage = document.querySelector('.success-message')
  if (existingMessage) {
    existingMessage.remove()
  }
  
  // 创建新的提示框
  const successMessage = document.createElement('div')
  successMessage.className = 'success-message'
  successMessage.textContent = message
  successMessage.style.position = 'fixed'
  successMessage.style.top = '50%'
  successMessage.style.left = '50%'
  successMessage.style.transform = 'translate(-50%, -50%) scale(0.8)'
  successMessage.style.background = 'linear-gradient(135deg, rgba(43, 113, 234, 0.9), rgba(255, 107, 129, 0.9))'
  successMessage.style.color = 'white'
  successMessage.style.padding = '1rem 2rem'
  successMessage.style.borderRadius = '25px'
  successMessage.style.zIndex = '9999'
  successMessage.style.fontSize = '1.2rem'
  successMessage.style.fontWeight = 'bold'
  successMessage.style.boxShadow = '0 8px 25px rgba(43, 113, 234, 0.3)'
  successMessage.style.opacity = '0'
  successMessage.style.pointerEvents = 'none'
  successMessage.style.transition = 'all 0.3s ease-out'
  
  document.body.appendChild(successMessage)
  
  // 立即显示（带动画）
  const showMessage = () => {
    successMessage.style.opacity = '1'
    successMessage.style.transform = 'translate(-50%, -50%) scale(1)'
  }
  
  requestAnimationFrame(showMessage)
  
  // 1秒后开始消失动画
  setTimeout(() => {
    successMessage.style.opacity = '0'
    successMessage.style.transform = 'translate(-50%, -50%) scale(0.8)'
    
    // 动画结束后移除
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.parentNode.removeChild(successMessage)
      }
    }, 300) // 等待淡出动画完成
  }, 1000)
  
  // 触发烟花效果
  triggerFireworks()
}
//返回按钮
const returnToHome = () => {
  //点击返回上一个页面
  router.push('/new-home')
}
// 触发烟花效果
const triggerFireworks = () => {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.position = 'fixed'
    canvas.style.top = 0
    canvas.style.left = 0
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = 9999
    canvas.style.background = 'transparent'
    
    // 确保canvas能正确添加到DOM
    if (document.body) {
      document.body.appendChild(canvas)
    } else {
      console.warn('无法找到document.body，跳过烟花效果')
      return
    }
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.warn('无法获取canvas上下文，跳过烟花效果')
      return
    }
    
    // 创建粒子类
    class Particle {
      constructor(x, y, color) {
        this.x = x
        this.y = y
        this.vx = (Math.random() - 0.5) * 8
        this.vy = (Math.random() - 0.5) * 8 - 2
        this.color = color
        this.life = 1
        this.decay = Math.random() * 0.02 + 0.01
        this.size = Math.random() * 3 + 2
        this.gravity = 0.1
      }
      
      update() {
        this.x += this.vx
        this.y += this.vy
        this.vy += this.gravity
        this.life -= this.decay
        return this.life > 0
      }
      
      draw() {
        try {
          ctx.save()
          ctx.globalAlpha = this.life
          ctx.fillStyle = this.color
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        } catch (error) {
          console.warn('绘制粒子时出错:', error)
        }
      }
    }
    
    // 粒子数组
    let particles = []
    let fireworksAnimationId = null
    let fireworksCheckEndId = null
    
    // 爆炸函数
    const createExplosion = (x, y, colors) => {
      try {
        const explosionColors = colors || ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd']
        const color = explosionColors[Math.floor(Math.random() * explosionColors.length)]
        
        for (let i = 0; i < 30; i++) {
          particles.push(new Particle(x, y, color))
        }
      } catch (error) {
        console.warn('创建爆炸效果时出错:', error)
      }
    }
    
    // 绘制星星动画
    const animate = () => {
      try {
        if (!ctx || !canvas) {
          return
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // 定期创建爆炸效果
        if (Math.random() < 0.02) {
          createExplosion(
            Math.random() * canvas.width,
            Math.random() * canvas.height * 0.8
          )
        }
        
        // 更新和绘制粒子
        particles = particles.filter(particle => {
          const alive = particle.update()
          if (alive) {
            particle.draw()
          }
          return alive
        })
        
        // 绘制静态星星背景
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height
          const radius = Math.random() * 2 + 1
          const colors = ['#ffffff', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
          const color = colors[Math.floor(Math.random() * colors.length)]
          
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.globalAlpha = Math.random() * 0.8 + 0.2
          ctx.fill()
        }
        ctx.globalAlpha = 1
        
        // 动画结束后移除canvas
        if (canvas.dataset.animationEnd === 'true' && particles.length === 0) {
          cleanup()
          return
        }
        
        if (!animationId) {
          fireworksAnimationId = requestAnimationFrame(animate)
        }
      } catch (error) {
        console.warn('烟花动画循环出错:', error)
        cleanup()
      }
    }
    
    // 清理函数
    const cleanup = () => {
      try {
        if (fireworksAnimationId) {
          cancelAnimationFrame(fireworksAnimationId)
          fireworksAnimationId = null
        }
        if (fireworksCheckEndId) {
          clearTimeout(fireworksCheckEndId)
          fireworksCheckEndId = null
        }
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas)
        }
      } catch (error) {
        console.warn('清理canvas时出错:', error)
      }
    }
    
    // 标记动画结束时间
    const endTime = Date.now() + 4000
    canvas.dataset.animationEnd = 'false'
    
    // 定时检查动画是否结束
    const checkEnd = () => {
      if (Date.now() > endTime) {
        canvas.dataset.animationEnd = 'true'
      } else {
        fireworksCheckEndId = requestAnimationFrame(checkEnd)
      }
    }
    
    // 开始动画
    animate()
    checkEnd()
    
  } catch (error) {
    console.error('触发烟花效果时出错:', error)
  }
}

// 处理背景点击
const handleBackgroundClick = (event) => {
  if (event.target.closest('.wish-card')) {
    return
  }

  const currentTime = Date.now()
  if (currentTime - lastClickTime.value > 3000) {
    clickCount.value = 0
  }
  lastClickTime.value = currentTime

  clickCount.value++
  if (clickCount.value === 10) {
    triggerFireworks()
    clickCount.value = 0
  }
}

// 提交愿望
const submitWish = () => {
  try {
    const name = newWish.name.trim()
    const wishText = newWish.wish.trim()
    
    if (!name) {
      alert('请输入您的名字')
      return
    }
    
    if (!wishText) {
      alert('请输入您的愿望')
      return
    }
    
    const wish = {
      id: Date.now(),
      name: name,
      wish: wishText,
      timestamp: new Date().toISOString(),
      likes: Math.floor(Math.random() * 50) + 10,
      stars: Math.floor(Math.random() * 30) + 5,
      isLiked: false,
      isStarred: false
    }
    
    wishes.unshift(wish)
    
    nextTick(() => {
      try {
        shuffleWishes()
        newWish.name = ''
        newWish.wish = ''
        showModal.value = false
        
        // 显示简单成功提示
        showSuccessMessage('愿望已送达到星空')
        
      } catch (error) {
        console.error('提交愿望后处理错误:', error)
      }
    })
  } catch (error) {
    console.error('提交愿望错误:', error)
    alert('提交失败，请重试')
  }
}

// 处理卡片点击
const handleCardClick = () => {
  // 可以在这里添加卡片点击的处理逻辑
}

// 初始化漂浮爱心
const initFloatingHearts = () => {
  const container = document.querySelector('.floating-hearts')
  if (!container) return null
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
    setTimeout(() => {
      if (heart.parentNode) heart.remove()
      heartCount--
    }, 14000)
  }
  return setInterval(createHeart, 3200)
}

onMounted(() => {
  nextTick(() => {
    initThreeJS()
    shuffleWishes()
    floatingHeartsInterval = initFloatingHearts()

    setInterval(() => shuffleWishes(), 10000)

    window.addEventListener('resize', onWindowResize)
  })
})

onUnmounted(() => {
  if (floatingHeartsInterval) {
    clearInterval(floatingHeartsInterval)
    floatingHeartsInterval = null
  }
  if (starryBackground.value) {
    // 清理星空背景的Three.js资源
    const scene = starryBackground.value._scene
    if (scene) {
      scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose()
        if (child.material) {
          if (child.material.length) {
            child.material.forEach(material => material.dispose())
          } else {
            child.material.dispose()
          }
        }
      })
    }
  }
  window.removeEventListener('resize', onWindowResize)
})
</script>

<style scoped>
:root {
  --primary-color: #2b71ea;
  --secondary-color: #43B0FA;
  --background-color: #faf4f1;
  --text-color: #333;
  --card-bg: rgba(255, 255, 255, 0.7);
  --card-border: rgba(43, 113, 234, 0.15);
  --card-shadow: 0 4px 15px rgba(43, 113, 234, 0.1);
  --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
}

.heart-icon:not(.active),
.star-icon:not(.active) {
  color: #ccc;
}

.heart-icon.active {
  color: #ff6b81;
}

.star-icon.active {
  color: #ffc107;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'YouSheShaYuFeiTe', Arial, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background: linear-gradient(180deg, #faf4f1 0%, #fff5f0 100%);
  color: #333;
  overflow-x: hidden;
  min-height: 100vh;
  position: relative;
  overflow-y: overlay;
  -webkit-overflow-scrolling: touch;
}

#starry-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 2;
  color: #333;
}

/* 漂浮爱心容器 */
.floating-hearts {
  position: fixed;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
  top: 0;
  left: 0;
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

/* 云朵装饰（纯 CSS 造型） */
.cloud-decoration {
  position: fixed;
  width: 96px;
  height: 30px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(233, 243, 255, 0.7));
  pointer-events: none;
  z-index: 1;
  opacity: 0.75;
  filter: drop-shadow(0 8px 16px rgba(43, 113, 234, 0.10));
  animation: cloudFloat 22s ease-in-out infinite;
  will-change: transform;
}

.cloud-decoration::before,
.cloud-decoration::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: inherit;
}

.cloud-decoration::before {
  width: 40px;
  height: 40px;
  top: -20px;
  left: 18px;
}

.cloud-decoration::after {
  width: 28px;
  height: 28px;
  top: -14px;
  right: 20px;
}

.cloud-1 {
  top: 8%;
  left: 5%;
  animation-delay: 0s;
}

.cloud-2 {
  top: 20%;
  right: 8%;
  transform: scale(0.8);
  animation-delay: -7s;
}

.cloud-3 {
  bottom: 15%;
  left: 12%;
  transform: scale(1.2);
  animation-delay: -14s;
}

@keyframes cloudFloat {
  0%, 100% {
    translate: 0 0;
  }
  50% {
    translate: 15px -20px;
  }
}

.return-button {
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: linear-gradient(135deg, #2b71ea 0%, #43B0FA 100%);
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: var(--card-shadow);
  transition: all 0.3s var(--transition-timing);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.return-button:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 20px rgba(43, 113, 234, 0.35);
}
header {
  text-align: center;
  margin-bottom: 3rem;
  padding-top: 2rem;
}

h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #2b71ea, #ff6b81);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0;
  transform: translateY(-20px);
  animation: fadeInDown 1s forwards;
}

header p {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(51, 51, 51, 0.7);
  max-width: 600px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s 0.3s forwards;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  opacity: 0;
  animation: fadeIn 1s 0.6s forwards;
}

.wish-button {
  background: linear-gradient(to right, #2b71ea, #ff6b81);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: bold;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: var(--card-shadow);
  transition: all 0.3s var(--transition-timing);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.wish-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: 0.5s;
}

.wish-button:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 20px rgba(43, 113, 234, 0.35);
}

.wish-button:hover::before {
  left: 100%;
}

.wish-button i {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.wishes-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  opacity: 0;
  animation: fadeIn 1s 0.9s forwards;
}

.wish-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 247, 240, 0.7));
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
  color: #333;
  transform: translateZ(0);
  transition: all 0.5s var(--transition-timing);
  position: relative;
  overflow: hidden;
  will-change: transform;
  contain: content;
}

.wish-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transition: 0.5s;
}

.wish-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 30px rgba(43, 113, 234, 0.2);
}

.wish-card:hover::before {
  left: 100%;
}

.wish-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
}

.avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #2b71ea, #ff6b81);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  box-shadow: 0 0 15px rgba(43, 113, 234, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  will-change: transform;
}

.wish-card:hover .avatar {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 0 20px rgba(255, 107, 129, 0.45);
}

.wish-info {
  flex: 1;
}

.wish-info h3 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  color: #333;
}

.wish-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.wish-tag {
  padding: 0.25rem 0.75rem;
  background: rgba(43, 113, 234, 0.15);
  border-radius: 9999px;
  font-size: 0.75rem;
  color: #2b71ea;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(43, 113, 234, 0.2);
  transition: all 0.3s ease;
}

.wish-tag:hover {
  background: rgba(43, 113, 234, 0.25);
  transform: scale(1.05);
}

.time-tag {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 9999px;
  font-size: 0.75rem;
  color: #666;
  backdrop-filter: blur(4px);
  border: 1px solid var(--card-border);
  transition: all 0.3s ease;
}

.wish-card:hover .time-tag {
  background: rgba(43, 113, 234, 0.15);
  color: #2b71ea;
}

.wish-content {
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 1.1rem;
  color: #444;
  padding: 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.6);
  transform-origin: center;
  transition: all 0.3s ease;
  position: relative;
}

.wish-content::before {
  content: '"';
  position: absolute;
  top: 0;
  left: 0.5rem;
  font-size: 2rem;
  color: #2b71ea;
  opacity: 0.5;
}

.wish-content::after {
  content: '"';
  position: absolute;
  bottom: -0.5rem;
  right: 0.5rem;
  font-size: 2rem;
  color: #ff6b81;
  opacity: 0.5;
}

.wish-card:hover .wish-content {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.02);
}

.wish-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--card-border);
}

.wish-stat {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
}

.wish-stat:hover {
  background: rgba(43, 113, 234, 0.1);
  transform: scale(1.1);
}

.wish-stat.active {
  animation: pop 0.3s ease;
}

.wish-stat i {
  margin-right: 0.5rem;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.wish-stat span {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

.heart-icon {
  color: #ff6b81;
  filter: drop-shadow(0 0 5px rgba(255, 107, 129, 0.5));
}

.star-icon {
  color: #ffc107;
  filter: drop-shadow(0 0 5px rgba(255, 193, 7, 0.5));
}

.wish-stat:hover .heart-icon {
  color: #ff4d6d;
  filter: drop-shadow(0 0 10px rgba(255, 77, 109, 0.7));
}

.wish-stat:hover .star-icon {
  color: #ffb300;
  filter: drop-shadow(0 0 10px rgba(255, 179, 0, 0.7));
}

.hint-text {
  text-align: center;
  margin-top: 2rem;
  color: rgba(51, 51, 51, 0.6);
  font-size: 0.875rem;
  opacity: 0;
  animation: fadeIn 1s 1.2s forwards;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(43, 113, 234, 0.25);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.modal.show {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #fff5f0 100%);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  border: 1px solid var(--card-border);
  box-shadow: 0 10px 30px rgba(43, 113, 234, 0.2);
  transform: scale(0.9);
  transition: transform 0.3s ease;
  color: #333;
}

.modal.show .modal-content {
  transform: scale(1);
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  background: linear-gradient(to right, #2b71ea, #ff6b81);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #444;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--card-border);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.8);
  color: #333;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.form-control:focus {
  outline: none;
  border-color: #2b71ea;
  box-shadow: 0 0 0 3px rgba(43, 113, 234, 0.15);
  background: rgba(255, 255, 255, 0.95);
}

.form-control::placeholder {
  color: #999;
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

.submit-button {
  width: 100%;
  background: linear-gradient(to right, #2b71ea, #ff6b81);
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.125rem;
  font-weight: bold;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: 0.5s;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(43, 113, 234, 0.35);
}

.submit-button:hover::before {
  left: 100%;
}

.submit-button i {
  margin-right: 0.5rem;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
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

@keyframes pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.floating {
  animation: float 3s ease-in-out infinite;
}

.glowing {
  box-shadow: 0 0 20px rgba(43, 113, 234, 0.3);
}

.glowing:hover {
  box-shadow: 0 0 30px rgba(43, 113, 234, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .wishes-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .wish-card {
    padding: 1rem;
  }
  
  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }
}

@media (max-width: 480px) {
  .wish-card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .time-tag {
    position: static;
    margin-top: 0.5rem;
  }
  
  .avatar {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
}
</style>