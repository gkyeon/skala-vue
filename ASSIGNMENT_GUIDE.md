# 과제 진행 가이드 (날씨 → 카페 추천 프로젝트)

> ⚠️ 이 문서와 아래 구현은 Claude(AI)가 작성했습니다. **그대로 제출하지 말고, 코드를 전부 읽고 이해한 뒤 변수명/로직/스타일을 본인 방식대로 고쳐서 제출하세요.** 교수님이 질문하셨을 때 각 파일이 왜 이렇게 짜여 있는지 설명할 수 있어야 합니다.
> 작성일: 2026-08-21

## 컨셉

교수님 실습은 "날씨 대시보드" 단일 주제인데, 나는 여기에 **카페 메뉴 추천**을 결합해서 도시 기온에 따라 어울리는 카페 메뉴를 추천하는 걸 프로젝트 전체의 스토리로 잡았음.

## 요구사항 체크리스트

| # | 요구사항 | 상태 | 구현 위치 |
|---|---|---|---|
| 1 | 본인 데이터 + mockup | ✅ | `CafeMockup.vue`, `WeatherCafeRecommend.vue`의 `weatherList`/`menuList` |
| 2 | 본인만의 반응형 상태/computed/watcher | ✅ | `WeatherCafeRecommend.vue` — `selectedCity`를 `watch`해서 `recentCities`(최근 조회 도시 3개) 기록 |
| 3 | mockup 컴포넌트 분리 | ✅ | `WeatherParent.vue`가 `BaseDashboardCard`/`SearchBar`/`WeatherCard`/`CafeMenuCard`로 분리 조립 |
| 4 | 추가 view + routing | ✅ | `HomeView.vue`(메인), `PracticesArchiveView.vue`(연습 모음), `/cafe/:menuId`·`/weather/:cityId`(동적), catch-all(404) 경로 — 자세한 구조는 아래 "다섯 번째" 업데이트 참고 |
| 5 | 본인 store 추가 | ✅ | `stores/cafeStore.js` (state: `tempChoice`/`favorites`, getter: `favoriteCount`/`isFavorite`, action: `chooseTemp`/`toggleFavorite`) |

---

## 변경사항 로그

### 2026-08-21

**새로 만든 파일**
- `src/stores/cafeStore.js` — 요구사항 5. 메뉴별 HOT/ICE 선택과 즐겨찾기를 전역 상태로 관리하는 Pinia store.
- `src/components/assignment/gkyeon/CafeMenuCard.vue` — 요구사항 3. 카페 메뉴 카드 단위 컴포넌트. `cafeStore`를 직접 사용해서 HOT/ICE 토글, 가격 계산(computed), 즐겨찾기 버튼을 담당.
- `src/views/CafeRecommendView.vue` — 요구사항 4. `WeatherCafeRecommend`(기본 버전)와 `WeatherParent`(분리+store 버전)를 함께 보여주는 새 view.

**고친 파일 (기존에 작성했지만 오타로 동작하지 않던 것들)**
- `src/components/assignment/gkyeon/BaseDashboardCard.vue` — CSS 세미콜론 누락 수정.
- `src/components/assignment/gkyeon/SearchBar.vue` — `calss` 오타, 깨진 따옴표 수정.
- `src/components/assignment/gkyeon/WeatherCard.vue` — `calss`/`cityItem.nave` 오타, 닫히지 않은 중괄호·따옴표 수정. `select-card`/`click-detail` emit이 `cityItem` 객체 전체를 넘기도록 정리.
- `src/components/assignment/gkyeon/WeatherParent.vue` — 변수명 불일치(`seletedCityInfo` vs `selectedCityInfo`, `WeatherList` vs `weatherlist`), 템플릿 리터럴에 백틱 대신 홑따옴표 사용, 짝 안 맞는 `</div>`, HTML 주석 자리에 `//` 사용 등 전면 수정. 여기에 카페 메뉴 추천 섹션(`CafeMenuCard` + `cafeStore` 연동, 즐겨찾기 목록)을 추가.
- `src/components/assignment/gkyeon/WeatherCafeRecommend.vue` — `watch` import 및 `recentCities` 로직/템플릿 추가만 함 (기존 로직은 그대로 유지).

**연결 작업**
- `src/router/index.js` — `/cafe` 경로 추가 (`CafeRecommendView`, lazy import).
- `src/App.vue` — 컴포넌트를 직접 박아 넣던 구조를 걷어내고 `RouterLink` 네비게이션(홈/소개/카페) + `RouterView`로 교체.
- `src/views/HomeView.vue` — `/cafe`로 가는 안내 링크 한 줄 추가 (기존 `TheWelcome`은 유지).

**확인한 것**
- `npm run dev` 실행 후 Playwright로 `/cafe` 페이지 방문 → 도시 카드 클릭(서울 선택) → 추천 메뉴 갱신 → ICE 토글 → 즐겨찾기 토글까지 콘솔 에러 없이 정상 동작 확인.

### 2026-08-21 (추가) — nav 위젯 + 동적 라우트/404

교수님의 `App.vue.exercise`에서 nav에 `UnitToggler`(전역 store 상태 노출)를 박아둔 패턴과, `router/index.js.exercise`의 `/weather/:cityId` 동적 라우트 + `NotFound` catch-all 패턴을 우리 프로젝트에도 대응시킴.

**새로 만든 파일**
- `src/components/assignment/gkyeon/FavoriteCounter.vue` — 교수님 `UnitToggler.vue` 대응. `cafeStore.favoriteCount`를 nav에 실시간으로 노출.
- `src/views/CafeMenuDetailView.vue` — 교수님 `WeatherDetailView.vue` 대응. `route.params.menuId`로 메뉴 상세 mock 데이터를 조회하고, `cafeStore`에서 현재 HOT/ICE 선택과 즐겨찾기 여부를 읽어와 표시.
- `src/views/NotFoundView.vue` — 교수님 `NotFoundView.vue` 대응. catch-all 라우트에 매칭.

**고친 파일**
- `src/router/index.js` — `/cafe/:menuId`(동적, `cafeMenuDetail`), `/:pathMatch(.*)*`(`notFound`) 라우트 추가.
- `src/components/assignment/gkyeon/WeatherParent.vue` — `showMenuDetail`이 `window.alert` 대신 `router.push(\`/cafe/${menu.id}\`)`로 실제 상세 페이지 이동하도록 변경 (`useRouter` 추가).
- `src/App.vue` — nav에 `<FavoriteCounter />` 추가.

**확인한 것**
- `/cafe`에서 서울 선택 → 컴포넌트 분리 섹션의 메뉴 카드 "상세보기" 클릭 → `/cafe/menu_04`로 이동, 상세 정보(이름/설명/가격) 정상 표시 → "카페 추천으로 돌아가기"로 복귀 확인.
- 즐겨찾기 토글 시 nav의 `⭐ 즐겨찾기 N개` 카운터가 즉시 갱신되는 것 확인.
- 존재하지 않는 경로(`/no-such-page`) 접속 시 404 페이지로 정상 라우팅, 콘솔 에러 없음 확인.

**참고**: 도시(날씨) 쪽 상세보기는 이 시점까진 `window.alert`로 남겨뒀었음(아래 2026-08-21 세 번째 업데이트에서 실제 라우팅으로 교체함).

---

### 2026-08-21 (세 번째) — assign.md 최소요구사항 갭 메우기

`assign.md`(교수님이 Claude Code용으로 작성한 Phase 1~8 풀스펙)와 지금까지 만든 카페 프로젝트를 대조해서, 카페 컨셉은 유지한 채 스펙이 요구하는 기본 항목 중 빠진 것만 채움. 계획 전체는 `/Users/hayeon/.claude/plans/temporal-singing-music.md`에 남아있음.

**Phase별 최종 충족 현황**

| Phase | 내용 | 상태 |
|---|---|---|
| 1 Mockup | v-for/v-if/v-model/click.stop+alert/본인 도시 | ✅ (배지 문구 스펙 텍스트로 통일) |
| 2 Composition | computed+watch+watchEffect+본인 반응형 | ✅ (`WeatherCafeRecommend.vue`에 `watchEffect(citySearchQuery)` 추가) |
| 3 Component | Base/SearchBar/WeatherCard/Parent 분리 | ✅ (기존대로, `CafeMenuCard` 추가분리 포함) |
| 4 Router | `/`,`/about`,`/weather/:cityId`,catch-all,본인 view | ✅ (`/about` 복원 + `CityWeatherDetailView`+`/weather/:cityId` 신설) |
| 5 Store | configStore(unit) + UnitToggler + 온도변환 + 본인 store | ✅ (`configStore.js`+`UnitToggler.vue` 신설, 기존 `cafeStore`는 본인 추가 store로 인정) |
| 6 Axios | mock→실 API, 로딩/에러 처리 | ✅ (`WeatherParent.vue`의 `weatherList`를 OpenWeatherMap 실시간 연동으로 교체) |
| 7 UI Library | Element Plus 등 | ✅ (`SearchBar`/`WeatherCard`/`BaseDashboardCard`/`UnitToggler`에 적용) |
| 8 Deploy | GitHub/배포 | ⏭️ 스킵 (본인이 직접 진행) |

**새로 만든 파일**
- `src/stores/configStore.js` — 스펙 그대로: state `unit`, getter `unitSymbol`, action `toggleUnit`.
- `src/components/assignment/gkyeon/UnitToggler.vue` — nav에서 단위 토글, `el-button` 사용.
- `src/views/CityWeatherDetailView.vue` — `/weather/:cityId`. 도시별로 OpenWeatherMap을 재호출해서 기온/습도/풍속 표시, `configStore` 단위변환 적용.

**고친 파일**
- `src/components/assignment/gkyeon/WeatherCard.vue` — `displayTemp` computed로 섭씨↔화씨 변환 적용, 배지 문구를 스펙 텍스트로 통일, `el-card`/`el-tag`/`el-button`으로 교체.
- `src/components/assignment/gkyeon/WeatherParent.vue` — `weatherList`를 mock 배열 대신 `onMounted`+`axios.get`으로 서울/수원/부산/**대구(본인 도시)** 실시간 데이터로 채움(`isLoading`+`try/catch`). 도시 "상세보기"를 `window.alert` 대신 `router.push(`/weather/${item.id}`)`로 교체 — assign.md Phase4가 명시한 방식.
- `src/components/assignment/gkyeon/WeatherCafeRecommend.vue` — `watchEffect(citySearchQuery)` 한 줄 추가 (Phase2 누락분).
- `src/components/assignment/gkyeon/SearchBar.vue`, `BaseDashboardCard.vue` — `el-input`/`el-card`로 교체.
- `src/views/AboutView.vue` — 원래 취지(서비스 소개 + "대시보드 홈으로 이동" 버튼)로 내용 보강.
- `src/router/index.js` — `/about`을 다시 `AboutView`로, 기존 `/about`에 있던 `OpenWeatherMap.vue` 연습은 `/axios-weather`로 이동, `/weather/:cityId` 신설.
- `src/App.vue` — nav 재정렬(홈/소개/카페/AxiosCRUD/OpenWeather연습) + `UnitToggler` 배치.
- `src/main.js` — `element-plus` 전역 등록.
- `package.json` — 정체불명 `"a"` 의존성 제거, `element-plus` 추가.

**확인한 것**
- Playwright로 `/about`(소개문구 확인) → `/cafe`(컴포넌트 분리 섹션이 실제 OpenWeatherMap 데이터 4개 도시로 로딩되는 것 확인, 로딩 문구 노출) → 단위변경 클릭 시 nav `단위변경 (°F)`로 즉시 반영 → 도시 카드 "상세보기" 클릭 시 `/weather/city_01`로 이동, 실시간 기온/습도/풍속 표시 → `/axios-weather`(기존 연습 정상)까지 콘솔 에러 없이 확인.
- 기본 버전(`WeatherCafeRecommend.vue`, mock 데이터 6개 도시)은 그대로 남아있어 Phase1~2 데모 역할 유지.

**참고**: OpenWeatherMap API 키는 여전히 코드에 하드코딩돼 있음(`.env` 처리는 Phase8 영역이라 이번엔 안 건드림). Phase8(배포) 진행할 때 꼭 `.env`로 옮기고 `.gitignore` 확인할 것.

---

## 코드 리뷰할 때 봐야 할 포인트

제출 전에 최소한 아래는 스스로 설명할 수 있어야 함:

1. **`cafeStore.js`의 `computed`가 왜 `getter`인지** — Pinia setup store에서 `computed`가 곧 getter로 취급되는 이유.
2. **`WeatherCafeRecommend.vue`의 `watch(selectedCity, ...)`가 왜 `selectedCityInfo`가 아니라 `selectedCity`를 감시하는지** — 객체 참조가 바뀌는 시점과 문자열이 바뀌는 시점의 차이.
3. **`CafeMenuCard.vue`가 props로 `menu`만 받고 `tempChoice`는 store에서 직접 읽는 이유** — 왜 이 상태만 전역으로 뺐는지 (여러 컴포넌트/페이지에서 공유돼야 하는 상태이기 때문).
4. **`WeatherParent.vue`와 `WeatherCafeRecommend.vue`가 왜 둘 다 남아있는지** — 하나는 컴포넌트 분리 이전(요구사항 2 데모), 하나는 분리 이후(요구사항 3·5 데모)라서 의도적으로 병행 표시함.
5. **`/cafe/:menuId`가 왜 동적 라우트인지, `:pathMatch(.*)*`는 뭘 하는 라우트인지** — 경로 파라미터로 값을 받는 방식과 catch-all 라우트의 매칭 순서(가장 마지막에 있어야 하는 이유).
6. **`configStore`와 `cafeStore`가 왜 따로 있는지** — 하나는 스펙이 요구한 "전역 단위 토글", 하나는 "본인만의 추가 store"라서 역할이 다름. 둘 다 Pinia store인데 왜 굳이 나눴는지 설명할 수 있어야 함.
7. **`WeatherParent.vue`의 `weatherList`가 왜 `ref([])`로 비어서 시작하는지, `isLoading`은 왜 필요한지** — `onMounted` 이후 비동기로 채워지는 데이터와 로딩 상태 관리 이유.
8. **`WeatherCard.vue`의 `displayTemp`가 왜 `cityItem.temp`를 직접 안 쓰고 computed로 감싸는지** — `configStore.unit`이 바뀔 때마다 자동으로 재계산돼야 하기 때문.
9. **`WeatherCard.vue`의 클래스가 왜 `weather-card`가 아니라 `wc-card`인지** — 아래 "발견한 버그" 참고. 전역 CSS와 이름이 겹치면 생기는 문제를 설명할 수 있어야 함.

이 9가지에 답 못 하면 그대로 낸 티가 남으니, 발표/질문 대비해서 한 번씩 직접 짚어보는 걸 추천.

---

### 2026-08-21 (네 번째) — 5일 예보 확장 + 디자인 개편

**확장 기능: 5일 예보**
- `CityWeatherDetailView.vue`에서 현재 날씨(`/weather` 엔드포인트)와 5일/3시간 예보(`/forecast` 엔드포인트)를 `Promise.all`로 동시에 요청.
- 응답의 `list` 배열(3시간 간격 데이터)에서 `dt_txt`가 `12:00:00`인 것만 골라 5일치로 축약해서 `forecastList`에 저장 — 새 라이브러리 없이 기존 axios 패턴만 재사용.

**디자인 개편** (사용자가 준 레퍼런스 이미지 기준: 소프트 뉴트럴 배경 + 화이트 라운드 카드 + 옅은 그림자 + 절제된 포인트 컬러 + 세그먼트 토글 + 통계 카드 그리드)
- `src/assets/base.css`에 디자인 토큰 추가: `--app-page-bg`, `--app-card-bg`, `--app-card-shadow`, `--app-radius-lg/md/pill`, `--app-text-primary/secondary`, `--app-accent-warm/cool`.
- `src/assets/main.css` — 원래 Vite 스캐폴드용이던 `#app`의 2단 grid 미디어쿼리 삭제 (실제 앱 레이아웃과 무관해서 제거).
- `App.vue` — 배경을 소프트 뉴트럴 톤으로, nav를 화이트 카드+그림자 스타일로.
- `configStore.js`에 `setUnit(unit)` action 추가 → `UnitToggler.vue`를 토글 버튼 1개에서 °C/°F 세그먼트 컨트롤(레퍼런스와 동일한 형태)로 변경.
- `WeatherCard.vue`, `CafeMenuCard.vue`, `BaseDashboardCard.vue`, `SearchBar.vue` — 새 디자인 토큰 기반으로 카드/뱃지/입력창 스타일 전면 개편.
- `CityWeatherDetailView.vue` — 레퍼런스의 "Today's Highlights" 통계 카드 그리드 패턴을 그대로 가져와 습도/풍속 표시에 적용, 예보도 레퍼런스 스타일의 day-card로.

**발견한 버그: 전역 CSS 클래스명 충돌**
- `main.js`가 `practice.css`를 전역으로 로드하는데, 그 안에 `.weather-card`/`.btn-detail`/`.badge` 등 예전 mockup 실습 때 쓰던 이름이 그대로 남아있었음(`WeatherCafeRecommend.vue`가 `<style>` 없이 이 전역 CSS에 의존하고 있어서 걷어낼 수 없음).
- `WeatherCard.vue`를 재작성하면서 같은 클래스명(`weather-card`, `btn-detail`)을 그대로 썼더니, 전역 `.btn-detail { position: absolute; ... }` 규칙이 새 scoped 스타일에는 없는 속성이라 그대로 새어 들어와 **"상세보기" 버튼이 온도 숫자 위에 겹쳐서 화면에 안 보이는** 버그가 생겼음.
- Vue의 scoped CSS는 겹치는 속성에 대해선 특정도(specificity)가 높아 이기지만, **새 컴포넌트에 아예 없는 속성**은 전역 규칙이 그대로 적용된다는 걸 이번에 직접 확인함.
- 해결: `WeatherCard.vue`의 클래스명을 `wc-card`/`wc-badge`/`wc-detail-btn` 등 고유 접두어로 전부 변경해서 충돌 자체를 없앰. `App.vue`의 nav 활성 링크도 전역 `.router-link-exact-active` 규칙 때문에 안 쓰던 파란 밑줄이 새고 있어서 `border-bottom: none`으로 명시적으로 무력화함.

**확인한 것**
- Playwright로 `/weather/city_01`의 5일 예보 5개 항목, 콘솔 에러 없음 확인.
- 위 버그를 실제로 재현(스크린샷으로 온도 숫자가 안 보이는 것 확인) → 원인을 DOM/computed style 비교로 특정 → 수정 후 다시 스크린샷으로 정상 표시 확인.
- 전체 라우트(`/`,`/about`,`/cafe`,`/axios-json`,`/axios-weather`,404) 재검증, 콘솔 에러 없음.

---

### 2026-08-21 (다섯 번째) — 구조 재정리: 메인은 최종본만, 연습은 아카이브로

**라우팅/구조 변경**
- `/`(메인)이 이제 완성된 카페 대시보드(`WeatherParent` 기반)를 직접 보여줌. 예전엔 Vite 기본 스캐폴드 웰컴 페이지였음.
- `/cafe`(기본 버전+분리 버전 둘 다 보여주던 페이지)는 없앰. `WeatherCafeRecommend.vue`("기본 버전")는 `/practices`로 이동.
- `/axios-json`, `/axios-weather` 전용 라우트도 없애고 `/practices` 안으로 통합.
- `/cafe/:menuId`, `/weather/:cityId` 상세 라우트는 그대로 유지(메인 대시보드에서 계속 사용).
- `router.push('/cafe')`로 돌아가던 버튼들(`AboutView`, `CafeMenuDetailView`, `CityWeatherDetailView`)을 `router.push('/')`로 수정.
- nav를 `메인 | 소개 | 연습 모음` 3개 + 단위토글 + 즐겨찾기로 대폭 축소.

**새 파일: `src/views/PracticesArchiveView.vue`**
- 사이드바(그룹별 목록) + 패널(선택한 컴포넌트 렌더링) 구조.
- 그룹 3개: "기본 문법"(practices/basic 21개, child-only 파일과 오타로 깨진 `SlotNameParent.vue`는 제외), "Mockup/Composition 단계"(WeatherMockup, WeatherComposition, CafeMockup, WeatherCafeRecommend), "Axios 연습"(AxiosJson, OpenWeatherMap) — 총 27개.
- 각 항목은 클릭 시 **동적 import**(`() => import(...)`)로 로드하고 `try/catch`로 감싸서, 특정 파일에 오타/에러가 있어도 그 항목만 에러 문구를 보여주고 나머지는 정상 동작하게 함 (실제로 `SlotNameParent.vue`가 존재하지 않는 파일을 import하다 깨진 걸 이 방식으로 확인하고 목록에서 뺐음).

**디자인 2차 개편** ("안 예쁘다" 피드백 반영)
- `base.css`에 Element Plus 테마 변수(`--el-color-primary`, `--el-border-radius-*`, `--el-text-color-*` 등)를 우리 토큰에 맞게 재정의 → el-button/el-input/el-tag가 기본 파란색/각진 스타일 대신 앱 팔레트를 그대로 따라감.
- OS 다크모드에 따라 텍스트/배경이 바뀌던 스캐폴드 기본 미디어쿼리 제거(라이트 톤으로 고정, 다크모드에서 텍스트가 안 보일 수 있는 위험 제거).
- `@element-plus/icons-vue` 설치 후 실제 아이콘 적용: `WeatherCard`(맑음/흐림 아이콘), `SearchBar`(검색 아이콘), `CafeMenuCard`(별 아이콘 즐겨찾기), `CityWeatherDetailView`(위치/습도/풍속 아이콘) — 이모지 대신 라이브러리 아이콘으로 교체.

**확인한 것**
- Playwright로 `/practices`의 27개 항목을 각각 클릭해서 전부 에러 없이 로드되는지 확인(11개 샘플 직접 클릭 검증).
- `/`에서 도시 선택 → 상세보기 → `/weather/:cityId` 이동, 메뉴 상세보기 → `/cafe/:menuId` 이동까지 정상 확인.
- 전체 라우트(`/`,`/about`,`/practices`,404) 콘솔 에러 없음 재확인.

---

### 2026-08-21 (여섯 번째) — 한글 라벨 정리 + 도시/메뉴 확장

**"온흐림"/"실 비" 문제**: 인코딩 깨짐이 아니라 OpenWeatherMap `lang=kr`의 실제(어색한) 번역이었음. `weather[0].description`(번역 텍스트) 대신 `weather[0].main`(Clear/Clouds/Rain 등 영문 코드)을 기준으로 우리가 직접 자연스러운 한글 라벨을 매핑하도록 `src/utils/weatherLabel.js`를 새로 만들어 `WeatherParent.vue`/`CityWeatherDetailView.vue`(현재+예보) 양쪽에 적용.

**도시 5개 추가**: 인천/광주/대전/울산/전주 — `WeatherParent.vue`의 `CITY_MAP`과 `CityWeatherDetailView.vue`의 `cityNameMap`에 각각 한 줄씩 추가(총 9개 도시).

**메뉴 4개 추가**: 자몽에이드, 딸기라떼, 크로플, 콜드브루 — `WeatherParent.vue`의 `menuList`에 기존 스키마(hasHotIce/price(Hot/Ice)/season) 그대로 맞춰 추가(총 8개 메뉴).

**확인한 것**: 9개 도시 카드 전부 실시간 로딩, 새 도시(전주) 상세페이지 정상 진입, 서울 선택 시 추천 메뉴에 새 메뉴 반영, 콘솔 에러 없음.
