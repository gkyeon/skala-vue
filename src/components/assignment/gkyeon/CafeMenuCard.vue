<!-- 3. CafeMenuCard.vue -->
<!-- - 카페 메뉴 한 장을 담당하는 분리 컴포넌트 -->
<!-- - HOT/ICE 선택, 즐겨찾기 상태는 cafeStore(전역 store)에서 관리 -->
<script setup>
import { computed } from 'vue'
import { Star, StarFilled } from '@element-plus/icons-vue'
import { useCafeStore } from '@/stores/cafeStore'

const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
  recommendedTemp: {
    type: String,
    default: 'hot',
  },
})

defineEmits(['show-detail'])

const cafeStore = useCafeStore()

const currentTemp = computed(() => cafeStore.getTempChoice(props.menu.id, props.recommendedTemp))

const price = computed(() => {
  if (!props.menu.hasHotIce) return props.menu.price
  return currentTemp.value === 'ice' ? props.menu.priceIce : props.menu.priceHot
})
</script>

<template>
  <div class="menu-card">
    <div class="card-main">
      <h4>{{ menu.name }}</h4>
      <p class="category">{{ menu.category }}</p>

      <div v-if="menu.hasHotIce" class="temp-toggle">
        <button
          class="segment"
          :class="{ active: currentTemp === 'hot' }"
          @click.stop="cafeStore.chooseTemp(menu.id, 'hot')"
        >
          HOT
        </button>
        <button
          class="segment"
          :class="{ active: currentTemp === 'ice' }"
          @click.stop="cafeStore.chooseTemp(menu.id, 'ice')"
        >
          ICE
        </button>
        <span v-if="currentTemp === recommendedTemp" class="recommend-tag">👍 오늘 추천</span>
      </div>
    </div>

    <div class="card-side">
      <p class="price">{{ price }}원</p>
      <div class="actions">
        <el-button
          size="small"
          circle
          :type="cafeStore.isFavorite(menu.id) ? 'warning' : 'default'"
          @click.stop="cafeStore.toggleFavorite(menu.id)"
        >
          <el-icon><StarFilled v-if="cafeStore.isFavorite(menu.id)" /><Star v-else /></el-icon>
        </el-button>
        <el-button size="small" round @click.stop="$emit('show-detail', menu, price)">
          상세보기
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: var(--app-page-bg);
  border-radius: var(--app-radius-md);
  padding: 16px 18px;
  margin-bottom: 10px;
  transition: box-shadow var(--app-duration) var(--app-ease);
}
.menu-card:hover {
  box-shadow: var(--app-card-shadow-hover);
}
.card-main h4 {
  margin: 0 0 2px;
  color: var(--app-text-primary);
}
.category {
  margin: 0;
  color: var(--app-text-secondary);
  font-size: 13px;
}
.temp-toggle {
  margin-top: 8px;
  display: flex;
  gap: 6px;
  align-items: center;
}
.temp-toggle .segment {
  border: none;
  background: var(--app-card-bg);
  padding: 4px 10px;
  border-radius: var(--app-radius-pill);
  font-size: 12px;
  font-weight: 600;
  color: var(--app-text-secondary);
  cursor: pointer;
  transition: all var(--app-duration) var(--app-ease);
}
.temp-toggle .segment.active {
  background: var(--app-accent-cool);
  color: #fff;
}
.temp-toggle .segment:active {
  transform: scale(0.92);
}
.recommend-tag {
  font-size: 11px;
  font-weight: 600;
  color: var(--app-accent-warm);
  background: var(--app-accent-warm-bg);
  padding: 3px 10px;
  border-radius: var(--app-radius-pill);
  white-space: nowrap;
}
.card-side {
  text-align: right;
  flex-shrink: 0;
}
.price {
  margin: 0 0 8px;
  font-weight: 700;
  color: var(--app-text-primary);
}
.actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}
</style>
