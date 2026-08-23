<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCafeStore } from '@/stores/cafeStore'
import { useCityFavoriteStore } from '@/stores/cityFavoriteStore'
import { useCityWeather } from '@/composables/useCityWeather'
import { menuList } from '@/data/menuList'
import BaseDashboardCard from '@/components/assignment/gkyeon/BaseDashboardCard.vue'
import WeatherCard from '@/components/assignment/gkyeon/WeatherCard.vue'
import CafeMenuCard from '@/components/assignment/gkyeon/CafeMenuCard.vue'

const router = useRouter()
const cafeStore = useCafeStore()
const cityFavoriteStore = useCityFavoriteStore()

// Home과 같은 실시간 날씨 데이터를 재사용해서 즐겨찾기한 도시의 온도/상태를 그대로 보여준다.
const { weatherList, isLoading } = useCityWeather()

const favoriteCities = computed(() =>
  weatherList.value.filter((city) => cityFavoriteStore.isFavorite(city.id)),
)

const favoriteMenus = computed(() =>
  menuList.filter((menu) => cafeStore.isFavorite(menu.id)),
)

const hasNothing = computed(
  () => favoriteCities.value.length === 0 && favoriteMenus.value.length === 0,
)

function goToCityDetail(item) {
  router.push(`/weather/${item.id}`)
}

function goToMenuDetail(menu) {
  router.push(`/cafe/${menu.id}`)
}
</script>

<template>
  <div class="favorites-view">
    <h1 class="page-title">❤️ 내 즐겨찾기</h1>
    <p class="page-desc">하트로 찜한 도시와 별로 찜한 카페 메뉴를 한곳에서 모아봐요.</p>

    <div v-if="!isLoading && hasNothing" class="empty-card">
      <span class="empty-icon">🤍</span>
      <p>아직 즐겨찾기한 항목이 없어요.</p>
      <p class="empty-hint">도시 카드의 ♡, 메뉴 카드의 ☆를 눌러 찜해 보세요.</p>
      <el-button type="primary" round @click="router.push('/')">대시보드로 이동</el-button>
    </div>

    <template v-else>
      <BaseDashboardCard v-if="cityFavoriteStore.favoriteCount > 0">
        <h3>🏙️ 즐겨찾기한 도시 ({{ cityFavoriteStore.favoriteCount }})</h3>
        <p v-if="isLoading" class="loading-msg">🔄 실시간 기상 데이터를 불러오는 중입니다...</p>
        <div v-else class="weather-grid">
          <WeatherCard
            v-for="city in favoriteCities"
            :key="city.id"
            :city-item="city"
            @select-card="goToCityDetail"
            @click-detail="goToCityDetail"
          />
        </div>
      </BaseDashboardCard>

      <BaseDashboardCard v-if="cafeStore.favoriteCount > 0">
        <h3>☕ 즐겨찾기한 메뉴 ({{ cafeStore.favoriteCount }})</h3>
        <CafeMenuCard
          v-for="menu in favoriteMenus"
          :key="menu.id"
          :menu="menu"
          @show-detail="goToMenuDetail"
        />
      </BaseDashboardCard>
    </template>
  </div>
</template>

<style scoped>
.favorites-view {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.page-title {
  margin: 0 0 6px;
  font-size: 26px;
  color: var(--app-text-primary);
}
.page-desc {
  margin: 0 0 8px;
  font-size: 15px;
  color: var(--app-text-secondary);
}
@media (min-width: 640px) {
  .page-title {
    font-size: 34px;
  }
}
.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}
.loading-msg {
  text-align: center;
  color: var(--app-text-secondary);
  font-weight: 600;
  padding: 20px 0;
}
h3 {
  margin-bottom: 14px;
  font-size: 15px;
  color: var(--app-text-primary);
}
.empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  background: var(--app-card-bg);
  border: 1px solid var(--app-card-border);
  backdrop-filter: var(--app-blur);
  -webkit-backdrop-filter: var(--app-blur);
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-radius-lg);
  padding: 48px 28px;
}
.empty-icon {
  font-size: 36px;
  margin-bottom: 4px;
}
.empty-card p {
  margin: 0;
  color: var(--app-text-primary);
  font-weight: 600;
}
.empty-hint {
  color: var(--app-text-secondary) !important;
  font-weight: 500 !important;
  font-size: 13px;
  margin-bottom: 16px !important;
}
</style>
