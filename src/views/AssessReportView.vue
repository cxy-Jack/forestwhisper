<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { articles } from '@/data/articles'
import { getScale } from '@/data/scales'

const route = useRoute()
const scale = computed(() => getScale(route.params.id as string))
const score = computed(() => Number(route.query.score ?? 0))

const band = computed(() => {
  if (!scale.value) return null
  return (
    scale.value.bands.find((item) => score.value >= item.min && score.value <= item.max) ??
    scale.value.bands[0]
  )
})

const suggestReads = computed(() => {
  if (!band.value) return []
  if (band.value.level === 'minimal') return articles.filter((item) => ['a5', 'b3'].includes(item.id))
  if (band.value.level === 'mild') return articles.filter((item) => ['a1', 'a3'].includes(item.id))
  if (band.value.level === 'moderate') return articles.filter((item) => ['b2', 'a4'].includes(item.id))
  return articles.filter((item) => item.id === 'b1')
})

const isSevere = computed(
  () => band.value?.level === 'severe' || band.value?.level === 'moderate'
)
</script>

<template>
  <div v-if="scale && band" class="page narrow report-page">
    <header class="report-head">
      <p class="eyebrow">你的测评结果 · {{ scale.shortName }}</p>
      <h1 class="page-title">{{ band.title }}</h1>
      <p class="page-sub">{{ band.summary }}</p>
    </header>

    <mao-card padding="lg">
      <div class="mt-card-body">
        <div class="score-row">
          <mao-metric label="本次得分" :value="`${score} / ${scale.maxScore}`"></mao-metric>
          <mao-badge :tone="band.level === 'severe' ? 'danger' : 'accent'">
            {{ band.level === 'minimal' ? '平稳' : band.level === 'severe' ? '需关注' : '需要照顾' }}
          </mao-badge>
        </div>
        <mao-progress
          :value="score"
          :max="scale.maxScore"
          label="得分区间"
          show-value
        ></mao-progress>
        <div class="band-list">
          <mao-badge
            v-for="item in scale.bands"
            :key="item.min"
            :tone="item === band ? 'accent' : 'neutral'"
          >
            {{ item.title }}
          </mao-badge>
        </div>
      </div>
    </mao-card>

    <mao-card padding="lg">
      <div class="mt-card-body">
        <mao-header level="3" name="想对你说"></mao-header>
        <p class="body-copy">{{ band.suggestion }}</p>
      </div>
    </mao-card>

    <mao-notice v-if="isSevere" tone="danger" title="如果你此刻很难熬">
      请记得，你不必独自撑过今晚。全国 24 小时心理援助热线：
      <mao-link href="tel:4001619995">400-161-9995</mao-link>；北京心理危机研究与干预中心：
      <mao-link href="tel:01082951332">010-82951332</mao-link>。若出现伤害自己的念头，请立即拨打
      120 或前往就近医院急诊。
    </mao-notice>

    <section>
      <mao-header
        level="3"
        name="接下来，可以去这些地方"
        description="选一个现在做起来最轻的动作。"
      ></mao-header>

      <div class="next-grid">
        <RouterLink
          v-for="article in suggestReads"
          :key="article.id"
          :to="`/articles/${article.id}`"
          :aria-label="article.title"
        >
          <mao-card padding="md" hoverable>
            <div class="mt-card-body">
              <mao-badge :tone="article.kind === 'book' ? 'sage' : 'blue'">
                {{ article.kind === 'book' ? '一本书' : '读一读' }}
              </mao-badge>
              <h2 class="mt-card-header">{{ article.title }}</h2>
            </div>
          </mao-card>
        </RouterLink>
        <RouterLink to="/breathe" aria-label="呼吸与冥想，让身体先慢下来">
          <mao-card padding="md" hoverable>
            <div class="mt-card-body">
              <mao-badge tone="accent">练习</mao-badge>
              <h2 class="mt-card-header">呼吸与冥想 · 让身体先慢下来</h2>
            </div>
          </mao-card>
        </RouterLink>
        <RouterLink to="/wishes" aria-label="心愿墙，把此刻写下来">
          <mao-card padding="md" hoverable>
            <div class="mt-card-body">
              <mao-badge tone="accent">表达</mao-badge>
              <h2 class="mt-card-header">心愿墙 · 把此刻写下来</h2>
            </div>
          </mao-card>
        </RouterLink>
      </div>
    </section>

    <mao-card padding="md" transparent>
      <div class="mt-card-body">
        <p class="muted">
          这份结果只是此刻的一面镜子，不是标签，更不是诊断。状态会流动，人也是。
          <RouterLink to="/assess" class="back-link">回到测评列表</RouterLink>
        </p>
      </div>
    </mao-card>
  </div>
</template>

<style scoped>
.report-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.report-head {
  padding: 8px 0 12px;
  text-align: center;
}

.score-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.band-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.body-copy {
  margin-top: 12px;
  line-height: 1.9;
}

.next-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.next-grid h2 {
  margin-top: 10px;
  font-size: var(--mt-fs-lg);
  line-height: 1.5;
}

.back-link {
  color: var(--mt-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 560px) {
  .next-grid {
    grid-template-columns: 1fr;
  }
}
</style>
