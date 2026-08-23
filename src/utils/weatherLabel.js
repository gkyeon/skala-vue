// OpenWeatherMap의 lang=kr 번역이 부자연스러운 경우가 많아서(예: Clouds -> "온흐림"),
// weather[0].main 값을 기준으로 우리가 직접 자연스러운 한글 라벨을 붙여준다.
const LABEL_MAP = {
  Clear: '맑음',
  Clouds: '흐림',
  Rain: '비',
  Drizzle: '이슬비',
  Thunderstorm: '뇌우',
  Snow: '눈',
  Mist: '안개',
  Fog: '안개',
  Haze: '옅은 안개',
}

export function getWeatherLabel(main) {
  return LABEL_MAP[main] || main
}
