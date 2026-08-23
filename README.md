# Weather Dashboard (카페 메뉴 추천)

## 프로젝트 소개

[바로가기](https://skala-vue-dusky-zeta.vercel.app/)

원래의 "날씨 대시보드" 에 카페 메뉴 추천을 더해서 도시
기온에 맞는 메뉴를 골라주는 프로젝트. 더운 날엔 시원한 메뉴, 선선한
날엔 따뜻한 메뉴 순으로 추천되고, 도시/메뉴 즐겨찾기는 각각 하트(♡)와 별(☆)로
저장됨. 도시 상세 페이지에서는 5일 예보와 미세먼지 지수도 같이 보여줌.

- 메인 : 메인화면, 도시에 따른 날씨를 확인할 수 있음.
- 즐겨찾기 : 자신이 즐겨찾기한 도시나 카페 메뉴를 확인할 수 있음.
- 소개 : 홈페이지 및 프로젝트에 대한 소개를 확인할 수 있음.
- 연습 모음 : vue 실습 코드 모음집.

![1787479176639](image/README/1787479176639.jpg)

## 추가한 기능

- **컨셉**: "날씨 대시보드" 단일 주제에 카페 메뉴 추천을 결합
- **데이터**: 도시 9개(대구/인천/광주/대전/울산/전주 6개 추가), 카페 메뉴
  8종(아메리카노~콜드브루)
- **반응형 로직**: `recentCities`(watch로 최근 조회 도시 3개 기록),
  `currentSeason`/`recommendedTemp`(기온 기반 계절 판정 → HOT/ICE 추천),
  `recommendCaption`(날씨 상태×기온 조합해 추천 문구 자동 생성, 16가지 패턴)
- **컴포넌트/뷰**: `CafeMenuCard`, `CafeMenuDetailView`,
  `FavoritesView`(즐겨찾기 전용 페이지), `PracticesArchiveView`(연습 아카이브)
- **store 2개**: `cafeStore`(메뉴 HOT/ICE 선택 + 즐겨찾기),
  `cityFavoriteStore`(도시 즐겨찾기)
- **API 확장**: 대기질(미세먼지) API 추가 연동 — 현재 날씨 응답의 좌표를 그대로 재사용
- **디자인/UX**: 날씨 상태 6종(맑음/흐림/비/눈/뇌우/안개)별 다이내믹 accent
  컬러, 반투명 유리(glass) UI + 시스템 다크모드 자동 대응, 도시 하트(♡)
  즐겨찾기, 모바일 햄버거 네비게이션 등. (애플 macOS/iOS 시스템 앱 스타일)


## 기술 스택

Vue 3 (Composition API, `<script setup>`), Vite, Vue Router, Pinia, Axios,
Element Plus, OpenWeatherMap API (현재 날씨 / 5일 예보 / 대기질)

## 배포 링크

- https://skala-vue-dusky-zeta.vercel.app/

## 단원별 커스터마이징 기록

### Mockup

- 기본 3개 도시(서울/수원/부산) 외에 도시 추가
- 온도 25도 기준 hot/cool 배지 분기, 카드 클릭 시 상태바 갱신, 상세보기 버튼은
  `@click.stop`으로 버블링 차단

### Composition API

- `computed`로 검색어 기반 도시 필터링(`filteredWeatherList`)
- `watch(selectedCity, ...)`로 최근 조회한 도시 3개 기록(`recentCities`)
- `watchEffect`로 검색어 변경 로그 출력

### Component 분리

- `BaseDashboardCard` / `SearchBar` / `WeatherCard` / `WeatherParent`로 분리
- 카페 메뉴 카드도 `CafeMenuCard`로 별도 분리

### Router

- `/`, `/about`, `/weather/:cityId`, `/cafe/:menuId`, catch-all(404) 라우트
- 추가로 연습 코드 아카이브(`/practices`), 즐겨찾기 전용 페이지(`/favorites`) 라우트

### Pinia

- `configStore` — 온도 단위(°C/°F) 상태와 토글
- 추가 store 1: `cafeStore` — 메뉴별 HOT/ICE 선택, 메뉴 즐겨찾기
- 추가 store 2: `cityFavoriteStore` — 도시 즐겨찾기(♡)

### Axios

- Mock 데이터 → OpenWeatherMap 실시간 연동(9개 도시 현재 날씨)
- 도시 상세 페이지에서 5일 예보(3시간 간격 데이터 중 정오 값만 축약) 추가 연동
- 추가 API 연동: 대기질(미세먼지) API — 현재 날씨 응답의 좌표로 이어서 요청,
  AQI 1~5단계를 배지로 표시
- `try/catch` 에러 처리 + `isLoading` 로딩 상태 표시

### UI Library

- Element Plus 선택 — 버튼/인풋/아이콘/탭에 적용, 테마 변수를 프로젝트 색상
  토큰에 맞게 재정의

### Deployment

- API 키를 `.env`(`VITE_OPENWEATHER_API_KEY`)로 이전, `.gitignore`에 `.env` 추가
- `npm run build` / `npm run lint` 통과 확인

- GitHub 공개 저장소 생성 + push (https://github.com/gkyeon/skala-vue)

- Vercel로 배포, 환경변수에 API 키 등록

- 위 배포 링크 채워넣기

## 트러블슈팅

### 1. 전역 CSS 클래스명 충돌로 "상세보기" 버튼이 안 보임

- **증상**: 날씨 카드의 상세보기 버튼이 온도 숫자 뒤에 가려져 클릭이 안 됨
- **원인**: 초기 실습 때 쓰던 전역 CSS(`practice.css`)에 `.weather-card`/`.btn-detail`
  같은 클래스명이 이미 있었는데, 새 컴포넌트가 같은 이름을 그대로 재사용하면서
  전역 규칙(`position: absolute` 등) 오류
- **해결**: 컴포넌트 클래스명을 `wc-card`/`wc-badge`/`wc-detail-btn`처럼 고유
  접두어로 바꿔서 충돌 자체를 없앰

### 2. 날씨 상태가 "온흐림", "실 비"처럼 어색하게 표시됨

- **증상**: 인코딩이 깨진 것처럼 부자연스러운 한글이 나옴
- **원인**: 인코딩 문제가 아니라 OpenWeatherMap `lang=kr` 자동 번역
  (`weather[0].description`) 자체가 어색한 번역이었음
- **해결**: `weather[0].main`(Clear/Clouds/Rain 등 영문 코드) 기준으로 직접
  한글 라벨을 매핑하는 유틸(`weatherLabel.js`)을 만들어 적용

### 3. 홈 탭이 다른 페이지에서도 항상 활성 색으로 보임

- **증상**: `/about`, `/favorites` 등 다른 페이지에 있어도 "🏠 메인" 링크가
  계속 활성 색으로 표시됨
- **원인**: Vue Router의 `router-link-active`는 "부분 일치"라서, 모든 경로가
  `/`로 시작하는 이상 홈 링크는 항상 활성 상태로 인식됨
- **해결**: 정확히 일치할 때만 붙는 `router-link-exact-active` 기준으로 스타일
  다시 적용

### 4. `npm run build`가 실패함

- **증상**: 빌드/린트가 아예 안 돌아감
- **원인**: `practices/basic` 안의 오래된 연습 파일 2개(`VrefSample.vue`의
  객체 리터럴 안에 함수 본문이 잘못 끼어든 문법 오류, `ElementsHandling.vue`의
  `=` 대신 `-` 오타·태그 안 닫힘)가 Vite 빌드 그래프에 걸려서 전체 빌드가 죽음
- **해결**: 두 파일의 문법 오류 수정. 같이 돌아간 ESLint에서 잡힌 나머지
  자잘한 문제(미사용 import, 단어 하나짜리 컴포넌트명, 존재하지 않는 파일을
  import하던 중복 연습 파일)도 같이 정리

### 5. 화면 폭이 좁아지면 네비게이션 메뉴가 겹쳐 표시됨

- **증상**: 640px 이하로 화면 폭을 줄이면 링크 4개와 단위 토글·즐겨찾기
  카운터가 한 줄에 겹쳐 표시됨
- **원인**: `nav-links`에 `flex-wrap`만 적용되어 있어, 좁은 화면에서
  줄바꿈되며 다른 요소와 공간을 다투는 구조였음
- **해결**: 640px 미만에서는 링크를 숨기고 햄버거 버튼으로 대체. 클릭 시
  드롭다운으로 펼쳐지고, 라우트 변경 시 자동으로 닫히도록 처리

### 6. 화면 폭을 극단적으로 줄이면 카드 레이아웃이 깨짐

- **증상**: 화면 폭을 300px 이하로 줄이면 카드 내부 텍스트와 배지가 서로
  겹쳐 표시됨
- **원인**: 최소 폭 제한이 설정되어 있지 않아, 뷰포트가 좁아질수록
  grid/flex 레이아웃이 한계 없이 축소됨
- **해결**: `body`에 `min-width: 320px`를 설정하여, 그 이하에서는 레이아웃이
  깨지는 대신 가로 스크롤이 발생하도록 처리

## 실행 방법

```bash
npm install
cp .env.example .env   # .env를 열어서 본인 OpenWeatherMap API 키로 교체
npm run dev
```

API 키는 `.env`의 `VITE_OPENWEATHER_API_KEY`로만 참조하고, 코드에는 절대
하드코딩하지 않음. `.env`는 `.gitignore`에 포함하여 커밋하지 않음.
