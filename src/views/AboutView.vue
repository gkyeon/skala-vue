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
    desc: '서울, 수원, 부산... 이렇게 9개 도시 날씨를 OpenWeatherMap에서 실시간으로 긁어옴.',
  },
  {
    icon: Refresh,
    title: '날씨 기반 카페 메뉴 추천',
    desc: '더운 도시 고르면 아이스 위주로, 선선하면 핫 위주로 메뉴가 추천됨. 디저트나 건강 메뉴는 계절 태그로 알아서 걸러짐.',
  },
  {
    icon: Star,
    title: '즐겨찾기 (도시 ♡ / 메뉴 ☆)',
    desc: '도시는 하트, 메뉴는 별 눌러서 찜. 위에 카운터 숫자도 바로 바뀌고 즐겨찾기 페이지 가면 몰아서 볼 수 있음.',
  },
  {
    icon: Odometer,
    title: '섭씨/화씨 단위 전환 + 5일 예보',
    desc: '°C/°F는 아무 데서나 바꿀 수 있고, 도시 눌러서 상세로 들어가면 습도랑 풍속에 5일치 예보까지 나옴.',
  },
  {
    icon: Moon,
    title: '시스템 다크모드 자동 대응',
    desc: '핸드폰이나 컴퓨터 다크모드 켜져 있으면 앱도 알아서 어둡게 바뀜. 버튼 따로 안 만들어도 됨.',
  },
]

const myAdditions = [
  {
    title: '카페 메뉴 추천 컨셉',
    file: 'WeatherParent.vue',
    desc: '원래 스펙은 그냥 날씨 대시보드였는데, 심심해서 카페 메뉴 추천을 붙여봄.',
  },
  {
    title: '도시 9개 · 카페 메뉴 8종 데이터',
    file: 'useCityWeather.js / menuList.js',
    desc: '도시는 대구·인천·광주·대전·울산·전주 6개 더 넣었고, 메뉴 8개는 스펙에 아예 없어서 그냥 내가 다 지어냄.',
  },
  {
    title: '최근 조회 도시 기록 (watch)',
    file: 'WeatherCafeRecommend.vue — recentCities',
    desc: '도시 하나 고를 때마다 watch로 감시해서 최근 본 도시 3개까지 기록해둠.',
  },
  {
    title: '날씨 기반 추천 카피 자동 생성',
    file: 'recommendCaption.js',
    desc: '날씨랑 기온 조합해서 추천 멘트를 16가지 자동으로 뽑아내게 만듦. 매번 똑같은 말 뜨면 재미없어서.',
  },
  {
    title: '즐겨찾기 store 2개',
    file: 'cafeStore.js / cityFavoriteStore.js',
    desc: '즐겨찾기가 메뉴 따로 도시 따로라서 store도 두 개로 나눠서 만듦.',
  },
  {
    title: '즐겨찾기 전용 페이지',
    file: 'FavoritesView.vue — /favorites',
    desc: '찜한 거 모아보는 페이지가 없길래 하나 새로 만듦.',
  },
  {
    title: '대기질(미세먼지) API 연동',
    file: 'CityWeatherDetailView.vue — air_pollution',
    desc: '날씨 API가 좌표를 같이 주길래 그거 그대로 써서 미세먼지 API도 붙여봄.',
  },
  {
    title: '날씨 상태별 다이내믹 테마',
    file: 'weatherTheme.js',
    desc: '날씨 상태마다 색이랑 아이콘이 다르게 나오게 하고 싶어서 테마 파일 하나 따로 뺌.',
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
    title: '"상세보기" 버튼이 온도 숫자 뒤에 가려져서 안 보임',
    desc: '눌러도 반응이 없어서 한참 봤는데, 예전 실습 때 쓰던 전역 CSS(practice.css)에 .weather-card, .btn-detail 이름이 이미 있었고 새로 만든 컴포넌트가 그 이름을 그대로 써버려서 스타일이 새어 들어온 거였음. 클래스명을 wc-card, wc-badge처럼 고유 접두어로 싹 바꾸니까 바로 해결됨.',
  },
  {
    title: '날씨 상태가 "온흐림", "실 비"처럼 나옴',
    desc: '처음엔 인코딩 깨진 줄 알았는데 아니고, OpenWeatherMap이 lang=kr로 줄 때 번역 자체가 원래 어색한 거였음. weather[0].main 영문 코드(Clear/Clouds/Rain...) 기준으로 한글 라벨 직접 매핑하는 파일(weatherLabel.js) 하나 만들어서 해결.',
  },
  {
    title: '홈 링크가 다른 페이지 가도 계속 활성 색으로 보임',
    desc: '/about 같은 데 가도 "🏠 메인"이 계속 파란색이길래 찾아보니, router-link-active가 부분 일치라서 모든 경로가 "/"로 시작하니까 항상 걸리는 거였음. router-link-exact-active로 바꿔서 고침.',
  },
  {
    title: '화면 좁히면 nav 메뉴가 다 뭉개짐',
    desc: '반응형 만들면서 폭 줄여봤더니 링크 4개랑 단위토글, 즐겨찾기 카운터가 한 줄에 다 우겨넣어져서 글자끼리 겹쳐버림. 640px 밑에서는 링크를 다 숨기고 햄버거 버튼 하나로 바꿔서, 누르면 드롭다운으로 펼쳐지게 만듦. 페이지 이동하면 자동으로 닫히게 처리.',
  },
  {
    title: '폭을 극단적으로 줄이면 카드가 깨짐',
    desc: '최소 폭을 아예 안 걸어놨더니 300px 밑으로 줄일 때 카드 안 글자랑 배지가 서로 겹치기 시작함. body에 min-width: 320px 걸어서 그 밑으로는 그냥 가로 스크롤이 뜨게 처리함. 억지로 찌그러지는 것보단 스크롤 생기는 게 나음.',
  },
]
</script>

<template>
  <div class="about-container">
    <div class="about-hero">
      <h1 class="about-title">☕️ 날씨 기반 카페 추천</h1>
      <p class="about-lead">도시 날씨에 어울리는 카페 메뉴 추천해주는 대시보드.</p>
    </div>

    <el-tabs v-model="activeTab" class="about-tabs">
      <el-tab-pane label="소개" name="intro">
        <p class="tab-desc">
          원래 과제 주제는 "날씨 대시보드" 하나인데, 여기에 <strong>카페 메뉴 추천</strong>을
          더해서 도시 기온에 맞는 메뉴 골라주는 걸로 방향 잡음.
        </p>
        <p class="tab-desc">
          더운 날엔 시원한 메뉴, 선선한 날엔 따뜻한 메뉴 순으로 추천되고, 도시·메뉴
          즐겨찾기는 브라우저에 저장됨.
        </p>

        <h4 class="intro-sub-title">교수님 스펙엔 없던, 내가 추가한 것</h4>
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
            <p>{{ item.desc }}</p>
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
.home-btn {
  width: 100%;
  transition: transform var(--app-duration-fast) var(--app-ease);
}
.home-btn:active {
  transform: scale(0.98);
}
</style>
