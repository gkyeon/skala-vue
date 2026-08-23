<script setup>
import { ref } from 'vue'

// 본인만의 데이터: 카페 메뉴 배열 (v-for 및 :key 실습용)
const menuList = ref([
  { id: 'menu_01', name: '아메리카노', price: 4500, category: '커피' },
  { id: 'menu_02', name: '카페라떼', price: 5000, category: '커피' },
  { id: 'menu_03', name: '초코케이크', price: 6500, category: '디저트' },
  { id: 'menu_04', name: '고함량 프로틴 쉐이크', price: 4000, category: '음료' },
  { id: 'menu_05', name: '개인 PT', price: 50000, category: '서비스' },
])

// 검색어 및 알림창 제어용 데이터 (v-model 대용 한글 처리 및 이벤트 실습용)
const searchQuery = ref('')
const selectedMenuInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 알림 대행 함수 (window 객체 격리 우회)
const showDetail = (menuName, category, price) => {
  window.alert(`${menuName}의 가격은 ${price}원, 카테고리는 [${category}]입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>🔍 메뉴 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 메뉴 이름 입력"
      />
      <p>
        검색 중인 메뉴: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>☕ 카페 메뉴판</h3>

      <div
        v-for="item in menuList"
        :key="item.id"
        class="weather-card"
        @click="selectedMenuInfo = `${item.name}이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.category }})</h4>
        <p>가격: {{ item.price }}원</p>

        <span v-if="item.price >= 5000" class="badge hot">💎 프리미엄 (5000원 이상)</span>
        <span v-else class="badge cool">🪙 가성비 (5000원 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(item.name, item.category, item.price)">
          상세보기
        </button>
      </div>
    </section>

    <div class="status-bar">
      {{ selectedMenuInfo }}
    </div>
  </div>
</template>
