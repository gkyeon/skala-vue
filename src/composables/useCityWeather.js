import { ref, onMounted } from 'vue'
import axios from 'axios'
import { getWeatherLabel } from '@/utils/weatherLabel'

// 도시 id ↔ OpenWeatherMap 조회용 영문 도시명 (city_04 이후 = 본인이 추가한 도시)
export const CITY_MAP = [
  { id: 'city_01', name: '서울', query: 'Seoul' },
  { id: 'city_02', name: '수원', query: 'Suwon' },
  { id: 'city_03', name: '부산', query: 'Busan' },
  { id: 'city_04', name: '대구', query: 'Daegu' },
  { id: 'city_05', name: '인천', query: 'Incheon' },
  { id: 'city_06', name: '광주', query: 'Gwangju' },
  { id: 'city_07', name: '대전', query: 'Daejeon' },
  { id: 'city_08', name: '울산', query: 'Ulsan' },
  { id: 'city_09', name: '전주', query: 'Jeonju' },
]

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

// WeatherParent.vue(Home)와 FavoritesView.vue 둘 다 같은 실시간 날씨 목록이 필요해서
// 원래 WeatherParent.vue 안에 있던 fetch 로직을 그대로 옮긴 공용 composable.
// 동작(호출 파라미터, 에러 처리, 반환 데이터 모양)은 기존과 완전히 동일.
export function useCityWeather() {
  const weatherList = ref([])
  const isLoading = ref(false)

  const fetchRealTimeWeather = async () => {
    isLoading.value = true
    try {
      const responses = await Promise.all(
        CITY_MAP.map((city) =>
          axios.get(BASE_URL, {
            params: { q: city.query, appid: API_KEY, units: 'metric', lang: 'kr' },
          }),
        ),
      )

      weatherList.value = CITY_MAP.map((city, index) => ({
        id: city.id,
        name: city.name,
        temp: responses[index].data.main.temp,
        status: getWeatherLabel(responses[index].data.weather[0].main),
      }))
    } catch (error) {
      console.error('실시간 날씨 조회 실패:', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    fetchRealTimeWeather()
  })

  return { weatherList, isLoading, fetchRealTimeWeather }
}
