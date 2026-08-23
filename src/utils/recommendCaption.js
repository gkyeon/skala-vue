// 도시명/기온/날씨 상태(weatherLabel.js가 만든 한글 라벨)를 조합해서
// 카페 메뉴 추천 섹션에 쓸 한 줄 카피를 만들어준다. 25도를 기준으로 hot/cool 톤을 나눈다.
const STATUS_CAPTIONS = {
  맑음: {
    hot: (city) => `${city}, 쨍하게 맑고 더운 날엔 시원한 아이스 메뉴가 딱이에요.`,
    cool: (city) => `${city}, 맑고 선선한 날엔 따뜻한 라떼 한 잔 어때요?`,
  },
  흐림: {
    hot: (city) => `${city}, 흐리고 후덥지근한 날엔 시원한 음료로 기분 전환해요.`,
    cool: (city) => `${city}, 구름 낀 날엔 달콤한 디저트가 기분을 살려줘요.`,
  },
  비: {
    hot: (city) => `${city}, 비 오는 더운 날엔 시원한 아이스 음료가 청량해요.`,
    cool: (city) => `${city}, 비 오는 날엔 따뜻한 음료 한 잔이 생각나죠.`,
  },
  이슬비: {
    hot: (city) => `${city}, 촉촉하게 이슬비 내리는 날엔 시원한 음료도 좋아요.`,
    cool: (city) => `${city}, 보슬비 내리는 날엔 따뜻한 음료가 어울려요.`,
  },
  뇌우: {
    hot: (city) => `${city}, 천둥 번개 치는 날엔 실내에서 시원하게 즐겨보세요.`,
    cool: (city) => `${city}, 천둥 번개 치는 날엔 따뜻하게 몸을 녹여보세요.`,
  },
  눈: {
    hot: (city) => `${city}, 눈이 와도 포근한 날엔 살짝 시원한 메뉴도 괜찮아요.`,
    cool: (city) => `${city}, 눈 내리는 날엔 몸을 녹여줄 따뜻한 음료 어때요?`,
  },
  안개: {
    hot: (city) => `${city}, 안개 낀 더운 날엔 시원한 콜드브루로 정신 차려볼까요?`,
    cool: (city) => `${city}, 안개 낀 날엔 진한 핫 음료로 하루를 시작해요.`,
  },
  '옅은 안개': {
    hot: (city) => `${city}, 뿌옇고 더운 날엔 시원한 음료가 좋아요.`,
    cool: (city) => `${city}, 옅은 안개 낀 날엔 따뜻한 음료가 어울려요.`,
  },
}

export function getRecommendCaption(cityName, temp, status) {
  const group = STATUS_CAPTIONS[status]
  if (!group) return `${cityName}(${temp}°C)에 어울리는 메뉴를 골라봤어요.`
  const key = temp >= 25 ? 'hot' : 'cool'
  return group[key](cityName)
}
