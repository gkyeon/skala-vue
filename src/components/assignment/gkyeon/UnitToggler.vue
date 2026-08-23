<!-- 5. UnitToggler.vue -->
<!-- - configStore(전역 온도 단위 상태)를 nav 어디서든 토글할 수 있게 노출 -->
<!-- - 레퍼런스 디자인의 °C/°F 세그먼트 토글 참고 -->
<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggle">
    <button
      class="segment"
      :class="{ active: configStore.unit === 'celsius' }"
      @click="configStore.setUnit('celsius')"
    >
      °C
    </button>
    <button
      class="segment"
      :class="{ active: configStore.unit === 'fahrenheit' }"
      @click="configStore.setUnit('fahrenheit')"
    >
      °F
    </button>
  </div>
</template>

<style scoped>
.unit-toggle {
  display: inline-flex;
  background: var(--app-page-bg);
  border-radius: var(--app-radius-pill);
  padding: 3px;
}
.segment {
  border: none;
  background: transparent;
  padding: 6px 14px;
  border-radius: var(--app-radius-pill);
  font-size: 13px;
  font-weight: 600;
  color: var(--app-text-secondary);
  cursor: pointer;
  transition: all var(--app-duration) var(--app-ease);
}
.segment:active {
  transform: scale(0.94);
}
.segment.active {
  background: var(--app-text-primary);
  color: #fff;
}
</style>
