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
    desc: '서울·수원·부산·대구·인천·광주·대전·울산·전주의 현재 기온과 날씨 상태를 OpenWeatherMap API로 실시간 조회합니다.',
  },
  {
    icon: Refresh,
    title: '날씨 기반 카페 메뉴 추천',
    desc: '선택한 도시가 더우면 ICE 메뉴를, 선선하면 HOT 메뉴를 우선 추천합니다. 계절(season) 태그로 디저트·건강 메뉴도 함께 필터링돼요.',
  },
  {
    icon: Star,
    title: '즐겨찾기 (도시 ♡ / 메뉴 ☆)',
    desc: '도시 카드의 하트, 메뉴 카드의 별을 눌러 찜하면 상단 카운터에 즉시 반영되고, 전용 "즐겨찾기" 페이지에서 한눈에 모아볼 수 있습니다.',
  },
  {
    icon: Odometer,
    title: '섭씨/화씨 단위 전환 + 5일 예보',
    desc: '어디서든 °C/°F를 전환할 수 있고, 도시 상세 페이지에서는 습도·풍속과 함께 5일치 예보를 확인할 수 있습니다.',
  },
  {
    icon: Moon,
    title: '시스템 다크모드 자동 대응',
    desc: 'OS 다크모드 설정을 그대로 따라가는 반투명 유리(glass) 카드 UI로, 별도 토글 없이 기기 설정에 맞춰 화면 톤이 바뀝니다.',
  },
]

const myAdditions = [
  {
    title: '카페 메뉴 추천 컨셉',
    file: 'WeatherParent.vue',
    desc: '"날씨 대시보드" 단일 주제에 카페 메뉴 추천을 붙인 것 자체가 스펙에 없던 아이디어입니다.',
  },
  {
    title: '도시 9개 · 카페 메뉴 8종 데이터',
    file: 'useCityWeather.js / menuList.js',
    desc: '기본 도시(서울·수원·부산) 외 대구·인천·광주·대전·울산·전주 6개를 추가했고, 카페 메뉴 8종은 스펙에 아예 없어서 전부 직접 기획했습니다.',
  },
  {
    title: '최근 조회 도시 기록 (watch)',
    file: 'WeatherCafeRecommend.vue — recentCities',
    desc: '선택한 도시를 watch로 감시해서 최근 조회한 도시 3개를 기록하는 반응형 로직입니다.',
  },
  {
    title: '날씨 기반 추천 카피 자동 생성',
    file: 'recommendCaption.js',
    desc: '날씨 상태 8종 × 기온(hot/cool) 조합으로 16가지 추천 문구를 만들어 카페 추천 섹션에 보여줍니다.',
  },
  {
    title: '즐겨찾기 store 2개',
    file: 'cafeStore.js / cityFavoriteStore.js',
    desc: '스펙은 configStore(단위 변환) 하나만 요구하는데, 메뉴 즐겨찾기·도시 즐겨찾기 store를 각각 따로 추가했습니다.',
  },
  {
    title: '즐겨찾기 전용 페이지',
    file: 'FavoritesView.vue — /favorites',
    desc: '찜한 도시와 메뉴를 한곳에 모아 보는 화면으로, 본인이 추가한 View + Route입니다.',
  },
  {
    title: '대기질(미세먼지) API 연동',
    file: 'CityWeatherDetailView.vue — air_pollution',
    desc: '현재 날씨 응답의 좌표를 재사용해서 대기질 API를 추가로 호출하고, AQI 배지로 보여줍니다.',
  },
  {
    title: '날씨 상태별 다이내믹 테마',
    file: 'weatherTheme.js',
    desc: '맑음·흐림·비·눈·뇌우·안개 6종 상태에 따라 accent 컬러·그라디언트·아이콘이 바뀌는 디자인 시스템입니다.',
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
    title: '전역 CSS 클래스명 충돌로 "상세보기" 버튼이 안 보임',
    problem:
      '날씨 카드의 "상세보기" 버튼을 눌러도 반응이 없고, 화면에는 버튼이 온도 숫자 뒤에 가려져 보이지 않았습니다.',
    cause:
      '초기 실습 때 쓰던 전역 CSS(practice.css)에 .weather-card/.btn-detail 같은 이름이 이미 존재했는데, 새로 만든 컴포넌트가 <style scoped>도 없이 같은 클래스명을 그대로 재사용하면서 전역 규칙(position: absolute 등)이 그대로 새어 들어왔습니다.',
    fix: '컴포넌트 클래스명을 wc-card/wc-badge/wc-detail-btn처럼 고유 접두어로 전부 바꿔서 이름 충돌 자체를 없앴습니다.',
  },
  {
    title: '날씨 상태가 "온흐림", "실 비"처럼 어색하게 표시됨',
    problem: '도시별 날씨 상태 텍스트가 인코딩이 깨진 것처럼 부자연스럽게 나왔습니다.',
    cause:
      '인코딩 문제가 아니라 OpenWeatherMap의 lang=kr 자동 번역(weather[0].description) 자체가 어색한 번역이었습니다.',
    fix: '번역 텍스트 대신 weather[0].main(Clear/Clouds/Rain 등 영문 코드)을 기준으로 자연스러운 한글 라벨을 직접 매핑하는 유틸(weatherLabel.js)을 만들어 적용했습니다.',
  },
  {
    title: '홈 탭이 다른 페이지에서도 항상 활성 색으로 보임',
    problem: '"🏠 메인" 네비게이션 링크가 /about, /favorites 등 다른 페이지에 있어도 계속 파란 활성 색으로 표시됐습니다.',
    cause:
      'Vue Router의 router-link-active 클래스는 "부분 일치"라서, 모든 경로가 "/"로 시작하는 이상 홈 링크는 항상 활성 상태로 인식됩니다.',
    fix: 'router-link-active 대신 정확히 일치할 때만 붙는 router-link-exact-active 클래스를 기준으로 스타일을 다시 걸었습니다.',
  },
]
</script>

<template>
  <div class="about-container">
    <div class="about-hero">
      <h1 class="about-title">☕️ 날씨 기반 카페 추천</h1>
      <p class="about-lead">도시 날씨에 어울리는 카페 메뉴를 추천해주는 대시보드입니다.</p>
    </div>

    <el-tabs v-model="activeTab" class="about-tabs">
      <el-tab-pane label="소개" name="intro">
        <p class="tab-desc">
          원래 과제 주제는 "날씨 대시보드" 하나인데, 여기에 <strong>카페 메뉴 추천</strong>을
          더해서 도시 기온에 맞는 메뉴를 골라주는 걸로 방향을 잡았습니다.
        </p>
        <p class="tab-desc">
          더운 날엔 시원한 메뉴, 선선한 날엔 따뜻한 메뉴 순으로 추천되고, 도시·메뉴
          즐겨찾기는 브라우저에 저장됩니다.
        </p>

        <h4 class="intro-sub-title">교수님 스펙 대비 내가 직접 추가한 것</h4>
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
