<script setup>
import WeatherParent from '@/components/assignment/gkyeon/WeatherParent.vue'
</script>

<template>
  <div class="home-view">
    <h1 class="page-title">☕ 날씨 기반 카페 추천</h1>
    <p class="page-desc">도시 기온에 맞춰 어울리는 카페 메뉴를 추천해 드려요.</p>
    <WeatherParent />
  </div>
</template>

<style scoped>
.home-view {
  max-width: 1180px;
  margin: 0 auto;
}
.page-title {
  margin: 0 0 6px;
  font-size: 26px;
  color: var(--app-text-primary);
}
.page-desc {
  margin: 0 0 28px;
  font-size: 15px;
  color: var(--app-text-secondary);
}
@media (min-width: 640px) {
  .page-title {
    font-size: 34px;
  }
}
</style>
