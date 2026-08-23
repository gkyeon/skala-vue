
# Weather Dashboard 프로젝트 — Claude Code 실행 지시서

> 이 문서를 Claude Code(터미널/VS Code/데스크톱)에 그대로 붙여넣고 "이 스펙대로 프로젝트 만들어줘"라고 하면 됨.
> 각 Phase는 순서대로 진행하고, Phase마다 완료 후 동작 확인(dev 서버 실행)까지 시켜라.

---

## 0. 프로젝트 개요

- **이름**: Weather Dashboard (SKALA Vue 실습 과제)
- **스택**: Vue 3 (Composition API, `<script setup>`), Vite, Vue Router, Pinia, Axios, 외부 UI Library(택1: Vuetify/Element Plus/PrimeVue 중 하나), OpenWeatherMap API
- **최종 산출물**:
  1. GitHub Public 저장소
  2. Vercel/Netlify/GitHub Pages 배포 URL
  3. README.md (단원별 커스터마이징 기록 포함)
- **평가 항목**: 기본 문법 25 / 확장 문법 25 / 앱 완성도 25 / 수업 참여 25 (참여는 본인 몫)

### 프로젝트 초기화 명령

```bash
npm create vite@latest weather-dashboard -- --template vue
cd weather-dashboard
npm install
npm install vue-router@4 pinia axios
```

### 최종 폴더 구조 (Phase 4 시점 기준으로 미리 세팅)

```
src/
├── main.js
├── App.vue
├── router/
│   └── index.js
├── stores/
│   └── configStore.js
├── components/
│   └── /assignment/gkyeon
│       ├── BaseDashboardCard.vue
│       ├── SearchBar.vue
│       ├── WeatherCard.vue
│       └── UnitToggler.vue
├── views/
│   ├── WeatherHomeView.vue
│   ├── WeatherAboutView.vue
│   ├── WeatherDetailView.vue
│   └── NotFoundView.vue
└── data/
    └── mockWeather.js
```

---

## Phase 1 — Weather Mockup (기본 Vue 문법)

**파일**: 우선 `src/App.vue` 하나에 전부 작성 (이후 Phase에서 분리 예정이므로 지금은 단일 파일 OK)

### 요구사항 (반드시 전부 구현)

1. **배열 렌더링 (`v-for`)**

   - 아래 mock 데이터를 `ref`로 선언, `v-for`로 카드 반복 출력
   - `:key`는 반드시 `id` 사용

   ```js
   const weatherList = ref([
     { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
     { id: 'city_02', name: '수원', temp: 24, status: '비' },
     { id: 'city_03', name: '부산', temp: 26, status: '구름' },
     // 본인 데이터 최소 1개 이상 추가 (요구사항 5번)
   ])
   ```
2. **조건부 렌더링 (`v-if` / `v-else`)**

   - `temp >= 25` → "🔥 더움 (25도 이상)" 배지
   - `temp < 25` → "❄️ 선선함 (25도 미만)" 배지
   - 배지 색상은 다르게 스타일링 (더움=빨강 계열, 선선=파랑 계열)
3. **양방향 바인딩 + 한글 처리 (`v-model` 또는 `:value`+`@input`)**

   - `searchInput` input 박스 구현
   - 입력된 도시명을 화면에 실시간 출력 ("검색 중인 도시: {searchInput}")
   - 한글 IME 조합 이슈 없는지 반드시 확인 (v-model 사용 시 자동 처리됨)
4. **이벤트 및 수식어**

   - 날씨 카드 전체 클릭(`@click`) → 상태바에 `"{도시}이 선택되었습니다."` 표시 (`ref selectedMessage`)
   - 카드 내부 [상세보기] 버튼 클릭 → **`@click.stop`으로 버블링 차단** → `window.alert()`로 상세 정보 표출

   ```js
   const showDetail = (cityName, status) => {
     window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
   }
   ```

   - 버튼에는 반드시 `@click.stop="showDetail(city.name, city.status)"` 형태로 작성 (부모 카드 클릭 이벤트와 분리 확인)
5. **본인 데이터 추가**

   - weatherList에 본인이 정한 도시 최소 1개 이상 추가 (실제 거주지/여행지 등 자유)

### 완료 조건

- `npm run dev` 실행 시 에러 없이 카드 3개 이상 렌더링
- 검색창 타이핑 시 실시간 반영
- 카드 클릭 시 상태바 갱신, 상세보기 버튼 클릭 시 alert만 뜨고 카드 클릭 이벤트는 발생하지 않음 (콘솔로그로 검증)

---

## Phase 2 — Weather Composition (Composition API 심화)

**파일**: `src/App.vue` 계속 확장

### 요구사항

1. **반응형 상태 3종 정의**

   ```js
   const searchQuery = ref('')
   const selectedCityInfo = ref(null) // 또는 ref('') — 선택된 도시 메시지/객체
   const weatherList = ref([...]) // Phase 1 재사용
   ```
2. **`computed`로 필터링된 목록**

   ```js
   const filteredWeatherList = computed(() => {
     if (!searchQuery.value) return weatherList.value
     return weatherList.value.filter(city =>
       city.name.includes(searchQuery.value)
     )
   })
   ```
3. **`watch`로 `selectedCityInfo` 감시**

   ```js
   watch(selectedCityInfo, (newVal, oldVal) => {
     console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newVal}"`)
   })
   ```
4. **`watchEffect`로 `searchQuery` 감시**

   ```js
   watchEffect(() => {
     console.log(`[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 데이터를 필터링합니다.`)
   })
   ```
5. **템플릿 분기 처리**

   - `searchQuery`가 빈 문자열 → 원본 `weatherList` 출력
   - `filteredWeatherList.length > 0` → 필터링된 카드 출력
   - `filteredWeatherList.length === 0` → "검색 결과가 일치하는 도시가 없습니다." 안내 문구
6. **본인만의 반응형 변수 / computed / watcher 최소 1개씩 추가**

   - 예: `favoriteCity` ref + `isFavorite` computed + watch

### 완료 조건

- 콘솔에 watch/watchEffect 로그가 정상적으로 순서대로 찍히는지 확인
- 검색어 없음/일치/불일치 3가지 케이스 모두 화면에서 확인 가능

---

## Phase 3 — Weather Component (컴포넌트 분리, 기능 변경 금지)

### 분리 대상 (4개 파일, `src/components/exercise/`)

#### 1. `BaseDashboardCard.vue`

- 검색박스/리스트박스 공통 디자인(테두리, 헤더, 그림자 등)을 담당하는 **레이아웃 wrapper**
- `<slot>` 기본 슬롯 사용 (또는 named slot: `header`, `default`)
- props/emits 없음 (순수 프레젠테이션 컴포넌트)

```vue
<template>
  <div class="dashboard-card">
    <slot name="header" />
    <slot />
  </div>
</template>
```

#### 2. `SearchBar.vue`

- **props**: `modelValue`(또는 `searchQuery`) — 부모의 검색어 상태를 전달받음
- **emits**: `update-query` — input 변경 시 부모에게 새 검색어 전달

```vue
<script setup>
defineProps(['searchQuery'])
const emit = defineEmits(['update-query'])
</script>
<template>
  <input :value="searchQuery" @input="emit('update-query', $event.target.value)" />
</template>
```

#### 3. `WeatherCard.vue`

- **props**: `cityItem` (Object) — 도시 데이터 객체 전체
- **emits**:
  - `select-card` — 카드 클릭 시
  - `click-detail` — 상세보기 버튼 클릭 시 (`.stop` 처리 유지)

```vue
<script setup>
defineProps(['cityItem'])
const emit = defineEmits(['select-card', 'click-detail'])
</script>
<template>
  <div class="weather-card" @click="emit('select-card', cityItem)">
    <span>{{ cityItem.name }} ({{ cityItem.status }})</span>
    <span>현재 기온: {{ cityItem.temp }}°C</span>
    <button @click.stop="emit('click-detail', cityItem)">상세보기</button>
  </div>
</template>
```

#### 4. `WeatherParent.vue` (App.vue 역할, 최상위)

- Phase 1~2의 모든 반응형 데이터 유지 (searchQuery, selectedCityInfo, weatherList, filteredWeatherList, watch/watchEffect)
- `BaseDashboardCard` 안에 `SearchBar`, `WeatherCard`를 slot으로 배치
- `SearchBar`의 `update-query` 이벤트 → `searchQuery.value` 갱신
- `WeatherCard`의 `select-card` 이벤트 → `selectedCityInfo.value` 갱신 (상태바 메시지)
- `WeatherCard`의 `click-detail` 이벤트 → `showDetail()` 함수 호출

### 필수 조건

- 기능은 Phase 2와 **완전히 동일**해야 함 (분리만 하는 것)
- 각 컴포넌트는 `<style scoped>`로 디자인 분리
- 본인 Mockup에서 컴포넌트를 추가로 더 쪼개서 확장 (예: `TempBadge.vue` 분리 등)

---

## Phase 4 — Weather Router (Vue Router)

### 설치 및 설정

```bash
npm install vue-router@4
```

### `src/router/index.js`

```js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/WeatherHomeView.vue'), // Lazy Loading
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: '/:pathMatch(.*)*', // Catch-all Route
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

### `src/main.js`

```js
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

createApp(App).use(router).mount('#app')
```

### `src/App.vue`

- Navigation Bar 추가: `<RouterLink to="/">날씨 대시보드</RouterLink>` / `<RouterLink to="/about">서비스 소개</RouterLink>`
- 메인 콘텐츠 영역: `<RouterView />`

### `src/data/mockWeather.js` (분리 권장)

```js
export const mockWeatherList = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
]
```

### `src/views/WeatherHomeView.vue`

- Phase 3의 `WeatherParent` 로직을 그대로 이식 (`/` 경로 전용 화면)
- 상세보기 클릭 시 **`window.alert()` 제거**, 대신 Programmatic Navigation:

```js
import { useRouter } from 'vue-router'
const router = useRouter()

const goToDetail = (cityId) => {
  router.push('/weather/' + cityId)
}
```

- `WeatherCard`의 `click-detail` 이벤트 핸들러를 `goToDetail(cityItem.id)`로 교체

### `src/views/WeatherDetailView.vue`

- 동적 경로 파라미터 `cityId` 수신

```js
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { mockWeatherList } from '../data/mockWeather.js'

const route = useRoute()
const router = useRouter()
const cityDetail = ref(null)

onMounted(() => {
  cityDetail.value = mockWeatherList.find(c => c.id === route.params.cityId)
})
</script>
```

- 지역별 상세 기상관측 정보 표시 (실시간 기온, 기상 현황, 대기 습도, 현재 풍속 등 mock 필드 자유 추가)
- "← 메인 대시보드로 돌아가기" 버튼 (`router.push('/')`)

### `src/views/WeatherAboutView.vue`

- 서비스 소개 텍스트 자유 작성
- "대시보드 홈으로 이동" 버튼

### `src/views/NotFoundView.vue`

- "페이지를 찾을 수 없습니다" + 안내 문구
- "날씨 메인으로 이동" 버튼

### 추가 요구사항

- 위에 정의된 view 외 본인만의 추가 view 최소 1개 작성 및 라우팅 연결 (예: `WeatherFavoritesView.vue`)

---

## Phase 5 — Weather Store (Pinia)

### 설치

```bash
npm install pinia
```

### `src/main.js` 갱신

```js
import { createPinia } from 'pinia'
createApp(App).use(router).use(createPinia()).mount('#app')
```

### `src/stores/configStore.js`

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius') // state

  const unitSymbol = computed(() => (unit.value === 'celsius' ? '°C' : '°F')) // getter

  const toggleUnit = () => { // action
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  return { unit, unitSymbol, toggleUnit }
})
```

### `src/components/exercise/UnitToggler.vue`

```vue
<script setup>
import { useConfigStore } from '../../stores/configStore.js'
const configStore = useConfigStore()
</script>
<template>
  <button @click="configStore.toggleUnit">
    단위변경 ({{ configStore.unitSymbol }})
  </button>
</template>
```

- `App.vue`의 Navigation Bar 옆에 배치

### 온도 변환 적용 (WeatherCard.vue, WeatherDetailView.vue 양쪽)

```js
import { useConfigStore } from '../../stores/configStore.js'
const configStore = useConfigStore()

const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp // 원본은 섭씨
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
```

- 템플릿에서 `{{ displayTemp }}{{ configStore.unitSymbol }}` 로 출력

### 추가 요구사항

- 본인만의 Store 추가 작성 (예: `favoriteStore.js` — 즐겨찾기 도시 관리) **또는** `configStore`에 state/getter/action 추가 (예: 다크모드 토글)

---

## Phase 6 — Weather Axios (실제 API 연동)

### 사전 준비

```bash
npm install axios
```

- OpenWeatherMap 가입 → API Key 발급: https://openweathermap.org/api
- `.env` 파일에 키 저장 (Phase 8에서 자세히 다룸)

```
VITE_OPENWEATHER_API_KEY=발급받은키
```

### API 호출 예시 (`src/views/WeatherHomeView.vue` 또는 별도 `src/api/weather.js`)

```js
import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

export const fetchWeatherByCity = async (cityName) => {
  const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      q: cityName,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })
  return res.data
}
```

### 요구사항

1. Mock 데이터 → 실제 OpenWeatherMap 데이터로 교체 (서울/수원/부산 등 실제 좌표/도시명 사용, `onMounted`에서 API 호출 후 `weatherList` 채우기)
2. OpenWeatherMap 5-day/3-hour forecast API 등 추가 API 연동하여 기능 확장 (예: 상세페이지에 5일 예보 표시)
3. 기타 외부 API(예: 미세먼지 API, 지도 API 등) 추가 연동 자유

### 주의

- axios 요청 실패 시 `try/catch`로 에러 핸들링, 로딩 상태(`isLoading`) 표시

---

## Phase 7 — Weather UI Library

- Vuetify / Element Plus / PrimeVue 중 택1 설치

```bash
# 예: Element Plus
npm install element-plus
```

- Phase 3에서 분리한 컴포넌트(`SearchBar`, `WeatherCard`, `BaseDashboardCard`, `UnitToggler`)에 자유롭게 적용
  - 예: `el-input`으로 검색창 교체, `el-card`로 날씨 카드 스타일링, `el-button`으로 버튼 교체
- `main.js`에 라이브러리 전역 등록

---

## Phase 8 — Weather Deployment

### 8-1. 코드 품질 관리

```bash
npm install eslint --save-dev
npx eslint --init
npx eslint src/ --fix
```

- ESLint 에러 0개까지 정리

### 8-2. 환경변수 처리

- `.env` 파일 생성, API 키 저장 (`VITE_OPENWEATHER_API_KEY=...`)
- `.gitignore`에 반드시 추가:

```
.env
.env.local
```

- 코드에서는 `import.meta.env.VITE_OPENWEATHER_API_KEY`로만 참조 (하드코딩 절대 금지)

### 8-3. Build

```bash
npm run build
```

- `dist/` 폴더 생성 확인

### 8-4. 배포 (택1)

- **Vercel**: `vercel` CLI 또는 GitHub 연동 후 자동 배포, 환경변수는 Vercel 대시보드에 별도 등록
- **Netlify**: `netlify deploy --prod` 또는 GitHub 연동
- **GitHub Pages**: `vite.config.js`에 `base: '/저장소이름/'` 설정 후 `gh-pages` 패키지로 배포

### 8-5. 배포 후 확인

- 배포 URL에서 API 정상 호출 확인 (환경변수 미설정 시 404/401 에러 나므로 반드시 배포 플랫폼에도 API 키 등록)
- 시크릿 모드로 GitHub 저장소 접속 → 로그인 요구 없이 코드 노출 확인

---

## README.md 작성 가이드 (Claude Code가 자동 생성)

```md
# Weather Dashboard

## 프로젝트 소개
(본인 소개 + 프로젝트 개요)

## 기술 스택
Vue 3, Vite, Vue Router, Pinia, Axios, (선정한 UI 라이브러리), OpenWeatherMap API

## 배포 링크
- https://...

## 단원별 커스터마이징 기록
### Day1 - Mockup
- 본인이 추가한 데이터/기능 기록

### Day2 - Composition API
- 추가한 반응형 변수/computed/watcher 기록

### Day3 - Component 분리
- 추가로 분리한 컴포넌트 기록

### Day4 - Router
- 추가한 View/라우트 기록

### Day5 - Pinia
- 추가한 Store 기록

### Day6 - Axios
- 연동한 추가 API 기록

### Day7 - UI Library
- 선정한 라이브러리 및 적용 범위

### Day8 - Deployment
- 배포 플랫폼 및 트러블슈팅 기록

## 실행 방법
\`\`\`bash
npm install
npm run dev
\`\`\`
```

---

## Claude Code에게 줄 실행 순서 (요약 프롬프트)

```
위 스펙 문서를 참고해서 Phase 1부터 Phase 8까지 순서대로 Vue 3 + Vite 프로젝트를 구현해줘.
각 Phase 완료 시마다:
1. 구현한 파일 목록 요약
2. npm run dev로 정상 동작 확인
3. 다음 Phase로 자동 진행

Phase 6(Axios)에서는 OpenWeatherMap API 키를 아직 발급받지 못했다면
.env.example 파일과 mock fallback 로직을 만들어두고, 내가 실제 키를 넣으면 바로 동작하게 해줘.

완료 후 README.md도 위 가이드대로 작성해줘.
```
