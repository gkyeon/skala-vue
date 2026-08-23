<script setup>
import SlotNamedChild from './SlotNamedChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Named slot 레이아웃 주입 실습</h2>
    <SlotNamedChild>
      <template #header>
        <h3>📌 카드 제목 영역</h3>
      </template>
      <p>기본(default) 슬롯에 들어가는 본문 내용입니다.</p>
    </SlotNamedChild>
  </div>
</template>
