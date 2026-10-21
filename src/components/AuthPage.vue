<template>
  <div class="auth-page">
    <!-- 返回 -->
    <button class="back-btn" @click="goBack" aria-label="返回">
      <i class="fas fa-arrow-left"></i>
    </button>

    <div class="auth-wrap">
      <Transition name="mode" mode="out-in">
        <div :key="isLogin ? 'login' : 'register'" class="auth-inner">
          <!-- 品牌 -->
          <div class="brand">
            <img src="@/assets/img/网站logo.png" alt="林影心语" class="brand-logo">
            <span class="brand-name">林影心语</span>
          </div>

          <h1 class="title">{{ isLogin ? '登录' : '注册' }}</h1>

          <!-- 登录表单 -->
          <form v-if="isLogin" class="auth-form" @submit.prevent="handleLogin">
            <label class="field">
              <span class="field-label">邮箱</span>
              <input
                v-model="loginForm.usernameEmail"
                type="email"
                class="field-input"
                placeholder="请输入邮箱"
                required
              >
            </label>

            <label class="field">
              <span class="field-label">密码</span>
              <div class="input-wrap">
                <input
                  v-model="loginForm.password"
                  :type="showLoginPassword ? 'text' : 'password'"
                  class="field-input"
                  placeholder="请输入密码"
                  required
                >
                <button
                  type="button"
                  class="input-suffix"
                  @click="showLoginPassword = !showLoginPassword"
                  tabindex="-1"
                >
                  <i :class="showLoginPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </label>

            <p v-if="loginError" class="field-error">{{ loginError }}</p>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              <span v-if="!isLoading">登录</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </form>

          <!-- 注册表单 -->
          <form v-else class="auth-form" @submit.prevent="handleRegister">
            <label class="field">
              <span class="field-label">用户名</span>
              <input
                v-model="registerForm.username"
                type="text"
                class="field-input"
                placeholder="给自己取一个名字"
                required
              >
            </label>

            <label class="field">
              <span class="field-label">邮箱</span>
              <input
                v-model="registerForm.email"
                type="email"
                class="field-input"
                placeholder="请输入邮箱"
                required
              >
            </label>

            <label class="field">
              <span class="field-label">验证码</span>
              <div class="input-wrap code-wrap">
                <input
                  v-model="registerForm.code"
                  type="text"
                  class="field-input"
                  placeholder="请输入验证码"
                  required
                  :disabled="!isCodeSent"
                >
                <button
                  type="button"
                  class="code-btn"
                  @click="handleSendCode"
                  :disabled="isLoading || isCountingDown"
                >
                  <span v-if="!isCountingDown">获取验证码</span>
                  <span v-else>{{ countdown }}s 后重发</span>
                </button>
              </div>
            </label>

            <label class="field">
              <span class="field-label">密码</span>
              <div class="input-wrap">
                <input
                  v-model="registerForm.password"
                  :type="showRegisterPassword ? 'text' : 'password'"
                  class="field-input"
                  placeholder="至少 8 位"
                  required
                  minlength="8"
                >
                <button
                  type="button"
                  class="input-suffix"
                  @click="showRegisterPassword = !showRegisterPassword"
                  tabindex="-1"
                >
                  <i :class="showRegisterPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </label>

            <label class="field">
              <span class="field-label">确认密码</span>
              <div class="input-wrap">
                <input
                  v-model="registerForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="field-input"
                  placeholder="再输入一次密码"
                  required
                >
                <button
                  type="button"
                  class="input-suffix"
                  @click="showConfirmPassword = !showConfirmPassword"
                  tabindex="-1"
                >
                  <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </label>

            <p v-if="passwordMismatch" class="field-error">两次输入的密码不一致</p>
            <p v-if="registerSuccess" class="field-ok">{{ registerSuccess }}</p>
            <p v-if="registerError" class="field-error">{{ registerError }}</p>

            <button
              type="submit"
              class="submit-btn"
              :disabled="isLoading || !isFormValid"
            >
              <span v-if="!isLoading">注册</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </form>

          <!-- 模式切换 -->
          <p class="switch">
            <span>{{ isLogin ? '还没有账号？' : '已有账号？' }}</span>
            <button type="button" class="switch-link" @click="toggleAuthMode" :disabled="isLoading">
              {{ isLogin ? '注册' : '去登录' }}
            </button>
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const API_BASE_URL = 'https://api.banana404.top'

export default {
  name: 'AuthPage',
  setup() {
    const router = useRouter()
    let countdownTimer = null
    const isLogin = ref(true)
    const isLoading = ref(false)
    const showLoginPassword = ref(false)
    const showRegisterPassword = ref(false)
    const showConfirmPassword = ref(false)
    const loginError = ref('')
    const registerError = ref('')
    const registerSuccess = ref('')
    const codeSalt = ref('')
    const isCodeSent = ref(false)
    const isCountingDown = ref(false)
    const countdown = ref(60)

    const loginForm = ref({
      usernameEmail: '',
      password: ''
    })

    const registerForm = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      code: ''
    })

    onUnmounted(() => {
      if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    })

    const passwordMismatch = computed(() => {
      return registerForm.value.password &&
             registerForm.value.confirmPassword &&
             registerForm.value.password !== registerForm.value.confirmPassword
    })

    const isFormValid = computed(() => {
      return registerForm.value.username &&
             registerForm.value.email &&
             registerForm.value.password &&
             registerForm.value.confirmPassword &&
             registerForm.value.code &&
             codeSalt.value &&
             !passwordMismatch.value
    })

    const toggleAuthMode = () => {
      if (isLoading.value) return
      isLogin.value = !isLogin.value
      loginError.value = ''
      registerError.value = ''
      registerSuccess.value = ''

      if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
      isCountingDown.value = false
      countdown.value = 60
      isCodeSent.value = false
      codeSalt.value = ''
    }

    // 返回上一页功能
    const goBack = () => {
      router.back()
    }

    const startCountdown = () => {
      isCountingDown.value = true
      countdown.value = 60

      if (countdownTimer) {
        clearInterval(countdownTimer)
      }

      countdownTimer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(countdownTimer)
          countdownTimer = null
          isCountingDown.value = false
        }
      }, 1000)
    }

    const handleSendCode = async () => {
      if (!registerForm.value.email) {
        registerError.value = '请输入邮箱地址'
        return
      }

      isLoading.value = true
      registerError.value = ''

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/user/email/code/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            email: registerForm.value.email
          })
        })

        const data = await response.json()

        if (data.code === 200) {
          codeSalt.value = data.data?.codeSalt || ''
          isCodeSent.value = true
          registerSuccess.value = '验证码已发送，请查收邮箱'
          startCountdown()
        } else {
          registerError.value = data.msg || '发送验证码失败'
        }
      } catch (error) {
        console.error('发送验证码错误:', error)
        registerError.value = '网络错误，请稍后重试'
      } finally {
        isLoading.value = false
      }
    }

    const handleLogin = async () => {
      if (!loginForm.value.usernameEmail || !loginForm.value.password || isLoading.value) return

      isLoading.value = true
      loginError.value = ''

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/user/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            email: loginForm.value.usernameEmail,
            passwd: loginForm.value.password
          })
        })

        const data = await response.json()

        if (data.code === 200) {
          localStorage.setItem('realUserInfo', JSON.stringify(data.data))

          // 设置跨子域 Cookie
          const domain = '.hkmre.top'; // 主域名，前面加 dot 表示所有子域名都能访问
          const expires = new Date();
          expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7天过期

          // 从响应中获取认证信息，根据后端实际返回结构调整
          // 注意：实际项目中，认证信息可能在 cookie 中由后端设置
          // 这里我们手动设置一个跨域 cookie 用于子域名访问
          const userData = data.data || {};

          // 使用与后端一致的 cookie 名称
          document.cookie = `forestwhisper=${JSON.stringify(userData)}; path=/; domain=${domain}; expires=${expires.toUTCString()}; secure; sameSite=none`;

          router.push('/user-panel')
        } else {
          loginError.value = data.msg || '登录失败，请检查邮箱和密码'
        }
      } catch (error) {
        console.error('登录错误:', error)
        loginError.value = '网络错误，请检查网络连接'
      } finally {
        isLoading.value = false
      }
    }

    const handleRegister = async () => {
      if (!isFormValid.value || isLoading.value) return

      isLoading.value = true
      registerError.value = ''
      registerSuccess.value = ''

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/user/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            email: registerForm.value.email,
            username: registerForm.value.username,
            passwd: registerForm.value.password,
            code: registerForm.value.code
          })
        })

        const data = await response.json()

        if (data.code === 200) {
          registerSuccess.value = '注册成功，正在跳转到登录…'
          setTimeout(() => {
            isLogin.value = true
            loginForm.value.usernameEmail = registerForm.value.email
            registerForm.value = {
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
              code: ''
            }
            codeSalt.value = ''
            isCodeSent.value = false
            registerSuccess.value = ''
          }, 2000)
        } else {
          registerError.value = data.msg || '注册失败，请检查输入信息'
        }
      } catch (error) {
        console.error('注册错误:', error)
        registerError.value = '网络错误，请稍后重试'
      } finally {
        isLoading.value = false
      }
    }

    return {
      isLogin,
      isLoading,
      showLoginPassword,
      showRegisterPassword,
      showConfirmPassword,
      loginForm,
      registerForm,
      passwordMismatch,
      isFormValid,
      loginError,
      registerError,
      registerSuccess,
      codeSalt,
      isCodeSent,
      isCountingDown,
      countdown,
      toggleAuthMode,
      handleLogin,
      handleRegister,
      handleSendCode,
      goBack
    }
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.auth-page {
  position: relative;
  min-height: 100vh;
  background: #f8f7f5;
  font-family: 'YouSheShaYuFeiTe', Arial, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #1f2937;
}

/* ---------- 返回 ---------- */
.back-btn {
  position: fixed;
  top: 22px;
  left: 22px;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #a8a49c;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, color 0.2s ease;
}

.back-btn:hover {
  background: rgba(0, 0, 0, 0.045);
  color: #5b584f;
}

.back-btn:active {
  background: rgba(0, 0, 0, 0.07);
}

/* ---------- 容器 ---------- */
.auth-wrap {
  width: 100%;
  max-width: 350px;
}

.auth-inner {
  animation: fade-up 0.45s ease both;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ---------- 品牌 ---------- */
.brand {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 9px;
  margin-bottom: 46px;
}

.brand-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.brand-name {
  font-size: 15px;
  font-weight: 600;
  color: #2d2a26;
  letter-spacing: 0.1em;
}

/* ---------- 标题 ---------- */
.title {
  font-size: 22px;
  font-weight: 600;
  color: #2d2a26;
  letter-spacing: 0.01em;
  margin-bottom: 28px;
}

/* ---------- 表单 ---------- */
.auth-form {
  display: block;
}

.field {
  display: block;
  margin-bottom: 18px;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #5b584f;
  margin-bottom: 7px;
}

.field-input {
  width: 100%;
  height: 44px;
  padding: 0 13px;
  border: 1px solid #e4e2dd;
  border-radius: 10px;
  background: #ffffff;
  font-family: inherit;
  font-size: 14px;
  color: #2d2a26;
  transition: border-color 0.2s ease;
}

.field-input::placeholder {
  color: #b3afa7;
}

.field-input:focus {
  outline: none;
  border-color: #2b71ea;
}

.field-input:disabled {
  background: #f4f3f0;
  color: #b3afa7;
  cursor: not-allowed;
}

/* 输入框内附加按钮 */
.input-wrap {
  position: relative;
}

.input-wrap .field-input {
  padding-right: 42px;
}

.code-wrap .field-input {
  padding-right: 102px;
}

.input-suffix {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #b3afa7;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.input-suffix:hover {
  color: #6b6760;
}

.code-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  height: 26px;
  padding: 0 0 0 13px;
  border: none;
  border-left: 1px solid #e4e2dd;
  background: transparent;
  font-family: inherit;
  font-size: 12.5px;
  color: #2b71ea;
  cursor: pointer;
  transition: color 0.2s ease;
}

.code-btn:hover:not(:disabled) {
  color: #2463cf;
}

.code-btn:disabled {
  color: #b3afa7;
  cursor: default;
}

/* ---------- 提示文字 ---------- */
.field-error,
.field-ok {
  font-size: 12.5px;
  line-height: 1.4;
  margin: -6px 2px 12px;
}

.field-error {
  color: #cf5a5a;
}

.field-ok {
  color: #2b71ea;
}

/* ---------- 提交按钮 ---------- */
.submit-btn {
  width: 100%;
  height: 46px;
  margin-top: 8px;
  border: none;
  border-radius: 10px;
  background: #2b71ea;
  color: #ffffff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.12s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #2463cf;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.985);
}

.submit-btn:disabled {
  background: #a8c1ee;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ---------- 切换 ---------- */
.switch {
  margin-top: 26px;
  text-align: center;
  font-size: 13px;
  color: #8f8b83;
}

.switch-link {
  border: none;
  background: transparent;
  padding: 0;
  margin-left: 3px;
  font-family: inherit;
  font-size: 13px;
  color: #2b71ea;
  cursor: pointer;
  transition: color 0.2s ease;
}

.switch-link:hover {
  color: #2463cf;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.switch-link:disabled {
  color: #b3afa7;
  cursor: default;
  text-decoration: none;
}

/* ---------- 登录/注册切换 ---------- */
.mode-enter-active,
.mode-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.mode-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.mode-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ---------- 响应式 ---------- */
@media (max-width: 480px) {
  .auth-page {
    padding: 32px 22px;
  }

  .brand {
    margin-bottom: 38px;
  }

  .back-btn {
    top: 14px;
    left: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .auth-inner {
    animation: none;
  }

  .mode-enter-active,
  .mode-leave-active {
    transition: none;
  }
}
</style>
