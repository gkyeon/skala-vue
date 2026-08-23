<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'

const count = ref(0)
let timerID = null // 실시간 타이머 메모리 주소를 담을 변수

//생성 (creation) 단계 = <script setup> 본문 그 자체
console.log('1.[setup] 컴포넌트가 메모리에 생성되었습니다. (DOM 접근 불가능)')

//부착 (Mounting) 단계
onMounted(() => {
  console.log('2.[onMounted] 화면에 완벽히 부착되었습니다.! (API 호풀/ DOM 조작 적기')
  //실무 활용 시뮬레이션 : 3초마다 숫자가 자동으로 올라가는 타이머 가동
  timerID = setInterval(() => {
    count.value++
  }, 3000)
})

// 갱신 (Updating) 단계 - count 변수가 바뀌어서 화면이 리렌더링(새로고침) 될 때마다 매번 실행됩니다)
onUpdated(() => {
  console.log(
    `3. [onUpdated] 데이터가 변경되어 화면을 새로 그렸습니다. (현재 count: ${count.value})`,
  )
})

// 소멸 (Unmounting) 단계 = v-if="false" 등으로 이 컴포넌트가 화면에서 완전히 파괴되어 사라질 때 실행된다.
onUnmounted(() => {
  // 여기서 타이머를 안 꺼주면 컴포넌트가 화면에서 완전히 파괴되어 사라질 때 실행된다.
  clearInterval(timerID)
  console.log('4. [onUnmounted] 컴포넌트가 소멸했습니다. 타이머 청소 완료 !')
})
</script>

<template>
  <div class="practice-section">
    <h2>Lifecycle 훅 학습</h2>
    <p>3초마다 자동으로 올라가는 카운트: {{ count }}</p>
  </div>
</template>
