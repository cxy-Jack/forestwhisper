<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { articles, getArticle } from '@/data/articles'
import { useAssessStore } from '@/stores/assess'

const route = useRoute()
const router = useRouter()
const store = useAssessStore()
const article = computed(() => getArticle(route.params.id as string))

if (!article.value) {
  router.replace('/articles')
}

const isFav = computed(() => (article.value ? store.isFavorite(article.value.id) : false))
const nextRead = computed(() => {
  if (!article.value) return null
  return (
    articles.find(
      (item) =>
        item.id !== article.value!.id && item.mood.some((mood) => article.value!.mood.includes(mood))
    ) ??
    articles.find((item) => item.id !== article.value!.id) ??
    null
  )
})
</script>

<template>
  <div v-if="article" class="page narrow">
    <mao-button variant="light" size="sm" class="back" @click="router.push('/articles')">
      返回阅读
    </mao-button>

    <header class="article-head">
      <mao-badge :tone="article.kind === 'book' ? 'sage' : 'blue'">
        {{ article.kind === 'book' ? '一本书' : '一篇文章' }}
      </mao-badge>
      <h1>{{ article.title }}</h1>
      <p v-if="article.author" class="author">{{ article.author }}</p>
      <p class="digest">{{ article.digest }}</p>

      <div class="article-meta">
        <mao-badge v-for="tag in article.tags" :key="tag">{{ tag }}</mao-badge>
        <mao-button
          size="sm"
          :color="isFav ? 'primary' : 'neutral'"
          :variant="isFav ? 'flat' : 'bordered'"
          @click="store.toggleFavorite(article.id)"
        >
          <mao-icon :name="isFav ? 'bookmark' : 'plus'" size="15"></mao-icon>
          {{ isFav ? '已收藏' : '收进书签' }}
        </mao-button>
      </div>
    </header>

    <article class="article-body">
      <p v-for="(paragraph, index) in article.content" :key="index">{{ paragraph }}</p>
    </article>

    <mao-notice tone="blue" title="文献依据">{{ article.evidence }}</mao-notice>

    <mao-card v-if="nextRead" padding="md">
      <div class="mt-card-body">
        <p class="muted">读完这篇，或许你还想看看</p>
        <RouterLink :to="`/articles/${nextRead.id}`" class="next-title">
          {{ nextRead.title }}
        </RouterLink>
      </div>
    </mao-card>

    <p class="foot-wish muted">
      如果这篇文字触动了什么，欢迎去
      <RouterLink to="/wishes" class="inline-link">心愿墙</RouterLink>
      写下来，或者去
      <RouterLink to="/chat" class="inline-link">聊聊</RouterLink>。
    </p>
  </div>
</template>

<style scoped>
.back {
  margin-bottom: 20px;
}

.article-head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 32px;
}

.article-head h1 {
  font-family: var(--mt-font-display);
  font-size: clamp(34px, 6vw, 56px);
  line-height: 1.25;
}

.author {
  color: var(--mt-muted);
  font-family: var(--mt-mono);
  font-size: var(--mt-fs-sm);
}

.digest {
  padding: 14px 16px;
  border-radius: var(--mt-radius-lg);
  background: var(--mt-surface-2);
  color: var(--mt-muted);
  font-size: var(--mt-fs-lg);
  line-height: var(--mt-lh);
}

.article-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.article-body {
  margin-bottom: 28px;
  font-family: var(--mt-font-cn);
  font-size: 18px;
  line-height: 2;
}

.article-body p + p {
  margin-top: 20px;
}

.next-title {
  display: inline-block;
  margin-top: 8px;
  color: var(--mt-accent);
  font-family: var(--mt-font-display);
  font-size: var(--mt-fs-xl);
}

.foot-wish {
  margin-top: 20px;
  line-height: 1.9;
}

.inline-link {
  color: var(--mt-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
