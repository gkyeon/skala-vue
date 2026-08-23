<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Sunny,
  Star,
  Odometer,
  Refresh,
  Moon,
  WarningFilled,
} from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('intro')

const features = [
  {
    icon: Sunny,
    title: '9개 도시 실시간 날씨',
    desc: '서울·수원·부산·대구·인천·광주·대전·울산·전주 9개 도시의 실시간 기온과 날씨 상태를 OpenWeatherMap API로 조회함.',
  },
  {
    icon: Refresh,
    title: '날씨 기반 카페 메뉴 추천',
    desc: '선택한 도시 기온이 25도 이상이면 ICE, 미만이면 HOT 메뉴를 우선 추천함. season 태그로 디저트·건강 메뉴도 함께 필터링됨.',
  },
  {
    icon: Star,
    title: '즐겨찾기 (도시 ♡ / 메뉴 ☆)',
    desc: '도시 카드의 하트, 메뉴 카드의 별을 클릭하면 즐겨찾기로 등록되고 상단 카운터에 즉시 반영됨. 즐겨찾기 페이지에서 모아볼 수 있음.',
  },
  {
    icon: Odometer,
    title: '섭씨/화씨 단위 전환 + 5일 예보',
    desc: '°C/°F 단위를 전역으로 전환할 수 있으며, 도시 상세 페이지에서 습도·풍속과 5일 예보를 확인할 수 있음.',
  },
  {
    icon: Moon,
    title: '시스템 다크모드 자동 대응',
    desc: 'OS 다크모드 설정에 따라 별도 토글 없이 화면 톤이 자동으로 전환됨.',
  },
]

const myAdditions = [
  {
    title: '카페 메뉴 추천 컨셉',
    file: 'WeatherParent.vue',
    desc: '날씨 대시보드 단일 주제에 카페 메뉴 추천 기능을 결합함. 스펙에 없는 확장 컨셉임.',
  },
  {
    title: '도시 9개 · 카페 메뉴 8종 데이터',
    file: 'useCityWeather.js / menuList.js',
    desc: '기본 3개 도시 외 대구·인천·광주·대전·울산·전주 6개를 추가함. 카페 메뉴 8종은 스펙에 정의되어 있지 않아 직접 설계함.',
  },
  {
    title: '최근 조회 도시 기록 (watch)',
    file: 'WeatherCafeRecommend.vue — recentCities',
    desc: '선택한 도시를 watch로 감시하여 최근 조회한 도시 3개를 기록하는 로직을 추가함.',
  },
  {
    title: '날씨 기반 추천 카피 자동 생성',
    file: 'recommendCaption.js',
    desc: '날씨 상태 8종과 기온(hot/cool)을 조합해 총 16가지 추천 문구를 자동 생성하는 기능을 구현함.',
  },
  {
    title: '즐겨찾기 store 2개',
    file: 'cafeStore.js / cityFavoriteStore.js',
    desc: '스펙은 단위 변환 store(configStore) 1개만 요구하나, 메뉴 즐겨찾기와 도시 즐겨찾기 store를 각각 별도로 구현함.',
  },
  {
    title: '즐겨찾기 전용 페이지',
    file: 'FavoritesView.vue — /favorites',
    desc: '찜한 도시와 메뉴를 한 화면에서 확인할 수 있는 전용 View와 Route를 추가함.',
  },
  {
    title: '대기질(미세먼지) API 연동',
    file: 'CityWeatherDetailView.vue — air_pollution',
    desc: '현재 날씨 API 응답의 좌표 데이터를 재사용하여 대기질(미세먼지) API를 추가로 연동함.',
  },
  {
    title: '날씨 상태별 다이내믹 테마',
    file: 'weatherTheme.js',
    desc: '날씨 상태 6종(맑음·흐림·비·눈·뇌우·안개)에 따라 accent 컬러·그라디언트·아이콘이 전환되는 디자인 시스템을 구현함.',
  },
]

const techStack = [
  { name: 'Vue 3', role: 'Composition API + <script setup>' },
  { name: 'Vite', role: '개발 서버 · 번들러' },
  { name: 'Vue Router', role: 'SPA 라우팅 (동적 라우트 · catch-all 404)' },
  { name: 'Pinia', role: '전역 상태 관리 (온도 단위 · 즐겨찾기 2종)' },
  { name: 'Axios', role: 'OpenWeatherMap 현재 날씨 + 5일 예보 연동' },
  { name: 'Element Plus', role: 'UI 컴포넌트 라이브러리 (버튼 · 인풋 · 아이콘)' },
]

const troubleshooting = [
  {
    title: '전역 CSS 클래스명 충돌로 "상세보기" 버튼이 가려짐',
    problem: '상세보기 버튼 클릭이 동작하지 않고, 버튼이 온도 숫자 뒤에 가려져 화면에 표시되지 않음.',
    cause:
      '기존 실습에서 사용하던 전역 CSS(practice.css)에 .weather-card, .btn-detail 클래스명이 이미 존재했고, 신규 컴포넌트가 동일한 클래스명을 재사용하면서 전역 스타일 규칙(position: absolute 등)이 그대로 적용됨.',
    fix: '컴포넌트 클래스명을 wc-card, wc-badge 등 고유 접두어로 변경하여 충돌을 제거함.',
  },
  {
    title: '날씨 상태가 "온흐림", "실 비"처럼 부자연스럽게 표시됨',
    problem: '날씨 상태 텍스트가 인코딩이 깨진 것처럼 부자연스럽게 표시됨.',
    cause: '인코딩 문제가 아니라 OpenWeatherMap의 lang=kr 자동 번역(weather[0].description) 자체가 부자연스러운 번역이었음.',
    fix: 'weather[0].main(Clear/Clouds/Rain 등 영문 코드) 기준으로 한글 라벨을 직접 매핑하는 유틸(weatherLabel.js)을 구현하여 적용함.',
  },
  {
    title: '홈 링크가 다른 페이지에서도 항상 활성 색으로 표시됨',
    problem: '"🏠 메인" 링크가 /about, /favorites 등 다른 페이지에서도 계속 활성 색으로 표시됨.',
    cause: 'Vue Router의 router-link-active 클래스는 부분 일치 기준이므로, 모든 경로가 "/"로 시작하는 이상 홈 링크가 항상 활성 상태로 인식됨.',
    fix: '정확히 일치할 때만 적용되는 router-link-exact-active 클래스 기준으로 스타일을 재적용함.',
  },
  {
    title: '화면 폭이 좁아지면 네비게이션 메뉴가 겹쳐 표시됨',
    problem: '640px 이하로 화면 폭을 줄이면 링크 4개와 단위 토글·즐겨찾기 카운터가 한 줄에 겹쳐 표시됨.',
    cause: 'nav-links에 flex-wrap만 적용되어 있어, 좁은 화면에서 줄바꿈되며 다른 요소와 공간을 다투는 구조였음.',
    fix: '640px 미만에서는 링크를 숨기고 햄버거 버튼으로 대체함. 클릭 시 드롭다운으로 펼쳐지고, 라우트 변경 시 자동으로 닫히도록 처리함.',
  },
  {
    title: '화면 폭을 극단적으로 줄이면 카드 레이아웃이 깨짐',
    problem: '화면 폭을 300px 이하로 줄이면 카드 내부 텍스트와 배지가 서로 겹쳐 표시됨.',
    cause: '최소 폭 제한이 설정되어 있지 않아, 뷰포트가 좁아질수록 grid/flex 레이아웃이 한계 없이 축소됨.',
    fix: 'body에 min-width: 320px를 설정하여, 그 이하에서는 레이아웃이 깨지는 대신 가로 스크롤이 발생하도록 처리함.',
  },
]
</script>

<template>
  <div class="about-container">
    <div class="about-hero">
      <h1 class="about-title">☕️ 날씨 기반 카페 추천</h1>
      <p class="about-lead">도시 날씨에 어울리는 카페 메뉴를 추천하는 대시보드.</p>
    </div>

    <el-tabs v-model="activeTab" class="about-tabs">
      <el-tab-pane label="소개" name="intro">
        <p class="tab-desc">
          과제 스펙은 날씨 대시보드 단일 주제였으나, <strong>카페 메뉴 추천</strong> 기능을
          결합하여 도시 기온에 맞는 메뉴를 추천하는 방향으로 확장함.
        </p>
        <p class="tab-desc">
          기온이 높은 도시는 시원한 메뉴, 낮은 도시는 따뜻한 메뉴 순으로 추천되며,
          도시·메뉴 즐겨찾기는 브라우저에 저장됨.
        </p>

        <h4 class="intro-sub-title">교수님 스펙 대비 직접 추가한 항목</h4>
        <div class="mine-list">
          <div v-for="item in myAdditions" :key="item.title" class="mine-row">
            <div class="mine-head">
              <h4>{{ item.title }}</h4>
              <code class="mine-file">{{ item.file }}</code>
            </div>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="주요 기능" name="features">
        <div class="feature-list">
          <div v-for="item in features" :key="item.title" class="feature-row">
            <el-icon class="feature-icon" :size="20"><component :is="item.icon" /></el-icon>
            <div>
              <h4>{{ item.title }}</h4>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="기술 스택" name="stack">
        <div class="stack-grid">
          <div v-for="tech in techStack" :key="tech.name" class="stack-chip">
            <strong>{{ tech.name }}</strong>
            <span>{{ tech.role }}</span>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="트러블슈팅" name="troubleshooting">
        <div class="trouble-list">
          <div v-for="item in troubleshooting" :key="item.title" class="trouble-card">
            <div class="trouble-title">
              <el-icon :size="16"><WarningFilled /></el-icon>
              <h4>{{ item.title }}</h4>
            </div>
            <p><span class="trouble-label">증상</span>{{ item.problem }}</p>
            <p><span class="trouble-label">원인</span>{{ item.cause }}</p>
            <p><span class="trouble-label">해결</span>{{ item.fix }}</p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-button type="primary" round size="large" class="home-btn" @click="router.push('/')">
      대시보드 홈으로 이동
    </el-button>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.about-hero {
  text-align: center;
  padding: 8px 0 4px;
}
.about-title {
  margin: 0 0 8px;
  font-size: 28px;
  color: var(--app-text-primary);
}
.about-lead {
  margin: 0;
  font-size: 16px;
  color: var(--app-text-secondary);
}
.about-tabs {
  background: var(--app-card-bg);
  border: 1px solid var(--app-card-border);
  backdrop-filter: var(--app-blur);
  -webkit-backdrop-filter: var(--app-blur);
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-radius-lg);
  padding: 8px 24px 24px;
}
.about-tabs :deep(.el-tabs__header) {
  margin-bottom: 12px;
}
.about-tabs :deep(.el-tabs__nav-wrap::after) {
  background: var(--app-card-border);
}
.about-tabs :deep(.el-tabs__item) {
  color: var(--app-text-secondary);
  font-weight: 600;
}
.about-tabs :deep(.el-tabs__item.is-active) {
  color: var(--app-accent-cool);
}
.about-tabs :deep(.el-tabs__active-bar) {
  background: var(--app-accent-cool);
}
.tab-desc {
  margin: 0 0 12px;
  color: var(--app-text-secondary);
  line-height: 1.7;
}
.tab-desc:last-child {
  margin-bottom: 0;
}
.intro-sub-title {
  margin: 20px 0 12px;
  color: var(--app-text-secondary);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.mine-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.mine-row {
  background: var(--app-page-bg);
  border-radius: var(--app-radius-md);
  padding: 12px 14px;
}
.mine-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.mine-head h4 {
  margin: 0;
  color: var(--app-text-primary);
  font-size: 14px;
}
.mine-file {
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 11px;
  color: var(--app-accent-cool);
  background: var(--app-accent-cool-bg);
  padding: 2px 8px;
  border-radius: var(--app-radius-pill);
}
.mine-row p {
  margin: 0;
  color: var(--app-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.feature-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}
.feature-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--app-accent-cool);
  background: var(--app-accent-cool-bg);
  padding: 8px;
  border-radius: var(--app-radius-pill);
}
.feature-row h4 {
  margin: 0 0 4px;
  color: var(--app-text-primary);
  font-size: 15px;
}
.feature-row p {
  margin: 0;
  color: var(--app-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}
.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}
.stack-chip {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--app-page-bg);
  border-radius: var(--app-radius-md);
  padding: 12px 14px;
}
.stack-chip strong {
  color: var(--app-text-primary);
  font-size: 14px;
}
.stack-chip span {
  color: var(--app-text-secondary);
  font-size: 12px;
}
.trouble-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.trouble-card {
  background: var(--app-page-bg);
  border-radius: var(--app-radius-md);
  padding: 16px 18px;
}
.trouble-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: var(--app-accent-warm);
}
.trouble-title h4 {
  margin: 0;
  color: var(--app-text-primary);
  font-size: 14px;
}
.trouble-card p {
  margin: 0 0 4px;
  color: var(--app-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}
.trouble-card p:last-child {
  margin-bottom: 0;
}
.trouble-label {
  display: inline-block;
  min-width: 40px;
  margin-right: 6px;
  color: var(--app-text-primary);
  font-weight: 700;
  font-size: 12px;
}
.home-btn {
  width: 100%;
  transition: transform var(--app-duration-fast) var(--app-ease);
}
.home-btn:active {
  transform: scale(0.98);
}
</style>
