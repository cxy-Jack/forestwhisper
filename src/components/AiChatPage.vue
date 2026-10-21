<!-- src/components/AiChatPage.vue -->
<template>
  <div class="app-container">
    <!-- 加载动画 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
    </div>

    <!-- 登录提示弹窗 -->
    <div v-if="showLoginPrompt" class="login-prompt-overlay">
      <div class="login-prompt">
        <h3>登录提示</h3>
        <p>登录后可以同步你的对话历史，获得更好的体验</p>
        <div class="prompt-buttons">
          <button class="login-btn" @click="goToLogin">去登录</button>
          <button class="continue-btn" @click="continueWithoutLogin">
            继续使用
          </button>
        </div>
      </div>
    </div>

    <div class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="user-info">
          <div class="user-avatar">
            <img
              src="/favicon.ico"
              alt="小dong"
              class="avatar-img"
            />
          </div>
          <div class="user-details" v-show="!sidebarCollapsed">
            <span class="username">小dong</span>
            <span class="user-status">在线</span>
          </div>
        </div>

        <button
          class="menu-toggle"
          @click="toggleSidebarCollapse"
          aria-label="折叠菜单"
        >
          <i
            class="fas"
            :class="sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"
          ></i>
        </button>
      </div>

      <!-- 登录按钮 -->
      <div class="login-section" v-show="!sidebarCollapsed">
        <button class="login-button" @click="goToLogin">
          <i class="fas" :class="isLoggedIn ? 'fa-user' : 'fa-sign-in-alt'"></i>
          {{ isLoggedIn ? userName : "登录" }}
        </button>
      </div>

      <div class="sidebar-content">
        <div class="menu-section">
          <div class="section-title" v-show="!sidebarCollapsed">
            <i class="fas fa-compass"></i> 功能导航
          </div>
          <a
            href="#"
            class="menu-item"
            :class="{ active: activeMenu === 'chat' }"
            @click="setActiveMenu('chat')"
            :title="sidebarCollapsed ? '聊天分享' : ''"
          >
            <span class="menu-icon">
              <i class="fas fa-comments"></i>
            </span>
            <span class="menu-text" v-show="!sidebarCollapsed">聊天分享</span>
            <span
              class="menu-badge"
              v-if="activeMenu === 'chat' && !sidebarCollapsed"
            >
              <i class="fas fa-circle"></i>
            </span>
          </a>
          <a
            href="#"
            class="menu-item"
            :class="{ active: activeMenu === 'public' }"
            @click="setActiveMenu('public')"
            :title="sidebarCollapsed ? '心理分享' : ''"
          >
            <span class="menu-icon">
              <i class="fas fa-users"></i>
            </span>
            <span class="menu-text" v-show="!sidebarCollapsed">心理分享</span>
            <span
              class="menu-badge"
              v-if="activeMenu === 'public' && !sidebarCollapsed"
            >
              <i class="fas fa-circle"></i>
            </span>
          </a>
          <a
            href="#"
            class="menu-item"
            :class="{ active: activeMenu === 'psychology' }"
            @click="setActiveMenu('psychology')"
            :title="sidebarCollapsed ? '心理辅导' : ''"
          >
            <span class="menu-icon">
              <i class="fas fa-heart"></i>
            </span>
            <span class="menu-text" v-show="!sidebarCollapsed">心理辅导</span>
            <span
              class="menu-badge"
              v-if="activeMenu === 'psychology' && !sidebarCollapsed"
            >
              <i class="fas fa-circle"></i>
            </span>
          </a>
        </div>

        <div class="menu-section chat-history" v-show="!sidebarCollapsed">
          <div class="section-title">
            <i class="fas fa-history"></i> 历史对话
            <button
              class="clear-history-btn"
              @click="clearHistory"
              title="清空历史"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <div class="history-list">
            <div
              v-for="(chat, index) in chatHistory"
              :key="index"
              class="history-item"
              :class="{ active: activeChatId === chat.id }"
              @click="selectChat(chat.id)"
            >
              <span class="menu-icon">
                <i class="fas fa-comment-dots"></i>
              </span>
              <div class="history-content">
                <span class="history-text">{{ chat.title }}</span>
                <span class="history-time">{{ chat.time }}</span>
              </div>
              <button
                class="delete-chat-btn"
                @click.stop="deleteChat(index)"
                title="删除对话"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="chat-header">
        <div class="header-left">
          <div class="chat-title-section">
            <h1 class="chat-title">{{ currentChatTitle }}</h1>
            <span class="chat-subtitle" v-if="messages.length > 0"
              >{{ messages.length }} 条消息</span
            >
          </div>
        </div>
        <div class="header-actions">
          <button class="action-btn" @click="exportChat" title="导出对话">
            <i class="fas fa-download"></i>
          </button>
          <button
            class="action-btn"
            @click="clearCurrentChat"
            title="清空当前对话"
          >
            <i class="fas fa-eraser"></i>
          </button>
          <button class="new-chat-btn" @click="startNewChat">
            <i class="fas fa-plus"></i>
            新对话
          </button>
          <!-- 
                    <button class="new-chat-btn one" @click="Precisemode">
                        <img src="../assets/img/活动浏览_1757572010.svg" alt="" style="width: 20px;">
                        精确模式
                    </button>-->
        </div>
      </div>

      <div class="chat-area" ref="chatArea">
        <div v-if="messages.length === 0" class="welcome-state">
          <div class="welcome-avatar">
            <img
              src="/favicon.ico"
              alt="小dong"
              class="welcome-img"
            />
            <div class="welcome-status"></div>
          </div>
          <div class="welcome-content">
            <h2 class="welcome-text">你好，我是小dong</h2>
            <p class="welcome-question">
              我是你的专属心理助手，今天有什么想要和我分享的吗？
            </p>
            <div class="welcome-suggestions">
              <button
                class="suggestion-btn"
                @click="sendSuggestion('我今天心情不太好')"
              >
                <i class="fas fa-sad-tear"></i>
                我今天心情不太好
              </button>
              <button
                class="suggestion-btn"
                @click="sendSuggestion('我想聊聊工作压力')"
              >
                <i class="fas fa-briefcase"></i>
                我想聊聊工作压力
              </button>
              <button
                class="suggestion-btn"
                @click="sendSuggestion('我需要一些建议')"
              >
                <i class="fas fa-lightbulb"></i>
                我需要一些建议
              </button>
            </div>
          </div>
        </div>
        <div v-else class="chat-messages">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message"
            :class="message.type"
          >
            <div class="message-avatar" :class="message.type">
              <img
                v-if="message.type === 'ai'"
                src="/favicon.ico"
                alt="小do"
                class="avatar-img"
              />
              <i v-else class="fas fa-user"></i>
            </div>
            <div class="message-bubble">
              <div class="message-content">{{ message.content }}</div>
              <div class="message-time">{{ message.timestamp }}</div>
            </div>
          </div>
          <div v-if="isTyping" class="message ai typing-message">
            <div class="message-avatar ai">
              <img
                src="/favicon.ico"
                alt="小do"
                class="avatar-img"
              />
            </div>
            <div class="message-bubble">
              <div class="typing-indicator">
                <span class="typing-text">小do正在思考中</span>
                <div class="typing-dots">
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="Precisemode" v-if="kaiguan">
        <div class="box">
          <button
            style="border: none; border-radius: 50%; margin-top: -30px"
            @click="Close"
          >
            <img
              src="../assets/img/关闭_1757574694.svg"
              alt=""
              style="width: 25px"
            />
          </button>
          <div class="BoxLogo">
            <img
              src="../assets/img/shudong1.png"
              alt=""
              style="width: 130px; margin-top: -45px; margin-left: -25px"
              height="130px"
            />
            <div>
              <h3>你好！</h3>
              <h3>可以告诉小dong一些你的信息吗</h3>
            </div>
          </div>
          <form class="biaodan">
            <label for="name">
              我该称呼你为
              <input
                type="text"
                v-model="userInfo.name"
                placeholder="请输入姓名"
                style="margin-left: 5px"
              />
            </label>
            <label for="SueiSu">
              你多少岁了呢
              <input
                type="number"
                v-model="userInfo.age"
                placeholder="请输入年龄"
                style="margin-left: 5px"
              />
            </label>
            <label for="ShenFen">
              你在现实生活是什么身份呢
              <input
                type="text"
                style="width: 100px; margin-left: 5px"
                v-model="userInfo.identity"
                placeholder="如：学生"
              />
            </label>
            <label for="gender">
              你是
              <select
                name="gender"
                style="
                  border: none;
                  background-color: #e5e7eb;
                  font-size: 16px;
                  margin-left: 5px;
                "
                v-model="userInfo.gender"
              >
                <option value="男生">男生</option>
                <option value="女生">女生</option>
              </select>
              吗？
            </label>
          </form>
          <button
            class="ann"
            @click="confirmUserInfo"
            style="
              cursor: pointer;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              font-size: 16px;
            "
          >
            确认
          </button>
        </div>
      </div>
      <div class="input-area">
        <div class="input-container">
          <div class="input-wrapper">
            <textarea
              v-model="inputMessage"
              class="message-input"
              :placeholder="inputPlaceholder"
              @keydown.enter.prevent="handleEnter"
              @input="handleInput"
              @focus="onInputFocus"
              @blur="onInputBlur"
              rows="1"
              maxlength="500"
              ref="messageInput"
            ></textarea>
            <div class="input-actions">
              <button
                class="input-btn emoji-btn"
                @click="toggleEmojiPicker"
                title="表情"
              >
                <i class="fas fa-smile"></i>
              </button>
              <!-- 修改发送按钮，根据isTyping状态显示不同的图标和功能 -->
              <button
                class="input-btn send-btn"
                :disabled="!canSend && !isTyping"
                @click="isTyping ? abortResponse() : sendMessage()"
                :title="isTyping ? '中止回复' : '发送'"
              >
                <i
                  class="fas"
                  :class="isTyping ? 'fa-stop' : 'fa-paper-plane'"
                ></i>
              </button>
            </div>

            <!-- 表情选择器 -->
            <div v-if="showEmojiPicker" class="emoji-picker">
              <div class="emoji-picker-content">
                <div class="emoji-category">
                  <div
                    v-for="emoji in emojis"
                    :key="emoji"
                    class="emoji-item"
                    @click="insertEmoji(emoji)"
                  >
                    {{ emoji }}
                  </div>
                </div>
              </div>
            </div>
            <div
              class="char-count"
              :class="{ warning: inputMessage.length > 400 }"
            >
              {{ inputMessage.length }}/500
            </div>
          </div>
        </div>

        <!-- 推荐回复区域 - 根据API响应动态显示 -->
        <div class="recommendations-area" v-if="recommendations.length > 0">
          <div class="recommendations-title">推荐回复：</div>
          <div class="recommendations-list">
            <div
              class="recommendation-item"
              v-for="(rec, index) in recommendations"
              :key="index"
              @click="inputMessage = rec.content"
            >
              {{ rec.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { useRouter } from "vue-router";
import "../assets/AI-chat-style.css";

const router = useRouter();

const API_BASE_URL = "https://api.banana404.top";

const botId = "7548122283844468771";
const userId = ref("139");
const accessToken =
  "pat_0YLUZxsWR9JuWiilklAkVWJHG0NXp4l9PjycV3z3SLDG7XsGs8889EHQQWiFVUrM";
const cozeConfig = {
  token: accessToken,
  baseURL: "https://api.coze.cn",
  botId,
  userId: "139",
};

const conversationID = ref(null);
const activeChatId = ref(null);
const activeMenu = ref("chat");
const messages = ref([]);
const historyMessages = ref([]);
const chatHistory = ref([]);
const currentChatTitle = ref("首页");
const inputMessage = ref("");
const inputFocused = ref(false);
const isTyping = ref(false);
const isLoading = ref(true);
const sidebarCollapsed = ref(false);
const showEmojiPicker = ref(false);
const showLoginPrompt = ref(false);
const abortController = ref(null);
const kaiguan = ref(false);
const preciseMode = ref(false);
const userProfileContext = ref("");
const hasError = ref(false);
const recommendations = ref([]);
const isLoggedIn = ref(false);
const userName = ref("");

const userInfo = reactive({ name: "", age: "", identity: "", gender: "男生" });

const chatArea = ref(null);
const messageInput = ref(null);

const emojis = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩",
  "🥳",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "☹️",
  "😣",
  "😖",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
  "😡",
  "🤬",
  "🤯",
  "😳",
  "🥵",
  "🥶",
  "😱",
  "😨",
  "😰",
  "😥",
  "😓",
  "🤗",
  "🤔",
  "🤭",
  "🤫",
  "🤥",
  "😶",
  "😐",
  "😑",
  "😬",
  "🙄",
  "😯",
  "😦",
  "😧",
  "😮",
  "😲",
  "🥱",
  "😴",
  "🤤",
  "😪",
  "😵",
  "🤐",
  "🥴",
  "🤢",
  "🤮",
  "🤧",
  "😷",
  "🤒",
  "🤕",
  "🤑",
  "🤠",
  "😈",
  "👿",
  "👹",
  "👺",
  "🤡",
  "💩",
  "👻",
  "💀",
  "☠️",
  "👽",
  "👾",
  "🤖",
  "🎃",
  "😺",
  "😸",
  "😹",
  "😻",
  "😼",
  "😽",
  "🙀",
  "😿",
  "😾",
];

const inputPlaceholder = computed(() =>
  inputFocused.value ? "输入你的消息..." : "有什么想要分享的吗？",
);
const canSend = computed(
  () => inputMessage.value.trim().length > 0 && !isTyping.value,
);

function formatTime(date) {
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimeRelative(date) {
  const diff = new Date() - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return formatTime(date);
}

function scrollToBottom() {
  nextTick(() => {
    if (chatArea.value) {
      chatArea.value.scrollTo({
        top: chatArea.value.scrollHeight,
        behavior: "smooth",
      });
    }
  });
}

function generateRandomUserId() {
  const randomId = Math.floor(
    1000000000 + Math.random() * 9000000000,
  ).toString();
  userId.value = randomId;
  cozeConfig.userId = randomId;
}

async function fetchUserInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/me`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`请求失败，状态码：${response.status}`);

    const data = await response.json();
    if (data.code === 200 && data.data && data.data.uid) {
      userId.value = data.data.uid.toString();
      cozeConfig.userId = userId.value;
      isLoggedIn.value = true;
      userName.value = data.data.name || "用户";

      fetchChatHistory();

      const storedID = localStorage.getItem("coze_conversation_id");
      if (storedID) {
        conversationID.value = storedID;
        fetchChatDetails(storedID);
      }
      isLoading.value = false;
    } else {
      showLoginPrompt.value = true;
      isLoading.value = false;
    }
  } catch (error) {
    console.error("获取用户信息时发生错误:", error);
    showLoginPrompt.value = true;
    isLoading.value = false;
  }
}

function goToLogin() {
  router.push("/login");
}

function continueWithoutLogin() {
  generateRandomUserId();
  showLoginPrompt.value = false;
  fetchChatHistory();
}

function handleClickOutside(event) {
  if (!showEmojiPicker.value) return;
  if (
    event.target.closest(".emoji-picker") ||
    event.target.closest(".emoji-btn")
  )
    return;
  showEmojiPicker.value = false;
}

function toggleSidebarCollapse() {
  showEmojiPicker.value = false;
  sidebarCollapsed.value = !sidebarCollapsed.value;
  localStorage.setItem("sidebarCollapsed", sidebarCollapsed.value);
}

function getMenuTitle(menu) {
  const titles = {
    chat: "聊天分享",
    public: "心理分享",
    psychology: "心理辅导",
  };
  return titles[menu] || "首页";
}

function setActiveMenu(menu) {
  activeMenu.value = menu;
  activeChatId.value = null;
  currentChatTitle.value = getMenuTitle(menu);
  messages.value = [];
}

function selectChat(chatId) {
  activeChatId.value = chatId;
  activeMenu.value = "";
  currentChatTitle.value = "历史对话";
  loadChatHistory(chatId);
}

function loadChatHistory(chatId) {
  activeChatId.value = chatId;
  conversationID.value = chatId;
  localStorage.setItem("coze_conversation_id", chatId);
  currentChatTitle.value = "加载中...";
  messages.value = [];
  isTyping.value = true;
  fetchChatDetails(chatId);
  scrollToBottom();
}

async function fetchChatHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/ai/conversations`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`请求失败，状态码：${response.status}`);

    const data = await response.json();
    if (data.code === 200 && Array.isArray(data.data)) {
      chatHistory.value = data.data.map((conv) => ({
        id: conv.conversationId,
        title: conv.title || "未命名对话",
        time: formatTimeRelative(new Date(conv.updatedAt * 1000)),
      }));
    } else {
      console.error("获取会话列表失败:", data);
      chatHistory.value = [];
    }
  } catch (error) {
    console.error("获取历史对话列表时发生错误:", error);
  }
}

async function fetchChatDetails(chatId) {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/ai/messages`);
    url.searchParams.append("conversationId", chatId);

    const response = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`网络响应错误: ${response.status}`);

    const data = await response.json();
    if (data.code === 200 && Array.isArray(data.data)) {
      currentChatTitle.value = "历史对话";
      messages.value = data.data.map((msg) => ({
        type: msg.role === "user" ? "user" : "ai",
        content: msg.content,
        timestamp: formatTime(new Date(msg.createdAt * 1000)),
      }));
      historyMessages.value = data.data.map((msg) => ({
        content: msg.content,
        content_type: "text",
        role: msg.role,
        type: msg.role === "user" ? "question" : "answer",
      }));
      localStorage.setItem("coze_conversation_id", chatId);
      conversationID.value = chatId;
    } else {
      messages.value.push({
        type: "system",
        content: `获取对话详情失败: ${data.msg || "未知错误"}`,
        timestamp: formatTime(new Date()),
      });
    }
  } catch (error) {
    console.error("获取对话详情时发生错误:", error);
    messages.value.push({
      type: "system",
      content: `获取对话详情时发生网络错误: ${error.message || "未知错误"}`,
      timestamp: formatTime(new Date()),
    });
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
}

function startNewChat() {
  messages.value = [];
  activeChatId.value = null;
  conversationID.value = null;
  currentChatTitle.value = "新对话";
  activeMenu.value = "chat";
  inputMessage.value = "";
  localStorage.removeItem("coze_conversation_id");
  nextTick(() => messageInput.value && messageInput.value.focus());
}

function Close() {
  kaiguan.value = false;
}

function clearCurrentChat() {
  if (confirm("确定要清空当前对话吗？")) {
    messages.value = [];
  }
}

function clearHistory() {
  if (confirm("确定要清空所有历史对话吗？")) {
    chatHistory.value = [];
  }
}

function deleteChat(index) {
  if (!confirm("确定要删除这个对话吗？")) return;
  const conversationId = chatHistory.value[index].id;

  fetch(`${API_BASE_URL}/api/v1/ai/conversation/del`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code === 200) {
        chatHistory.value.splice(index, 1);
      } else {
        alert("删除会话失败: " + (data.msg || "未知错误"));
      }
    })
    .catch((error) => {
      console.error("删除会话时出错:", error);
      alert("删除会话时出错，请检查网络连接");
    });
}

function exportChat() {
  if (messages.value.length === 0) {
    alert("当前没有对话内容可以导出");
    return;
  }
  alert("导出功能开发中...");
}

function handleEnter(event) {
  if (event.shiftKey) return;
  sendMessage();
}

function handleInput() {
  if (inputMessage.value.length > 500) {
    inputMessage.value = inputMessage.value.substring(0, 500);
  }
  requestAnimationFrame(() => {
    const textarea = messageInput.value;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  });
}

function onInputFocus() {
  inputFocused.value = true;
}

function onInputBlur() {
  inputFocused.value = false;
}

function toggleEmojiPicker() {
  showEmojiPicker.value = !showEmojiPicker.value;
}

function insertEmoji(emoji) {
  const textarea = messageInput.value;
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  inputMessage.value =
    inputMessage.value.substring(0, start) +
    emoji +
    inputMessage.value.substring(end);

  nextTick(() => {
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
  });
}

function sendSuggestion(text) {
  inputMessage.value = text;
  sendMessage();
}

function sendMessage() {
  if (!canSend.value) return;

  const message = inputMessage.value.trim();

  messages.value.push({
    type: "user",
    content: message,
    timestamp: formatTime(new Date()),
  });
  historyMessages.value.push({
    content: message,
    content_type: "text",
    role: "user",
    type: "question",
  });

  recommendations.value = [];
  inputMessage.value = "";
  isTyping.value = true;

  nextTick(() => {
    if (messageInput.value) messageInput.value.style.height = "auto";
  });

  scrollToBottom();
  abortController.value = new AbortController();
  getAIResponse(message);
}

function abortResponse() {
  if (!abortController.value) return;
  abortController.value.abort();
  abortController.value = null;
  isTyping.value = false;
  messages.value.push({
    type: "ai",
    content: "回复已中止",
    timestamp: formatTime(new Date()),
  });
  scrollToBottom();
}

async function getAIResponse(userMessage) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        conversationId: conversationID.value || "",
        message: userMessage,
      }),
      signal: abortController.value ? abortController.value.signal : undefined,
      credentials: "include",
    });

    if (!response.body) {
      handleAIResponseError("❌ 未获取到流式响应");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let currentContent = "";
    let aiMessageCreated = false;
    let botIndex = messages.value.length;

    isTyping.value = true;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (abortController.value && abortController.value.signal.aborted) return;

      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const raw of lines) {
        const line = raw.trim();
        if (!line || !line.startsWith("data:")) continue;

        const dataStr = line.slice(5).trim();
        if (dataStr === "[DONE]") break;

        let data;
        try {
          data = JSON.parse(dataStr);
        } catch (e) {
          console.error("解析响应数据出错:", e, "原始数据:", dataStr);
          continue;
        }

        if (data.type === "conversation" && data.conversationId) {
          conversationID.value = data.conversationId;
          activeChatId.value = data.conversationId;
          localStorage.setItem("coze_conversation_id", data.conversationId);
          fetchChatHistory();
        } else if (data.type === "content" && data.content) {
          currentContent += data.content;
          if (!aiMessageCreated) {
            messages.value.push({
              type: "ai",
              content: currentContent,
              timestamp: formatTime(new Date()),
            });
            aiMessageCreated = true;
            botIndex = messages.value.length - 1;
          } else {
            messages.value[botIndex].content = currentContent;
            messages.value[botIndex].timestamp = formatTime(new Date());
          }
          scrollToBottom();
        } else if (data.type === "error") {
          const text = "错误: " + data.error;
          if (!aiMessageCreated) {
            messages.value.push({
              type: "ai",
              content: text,
              timestamp: formatTime(new Date()),
            });
            aiMessageCreated = true;
          } else {
            messages.value[botIndex].content = text;
          }
          scrollToBottom();
        }
      }
    }

    historyMessages.value.push({
      content: currentContent,
      content_type: "text",
      role: "assistant",
      type: "answer",
    });

    isTyping.value = false;
    scrollToBottom();
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error("获取AI响应时出错:", error);
    handleAIResponseError("❌ 消息发送失败，请检查网络或API密钥");
  } finally {
    abortController.value = null;
  }
}

function handleAIResponseError(errorMsg) {
  isTyping.value = false;
  isLoading.value = false;
  hasError.value = true;

  let errorType = "未知错误";
  let errorSuggestion = "请稍后重试";

  if (errorMsg.includes("网络") || errorMsg.includes("Failed to fetch")) {
    errorType = "网络连接错误";
    errorSuggestion = "请检查您的网络连接后重试";
  } else if (errorMsg.includes("超时") || errorMsg.includes("timeout")) {
    errorType = "请求超时";
    errorSuggestion = "服务器响应较慢，请稍后重试";
  } else if (errorMsg.includes("未获取到")) {
    errorType = "响应格式错误";
    errorSuggestion = "请检查API配置是否正确";
  } else if (
    errorMsg.includes("授权") ||
    errorMsg.includes("Token") ||
    errorMsg.includes("401")
  ) {
    errorType = "授权失败";
    errorSuggestion = "请检查API Token是否正确";
  } else if (errorMsg.includes("404")) {
    errorType = "资源未找到";
    errorSuggestion = "请检查Bot ID是否正确";
  }

  messages.value.push({
    type: "system",
    content: `❌ ${errorType}\n${errorMsg}\n💡 ${errorSuggestion}`,
    timestamp: formatTime(new Date()),
    errorDetails: errorMsg,
  });

  scrollToBottom();
  setTimeout(() => {
    hasError.value = false;
  }, 3000);
}

function generateUserProfile() {
  const age = parseInt(userInfo.age);
  let ageGroup = "";
  if (age <= 18) ageGroup = "青少年";
  else if (age <= 25) ageGroup = "青年";
  else if (age <= 35) ageGroup = "年轻成年人";
  else if (age <= 50) ageGroup = "中年人";
  else ageGroup = "中老年人";

  userProfileContext.value = `用户信息：姓名${userInfo.name}，${age}岁${ageGroup}，${userInfo.gender}，身份是${userInfo.identity}。请根据用户的年龄段、性别和身份特点，提供更有针对性和个性化的回答。比如：对学生要考虑学业压力和成长困惑；对技术人员要理解工作强度和职业发展；对老师要关注教学压力和师生关系；对社会人员要考虑工作生活平衡等。回答要符合用户的年龄特征和身份背景。`;
}

async function sendUserProfileToAPI() {
  const response = await fetch(`${cozeConfig.baseURL}/v3/chat`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cozeConfig.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bot_id: botId,
      user_id: userId.value,
      stream: false,
      additional_messages: [
        {
          content: userProfileContext.value,
          content_type: "text",
          role: "user",
        },
      ],
      parameters: {},
    }),
  });

  if (!response.ok) throw new Error(`API请求失败: ${response.status}`);
  return response.json();
}

async function confirmUserInfo() {
  if (
    !userInfo.name.trim() ||
    !userInfo.age ||
    !userInfo.gender ||
    !userInfo.identity.trim()
  ) {
    alert("请填写完整的信息，包括姓名、年龄、性别和身份");
    return;
  }

  const age = parseInt(userInfo.age);
  if (isNaN(age) || age <= 0 || age > 120) {
    alert("请输入有效的年龄");
    return;
  }

  generateUserProfile();
  if (!userProfileContext.value) {
    alert("无法生成用户画像，请稍后重试");
    return;
  }

  kaiguan.value = false;
  isTyping.value = true;
  scrollToBottom();

  try {
    await sendUserProfileToAPI();
    preciseMode.value = true;
    messages.value.push({
      type: "ai",
      content: `你好${userInfo.name}！我已经了解了你的基本信息，现在我会根据你的年龄、身份和性别为你提供更精确的回答。有什么想要和我分享的吗？`,
      timestamp: formatTime(new Date()),
    });
  } catch (error) {
    console.error("发送用户画像到API失败:", error);
    preciseMode.value = false;
    messages.value.push({
      type: "ai",
      content: `你好${userInfo.name}！很高兴认识你，有什么想要和我分享的吗？`,
      timestamp: formatTime(new Date()),
    });
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);

  const savedCollapsed = localStorage.getItem("sidebarCollapsed");
  if (savedCollapsed !== null) {
    sidebarCollapsed.value = savedCollapsed === "true";
  }

  fetchUserInfo();

  nextTick(() => {
    if (messageInput.value) messageInput.value.focus();
  });
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  if (abortController.value) abortController.value.abort();
});
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

:root {
  --text-color: #333;
  --background-color: #f5f5f5;
  --sidebar-background: #fff;
  --chat-background: #fff;
  --message-input-background: #fff;
  --message-bubble-user: #e3f2fd;
  --message-bubble-ai: #f5f5f5;
  --border-color: #e0e0e0;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 表情选择器样式 */
.emoji-picker {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 320px;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
  max-height: 250px;
  overflow-y: auto;
  z-index: 997;
}

.emoji-picker-content {
  padding: 10px;
}

.emoji-category {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
}

.emoji-item {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.emoji-item:hover {
  background-color: #f0f0f0;
}

/* 确保输入区域是相对定位，以便表情选择器的绝对定位正常工作 */
.input-wrapper {
  position: relative;
}

/* 加载动画样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 登录提示弹窗样式 */
.login-prompt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9998;
}

.login-prompt {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.login-prompt h3 {
  margin-top: 0;
  color: #333;
}

.login-prompt p {
  margin-bottom: 20px;
  color: #666;
}

.prompt-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.login-btn,
.continue-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.login-btn {
  background-color: #3498db;
  color: white;
}

.login-btn:hover {
  background-color: #2980b9;
}

.continue-btn {
  background-color: #f0f0f0;
  color: #333;
}

.continue-btn:hover {
  background-color: #e0e0e0;
}

/* 登录按钮样式 */
.login-section {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #2980b9;
}
</style>
