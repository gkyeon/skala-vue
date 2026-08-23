<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { WarningFilled } from '@element-plus/icons-vue'
import { useCafeStore } from '@/stores/cafeStore'

const route = useRoute()
const router = useRouter()
const cafeStore = useCafeStore()

const mockMenuDetails = {
  menu_01: {
    name: '아메리카노',
    category: '커피',
    hasHotIce: true,
    priceHot: 4000,
    priceIce: 4500,
    desc: '깊고 진한 에스프레소에 물을 더한 기본 커피.',
  },
  menu_02: {
    name: '카페라떼',
    category: '커피',
    hasHotIce: true,
    priceHot: 4500,
    priceIce: 5000,
    desc: '에스프레소에 부드러운 스팀 밀크를 더한 커피.',
  },
  menu_03: {
    name: '초코케이크',
    category: '디저트',
    hasHotIce: false,
    price: 6500,
    desc: '진한 초콜릿 풍미의 촉촉한 케이크.',
  },
  menu_04: {
    name: '고함량 프로틴 쉐이크',
    category: '건강',
    hasHotIce: false,
    price: 4000,
    desc: '운동 후 마시기 좋은 고단백 쉐이크.',
  },
}

const menuData = ref(null)

onMounted(() => {
  const id = route.params.menuId
  if (mockMenuDetails[id]) {
    menuData.value = mockMenuDetails[id]
  }
})

const currentTemp = computed(() => {
  if (!menuData.value?.hasHotIce) return null
  return cafeStore.getTempChoice(route.params.menuId, 'hot')
})

const price = computed(() => {
  if (!menuData.value) return 0
  if (!menuData.value.hasHotIce) return menuData.value.price
  return currentTemp.value === 'ice' ? menuData.value.priceIce : menuData.value.priceHot
})
</script>

<template>
  <div class="detail-container">
    <h3 class="detail-title">☕ 메뉴 상세 정보</h3>

    <div v-if="menuData" class="info-card">
      <div class="info-header">
        <h4>{{ menuData.name }}</h4>
        <span class="category-tag">{{ menuData.category }}</span>
      </div>
      <p class="desc">{{ menuData.desc }}</p>

      <div class="info-rows">
        <p v-if="menuData.hasHotIce" class="info-row">
          <span class="label">현재 선택</span>
          <strong class="temp-value">{{ currentTemp === 'ice' ? 'ICE' : 'HOT' }}</strong>
        </p>
        <p class="info-row">
          <span class="label">가격</span>
          <strong class="price-value">{{ price }}원</strong>
        </p>
      </div>

      <p v-if="cafeStore.isFavorite(route.params.menuId)" class="favorite-note">
        ⭐ 즐겨찾기한 메뉴입니다.
      </p>
    </div>
    <div v-else class="empty-state">
      <el-icon :size="32"><WarningFilled /></el-icon>
      <p>해당 메뉴의 상세 데이터가 존재하지 않습니다.</p>
    </div>

    <el-button round size="large" class="back-btn" @click="router.push('/')">
      ← 카페 추천으로 돌아가기
    </el-button>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 640px;
  margin: 0 auto;
  background: var(--app-card-bg);
  border: 1px solid var(--app-card-border);
  backdrop-filter: var(--app-blur);
  -webkit-backdrop-filter: var(--app-blur);
  box-shadow: var(--app-card-shadow);
  padding: 28px;
  border-radius: var(--app-radius-lg);
}
.detail-title {
  margin: 0 0 18px;
  color: var(--app-text-primary);
}
.info-card {
  background: var(--app-page-bg);
  padding: 20px;
  border-radius: var(--app-radius-md);
  margin-bottom: 20px;
}
.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.info-header h4 {
  margin: 0;
  color: var(--app-text-primary);
}
.category-tag {
  font-size: 11px;
  font-weight: 600;
  color: var(--app-accent-cool);
  background: var(--app-accent-cool-bg);
  padding: 3px 10px;
  border-radius: var(--app-radius-pill);
}
.desc {
  margin: 0 0 16px;
  color: var(--app-text-secondary);
  line-height: 1.6;
}
.info-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
}
.info-row .label {
  color: var(--app-text-secondary);
  font-size: 13px;
}
.temp-value {
  color: var(--app-text-primary);
}
.price-value {
  color: var(--app-text-primary);
  font-size: 18px;
}
.favorite-note {
  margin: 14px 0 0;
  color: var(--app-accent-warm);
  font-weight: 600;
  font-size: 14px;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--app-accent-warm);
  text-align: center;
  padding: 24px 0 32px;
}
.empty-state p {
  margin: 0;
  color: var(--app-text-secondary);
  font-weight: 500;
}
.back-btn {
  width: 100%;
  transition: transform var(--app-duration-fast) var(--app-ease);
}
.back-btn:active {
  transform: scale(0.98);
}
</style>
