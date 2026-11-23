<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import WishCard from '@/components/WishCard.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import { useWishesStore } from '@/stores/wishes'
import { articles } from '@/data/articles'
import type { WishMood } from '@/data/types'

const store = useWishesStore()
const router = useRouter()
const moods: WishMood[] = ['开心', '日常', '秘密', '想法', '情绪', '共鸣']
const filters: Array<WishMood | '全部'> = ['全部', ...moods]

const filter = ref<WishMood | '全部'>('全部')

const visibleWishes = computed(() => {
  const list =
    filter.value === '全部' ? store.wishes : store.wishes.filter((wish) => wish.mood === filter.value)
  return list.slice(0, 8)
})

const feedItems = computed(() => {
  const items: Array<
    | { type: 'wish'; data: (typeof visibleWishes.value)[number] }
    | { type: 'article'; data: (typeof articles)[number] }
  > = visibleWishes.value.map((data) => ({ type: 'wish', data }))

  if (filter.value === '全部' && items.length >= 4) {
    items.splice(4, 0, { type: 'article', data: articles[0] })
  }
  return items
})

const helpers = [
  { icon: 'lightbulb', title: '静不下来', text: '做一轮 4-7-8 呼吸', to: '/breathe' },
  { icon: 'brain', title: '想认识自己', text: '从一份心理量表开始', to: '/assess' },
  { icon: 'message-square', title: '想有人听', text: '和陪伴者聊一会儿', to: '/chat' },
  { icon: 'bookmark', title: '想读点什么', text: '看看有研究依据的文章', to: '/articles' }
]

function setFilter(event: Event) {
  filter.value = (event as CustomEvent<{ value: string }>).detail.value as WishMood | '全部'
}
</script>

<template>
  <div class="home-page">
    <section class="page home-container">
      <div class="home-grid">
        <div class="feed-column">
          <div class="filter-toolbar">
            <mao-segmented label="按表达类型筛选" :value="filter" @mt-change="setFilter">
              <mao-segment v-for="item in filters" :key="item" :value="item">
                {{ item }}
              </mao-segment>
            </mao-segmented>
          </div>

          <div class="feed">
            <template v-for="item in feedItems" :key="item.data.id">
              <WishCard v-if="item.type === 'wish'" :wish="item.data" />
              <ArticleCard v-else :article="item.data" />
            </template>
          </div>

          <mao-card v-if="!visibleWishes.length" padding="lg" transparent>
            <div class="mt-card-body">
              <p class="muted">这个分类下还没有人说话。</p>
            </div>
          </mao-card>

          <mao-button variant="bordered" @click="router.push('/wishes')">
            查看全部 {{ store.wishes.length }} 条
          </mao-button>
        </div>

        <aside class="home-rail" aria-label="更多入口">
          <mao-card padding="lg">
            <div class="mt-card-body rail-panel">
              <mao-header
                level="2"
                name="睡不着的时候，找点事做"
                description="每个入口都直接、安静，不要求你先整理好情绪。"
              ></mao-header>

              <div class="helper-list">
                <mao-button
                  v-for="item in helpers"
                  :key="item.to"
                  block
                  variant="light"
                  class="helper-link"
                  :aria-label="`${item.title}：${item.text}`"
                  @click="router.push(item.to)"
                >
                  <mao-icon :name="item.icon" size="22"></mao-icon>
                  <span class="helper-copy">
                    <strong>{{ item.title }}</strong>
                    <small>{{ item.text }}</small>
                  </span>
                </mao-button>
              </div>

              <mao-notice tone="blue" title="关于你的数据">
                测评分级依据公开发表的量表，当前结果只存在你自己的浏览器里。
              </mao-notice>
            </div>
          </mao-card>

          <footer class="home-footer">
            <p>
              这里不是医院，也给不了诊断。如果最近真的很难熬，请拨打
              <mao-link href="tel:4001619995">400-161-9995</mao-link>。
            </p>
            <p class="muted">林影心语 · 睡不着的人，先在这坐一会儿。</p>
          </footer>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(320px, 26vw, 400px);
  gap: 32px;
  align-items: start;
}

.home-container {
  width: min(100% - 64px, 1360px);
  margin-inline: auto;
}

.feed-column,
.home-rail {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.home-rail {
  position: sticky;
  top: calc(var(--app-topbar-height) + 24px);
}

.filter-toolbar {
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}

.filter-toolbar::-webkit-scrollbar {
  display: none;
}

.filter-toolbar :deep(mao-segmented) {
  width: max-content;
  padding: 0;
  border: 0;
  background: transparent;
  gap: 8px;
}

.filter-toolbar :deep(.mt-segmented-item) {
  padding: 7px 14px;
  border: 0;
  border-radius: var(--mt-radius-pill);
  background: var(--mt-surface-2);
}

.filter-toolbar :deep(.mt-segmented-item.is-on) {
  color: var(--mt-bg);
  background: var(--mt-text);
  box-shadow: none;
}

.feed {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}

.rail-panel,
.helper-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.helper-link {
  justify-content: flex-start;
  min-height: 58px;
  padding: 10px 12px;
  border-radius: var(--mt-radius-lg);
  background: var(--mt-surface-2);
  text-align: left;
  white-space: normal;
}

.helper-link:hover {
  background: color-mix(in srgb, var(--mt-surface-2) 70%, var(--mt-surface));
}

.helper-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.helper-copy strong {
  color: var(--mt-text);
  font-size: var(--mt-fs-md);
}

.helper-copy small {
  color: var(--mt-muted);
  font-size: var(--mt-fs-sm);
}

.home-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--mt-muted);
  line-height: var(--mt-lh);
}

@media (max-width: 1280px) {
  .home-grid {
    grid-template-columns: 1fr;
  }

  .home-rail {
    display: none;
  }

  .home-container {
    width: min(100% - 40px, 960px);
  }
}
</style>
