<!-- 4. FavoriteCounter.vue -->
<!-- - 교수님 UnitToggler.vue 패턴 참고: nav에서 전역 store 상태를 바로 노출 -->
<script setup>
import { useCafeStore } from '@/stores/cafeStore'
const cafeStore = useCafeStore()
</script>

<template>
  <span class="favorite-counter">⭐ 즐겨찾기 {{ cafeStore.favoriteCount }}개</span>
</template>

<style scoped>
.favorite-counter {
  margin-left: auto;
  font-weight: 600;
  font-size: 13px;
  color: var(--app-accent-warm);
  background: var(--app-accent-warm-bg);
  padding: 6px 14px;
  border-radius: var(--app-radius-pill);
}
</style>
