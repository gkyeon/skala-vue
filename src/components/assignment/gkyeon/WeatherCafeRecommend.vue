<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// 날씨 데이터
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '대구', temp: 30, status: '맑음' },
  { id: 'city_05', name: '강릉', temp: 21, status: '비' },
  { id: 'city_06', name: '제주', temp: 23, status: '구름' },
])

// 카페 메뉴 데이터
// hasHotIce: true인 메뉴는 HOT/ICE를 골라서 마실 수 있음 (가격도 다름)
// season: 어떤 기온대에 추천할지 ('hot' | 'cool' | 'always')
const menuList = ref([
  {
    id: 'menu_01',
    name: '아메리카노',
    category: '커피',
    hasHotIce: true,
    priceHot: 4000,
    priceIce: 4500,
    season: 'always',
  },
  {
    id: 'menu_02',
    name: '카페라떼',
    category: '커피',
    hasHotIce: true,
    priceHot: 4500,
    priceIce: 5000,
    season: 'always',
  },
  {
    id: 'menu_03',
    name: '홍차/아이스티',
    category: '음료',
    hasHotIce: true,
    priceHot: 4000,
    priceIce: 4000,
    season: 'always',
  },
  {
    id: 'menu_04',
    name: '초코케이크',
    category: '디저트',
    hasHotIce: false,
    price: 6500,
    season: 'cool', // 선선한 날 디저트가 잘 어울려서
  },
  {
    id: 'menu_05',
    name: '고함량 프로틴 쉐이크',
    category: '건강',
    hasHotIce: false,
    price: 4000,
    season: 'hot', // 더운 날 운동 후 시원하게
  },
  {
    id: 'menu_06',
    name: '개인 PT',
    category: '서비스',
    hasHotIce: false,
    price: 50000,
    season: 'cool', // 선선하거나 비 오는 날엔 실내 운동 추천
  },
])

// 도시 검색어 (실시간 필터링)
const citySearchQuery = ref('')
const filteredWeatherList = computed(() => {
  const query = citySearchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

// 검색어가 바뀔 때마다 자동으로 실행되는 watchEffect
watchEffect(() => {
  console.log(`🤖 [watchEffect 자동 호출] 현재 검색어 '${citySearchQuery.value}'에 매칭되는 도시를 필터링합니다.`)
})

// 메뉴 검색어 (실시간 필터링)
const menuSearchQuery = ref('')
const filteredMenuList = computed(() => {
  const query = menuSearchQuery.value.trim()
  if (!query) return menuList.value
  return menuList.value.filter((item) => item.name.includes(query))
})

// 클릭으로 선택된 도시 + 상태바 메시지
const selectedCity = ref(null)
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

function selectCity(item) {
  selectedCity.value = item
  selectedCityInfo.value = `${item.name}이 선택되었습니다.`
}

// 최근 조회한 도시를 최대 3개까지 기록 (watch 실습)
const recentCities = ref([])
watch(selectedCity, (city) => {
  if (!city) return
  recentCities.value = [
    city.name,
    ...recentCities.value.filter((name) => name !== city.name),
  ].slice(0, 3)
})

// 선택된 도시 기온 기준 계절 구분 (25도 이상 = hot)
const currentSeason = computed(() => {
  if (!selectedCity.value) return null
  return selectedCity.value.temp >= 25 ? 'hot' : 'cool'
})

// 도시 기온에 따라 HOT/ICE 중 뭘 추천할지
const recommendedTemp = computed(() => (currentSeason.value === 'hot' ? 'ice' : 'hot'))

// 사용자가 카드별로 직접 고른 HOT/ICE (없으면 recommendedTemp를 기본값으로 사용)
const userTempChoice = ref({})

function getTempFor(menuId) {
  return userTempChoice.value[menuId] || recommendedTemp.value || 'hot'
}

function chooseTemp(menuId, type) {
  userTempChoice.value[menuId] = type
}

function getPriceFor(menu) {
  if (!menu.hasHotIce) return menu.price
  return getTempFor(menu.id) === 'ice' ? menu.priceIce : menu.priceHot
}

// 선택된 도시 계절 + 검색어를 반영한 추천 메뉴
// season이 'always'거나 현재 계절과 일치하는 메뉴만 보여줌
const recommendedMenu = computed(() => {
  if (!selectedCity.value) return []
  return filteredMenuList.value.filter(
    (menu) => menu.season === 'always' || menu.season === currentSeason.value,
  )
})

// 날씨 상세보기
function showWeatherDetail(cityName, status) {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// 메뉴 상세보기
function showMenuDetail(menu) {
  window.alert(`${menu.name}의 가격은 ${getPriceFor(menu)}원, 카테고리는 [${menu.category}]입니다.`)
}
</script>

<!-- template 시작 -->
<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        :value="citySearchQuery"
        @input="(e) => (citySearchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ citySearchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>🏙️ 도시를 클릭하면 어울리는 카페 메뉴를 추천해 드려요</h3>

      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectCity(item)"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

        <button class="btn-detail" @click.stop="showWeatherDetail(item.name, item.status)">
          상세보기
        </button>
      </div>

      <p
        v-if="filteredWeatherList.length === 0"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>

    <p v-if="recentCities.length > 0" class="recent-cities">
      🕓 최근 조회한 도시: {{ recentCities.join(', ') }}
    </p>

    <section class="search-box">
      <h3>🔍 메뉴 검색</h3>
      <input
        type="text"
        :value="menuSearchQuery"
        @input="(e) => (menuSearchQuery = e.target.value)"
        placeholder="검색할 메뉴 이름 입력"
      />
      <p>
        검색 중인 메뉴: <strong>{{ menuSearchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3 v-if="selectedCity">
        ☕ {{ selectedCity.name }}({{ selectedCity.temp }}°C)에 어울리는 메뉴
      </h3>
      <h3 v-else>☕ 도시를 먼저 선택해 주세요</h3>

      <div v-for="menu in recommendedMenu" :key="menu.id" class="weather-card">
        <h4>{{ menu.name }} ({{ menu.category }})</h4>

        <div v-if="menu.hasHotIce" class="temp-toggle">
          <button
            :class="{ active: getTempFor(menu.id) === 'hot' }"
            @click.stop="chooseTemp(menu.id, 'hot')"
          >
            HOT
          </button>
          <button
            :class="{ active: getTempFor(menu.id) === 'ice' }"
            @click.stop="chooseTemp(menu.id, 'ice')"
          >
            ICE
          </button>
          <span v-if="getTempFor(menu.id) === recommendedTemp">👍 오늘 추천</span>
        </div>

        <p>가격: {{ getPriceFor(menu) }}원</p>

        <button class="btn-detail" @click.stop="showMenuDetail(menu)">상세보기</button>
      </div>

      <p
        v-if="selectedCity && recommendedMenu.length === 0"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        추천할 메뉴가 없습니다.
      </p>
    </section>
  </div>
</template>
