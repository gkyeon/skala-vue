import { Sunny, Cloudy, Pouring, Drizzling, Lightning, MostlyCloudy, PartlyCloudy } from '@element-plus/icons-vue'

// weatherLabel.js의 getWeatherLabel()이 만들어내는 한글 라벨('맑음', '흐림' 등)을 그대로 키로 써서
// 애플 시스템 컬러 계열 accent/그라디언트/아이콘을 매핑한다.
// WeatherParent.vue/CityWeatherDetailView.vue는 이미 화면에 이 한글 status 문자열을 들고 있으므로
// API 응답 처리 로직은 전혀 건드리지 않고 이 유틸만 붙이면 된다(PLAN.md Non-Goals 준수).
// Snow/Mist/Fog/Haze는 Element Plus 아이콘셋에 정확히 대응하는 아이콘이 없어
// 시각적으로 가장 가까운 아이콘(MostlyCloudy/PartlyCloudy)으로 대체.
const WEATHER_THEME_MAP = {
  맑음: {
    accent: '#FF9F0A',
    gradientFrom: '#FFD060',
    gradientTo: '#0A84FF',
    icon: Sunny,
  },
  흐림: {
    accent: '#8E8E93',
    gradientFrom: '#C7C7CC',
    gradientTo: '#8E8E93',
    icon: Cloudy,
  },
  비: {
    accent: '#0A84FF',
    gradientFrom: '#3A7BD5',
    gradientTo: '#1C3D5A',
    icon: Pouring,
  },
  이슬비: {
    accent: '#409CFF',
    gradientFrom: '#6FA8DC',
    gradientTo: '#3A7BD5',
    icon: Drizzling,
  },
  뇌우: {
    accent: '#5E5CE6',
    gradientFrom: '#5E5CE6',
    gradientTo: '#2C2C54',
    icon: Lightning,
  },
  눈: {
    accent: '#64D2FF',
    gradientFrom: '#E8F6FF',
    gradientTo: '#64D2FF',
    icon: MostlyCloudy,
  },
  안개: {
    accent: '#AEAEB2',
    gradientFrom: '#D8D8DC',
    gradientTo: '#AEAEB2',
    icon: PartlyCloudy,
  },
  '옅은 안개': {
    accent: '#AEAEB2',
    gradientFrom: '#D8D8DC',
    gradientTo: '#AEAEB2',
    icon: PartlyCloudy,
  },
}

const FALLBACK_THEME = WEATHER_THEME_MAP.흐림

export function getWeatherTheme(statusLabel) {
  return WEATHER_THEME_MAP[statusLabel] || FALLBACK_THEME
}
