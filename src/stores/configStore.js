import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // state: 온도 단위 (celsius | fahrenheit)
  const unit = ref('celsius')

  // getter: 화면에 표시할 단위 기호
  const unitSymbol = computed(() => (unit.value === 'celsius' ? '°C' : '°F'))

  // action: 단위 토글
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  // action: 단위 직접 지정 (세그먼트 토글 UI용)
  function setUnit(nextUnit) {
    unit.value = nextUnit
  }

  return { unit, unitSymbol, toggleUnit, setUnit }
})
