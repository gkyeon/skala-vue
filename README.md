# Weather Dashboard (카페 메뉴 추천)

> 이 README는 초안입니다. 본인 말투로 다시 다듬어서 제출하세요.

## 프로젝트 소개

원래 과제 주제는 "날씨 대시보드" 하나인데, 여기에 카페 메뉴 추천을 더해서 도시
기온에 맞는 메뉴를 골라주는 걸로 방향을 잡았음. 더운 날엔 시원한 메뉴, 선선한
날엔 따뜻한 메뉴 순으로 추천되고, 도시/메뉴 즐겨찾기는 각각 하트(♡)와 별(☆)로
저장됨. 도시 상세 페이지에서는 5일 예보와 미세먼지 지수도 같이 보여줌.

## 본인이 직접 추가한 것 (교수님 스펙 대비)

교수님이 주신 `assign.md`는 서울/수원/부산 3개 도시로 날씨 대시보드만 만드는
스펙임. 아래는 거기서 내가 직접 얹은 컨셉/데이터/기능.

- **컨셉 자체**: "날씨 대시보드" 단일 주제에 카페 메뉴 추천을 결합 — 도시
  기온에 맞춰 어울리는 메뉴를 추천하는 스토리는 스펙에 없던 것
- **데이터**: 도시 9개(대구/인천/광주/대전/울산/전주 6개 추가), 카페 메뉴
  8종(아메리카노~콜드브루) — 메뉴 데이터 자체가 스펙엔 아예 없음, 통째로 기획
- **본인 반응형 로직**: `recentCities`(watch로 최근 조회 도시 3개 기록),
  `currentSeason`/`recommendedTemp`(기온 기반 계절 판정 → HOT/ICE 추천),
  `recommendCaption`(날씨 상태×기온 조합해 추천 문구 자동 생성, 16가지 패턴)
- **본인 컴포넌트/뷰**: `CafeMenuCard`, `CafeMenuDetailView`,
  `FavoritesView`(즐겨찾기 전용 페이지), `PracticesArchiveView`(연습 아카이브)
- **본인 store 2개**: `cafeStore`(메뉴 HOT/ICE 선택 + 즐겨찾기),
  `cityFavoriteStore`(도시 즐겨찾기) — 스펙은 `configStore`(단위 변환) 하나만 요구
- **API 확장**: 대기질(미세먼지) API 추가 연동 — 스펙에 "자유롭게 확장"이라고만
  적힌 항목을 실제로 구현(현재 날씨 응답의 좌표를 그대로 재사용)
- **디자인/UX**: 날씨 상태 6종(맑음/흐림/비/눈/뇌우/안개)별 다이내믹 accent
  컬러, 반투명 유리(glass) UI + 시스템 다크모드 자동 대응, 도시 하트(♡)
  즐겨찾기, 모바일 햄버거 네비게이션 — 전부 스펙엔 없는 디자인 시스템

## 기술 스택

Vue 3 (Composition API, `<script setup>`), Vite, Vue Router, Pinia, Axios,
Element Plus, OpenWeatherMap API (현재 날씨 / 5일 예보 / 대기질)

## 배포 링크

- https://skala-vue-dusky-zeta.vercel.app/

## 단원별 커스터마이징 기록

### Day1 - Mockup

- 기본 3개 도시(서울/수원/부산) 외에 본인 도시로 대구 추가
- 온도 25도 기준 hot/cool 배지 분기, 카드 클릭 시 상태바 갱신, 상세보기 버튼은
  `@click.stop`으로 버블링 차단

### Day2 - Composition API

- `computed`로 검색어 기반 도시 필터링(`filteredWeatherList`)
- `watch(selectedCity, ...)`로 최근 조회한 도시 3개 기록(`recentCities`)
- `watchEffect`로 검색어 변경 로그 출력

### Day3 - Component 분리

- `BaseDashboardCard` / `SearchBar` / `WeatherCard` / `WeatherParent`로 분리
- 카페 메뉴 카드도 `CafeMenuCard`로 별도 분리

### Day4 - Router

- `/`, `/about`, `/weather/:cityId`, `/cafe/:menuId`, catch-all(404) 라우트
- 추가로 연습 코드 아카이브(`/practices`), 즐겨찾기 전용 페이지(`/favorites`) 라우트

### Day5 - Pinia

- `configStore` — 온도 단위(°C/°F) 상태와 토글
- 본인 추가 store 1: `cafeStore` — 메뉴별 HOT/ICE 선택, 메뉴 즐겨찾기
- 본인 추가 store 2: `cityFavoriteStore` — 도시 즐겨찾기(♡)

### Day6 - Axios

- Mock 데이터 → OpenWeatherMap 실시간 연동(9개 도시 현재 날씨)
- 도시 상세 페이지에서 5일 예보(3시간 간격 데이터 중 정오 값만 축약) 추가 연동
- 추가 API 연동: 대기질(미세먼지) API — 현재 날씨 응답의 좌표로 이어서 요청,
  AQI 1~5단계를 배지로 표시
- `try/catch` 에러 처리 + `isLoading` 로딩 상태 표시

### Day7 - UI Library

- Element Plus 선택 — 버튼/인풋/아이콘/탭에 적용, 테마 변수를 프로젝트 색상
  토큰에 맞게 재정의

### Day8 - Deployment

- [x] API 키를 `.env`(`VITE_OPENWEATHER_API_KEY`)로 이전, `.gitignore`에 `.env` 추가
- [x] `npm run build` / `npm run lint` 통과 확인
- [x] GitHub 공개 저장소 생성 + push (https://github.com/gkyeon/skala-vue)
- [x] Vercel로 배포, 환경변수에 API 키 등록
- [x] 위 배포 링크 채워넣기

## 트러블슈팅

### 1. 전역 CSS 클래스명 충돌로 "상세보기" 버튼이 안 보임

- **증상**: 날씨 카드의 상세보기 버튼이 온도 숫자 뒤에 가려져 클릭이 안 됨
- **원인**: 초기 실습 때 쓰던 전역 CSS(`practice.css`)에 `.weather-card`/`.btn-detail`
  같은 클래스명이 이미 있었는데, 새 컴포넌트가 같은 이름을 그대로 재사용하면서
  전역 규칙(`position: absolute` 등)이 새어 들어옴
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

## 실행 방법

```bash
npm install
cp .env.example .env   # .env를 열어서 본인 OpenWeatherMap API 키로 교체
npm run dev
```

API 키는 `.env`의 `VITE_OPENWEATHER_API_KEY`로만 참조하고, 코드에는 절대
하드코딩하지 않음. `.env`는 `.gitignore`에 포함돼 있어 커밋되지 않음.
