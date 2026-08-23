<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useCityFavoriteStore } from '@/stores/cityFavoriteStore'
import { getWeatherTheme } from '@/utils/weatherTheme'

// 1. 상위로부터 단방향 주입받을 객체 데이터 규격 검수
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

// 2. 상위로 송신할 두 가지 경로의 커스텀 이벤트 식별자 등록
const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()
const cityFavoriteStore = useCityFavoriteStore()

// 날씨 상태(맑음/흐림/비/눈/뇌우/안개)에 따른 accent 컬러 + 아이콘
const weatherTheme = computed(() => getWeatherTheme(props.cityItem.status))

// 3. 전역 온도 단위(configStore)에 맞춰 섭씨↔화씨 변환
const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp // 원본은 항상 섭씨
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return Math.round(rawTemp)
})
</script>

<template>
  <!-- 클래스명을 wc- 접두어로 통일: 전역 practice.css의 .weather-card/.btn-detail/.badge와
       이름이 겹쳐서 스타일이 충돌(온도 숫자가 버튼에 가려짐)했던 문제 방지 -->
  <div class="wc-card" @click="emit('select-card', cityItem)">
    <button
      class="wc-favorite"
      :class="{ active: cityFavoriteStore.isFavorite(cityItem.id) }"
      :aria-pressed="cityFavoriteStore.isFavorite(cityItem.id)"
      aria-label="도시 즐겨찾기"
      @click.stop="cityFavoriteStore.toggleFavorite(cityItem.id)"
    >
      {{ cityFavoriteStore.isFavorite(cityItem.id) ? '♥' : '♡' }}
    </button>
    <div class="wc-top">
      <el-icon class="wc-icon" :style="{ color: weatherTheme.accent, background: weatherTheme.accent + '1f' }" :size="24">
        <component :is="weatherTheme.icon" />
      </el-icon>
      <div class="wc-heading">
        <h4>{{ cityItem.name }}</h4>
        <p class="wc-status">{{ cityItem.status }}</p>
      </div>
    </div>
    <div class="wc-metrics">
      <p class="wc-temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
      <span class="wc-badge" :class="cityItem.temp >= 25 ? 'is-warm' : 'is-cool'">
        {{ cityItem.temp >= 25 ? '🔥 더움 (25도 이상)' : '❄️ 선선함 (25도 미만)' }}
      </span>
    </div>
    <el-button class="wc-detail-btn" size="small" round @click.stop="emit('click-detail', cityItem)">
      상세보기
    </el-button>
  </div>
</template>

<style scoped>
.wc-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--app-page-bg);
  border-radius: var(--app-radius-md);
  padding: 16px 18px;
  cursor: pointer;
  transition:
    box-shadow var(--app-duration) var(--app-ease),
    transform var(--app-duration) var(--app-ease);
}
.wc-card:hover {
  box-shadow: var(--app-card-shadow-hover);
  transform: translateY(-2px);
}
.wc-card:active {
  transform: scale(0.99);
  transition-duration: var(--app-duration-fast);
}
.wc-favorite {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  font-size: 19px;
  line-height: 1;
  color: var(--app-text-secondary);
  cursor: pointer;
  transition:
    color var(--app-duration) var(--app-ease),
    transform var(--app-duration-fast) var(--app-ease);
}
.wc-favorite.active {
  color: var(--app-accent-pink);
}
.wc-favorite:active {
  transform: scale(0.85);
}
.wc-top {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 32px;
}
.wc-icon {
  flex-shrink: 0;
  padding: 8px;
  border-radius: var(--app-radius-pill);
  transition: background var(--app-duration) var(--app-ease);
}
.wc-heading {
  flex: 1;
  min-width: 0;
}
.wc-heading h4 {
  margin: 0 0 2px;
  color: var(--app-text-primary);
}
.wc-status {
  margin: 0;
  color: var(--app-text-secondary);
  font-size: 13px;
}
.wc-metrics {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.wc-temp {
  margin: 0;
  font-weight: 700;
  font-size: 26px;
  letter-spacing: -0.02em;
  color: var(--app-text-primary);
}
.wc-badge {
  display: inline-block;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: var(--app-radius-pill);
  white-space: nowrap;
}
.wc-badge.is-warm {
  background: var(--app-accent-warm-bg);
  color: var(--app-accent-warm);
}
.wc-badge.is-cool {
  background: var(--app-accent-cool-bg);
  color: var(--app-accent-cool);
}
.wc-detail-btn {
  position: static;
  align-self: flex-end;
  transition: transform var(--app-duration-fast) var(--app-ease);
}
.wc-detail-btn:active {
  transform: scale(0.95);
}
</style>
