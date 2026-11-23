<script setup lang="ts">
import { computed, ref } from 'vue'
import WishCard from '@/components/WishCard.vue'
import { useWishesStore } from '@/stores/wishes'
import type { Wish, WishMood } from '@/data/types'
import { eventValue } from '@/maotaui'

const store = useWishesStore()
const moods: WishMood[] = ['开心', '日常', '秘密', '想法', '情绪', '共鸣']
const filters: Array<WishMood | '全部'> = ['全部', ...moods]

const draft = ref('')
const mood = ref<WishMood | null>(null)
const posted = ref(false)
const filter = ref<WishMood | '全部'>('全部')

const canPost = computed(() => draft.value.trim().length >= 2 && mood.value !== null)
const filtered = computed(() =>
  filter.value === '全部' ? store.wishes : store.wishes.filter((wish) => wish.mood === filter.value)
)

function setDraft(event: Event) {
  draft.value = eventValue(event).slice(0, 200)
}

function setMood(event: Event) {
  mood.value = eventValue(event) as WishMood
}

function setFilter(event: Event) {
  filter.value = eventValue(event) as Wish['mood'] | '全部'
}

function submit() {
  if (!canPost.value || !mood.value) return
  store.addWish(draft.value.trim(), mood.value)
  draft.value = ''
  mood.value = null
  posted.value = true
  window.setTimeout(() => (posted.value = false), 3600)
}

</script>

<template>
  <div class="page container">
    <header class="page-head">
      <p class="eyebrow">WISH WALL / 01</p>
      <h1 class="page-title">心愿墙</h1>
      <p class="page-sub">没有网名，没有头像。写完就挂在这面墙上，谁路过都能看见。</p>
    </header>

    <mao-card padding="lg" class="composer-card">
      <div class="mt-card-body stack">
        <mao-text-area
          label="写下此刻"
          hint="最多 200 字"
          placeholder="此刻想说什么都可以。"
          rows="4"
          :value="draft"
          @mt-input="setDraft"
        ></mao-text-area>

        <div class="segmented-wrap">
          <mao-segmented label="表达类型" :value="mood ?? ''" @mt-change="setMood">
            <mao-segment v-for="item in moods" :key="item" :value="item">
              {{ item }}
            </mao-segment>
          </mao-segmented>
        </div>

        <div class="composer-foot">
          <span class="muted">先选一个表达类型，再挂上去。</span>
          <mao-button
            color="primary"
            :disabled="!canPost ? '' : undefined"
            @click="submit"
          >
            挂上去
          </mao-button>
        </div>
        <mao-notice v-if="posted" tone="sage" title="挂好了">
          你的心愿已经加入列表。
        </mao-notice>
      </div>
    </mao-card>

    <div class="segmented-wrap filters">
      <mao-segmented label="按表达类型筛选" :value="filter" @mt-change="setFilter">
        <mao-segment v-for="item in filters" :key="item" :value="item">
          {{ item }}
        </mao-segment>
      </mao-segmented>
    </div>

    <div class="wish-list stack">
      <div v-for="wish in filtered" :key="wish.id" class="wish-wrap">
        <WishCard :wish="wish" />
      </div>
    </div>

    <mao-card v-if="!filtered.length" padding="lg" transparent>
      <div class="mt-card-body">
        <p class="muted">这一栏还没人说话，你第一个来？</p>
      </div>
    </mao-card>
  </div>
</template>

<style scoped>
.composer-card {
  margin-bottom: 22px;
}

.composer-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.filters {
  margin-bottom: 18px;
}

.segmented-wrap {
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.segmented-wrap::-webkit-scrollbar {
  display: none;
}

.segmented-wrap :deep(mao-segmented) {
  width: max-content;
}

.wish-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 560px) {
  .composer-foot {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
