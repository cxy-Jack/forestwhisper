<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Article } from '@/data/types'

const props = defineProps<{ article: Article }>()
const isBook = computed(() => props.article.kind === 'book')
</script>

<template>
  <RouterLink :to="`/articles/${article.id}`" class="article-link" :aria-label="article.title">
    <mao-card padding="md" hoverable>
      <div class="mt-card-body">
        <article class="article-entry">
          <header>
            <mao-badge :tone="isBook ? 'sage' : 'blue'">{{ isBook ? '书' : '文' }}</mao-badge>
            <span>{{ isBook ? '可随时翻开' : `${article.minutes} 分钟` }}</span>
          </header>

          <h3 class="mt-card-header">{{ article.title }}</h3>
          <p v-if="article.author" class="author">{{ article.author }}</p>
          <p class="digest">{{ article.digest }}</p>

          <footer class="mt-card-footer">
            <span>{{ article.evidence.split('；')[0].split('，')[0] }}</span>
            <mao-icon name="arrow-up-right" size="16"></mao-icon>
          </footer>
        </article>
      </div>
    </mao-card>
  </RouterLink>
</template>

<style scoped>
.article-link {
  display: block;
}

.article-entry {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.article-entry header,
.article-entry footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--mt-muted);
  font-family: var(--mt-mono);
  font-size: var(--mt-fs-xs);
}

.article-entry h3 {
  font-family: var(--mt-font-display);
  font-size: var(--mt-fs-xl);
  line-height: var(--mt-lh-tight);
}

.author {
  color: var(--mt-muted);
  font-size: var(--mt-fs-sm);
}

.digest {
  color: var(--mt-muted);
  line-height: var(--mt-lh);
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.article-link :deep(.mt-card) {
  height: 100%;
}
</style>
