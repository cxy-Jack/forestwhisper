<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'done'

const phase = ref<Phase>('idle')
const round = ref(0)
const count = ref(0)
const totalRounds = 3

const phaseMeta: Record<Phase, { label: string; hint: string }> = {
  idle: { label: '准备好就开始', hint: '找个舒服的姿势，让肩膀松下来' },
  inhale: { label: '吸气', hint: '用鼻子，慢慢地，把空气送到腹部' },
  hold: { label: '停一停', hint: '让氧气在身体里安静地待一会儿' },
  exhale: { label: '呼气', hint: '噘起嘴唇，像吹凉一杯茶，缓缓吐出' },
  done: { label: '做得很好', hint: '留意一下，身体里有什么松开了吗' }
}

const durations: Record<'inhale' | 'hold' | 'exhale', number> = {
  inhale: 4,
  hold: 7,
  exhale: 8
}

let timer: number | null = null

function clearTimer() {
  if (timer !== null) {
    window.clearInterval(timer)
    timer = null
  }
}

function runPhase(next: Phase) {
  phase.value = next
  if (next === 'done' || next === 'idle') return

  count.value = durations[next]
  clearTimer()
  timer = window.setInterval(() => {
    count.value--
    if (count.value > 0) return

    clearTimer()
    if (next === 'inhale') runPhase('hold')
    else if (next === 'hold') runPhase('exhale')
    else {
      round.value++
      if (round.value < totalRounds) runPhase('inhale')
      else phase.value = 'done'
    }
  }, 1000)
}

function start() {
  round.value = 0
  runPhase('inhale')
}

function reset() {
  clearTimer()
  phase.value = 'idle'
  round.value = 0
  count.value = 0
}

onUnmounted(clearTimer)

const running = computed(() => ['inhale', 'hold', 'exhale'].includes(phase.value))
</script>

<template>
  <div class="page narrow breathe-page">
    <mao-card padding="lg">
      <div class="mt-card-body">
        <header class="breathe-head">
          <p class="eyebrow">BREATHE / 04</p>
          <h1>4 · 7 · 8</h1>
          <p>延长的呼气会告诉身体：现在安全了。</p>
        </header>

        <mao-progress
          :value="round"
          :max="totalRounds"
          :label="`第 ${Math.min(round + 1, totalRounds)} 轮`"
          show-value
          tone="sage"
        ></mao-progress>

        <div class="circle-wrap" :class="phase">
          <div class="orbit" aria-hidden="true"></div>
          <div class="halo" aria-hidden="true"></div>
          <div class="breath-circle">
            <span class="phase-label">{{ phaseMeta[phase].label }}</span>
            <strong v-if="running">{{ count }}</strong>
            <span v-else-if="phase === 'idle'" class="rounds">三轮 · 约一分钟</span>
            <span v-else class="rounds">结束</span>
          </div>
        </div>

        <p class="phase-hint" aria-live="polite">
          {{ phaseMeta[phase].hint }}
          <template v-if="running">（第 {{ round + 1 }} 轮，共 {{ totalRounds }} 轮）</template>
        </p>

        <div class="actions">
          <mao-button v-if="!running" color="primary" @click="start">
            {{ phase === 'done' ? '再来一轮' : '开始呼吸' }}
          </mao-button>
          <mao-button v-else variant="bordered" @click="reset">提前结束</mao-button>
        </div>

        <p class="note muted">
          做完如果还想待一会儿，可以去
          <RouterLink to="/wishes">心愿墙</RouterLink>
          坐坐，或者
          <RouterLink to="/chat">找人聊聊</RouterLink>。
        </p>
      </div>
    </mao-card>
  </div>
</template>

<style scoped>
.breathe-page {
  max-width: 720px;
}

.breathe-head {
  margin-bottom: 24px;
  text-align: center;
}

.breathe-head h1 {
  font-family: var(--mt-font-display);
  font-size: clamp(44px, 10vw, 76px);
  letter-spacing: 0.08em;
}

.breathe-head p:last-child {
  margin-top: 8px;
  color: var(--mt-muted);
}

.circle-wrap {
  position: relative;
  width: 280px;
  height: 280px;
  margin: 48px auto 24px;
  display: grid;
  place-items: center;
}

.orbit {
  position: absolute;
  inset: 0;
  border: 1px solid var(--mt-border);
  border-radius: 50%;
  animation: orbit 60s linear infinite;
}

.orbit::after {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--mt-accent);
}

.halo {
  position: absolute;
  inset: 28px;
  border: 1px solid var(--mt-border);
  border-radius: 50%;
  transition: transform 4s ease-in-out;
}

.breath-circle {
  width: 184px;
  height: 184px;
  border: 1px solid var(--mt-accent);
  border-radius: 50%;
  background: var(--mt-accent-soft);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: transform 4s ease-in-out;
}

.breath-circle strong {
  font-family: var(--mt-font-display);
  font-size: 64px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.phase-label {
  color: var(--mt-accent);
  font-family: var(--mt-mono);
  font-size: var(--mt-fs-sm);
}

.rounds {
  color: var(--mt-muted);
  font-size: var(--mt-fs-xs);
}

.inhale .halo,
.hold .halo {
  transform: scale(1.16);
}

.inhale .breath-circle,
.hold .breath-circle {
  transform: scale(1.1);
}

.exhale .halo {
  transform: scale(0.92);
  transition-duration: 8s;
}

.exhale .breath-circle {
  transform: scale(0.9);
  transition-duration: 8s;
}

.done .breath-circle {
  animation: pulse 3s ease-in-out infinite;
}

.phase-hint {
  min-height: 3em;
  color: var(--mt-muted);
  line-height: 1.7;
  text-align: center;
}

.actions {
  display: flex;
  justify-content: center;
  margin: 16px 0 24px;
}

.note {
  line-height: 1.8;
  text-align: center;
}

.note a {
  color: var(--mt-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@keyframes orbit {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  50% {
    box-shadow: 0 0 0 12px var(--mt-accent-soft);
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit,
  .done .breath-circle {
    animation: none;
  }
}
</style>
