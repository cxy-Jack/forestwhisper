<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ChatMessage } from '@/data/types'
import { eventValue } from '@/maotaui'

const router = useRouter()
let messageId = 0
const nextId = () => `m${++messageId}`

const messages = ref<ChatMessage[]>([
  {
    id: nextId(),
    role: 'companion',
    content:
      '你来啦。我是这个房间里的陪伴者，不是咨询师，也不会评判你。\n今晚想聊点什么？说什么都可以，哪怕只是“不知道说什么”。',
    time: '现在'
  }
])

const draft = ref('')
const typing = ref(false)
const listEl = ref<HTMLElement | null>(null)

const rules: { keys: string[]; replies: string[] }[] = [
  {
    keys: ['睡不着', '失眠', '睡不好', '熬夜'],
    replies: [
      '睡不着的夜，时间会变得特别长。此刻不用逼自己睡——越用力，睡意跑得越远。\n要不要试试「呼吸」页的 4-7-8 呼吸？吸 4 秒、停 7 秒、呼 8 秒，做三轮就好。它会让你的神经知道：现在安全，可以休息了。'
    ]
  },
  {
    keys: ['焦虑', '紧张', '心慌', '担心', '害怕'],
    replies: [
      '焦虑来了。它其实是身体派来的信使，只是嗓门有点大。\n先别急着赶走它。可以试试：说出你现在能看到的 3 样东西、能听到的 2 种声音、能感觉到的 1 种触感。我在这儿，你慢慢说。'
    ]
  },
  {
    keys: ['难过', '低落', '沮丧', '想哭', 'emo', '抑郁'],
    replies: [
      '听到你这么说，想先陪你待一会儿。低落的时候，世界像被调成了灰色，连小事都变得很重。\n你不需要立刻振作。如果愿意，说说是什么压在你心上？说不出来也没关系，就坐一会儿。'
    ]
  },
  {
    keys: ['孤独', '没人', '孤单', '一个人', '朋友'],
    replies: [
      '孤独不是因为你不好，而是心里那扇窗太久没人敲了。\n平台的心愿墙上，此刻也有很多人和你一样醒着。去那里留一句话试试？被陌生人回应的感觉，有时比想象中更暖。'
    ]
  },
  {
    keys: ['压力', '累', '撑不住', '好难', '崩溃', '忙'],
    replies: [
      '听起来你已经扛了很久了。辛苦你了。\n现在压在你身上的事情里，有没有哪一件，是今晚可以先放下的？剩下的，明天再一件件捡。'
    ]
  },
  {
    keys: ['自残', '伤害自己', '不想活', '自杀', '结束'],
    replies: [
      '听到这句话，我很担心你。此刻的痛苦是真实的，但它可以流动、会变化。\n请拨打全国 24 小时心理援助热线 400-161-9995。如果这个念头很强烈，请立即前往就近医院急诊，或拨打 120。'
    ]
  }
]

const fallback = [
  '嗯，我在听。你继续说。\n如果想聊得更具体，可以告诉我：这件事让你的身体有什么感觉？',
  '谢谢你愿意把这些说出来。说出来本身，就已经很勇敢了。\n今晚想为自己做一件很小、很舒服的事吗？比如倒一杯温水。',
  '我听到了。不急着找答案，我们就这样聊一会儿。'
]

function reply(text: string) {
  for (const rule of rules) {
    if (rule.keys.some((key) => text.includes(key))) {
      return rule.replies[Math.floor(Math.random() * rule.replies.length)]
    }
  }
  return fallback[Math.floor(Math.random() * fallback.length)]
}

function setDraft(event: Event) {
  draft.value = eventValue(event).slice(0, 300)
}

async function scrollBottom() {
  await nextTick()
  listEl.value?.scrollTo({ top: listEl.value.scrollHeight, behavior: 'smooth' })
}

function send() {
  const text = draft.value.trim()
  if (!text || typing.value) return

  messages.value.push({ id: nextId(), role: 'user', content: text, time: '现在' })
  draft.value = ''
  typing.value = true
  scrollBottom()

  const delay = 900 + Math.min(1800, text.length * 40)
  window.setTimeout(() => {
    messages.value.push({ id: nextId(), role: 'companion', content: reply(text), time: '现在' })
    typing.value = false
    scrollBottom()
  }, delay)
}
</script>

<template>
  <div class="chat-page">
    <div class="chat-shell">
      <header class="chat-head">
        <div class="chat-id">
          <span class="status-dot" aria-hidden="true"></span>
          <div>
            <h1>陪你聊聊</h1>
            <p>一位倾听者 · 非专业医疗建议</p>
          </div>
        </div>
        <mao-button variant="light" size="sm" @click="router.push('/breathe')">
          呼吸练习
        </mao-button>
      </header>

      <div ref="listEl" class="chat-list" role="log" aria-live="polite">
        <mao-card
          v-for="message in messages"
          :key="message.id"
          padding="md"
          :class="['message', message.role]"
        >
          <div class="mt-card-body">
            <p v-for="(line, index) in message.content.split('\n')" :key="index">{{ line }}</p>
          </div>
        </mao-card>

        <mao-card v-if="typing" padding="md" class="message companion typing" aria-label="正在输入">
          <div class="mt-card-body">
            <span></span><span></span><span></span>
          </div>
        </mao-card>
      </div>

      <mao-card padding="md" class="chat-input-card">
        <div class="mt-card-body chat-input-row">
          <mao-text-field
            class="chat-input"
            label="输入消息"
            hint="最多 300 字"
            placeholder="把心里的话，轻轻放在这里……"
            :value="draft"
            @mt-input="setDraft"
            @keydown.enter="send"
          ></mao-text-field>
          <mao-button
            color="primary"
            icon
            aria-label="发送"
            :disabled="!draft.trim() || typing ? '' : undefined"
            @click="send"
          >
            <mao-icon name="arrow-up" size="18"></mao-icon>
          </mao-button>
        </div>
      </mao-card>

      <p class="chat-disclaimer">
        如果你正经历强烈的痛苦或有伤害自己的念头，请立即拨打
        <mao-link href="tel:4001619995">400-161-9995</mao-link>。
      </p>
    </div>
  </div>
</template>

<style scoped>
.chat-page {
  height: calc(100vh - 65px);
  min-height: 620px;
  padding: 18px;
}

.chat-shell {
  width: min(100%, 760px);
  height: 100%;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 4px 2px 16px;
}

.chat-id {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-id h1 {
  font-size: var(--mt-fs-lg);
}

.chat-id p {
  color: var(--mt-muted);
  font-size: var(--mt-fs-xs);
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--mt-sage);
  box-shadow: 0 0 0 5px var(--mt-sage-soft);
}

.chat-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px 2px;
}

.message {
  max-width: 82%;
  line-height: 1.75;
}

.message.user {
  align-self: flex-end;
  background: var(--mt-accent-soft);
}

.message.companion {
  align-self: flex-start;
}

.message p + p {
  margin-top: 8px;
}

.typing {
  display: flex;
  gap: 5px;
}

.typing span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--mt-muted);
  animation: bob 1s ease-in-out infinite;
}

.typing span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing span:nth-child(3) {
  animation-delay: 0.3s;
}

.chat-input-card {
  flex: none;
}

.chat-input-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.chat-input {
  flex: 1;
}

.chat-disclaimer {
  color: var(--mt-muted);
  font-size: var(--mt-fs-xs);
  line-height: 1.6;
  text-align: center;
}

@keyframes bob {
  50% {
    transform: translateY(-4px);
    opacity: 0.5;
  }
}

@media (max-width: 560px) {
  .chat-page {
    height: auto;
    min-height: calc(100vh - 65px);
    padding: 12px;
  }

  .chat-shell {
    min-height: calc(100vh - 89px);
  }

  .chat-list {
    min-height: 360px;
  }

  .message {
    max-width: 92%;
  }
}
</style>
