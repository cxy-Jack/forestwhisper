<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { scales } from '@/data/scales'
import { useAssessStore } from '@/stores/assess'

const store = useAssessStore()
</script>

<template>
  <div class="page container">
    <header class="page-head">
      <p class="eyebrow">SELF / 02</p>
      <h1 class="page-title">心理测评</h1>
      <p class="page-sub">
        量表来自公开发表的心理学研究，信效度可查。它不能代替诊断，只是照照镜子。
      </p>
    </header>

    <div class="scale-list stack">
      <RouterLink
        v-for="(scale, index) in scales"
        :key="scale.id"
        :to="`/assess/${scale.id}`"
        :aria-label="`${scale.name}，${scale.duration}`"
      >
        <mao-card padding="md" hoverable>
          <article class="mt-card-body scale-row">
            <span class="scale-index">{{ String(index + 1).padStart(2, '0') }}</span>

            <div class="scale-main">
              <div class="scale-title">
                <h2>{{ scale.name }}</h2>
                <mao-badge tone="accent">{{ scale.shortName }}</mao-badge>
              </div>
              <p>{{ scale.description }}</p>
              <small>{{ scale.evidence }}</small>
            </div>

            <div class="scale-side">
              <span>{{ scale.duration }} · {{ scale.questions.length }} 题</span>
              <span v-if="store.latestByScale.get(scale.id)" class="latest">
                上次 · {{ store.latestByScale.get(scale.id)!.levelTitle }}
              </span>
              <mao-icon name="chevron-right" size="16"></mao-icon>
            </div>
          </article>
        </mao-card>
      </RouterLink>
    </div>

    <mao-notice tone="blue" title="结果只保存在本机">
      你可以随时重测，看看自己的变化。
    </mao-notice>
  </div>
</template>

<style scoped>
.scale-list {
  margin-bottom: 20px;
}

.scale-row {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  gap: 20px;
  align-items: start;
}

.scale-index {
  color: var(--mt-faint);
  font-family: var(--mt-mono);
  font-size: var(--mt-fs-sm);
}

.scale-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scale-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.scale-title h2 {
  font-family: var(--mt-font-display);
  font-size: var(--mt-fs-xl);
}

.scale-main p {
  color: var(--mt-muted);
  line-height: var(--mt-lh);
}

.scale-main small {
  color: var(--mt-faint);
  line-height: 1.6;
}

.scale-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  color: var(--mt-muted);
  font-family: var(--mt-mono);
  font-size: var(--mt-fs-xs);
  text-align: right;
}

.latest {
  color: var(--mt-accent);
}

@media (max-width: 680px) {
  .scale-row {
    grid-template-columns: 32px minmax(0, 1fr);
  }

  .scale-side {
    grid-column: 2;
    align-items: flex-start;
    text-align: left;
  }
}
</style>
