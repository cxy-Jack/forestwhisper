<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { articles } from '@/data/articles'
import { useAssessStore } from '@/stores/assess'
import type { ScaleLevel } from '@/data/types'

const store = useAssessStore()
const router = useRouter()
const favorites = computed(() => articles.filter((article) => store.favorites.includes(article.id)))

const levelTone: Record<ScaleLevel, string> = {
  minimal: 'sage',
  mild: 'accent',
  moderate: 'neutral',
  severe: 'danger'
}

const levelLabel: Record<ScaleLevel, string> = {
  minimal: '平稳',
  mild: '轻度',
  moderate: '中度',
  severe: '需关注'
}
</script>

<template>
  <div class="page container">
    <header class="page-head">
      <p class="eyebrow">MINE / 05</p>
      <h1 class="page-title">我的足迹</h1>
      <p class="page-sub">所有数据只留在你的浏览器里。</p>
    </header>

    <mao-card padding="lg" class="section-card">
      <div class="mt-card-body">
        <mao-header level="3" name="测评记录" description="定期回来看看自己的变化。"></mao-header>

        <div v-if="store.records.length" class="record-list">
          <article v-for="(record, index) in store.records" :key="index" class="record-row">
            <div>
              <h2>{{ record.scaleName }}</h2>
              <mao-badge :tone="levelTone[record.level]">
                {{ record.levelTitle }} · {{ levelLabel[record.level] }}
              </mao-badge>
            </div>
            <div class="record-side">
              <strong>{{ record.score }} <small>/ {{ record.maxScore }}</small></strong>
              <span>{{ record.date }}</span>
            </div>
          </article>
        </div>

        <mao-notice v-else tone="blue" title="还没有测评记录">
          第一次看见自己，从一份小量表开始。
        </mao-notice>

        <mao-button
          v-if="!store.records.length"
          color="primary"
          variant="bordered"
          @click="router.push('/assess')"
        >
          去做一次测评
        </mao-button>
      </div>
    </mao-card>

    <mao-card padding="lg" class="section-card">
      <div class="mt-card-body">
        <mao-header
          level="3"
          name="收进书签的文字"
          description="读到触动的文字时，点一下「收进书签」。"
        ></mao-header>

        <div v-if="favorites.length" class="favorite-list">
          <RouterLink
            v-for="article in favorites"
            :key="article.id"
            :to="`/articles/${article.id}`"
            class="favorite-row"
            :aria-label="article.title"
          >
            <mao-badge :tone="article.kind === 'book' ? 'sage' : 'blue'">
              {{ article.kind === 'book' ? '书' : '文' }}
            </mao-badge>
            <span>{{ article.title }}</span>
            <mao-icon name="chevron-right" size="16"></mao-icon>
          </RouterLink>
        </div>

        <mao-notice v-else tone="blue" title="书签还空着">
          去读点什么，把喜欢的文字留在这里。
        </mao-notice>

        <mao-button
          v-if="!favorites.length"
          color="primary"
          variant="bordered"
          @click="router.push('/articles')"
        >
          去读点什么
        </mao-button>
      </div>
    </mao-card>

    <p class="muted">状态会流动，人也是。比起某一次的分数，更重要的是看见自己的变化。</p>
  </div>
</template>

<style scoped>
.section-card {
  margin-bottom: 18px;
}

.record-list,
.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 16px 0;
}

.record-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
  border-radius: var(--mt-radius-lg);
  background: var(--mt-surface-2);
}

.record-row h2 {
  margin-bottom: 7px;
  font-size: var(--mt-fs-lg);
}

.record-side {
  display: flex;
  align-items: baseline;
  gap: 14px;
  font-family: var(--mt-mono);
  font-size: var(--mt-fs-xs);
}

.record-side strong {
  font-size: var(--mt-fs-xl);
}

.record-side small {
  color: var(--mt-muted);
}

.favorite-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: var(--mt-radius-lg);
  background: var(--mt-surface-2);
}

.favorite-row span {
  flex: 1;
  font-family: var(--mt-font-cn);
  font-size: var(--mt-fs-lg);
}

.section-card :deep(mao-notice) {
  margin: 16px 0;
}

@media (max-width: 520px) {
  .record-row {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
