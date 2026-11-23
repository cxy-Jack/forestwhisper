<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { calcScore, getScale } from '@/data/scales'
import { useAssessStore } from '@/stores/assess'

const route = useRoute()
const router = useRouter()
const store = useAssessStore()
const scale = computed(() => getScale(route.params.id as string))

const current = ref(0)
const answers = ref<number[]>([])
const picked = ref<number | null>(null)

if (!scale.value) {
  router.replace('/assess')
}

function pick(value: number) {
  if (picked.value !== null || !scale.value) return
  picked.value = value

  window.setTimeout(() => {
    answers.value[current.value] = value
    if (current.value < scale.value!.questions.length - 1) {
      current.value++
      picked.value = null
    } else {
      finish()
    }
  }, 300)
}

function back() {
  if (current.value === 0) return
  current.value--
  picked.value = answers.value[current.value] ?? null
  answers.value = answers.value.slice(0, current.value)
}

function finish() {
  if (!scale.value) return
  const score = calcScore(scale.value.id, answers.value)
  const band =
    scale.value.bands.find((item) => score >= item.min && score <= item.max) ??
    scale.value.bands[0]

  store.addRecord({
    scaleId: scale.value.id,
    scaleName: scale.value.shortName,
    score,
    maxScore: scale.value.maxScore,
    level: band.level,
    levelTitle: band.title,
    date: new Date().toISOString().slice(0, 10)
  })

  router.replace({
    path: `/assess/${scale.value.id}/report`,
    query: { score: String(score) }
  })
}
</script>

<template>
  <div v-if="scale" class="page narrow quiz-page">
    <mao-progress
      :value="current"
      :max="scale.questions.length"
      :label="`${scale.shortName} · 第 ${current + 1} 题`"
      show-value
    ></mao-progress>

    <mao-card padding="lg">
      <div class="mt-card-body">
        <div class="quiz-head">
          <div>
            <p class="eyebrow">{{ scale.shortName }}</p>
            <h1>{{ scale.name }}</h1>
          </div>
          <mao-badge>{{ current + 1 }} / {{ scale.questions.length }}</mao-badge>
        </div>

        <p class="guide">回想一下：过去的这段时间里，这种情况出现的频率是？</p>
        <h2 class="question">{{ scale.questions[current].text }}</h2>

        <div class="options">
          <mao-button
            v-for="option in scale.options"
            :key="option.value"
            block
            :color="picked === option.value ? 'primary' : 'neutral'"
            :variant="picked === option.value ? 'solid' : 'bordered'"
            :disabled="picked !== null ? '' : undefined"
            @click="pick(option.value)"
          >
            {{ option.label }}
          </mao-button>
        </div>

        <footer class="quiz-foot">
          <mao-button v-if="current > 0" variant="light" @click="back">上一题</mao-button>
          <span v-else></span>
          <span class="muted">凭直觉作答就好，没有对错</span>
        </footer>
      </div>
    </mao-card>
  </div>
</template>

<style scoped>
.quiz-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 720px;
}

.quiz-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.quiz-head h1 {
  font-family: var(--mt-font-display);
  font-size: var(--mt-fs-2xl);
  line-height: var(--mt-lh-tight);
}

.guide {
  margin-bottom: 10px;
  color: var(--mt-muted);
  font-size: var(--mt-fs-sm);
}

.question {
  min-height: 4.8em;
  margin-bottom: 24px;
  font-family: var(--mt-font-cn);
  font-size: clamp(22px, 4vw, 30px);
  line-height: 1.6;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quiz-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
  font-size: var(--mt-fs-sm);
}
</style>
