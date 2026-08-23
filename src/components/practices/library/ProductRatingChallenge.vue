<script setup>
import { ref } from 'vue'

const productQuantity = ref(1) // 수량 카운터 기본값
const productRate = ref(4) // 별점 기본값 (별 4개)
</script>

<template>
  <el-card class="challenge-card">
    <template #header>
      <span>🛒 실습 2. 커머스 상품 수량 및 평점 시스템</span>
    </template>

    <div class="form-row">
      <label>구매 수량 선택:</label>
      <el-input-number v-model="productQuantity" :min="1" :max="10" />
      <span class="hint">(최대 10개 구매 가능)</span>
    </div>

    <div class="form-row">
      <label>상품 만족도 별점:</label>
      <el-rate v-model="productRate" />
      <span class="hint">{{ productRate }}점</span>
    </div>

    <div class="summary-bar">
      🟢 실시간 장부 요약: 선택 수량 {{ productQuantity }}개 / 내가 준 점수 {{ productRate }}점
    </div>
  </el-card>
</template>

<style scoped>
.challenge-card {
  max-width: 480px;
}
.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.form-row label {
  flex-shrink: 0;
  width: 110px;
}
.hint {
  color: #909399;
  font-size: 13px;
}
.summary-bar {
  background: #f4f4f5;
  padding: 10px 14px;
  border-radius: 6px;
  margin-top: 8px;
}
</style>
