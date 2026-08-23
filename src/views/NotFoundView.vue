<script setup>
import { useRouter } from 'vue-router'
import { WarningFilled } from '@element-plus/icons-vue'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <div class="not-found-card">
      <el-icon class="not-found-icon" :size="40"><WarningFilled /></el-icon>
      <h2 class="not-found-title">페이지를 찾을 수 없습니다</h2>
      <p class="not-found-desc">주소를 다시 확인하시거나, 메인 대시보드로 돌아가 주세요.</p>
      <el-button type="primary" round size="large" class="home-btn" @click="router.push('/')">
        날씨 메인으로 이동
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}
.not-found-card {
  max-width: 380px;
  width: 100%;
  text-align: center;
  background: var(--app-card-bg);
  border: 1px solid var(--app-card-border);
  backdrop-filter: var(--app-blur);
  -webkit-backdrop-filter: var(--app-blur);
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-radius-lg);
  padding: 40px 28px;
}
.not-found-icon {
  color: var(--app-accent-warm);
  margin-bottom: 12px;
}
.not-found-title {
  margin: 0 0 8px;
  color: var(--app-text-primary);
}
.not-found-desc {
  margin: 0 0 24px;
  color: var(--app-text-secondary);
}
.home-btn {
  width: 100%;
  transition: transform var(--app-duration-fast) var(--app-ease);
}
.home-btn:active {
  transform: scale(0.98);
}
</style>
