<!-- 1. WeatherParent.vue -->
<!-- - 도시 날씨 카드(WeatherCard) + 카페 메뉴 카드(CafeMenuCard)로 분리된 조립 화면 -->
<!-- - 온도 선택/즐겨찾기 상태는 cafeStore(전역 store)에서 관리 -->

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCafeStore } from '@/stores/cafeStore'
import { useCityWeather } from '@/composables/useCityWeather'
import { menuList } from '@/data/menuList'
import { getRecommendCaption } from '@/utils/recommendCaption'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import CafeMenuCard from './CafeMenuCard.vue'

const router = useRouter()
const cafeStore = useCafeStore()

// 실제 OpenWeatherMap 데이터로 채워질 날씨 목록 (Home/즐겨찾기 화면 공용 composable)
const { weatherList, isLoading } = useCityWeather()

const searchQuery = ref('')
const selectedCity = ref(null)
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

function selectCity(item) {
  selectedCity.value = item
  selectedCityInfo.value = `${item.name}이 선택되었습니다.`
}

const currentSeason = computed(() => {
  if (!selectedCity.value) return null
  return selectedCity.value.temp >= 25 ? 'hot' : 'cool'
})

const recommendedTemp = computed(() => (currentSeason.value === 'hot' ? 'ice' : 'hot'))

const recommendedMenu = computed(() => {
  if (!selectedCity.value) return []
  return menuList.filter(
    (menu) => menu.season === 'always' || menu.season === currentSeason.value,
  )
})

// 선택된 도시의 날씨 상태+기온을 조합한 한 줄 추천 카피
const recommendCaption = computed(() => {
  if (!selectedCity.value) return ''
  return getRecommendCaption(selectedCity.value.name, selectedCity.value.temp, selectedCity.value.status)
})

function showDetail(item) {
  router.push(`/weather/${item.id}`)
}

function showMenuDetail(menu) {
  router.push(`/cafe/${menu.id}`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard class="area-search">
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <div class="status-bar area-status">{{ selectedCityInfo }}</div>

    <BaseDashboardCard class="area-weather">
      <h3>🏙️ 지역별 날씨 현황 (실시간 OpenWeatherMap 연동)</h3>
      <p v-if="isLoading" class="loading-msg">🔄 실시간 기상 데이터를 불러오는 중입니다...</p>
      <template v-else>
        <div class="weather-grid">
          <WeatherCard
            v-for="item in filteredWeatherList"
            :key="item.id"
            :city-item="item"
            @select-card="selectCity"
            @click-detail="showDetail"
          />
        </div>
        <p v-if="filteredWeatherList.length === 0" class="empty-msg">
          😭 검색 결과와 일치하는 도시가 없습니다.
        </p>
      </template>
    </BaseDashboardCard>

    <BaseDashboardCard class="area-cafe">
      <template v-if="selectedCity">
        <h3>☕ {{ selectedCity.name }}({{ selectedCity.temp }}°C)에 어울리는 메뉴</h3>
        <p class="recommend-caption">{{ recommendCaption }}</p>
      </template>
      <h3 v-else>☕ 도시를 먼저 선택해 주세요</h3>

      <CafeMenuCard
        v-for="menu in recommendedMenu"
        :key="menu.id"
        :menu="menu"
        :recommended-temp="recommendedTemp"
        @show-detail="showMenuDetail"
      />
    </BaseDashboardCard>

    <BaseDashboardCard v-if="cafeStore.favoriteCount > 0" class="area-favorites">
      <h3>⭐ 내가 찜한 메뉴 ({{ cafeStore.favoriteCount }})</h3>
      <div class="favorite-chips">
        <button
          v-for="id in cafeStore.favorites"
          :key="id"
          class="favorite-chip"
          @click="showMenuDetail({ id })"
        >
          {{ menuList.find((m) => m.id === id)?.name }}
        </button>
      </div>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.dashboard-wrapper h3 {
  margin-bottom: 14px;
  font-size: 15px;
  color: var(--app-text-primary);
}
.area-cafe h3 {
  margin-bottom: 4px;
}
.recommend-caption {
  margin: 0 0 16px;
  color: var(--app-text-secondary);
  font-size: 13px;
}
.dashboard-wrapper {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}
.area-search {
  grid-area: search;
}
.area-status {
  grid-area: status;
}
.area-weather {
  grid-area: weather;
}
.area-cafe {
  grid-area: cafe;
}
.area-favorites {
  grid-area: favorites;
}
@media (min-width: 960px) {
  .dashboard-wrapper {
    grid-template-columns: 1.3fr 1fr;
    grid-template-areas:
      'search search'
      'status status'
      'weather cafe'
      'favorites favorites';
    align-items: start;
  }
}
.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}
.favorite-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.favorite-chip {
  border: none;
  background: var(--app-accent-warm-bg);
  color: var(--app-accent-warm);
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: var(--app-radius-pill);
  cursor: pointer;
  transition:
    transform var(--app-duration-fast) var(--app-ease),
    box-shadow var(--app-duration) var(--app-ease);
}
.favorite-chip:hover {
  box-shadow: var(--app-card-shadow);
}
.favorite-chip:active {
  transform: scale(0.95);
}
.status-bar {
  background: var(--app-accent-cool-bg);
  padding: 12px;
  text-align: center;
  color: var(--app-accent-cool);
  font-weight: 600;
  border-radius: var(--app-radius-md);
  margin: 10px 0;
  transition: background var(--app-duration) var(--app-ease);
}
.loading-msg {
  text-align: center;
  color: var(--app-text-secondary);
  font-weight: 600;
  padding: 20px 0;
}
.empty-msg {
  text-align: center;
  color: var(--app-text-secondary);
  padding: 10px 0;
}
</style>
