<script setup lang="ts">
import { computed, ref } from 'vue'
import ArticleCard from '@/components/ArticleCard.vue'
import { articles } from '@/data/articles'
import { eventValue } from '@/maotaui'

type Tab = 'all' | 'article' | 'book'
const tab = ref<Tab>('all')

const tabs = [
  { value: 'all', label: '全部' },
  { value: 'article', label: '文章' },
  { value: 'book', label: '书籍' }
] as const

const list = computed(() =>
  tab.value === 'all' ? articles : articles.filter((article) => article.kind === tab.value)
)

function setTab(event: Event) {
  tab.value = eventValue(event) as Tab
}
</script>

<template>
  <div class="page container">
    <header class="page-head">
      <p class="eyebrow">READING / 03</p>
      <h1 class="page-title">阅读与书籍</h1>
      <p class="page-sub">每一篇都以心理学研究为据，文献出处附在文末。不讲玄学，只递方法。</p>
    </header>

    <mao-segmented label="内容类型" :value="tab" @mt-change="setTab" class="tabs">
      <mao-segment v-for="item in tabs" :key="item.value" :value="item.value">
        {{ item.label }}
      </mao-segment>
    </mao-segmented>

    <div class="article-list stack">
      <ArticleCard v-for="article in list" :key="article.id" :article="article" />
    </div>
  </div>
</template>

<style scoped>
.tabs {
  width: max-content;
  margin-bottom: 20px;
}

.article-list {
  gap: 12px;
}
</style>
