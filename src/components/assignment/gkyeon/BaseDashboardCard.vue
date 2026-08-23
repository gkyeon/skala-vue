<!-- 2. BaseDashboardCard.vue -->
<!-- - 검색박스와 리스트박스의 디자인을 공통화 -->
<!-- - <slot> 배치하여 부모 컴포넌트가 도시 검색, 날씨 현황 주입 -->

<template>
  <div class="base-dashboard-card">
    <slot></slot>
  </div>
</template>

<style scoped>
.base-dashboard-card {
  background: var(--app-card-bg);
  border: 1px solid var(--app-card-border);
  border-radius: var(--app-radius-lg);
  box-shadow: var(--app-card-shadow);
  backdrop-filter: var(--app-blur);
  -webkit-backdrop-filter: var(--app-blur);
  padding: 28px;
  margin-bottom: 18px;
  transition:
    box-shadow var(--app-duration) var(--app-ease),
    transform var(--app-duration) var(--app-ease);
}
</style>
