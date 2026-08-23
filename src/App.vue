<script setup>
import { ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import FavoriteCounter from './components/assignment/gkyeon/FavoriteCounter.vue'
import UnitToggler from './components/assignment/gkyeon/UnitToggler.vue'
// 아래 3개는 라우팅 적용 이전에 진행한 실습 단계 (참고용으로 주석 보존)
// import CafeMockup from './components/assignment/gkyeon/CafeMockup.vue'
// import WeatherComposition from './components/assignment/gkyeon/WeatherComposition.vue'
// import WeatherMockup from './components/assignment/gkyeon/WeatherMockup.vue'

const route = useRoute()
const isMenuOpen = ref(false)

// 라우트가 바뀌면(=링크 클릭으로 이동하면) 모바일 드롭다운은 자동으로 닫는다
watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  },
)
</script>

<template>
  <div class="app-shell">
    <nav class="navigation-bar">
      <button
        class="menu-toggle"
        :class="{ 'is-open': isMenuOpen }"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-label="메뉴 열기/닫기"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>

      <div class="nav-links" :class="{ open: isMenuOpen }">
        <RouterLink to="/" class="nav-item">🏠 메인</RouterLink>
        <RouterLink to="/favorites" class="nav-item">❤️ 즐겨찾기</RouterLink>
        <RouterLink to="/about" class="nav-item">ℹ️ 소개</RouterLink>
        <RouterLink to="/practices" class="nav-item">📚 연습 모음</RouterLink>
      </div>
      <div class="nav-widgets">
        <UnitToggler />
        <FavoriteCounter />
      </div>
    </nav>
    <main>
      <RouterView v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: var(--app-page-bg);
}
.navigation-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 16px 28px;
  background: var(--app-nav-bg);
  backdrop-filter: var(--app-blur);
  -webkit-backdrop-filter: var(--app-blur);
  border-bottom: 1px solid var(--app-card-border);
}
.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}
.nav-widgets {
  display: flex;
  align-items: center;
  gap: 10px;
}
.menu-toggle {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: var(--app-radius-md);
  cursor: pointer;
  transition: background var(--app-duration) var(--app-ease);
}
.menu-toggle:hover {
  background: var(--app-page-bg);
}
.menu-toggle .bar {
  width: 20px;
  height: 2px;
  border-radius: var(--app-radius-pill);
  background: var(--app-text-primary);
  transition:
    transform var(--app-duration) var(--app-ease),
    opacity var(--app-duration) var(--app-ease);
}
.menu-toggle.is-open .bar:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.menu-toggle.is-open .bar:nth-child(2) {
  opacity: 0;
}
.menu-toggle.is-open .bar:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* 좁은 화면에서는 nav-links가 가로로 눌려서 뭉개지는 대신 햄버거 토글로 접힘 */
@media (max-width: 639px) {
  .navigation-bar {
    padding: 12px 16px;
  }
  .menu-toggle {
    display: flex;
    order: -1;
  }
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 4px;
    padding: 10px 16px 16px;
    background: var(--app-nav-bg);
    backdrop-filter: var(--app-blur);
    -webkit-backdrop-filter: var(--app-blur);
    border-bottom: 1px solid var(--app-card-border);
  }
  .nav-links.open {
    display: flex;
  }
  .nav-item {
    width: 100%;
  }
}
.nav-item {
  text-decoration: none;
  color: var(--app-text-secondary);
  font-weight: 600;
  font-size: 14px;
  padding: 7px 14px;
  border-radius: var(--app-radius-pill);
  transition:
    color var(--app-duration) var(--app-ease),
    background var(--app-duration) var(--app-ease);
}
/* router-link-active(부분 일치)가 아니라 exact-active를 써서
   "/" 링크가 하위 경로에서도 항상 활성화 색으로 보이는 문제를 피함 */
.nav-item.router-link-exact-active {
  color: var(--app-accent-cool);
  background: var(--app-accent-cool-bg);
}
main {
  padding: 32px 20px 60px;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition:
    opacity var(--app-duration) var(--app-ease),
    transform var(--app-duration) var(--app-ease);
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
