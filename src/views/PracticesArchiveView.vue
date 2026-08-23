<script setup>
import { ref } from 'vue'

const groups = [
  {
    label: '기본 문법 (Day1~3)',
    items: [
      { name: 'SampleOne', load: () => import('@/components/practices/basic/SampleOne.vue') },
      { name: 'SampleTwo', load: () => import('@/components/practices/basic/SampleTwo.vue') },
      { name: 'VTextSample', load: () => import('@/components/practices/basic/VTextSample.vue') },
      { name: 'VHtmlSample', load: () => import('@/components/practices/basic/VHtmlSample.vue') },
      { name: 'VHtmlXssSample', load: () => import('@/components/practices/basic/VHtmlXssSample.vue') },
      { name: 'VBindSample', load: () => import('@/components/practices/basic/VBindSample.vue') },
      {
        name: 'VBindClassStyleSample',
        load: () => import('@/components/practices/basic/VBindClassStyleSample.vue'),
      },
      { name: 'VifSample', load: () => import('@/components/practices/basic/VifSample.vue') },
      { name: 'VShowSample', load: () => import('@/components/practices/basic/VShowSample.vue') },
      { name: 'VForSample', load: () => import('@/components/practices/basic/VForSample.vue') },
      { name: 'VonEventHandler', load: () => import('@/components/practices/basic/VonEventHandler.vue') },
      {
        name: 'VEventObjectSample',
        load: () => import('@/components/practices/basic/VEventObjectSample.vue'),
      },
      {
        name: 'VmodelTwowayBindingSample',
        load: () => import('@/components/practices/basic/VmodelTwowayBindingSample.vue'),
      },
      { name: 'VrefSample', load: () => import('@/components/practices/basic/VrefSample.vue') },
      { name: 'VWatchSample', load: () => import('@/components/practices/basic/VWatchSample.vue') },
      { name: 'vLifecycleHook', load: () => import('@/components/practices/basic/vLifecycleHook.vue') },
      {
        name: 'LifecycleSample',
        load: () => import('@/components/practices/basic/LifecycleSample.vue'),
      },
      { name: 'ElementsHandling', load: () => import('@/components/practices/basic/ElementsHandling.vue') },
      { name: 'PropsEmitsParent', load: () => import('@/components/practices/basic/PropsEmitsParent.vue') },
      { name: 'SlotDefaultParent', load: () => import('@/components/practices/basic/SlotDefaultParent.vue') },
      { name: 'SlotNamedParent', load: () => import('@/components/practices/basic/SlotNamedParent.vue') },
    ],
  },
  {
    label: 'Mockup / Composition 단계',
    items: [
      {
        name: 'WeatherMockup',
        load: () => import('@/components/assignment/gkyeon/WeatherMockup.vue'),
      },
      {
        name: 'WeatherComposition',
        load: () => import('@/components/assignment/gkyeon/WeatherComposition.vue'),
      },
      { name: 'CafeMockup', load: () => import('@/components/assignment/gkyeon/CafeMockup.vue') },
      {
        name: 'WeatherCafeRecommend (기본 버전)',
        load: () => import('@/components/assignment/gkyeon/WeatherCafeRecommend.vue'),
      },
    ],
  },
  {
    label: 'Axios 연습',
    items: [
      { name: 'AxiosJson (CRUD)', load: () => import('@/components/assignment/gkyeon/AxiosJson.vue') },
      {
        name: 'OpenWeatherMap',
        load: () => import('@/components/assignment/gkyeon/OpenWeatherMap.vue'),
      },
    ],
  },
  {
    label: 'UI Libraries 코드 챌린지',
    items: [
      {
        name: '실습1. 회원가입 Form & 인풋 제어',
        load: () => import('@/components/practices/library/RegisterFormChallenge.vue'),
      },
      {
        name: '실습2. 커머스 상품 수량 및 평점',
        load: () => import('@/components/practices/library/ProductRatingChallenge.vue'),
      },
      {
        name: '실습3. 시스템 피드백 & 프로그레스',
        load: () => import('@/components/practices/library/ProgressFeedbackChallenge.vue'),
      },
    ],
  },
]

const selectedName = ref('')
const ActiveComponent = ref(null)
const loadError = ref('')

async function select(item) {
  selectedName.value = item.name
  loadError.value = ''
  ActiveComponent.value = null
  try {
    const mod = await item.load()
    ActiveComponent.value = mod.default
  } catch (error) {
    console.error(`[연습 아카이브] ${item.name} 로드 실패:`, error)
    loadError.value = `이 코드를 불러오는 중 오류가 발생했습니다: ${error.message}`
  }
}
</script>

<template>
  <div class="archive-view">
    <aside class="sidebar">
      <div v-for="group in groups" :key="group.label" class="group">
        <h4>{{ group.label }}</h4>
        <button
          v-for="item in group.items"
          :key="item.name"
          class="item-btn"
          :class="{ active: selectedName === item.name }"
          @click="select(item)"
        >
          {{ item.name }}
        </button>
      </div>
    </aside>

    <section class="panel">
      <p v-if="!selectedName" class="empty">👈 왼쪽 목록에서 연습 코드를 선택하면 여기에 렌더링됩니다.</p>
      <p v-else-if="loadError" class="error">{{ loadError }}</p>
      <component :is="ActiveComponent" v-else-if="ActiveComponent" />
    </section>
  </div>
</template>

<style scoped>
.archive-view {
  display: flex;
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
  align-items: flex-start;
}
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--app-card-bg);
  border-radius: var(--app-radius-lg);
  box-shadow: var(--app-card-shadow);
  padding: 16px;
  max-height: 80vh;
  overflow-y: auto;
}
.group {
  margin-bottom: 16px;
}
.group h4 {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--app-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.item-btn {
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  padding: 8px 10px;
  border-radius: var(--app-radius-md);
  font-size: 13px;
  color: var(--app-text-primary);
  cursor: pointer;
  margin-bottom: 2px;
}
.item-btn:hover {
  background: var(--app-page-bg);
}
.item-btn.active {
  background: var(--app-accent-cool-bg);
  color: var(--app-accent-cool);
  font-weight: 700;
}
.panel {
  flex: 1;
  background: var(--app-card-bg);
  border-radius: var(--app-radius-lg);
  box-shadow: var(--app-card-shadow);
  padding: 24px;
  min-height: 400px;
}
.empty {
  color: var(--app-text-secondary);
}
.error {
  color: #e05555;
}
</style>
