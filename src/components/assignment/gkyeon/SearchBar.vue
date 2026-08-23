<script setup>
import { Search } from '@element-plus/icons-vue'

// 1. 상위로 입력 텍스트를 전달할 커스텀 이벤트 등록 (매크로)
defineEmits(['update-query'])

// 2. 상위로부터 현재 검색 상태 값을 수신(한글 동기화 상태 유지용)
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="search-inner">
    <el-input
      :model-value="currentQuery"
      placeholder="검색할 도시 이름 입력"
      clearable
      size="large"
      class="search-input"
      @input="(val) => $emit('update-query', val)"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>
  </div>
</template>

<style scoped>
.search-input :deep(.el-input__wrapper) {
  border-radius: var(--app-radius-pill);
  background: var(--app-page-bg);
  box-shadow: none;
  padding: 4px 20px;
}
</style>
