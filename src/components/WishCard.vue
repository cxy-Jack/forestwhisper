<script setup lang="ts">
import type { Wish } from '@/data/types'
import { useWishesStore } from '@/stores/wishes'

defineProps<{ wish: Wish; compact?: boolean }>()
const store = useWishesStore()
</script>

<template>
  <mao-card transparent padding="md" class="post-card">
    <div class="mt-card-body">
      <article class="post">
        <mao-avatar :label="wish.mood.slice(0, 1)" tone="accent" size="md"></mao-avatar>

        <div class="post-main">
          <header class="post-head">
            <strong>匿名心愿</strong>
          </header>

          <p class="post-body" :class="{ compact }">{{ wish.content }}</p>

          <footer class="post-actions">
            <span class="action" title="评论">
              <mao-icon name="message-circle" size="19"></mao-icon>
              {{ wish.replies.length }}
            </span>

            <mao-button
              variant="light"
              size="sm"
              class="action like-action"
              :aria-pressed="wish.hugged"
              :aria-label="`喜欢这条心愿，当前 ${wish.hugs} 个`"
              @click="store.toggleHug(wish.id)"
            >
              <mao-icon name="heart" size="19"></mao-icon>
              {{ wish.hugs }}
            </mao-button>

            <span class="action" title="转发">
              <mao-icon name="repeat-2" size="19"></mao-icon>
              {{ wish.reposts ?? 0 }}
            </span>

            <span class="action" title="浏览量">
              <mao-icon name="chart-no-axes-column" size="19"></mao-icon>
              {{ wish.views ?? 0 }}
            </span>
          </footer>
        </div>
      </article>
    </div>
  </mao-card>
</template>

<style scoped>
.post-card {
  border-radius: 0;
}

.post {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
}

.post-main {
  min-width: 0;
}

.post-head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 8px;
}

.post-head strong {
  font-size: var(--mt-fs-md);
  font-weight: 600;
}

.post-body {
  margin-top: 5px;
  font-family: var(--mt-font-cn);
  font-size: var(--mt-fs-lg);
  font-weight: 400;
  line-height: 1.75;
}

.post-body.compact {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 12px;
  color: var(--mt-muted);
  line-height: 1;
}

.action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 3px 8px;
  border: 0;
  border-radius: var(--mt-radius-pill);
  background: transparent;
  color: var(--mt-muted);
  font-size: var(--mt-fs-xs);
  font-variant-numeric: tabular-nums;
  transition:
    color var(--mt-dur-fast) var(--mt-ease),
    background-color var(--mt-dur-fast) var(--mt-ease);
}

.like-action {
  gap: 4px;
}

.like-action[aria-pressed="true"] {
  color: var(--mt-color-danger);
}

.action:hover {
  color: var(--mt-text);
  background: color-mix(in srgb, var(--mt-muted) 14%, transparent);
}

.like-action[aria-pressed="true"]:hover {
  color: var(--mt-color-danger);
  background: color-mix(in srgb, var(--mt-color-danger) 14%, transparent);
}

</style>
