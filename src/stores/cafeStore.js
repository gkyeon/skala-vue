import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCafeStore = defineStore('cafe', () => {
  // state: 메뉴별 사용자가 고른 온도 (menuId -> 'hot' | 'ice')
  const tempChoice = ref({})
  // state: 즐겨찾기한 메뉴 id 목록
  const favorites = ref([])

  // getter: 즐겨찾기 개수
  const favoriteCount = computed(() => favorites.value.length)

  function isFavorite(menuId) {
    return favorites.value.includes(menuId)
  }

  function getTempChoice(menuId, fallback = 'hot') {
    return tempChoice.value[menuId] || fallback
  }

  // action: 카드별 HOT/ICE 선택
  function chooseTemp(menuId, type) {
    tempChoice.value[menuId] = type
  }

  // action: 즐겨찾기 토글
  function toggleFavorite(menuId) {
    if (isFavorite(menuId)) {
      favorites.value = favorites.value.filter((id) => id !== menuId)
    } else {
      favorites.value.push(menuId)
    }
  }

  return {
    tempChoice,
    favorites,
    favoriteCount,
    isFavorite,
    getTempChoice,
    chooseTemp,
    toggleFavorite,
  }
})
