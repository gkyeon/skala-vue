<script setup>
import { ref } from 'vue'

const position = ref('')
const tagName = ref('')
const getOnlyEvent = (e) => {
  position.value = `좌표 : X=${e.clientX}, Y=${e.clientY}`
}
const getWithParam = (name, e) => {
  tagName.value = `대상:${name} / 클릭된 태그 : ${e.target.tagName}`
}
</script>

<template>
  <div class="practice-section">
    <h2>v-on 이벤트 객체($event) 활용</h2>
    <button @click="getOnlyEvent($event)">$event만 받기</button>
    <p>좌표:{{ position }}</p>
    <button @click="getWithParam('버튼A', $event)">이름 + $event 같이 받기</button>
    <p>{{ tagName }}</p>
  </div>
</template>
