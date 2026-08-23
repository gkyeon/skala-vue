<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const userForm = ref({
  email: '',
  agree: false,
})

const handleRegister = () => {
  if (!userForm.value.email.includes('@')) {
    ElMessage.error('❌ 올바른 이메일 형식이 아닙니다.')
    return
  }
  if (!userForm.value.agree) {
    ElMessage.warning('⚠️ 이용약관에 동의하셔야 합니다.')
    return
  }
  ElMessage.success('🎉 가입 신청이 정상적으로 완료되었습니다!')
}
</script>

<template>
  <el-card class="challenge-card">
    <template #header>
      <span>📝 실습 1. 회원가입 Form &amp; 인풋 제어</span>
    </template>

    <div class="form-row">
      <label>이메일 주소:</label>
      <el-input v-model="userForm.email" placeholder="example@email.com" />
    </div>

    <div class="form-row">
      <el-switch v-model="userForm.agree" />
      <span>개인정보 수집 및 필수 이용약관에 동의합니다.</span>
    </div>

    <el-button type="success" @click="handleRegister">🔐 회원가입하기</el-button>
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
  margin-bottom: 20px;
}
.form-row label {
  flex-shrink: 0;
  width: 90px;
}
.form-row .el-input {
  flex: 1;
}
</style>
