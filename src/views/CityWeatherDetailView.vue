<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { LocationFilled, Odometer, WindPower, WarningFilled } from '@element-plus/icons-vue'
import { useConfigStore } from '@/stores/configStore'
import { getWeatherLabel } from '@/utils/weatherLabel'
import { getWeatherTheme } from '@/utils/weatherTheme'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

// 도시 id ↔ OpenWeatherMap 조회용 영문 도시명 매핑
const cityNameMap = {
  city_01: 'Seoul',
  city_02: 'Suwon',
  city_03: 'Busan',
  city_04: 'Daegu',
  city_05: 'Incheon',
  city_06: 'Gwangju',
  city_07: 'Daejeon',
  city_08: 'Ulsan',
  city_09: 'Jeonju',
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const CURRENT_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'
const AIR_QUALITY_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'

// OpenWeatherMap 대기질 지수(1~5)를 한글 라벨/색상으로 매핑
const AQI_INFO = {
  1: { label: '좋음', color: '#34c759' },
  2: { label: '보통', color: '#4d8df6' },
  3: { label: '민감군 주의', color: '#f0993d' },
  4: { label: '나쁨', color: '#ff9500' },
  5: { label: '매우 나쁨', color: '#ff453a' },
}

const cityData = ref(null)
const forecastList = ref([])
const airQuality = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  const cityName = cityNameMap[route.params.cityId]
  if (!cityName) return

  isLoading.value = true
  try {
    // 현재 날씨 + 5일/3시간 예보를 동시에 요청
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(CURRENT_URL, { params: { q: cityName, appid: API_KEY, units: 'metric', lang: 'kr' } }),
      axios.get(FORECAST_URL, { params: { q: cityName, appid: API_KEY, units: 'metric', lang: 'kr' } }),
    ])

    cityData.value = {
      name: currentRes.data.name,
      temp: currentRes.data.main.temp,
      status: getWeatherLabel(currentRes.data.weather[0].main),
      humidity: currentRes.data.main.humidity,
      wind: currentRes.data.wind.speed,
    }

    // 3시간 간격 데이터 중 정오(12:00:00) 값만 골라 5일치 요약으로 축약
    forecastList.value = forecastRes.data.list
      .filter((item) => item.dt_txt.includes('12:00:00'))
      .slice(0, 5)
      .map((item) => ({
        date: item.dt_txt.slice(5, 10), // MM-DD
        temp: item.main.temp,
        status: getWeatherLabel(item.weather[0].main),
      }))

    // 대기질(미세먼지)은 위/경도가 있어야 조회되는 별도 API라서, 현재 날씨 응답의
    // coord를 받은 뒤 이어서 요청한다. 실패해도 나머지 화면엔 영향 없게 별도 try/catch.
    try {
      const airRes = await axios.get(AIR_QUALITY_URL, {
        params: { lat: currentRes.data.coord.lat, lon: currentRes.data.coord.lon, appid: API_KEY },
      })
      const aq = airRes.data.list?.[0]
      if (aq) {
        airQuality.value = {
          aqi: aq.main.aqi,
          pm2_5: Math.round(aq.components.pm2_5),
        }
      }
    } catch (airError) {
      console.error('대기질 조회 실패:', airError)
    }
  } catch (error) {
    console.error('도시 상세 날씨 조회 실패:', error)
    errorMessage.value = '상세 정보를 가져오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
})

function toDisplayTemp(rawTemp) {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return Math.round(rawTemp)
}

const displayTemp = computed(() => {
  if (!cityData.value) return 0
  return toDisplayTemp(cityData.value.temp)
})

// 이 도시의 현재 날씨 상태(맑음/흐림/비/눈/뇌우/안개)에 맞춘 히어로 그라디언트 + accent
const heroTheme = computed(() => getWeatherTheme(cityData.value?.status))

const aqiInfo = computed(() => {
  if (!airQuality.value) return null
  return AQI_INFO[airQuality.value.aqi] ?? AQI_INFO[3]
})
</script>

<template>
  <div class="detail-container">
    <div v-if="isLoading" class="skeleton">
      <div class="skeleton-hero shimmer"></div>
      <div class="skeleton-row">
        <div class="skeleton-chip shimmer" v-for="n in 5" :key="n"></div>
      </div>
      <div class="skeleton-row">
        <div class="skeleton-block shimmer"></div>
        <div class="skeleton-block shimmer"></div>
      </div>
    </div>
    <div v-else-if="errorMessage" class="error-state">
      <el-icon :size="32"><WarningFilled /></el-icon>
      <p>{{ errorMessage }}</p>
    </div>

    <template v-else-if="cityData">
      <div
        class="hero-card"
        :style="{
          background: `linear-gradient(160deg, ${heroTheme.gradientFrom}, ${heroTheme.gradientTo})`,
        }"
      >
        <el-icon class="hero-icon" :size="36"><component :is="heroTheme.icon" /></el-icon>
        <p class="place"><el-icon><LocationFilled /></el-icon> {{ cityData.name }}</p>
        <p class="hero-temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
        <p class="hero-status">{{ cityData.status }}</p>
      </div>

      <div v-if="forecastList.length > 0" class="forecast-row">
        <div v-for="day in forecastList" :key="day.date" class="forecast-day">
          <p class="date">{{ day.date }}</p>
          <p class="temp">{{ toDisplayTemp(day.temp) }}°</p>
          <p class="status">{{ day.status }}</p>
        </div>
      </div>

      <h4 class="section-title">Today's Highlights</h4>
      <div class="highlight-grid">
        <div class="highlight-card">
          <p class="label"><el-icon><Odometer /></el-icon> 대기 습도</p>
          <p class="value">{{ cityData.humidity }}<span class="unit">%</span></p>
        </div>
        <div class="highlight-card">
          <p class="label"><el-icon><WindPower /></el-icon> 풍속</p>
          <p class="value">{{ cityData.wind }}<span class="unit">m/s</span></p>
        </div>
        <div v-if="aqiInfo" class="highlight-card">
          <p class="label">
            <el-icon :style="{ color: aqiInfo.color }"><WarningFilled /></el-icon> 대기질
          </p>
          <p class="value" :style="{ color: aqiInfo.color }">{{ aqiInfo.label }}</p>
          <p class="aqi-sub">PM2.5 {{ airQuality.pm2_5 }}㎍/m³</p>
        </div>
      </div>
    </template>

    <div v-else class="error-state">
      <el-icon :size="32"><LocationFilled /></el-icon>
      <p>해당 지역의 상세 데이터가 존재하지 않습니다.</p>
    </div>

    <el-button class="back-btn" round @click="router.push('/')">
      ← 메인 대시보드로 돌아가기
    </el-button>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 720px;
  margin: 0 auto;
  background: var(--app-card-bg);
  border: 1px solid var(--app-card-border);
  backdrop-filter: var(--app-blur);
  -webkit-backdrop-filter: var(--app-blur);
  padding: 28px;
  border-radius: var(--app-radius-lg);
  box-shadow: var(--app-card-shadow);
}
.skeleton-hero {
  height: 168px;
  margin: -28px -28px 24px;
  border-radius: var(--app-radius-lg) var(--app-radius-lg) 0 0;
}
.skeleton-row {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}
.skeleton-chip {
  flex: 1;
  height: 66px;
  border-radius: var(--app-radius-md);
}
.skeleton-block {
  flex: 1;
  height: 64px;
  border-radius: var(--app-radius-md);
}
.shimmer {
  background: linear-gradient(
    100deg,
    var(--app-page-bg) 30%,
    var(--app-card-border) 50%,
    var(--app-page-bg) 70%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
@keyframes shimmer {
  from {
    background-position: 150% 0;
  }
  to {
    background-position: -50% 0;
  }
}
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--app-accent-warm);
  text-align: center;
  padding: 32px 0;
}
.error-state p {
  margin: 0;
  color: var(--app-text-secondary);
  font-weight: 500;
}
.hero-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: -28px -28px 24px;
  padding: 32px 20px 40px;
  border-radius: var(--app-radius-lg) var(--app-radius-lg) 0 0;
  color: #fff;
  transition: background var(--app-duration) var(--app-ease);
}
.hero-icon {
  margin-bottom: 4px;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15));
}
.place {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 0 0 4px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
}
.hero-temp {
  margin: 0;
  font-size: 64px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: #fff;
}
.hero-status {
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
}
@media (min-width: 640px) {
  .hero-card {
    padding: 44px 20px 52px;
  }
  .hero-temp {
    font-size: 84px;
  }
}
.forecast-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin-bottom: 24px;
}
.forecast-day {
  flex: 1;
  min-width: 76px;
  text-align: center;
  background: var(--app-page-bg);
  border-radius: var(--app-radius-md);
  padding: 10px 4px;
}
.forecast-day .date {
  font-size: 12px;
  color: var(--app-text-secondary);
  margin: 0;
}
.forecast-day .temp {
  font-weight: 700;
  margin: 6px 0;
  color: var(--app-text-primary);
}
.forecast-day .status {
  font-size: 11px;
  margin: 0;
  color: var(--app-text-secondary);
}
.section-title {
  color: var(--app-text-secondary);
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 10px;
}
.highlight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}
.highlight-card {
  background: var(--app-page-bg);
  border-radius: var(--app-radius-md);
  padding: 14px 16px;
}
.highlight-card .label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0 0 6px;
  color: var(--app-text-secondary);
  font-size: 12px;
}
.highlight-card .value {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--app-text-primary);
}
.highlight-card .unit {
  font-size: 13px;
  font-weight: 500;
  margin-left: 2px;
}
.aqi-sub {
  margin: 4px 0 0;
  font-size: 11px;
  color: var(--app-text-secondary);
}
.back-btn {
  width: 100%;
  transition: transform var(--app-duration-fast) var(--app-ease);
}
.back-btn:active {
  transform: scale(0.98);
}
</style>
