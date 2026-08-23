import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// cafeStore.js의 즐겨찾기 패턴을 그대로 따라 도시 즐겨찾기(♡) 상태를 관리하는 store
export const useCityFavoriteStore = defineStore('cityFavorite', () => {
  // state: 즐겨찾기한 도시 id 목록
  const favorites = ref([])

  // getter: 즐겨찾기 개수
  const favoriteCount = computed(() => favorites.value.length)

  function isFavorite(cityId) {
    return favorites.value.includes(cityId)
  }

  // action: 도시 즐겨찾기 토글
  function toggleFavorite(cityId) {
    if (isFavorite(cityId)) {
      favorites.value = favorites.value.filter((id) => id !== cityId)
    } else {
      favorites.value.push(cityId)
    }
  }

  return {
    favorites,
    favoriteCount,
    isFavorite,
    toggleFavorite,
  }
})
