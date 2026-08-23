# PLAN.md — Weather Dashboard, Apple(iOS/macOS 시스템) 스타일 리디자인

> 대상 리포: `/Users/hayeon/workspace/10 Vue/skala-vue` (Vue 3 + Vite + Vue Router + Pinia + Element Plus)
> 이 문서는 "무엇을 클릭시켜 전환시킬지"가 아니라 "이미 동작하는 학교 과제 앱의 룩앤필을 어떻게 Apple 시스템 앱처럼 다시 입힐지"를 계획한다. 원본 스킬 템플릿(마케팅 랜딩페이지용)의 구조는 유지하되, 항목의 내용은 이 앱의 성격(정보형 대시보드, 전환 퍼널 없음)에 맞게 재해석했다.

---

## 0. Discovery 요약 (질문 대신 실사 + 사용자 확답)

- **사용자 확정 답변**:
  1. 톤앤무드 → **macOS/iOS 시스템 스타일** (반투명 유리 카드, 다크모드 자동 대응, 시스템 폰트, 아이콘 중심 정보구조)
  2. 포인트 컬러 → **날씨 상태 기반 다이내믹** (고정 팔레트 대신 맑음/흐림/비/눈/뇌우/안개별로 accent가 바뀜)
  3. 작업 범위 → **앱 전체**
- **코드 실사 결과**:
  - 이미 `--app-*` 디자인 토큰 체계가 존재(`src/assets/base.css`), `App.vue`/`WeatherCard`/`CafeMenuCard`/`CityWeatherDetailView`는 이 토큰을 쓰지만, `AboutView`/`NotFoundView`/`CafeMenuDetailView`는 토큰 없이 하드코딩된 옛날 스타일(`#f1f2f6`, 순수 `<button>` 등)로 남아있어 톤이 깨져 있음 → **이번 작업의 핵심 대상**.
  - `getWeatherLabel()`(`src/utils/weatherLabel.js`)이 OpenWeatherMap `weather[0].main`을 8종 한글 라벨로 변환 중 → 이 값을 다이내믹 accent의 키로 재사용 가능.
  - 다크모드는 현재 명시적으로 꺼져 있음(`base.css` 주석: "라이트 톤 디자인으로 고정") → 이번에 켠다(사용자가 시스템 스타일을 선택했으므로).
  - Element Plus 테마 변수가 이미 `--app-*` 토큰에 매핑되어 있어 재사용 가능(`el-color-primary` 등).
  - `WeatherCard.vue`는 현재 온도 25도 기준 hot/cool 2분류만 색을 바꿈 — "날씨 상태 기반" 요구를 채우려면 실제 상태(맑음/흐림/비/눈/뇌우/안개) 기반으로 확장 필요.
  - API 키가 `WeatherParent.vue`/`CityWeatherDetailView.vue`에 하드코딩되어 있음 — **디자인 스코프 밖**이므로 이번엔 손대지 않지만 Non-Goals에 명시.

---

## A. North Star

한 문장: "사용자가 화면을 떠날 때, **'이건 그냥 과제가 아니라 진짜 제품이다'**라고 느끼고, **'날씨가 이렇게 감각적으로 보일 수 있구나'**라고 생각한다."

## B. Empathy-Map (실사용자 = 평가 교수 + 본인 포트폴리오 열람자)

- **Says**: "과제치고 꽤 완성도 있네", "이거 실제 배포된 서비스 같다"
- **Thinks**: "기능 요구사항은 다 채웠나?" → 시각적 완성도가 낮으면 기능도 대충 했을 거라 무의식적으로 판단(halo effect)
- **Does**: 카드 하나 클릭 → 상세 페이지 이동 → 뒤로가기 → 다른 도시 클릭, 다크모드 켜진 기기라면 자동으로 다크 버전을 봄
- **Feels**: 지금 상태 = 무난한 화이트카드+옅은 그림자(나쁘지 않지만 "iOS 앱스토어 템플릿" 느낌). 목표 = "이거 애플 날씨 앱 만든 사람이 짠 거 아냐?"
- **Trust-Level**: 현재 6/10(기능은 탄탄, 톤은 일관성 부족) → 8~9/10로. 트리거: 일관된 유리질감 + 날씨별로 살아 움직이는 배경 + 오탈자 없는 다크모드.

## C. Belief Shift

- **기존 믿음**: "학기 과제는 기능만 되면 됨, 디자인은 부트스트랩/엘리먼트플러스 기본값이면 충분하다."
- **새로 심어야 할 믿음**: "이 프로젝트는 UI 완성도 자체가 실력 증명이다 — 날씨 데이터가 그냥 텍스트가 아니라 분위기(빛/블러/색)로 전달된다."
- **리프레임 문장**: "날씨는 숫자가 아니라 공기다. 이 앱은 그 공기를 화면에 그대로 옮긴다."

## D. Story-Satz (Apple-Style, 한 문장)

**"오늘의 하늘을, 그대로 담다."**

## E. 화면 구성 순회표 (Sektions-Bogen → Screen-Bogen 로 재해석)

| # | 화면 | 감정 목표 | 디자인 전환 포인트 | Build 단계 컴포넌트 |
|---|------|-----------|---------------------|----------------------|
| 1 | App Shell / Nav | "이건 시스템 앱이다" | sticky + `backdrop-filter: blur()` 반투명 툴바, 다크모드 자동 대응, SF 계열 폰트 스택 | `App.vue` |
| 2 | Home(대시보드) — 검색 | "가볍고 즉각적" | pill 검색바 유리질감, 포커스 시 스프링 확대 | `SearchBar.vue`, `BaseDashboardCard.vue` |
| 3 | Home — 도시 리스트 | "날씨가 살아있다" | `WeatherCard`에 날씨 상태별 아이콘+accent(맑음/흐림/비/눈/뇌우/안개 6종), hover 시 미세 리프트 | `WeatherCard.vue`, `weatherTheme.js`(신규) |
| 4 | Home — 카페 추천 | "제안받는 느낌" | 추천 태그를 배지가 아니라 강조 카드로, HOT/ICE 세그먼트를 iOS 세그먼트 컨트롤 톤으로 | `CafeMenuCard.vue` |
| 5 | 날씨 상세 페이지 | "몰입, 히어로" | 그 도시 날씨 상태에 맞춘 풀블리드 그라디언트 히어로 + 대형 타이포(48px→72px), 5일 예보 가로 스크롤을 유리 필 카드로 | `CityWeatherDetailView.vue` |
| 6 | 카페 메뉴 상세 | "일관성 회복" | 현재 완전히 다른 옛 스타일(순수 button, `#f1f2f6`) → 토큰 체계로 전면 교체 | `CafeMenuDetailView.vue` |
| 7 | About | "차분한 신뢰" | 큰 타이포 인트로 + 유리 카드 1장, CTA 버튼 pill | `AboutView.vue` |
| 8 | 404 | "귀엽지만 절제됨" | 중앙 정렬 + 시스템 아이콘 + pill 버튼(현재 순수 HTML button) | `NotFoundView.vue` |

## F. Visual Direction

- **Mood**: quiet(절제된), luminous(빛나는), precise(정교한)
- **Color**:
  - Neutral 배경(라이트): `#F2F2F7`(iOS systemGroupedBackground) / 카드 `rgba(255,255,255,0.72)` + blur
  - Neutral 배경(다크): `#000000`~`#1C1C1E` / 카드 `rgba(28,28,30,0.6)` + blur
  - 텍스트: 라이트 `#1C1C1E` / `#8A8A93`, 다크 `#F5F5F7` / `#98989D` (기존 토큰과 거의 동일, 다크 페어만 추가)
  - **날씨별 다이내믹 accent** (신규 `weatherTheme.js`):
    | 상태 | Accent | 근거 |
    |---|---|---|
    | 맑음 Clear | `#FF9F0A` (Apple Orange) → `#0A84FF` 하늘 그라디언트 | 해+맑은 하늘 |
    | 흐림 Clouds | `#8E8E93` (System Gray) | 무채색 하늘 |
    | 비 Rain/Drizzle | `#0A84FF` (System Blue), 채도 낮춘 인디고 그라디언트 | 비/물 |
    | 뇌우 Thunderstorm | `#5E5CE6` (System Indigo) | 무겁고 극적 |
    | 눈 Snow | `#64D2FF` (System Cyan, 저채도) | 시린 느낌 |
    | 안개 Mist/Fog/Haze | `#AEAEB2` | 뿌옇게 낮은 대비 |
  - 온도 hot/cool 배지는 유지하되 색상 우선순위는 "날씨 상태 > 온도"로 — 상세 페이지는 상태 accent, 리스트 카드는 상태 아이콘+온도 배지 병기
- **Typography**: 시스템 폰트 스택을 최상단으로(`-apple-system, "SF Pro Text", ...` 이후 `Inter` 폴백), 헤드라인은 optical sizing 느낌으로 `font-weight: 700`, `letter-spacing: -0.02em`, 본문은 `line-height: 1.5`
- **Motion**: 기본 duration 220ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`(iOS 스프링 근사), hover/press는 120ms. `prefers-reduced-motion` 존중(트랜지션 제거, opacity만 유지)
- **Whitespace-Doktrin**: luftig(여유) — 카드 내부 패딩 22px→28px, 섹션 간 간격 확대

## G. Interaction/Delight-Mechanik (Conversion-Mechanik 재해석 — 이 앱엔 구매 퍼널이 없으므로 "다음 행동 유도"로 치환)

- **Primary action**: "상세보기" 버튼 → 유지, pill 스타일 + 살짝 눌림 애니메이션(scale 0.97)
- **Secondary action**: 대시보드 상단 "← 메인 대시보드로" 등 back 버튼 → 아이콘+텍스트, ghost 스타일
- **Micro-reassurance**: 로딩 중 "🔄 실시간 데이터를 불러오는 중..." → skeleton shimmer로 교체(체감 속도 개선)
- **심리적 장치**: (a) 진행감 — 스켈레톤/스피너 통일, (b) 일관성으로 신뢰 — 8개 화면 전부 동일 토큰, (c) 즉각 피드백 — hover/press 마이크로 인터랙션
- **Friction-Killer**: `CafeMenuDetailView`/`NotFoundView`의 순수 HTML 버튼 → Element Plus/토큰 기반 버튼으로 통일해 "다른 앱처럼 느껴지는" 이질감 제거

## H. Tech-Plan

- **Framework**: 기존 Vue 3 `<script setup>` + Vite 그대로 유지 (재구축 아님, 파사드 교체)
- **Component Library**: Element Plus 계속 사용 — `--el-*` 토큰만 다크모드 대응하도록 재정의 (신규 라이브러리 도입 안 함)
- **Icons**: 기존 `@element-plus/icons-vue` 유지 + 날씨 상태별 아이콘 매핑 확장(Sunny/Cloudy 외 `Lightning`, `Drizzling`(없으면 근접 아이콘 대체 매핑 필요 — Element Plus 아이콘셋 내에서 확인 후 대체)
- **Motion**: 순수 CSS transition/keyframes (Framer Motion 등 신규 의존성 추가 안 함 — Vue 프로젝트이고 범위상 과함)
- **Image 전략**: 실사진 없음 — CSS 그라디언트 + 시스템 아이콘만으로 표현(타이포그래픽 + 그라디언트 중심)
- **다크모드 구현**: `prefers-color-scheme: dark` 미디어쿼리로 `--app-*`, `--el-*` 토큰 재정의. 별도 토글 UI는 이번 스코프에 넣지 않음(Non-Goal — OS 설정 따라감)
- **신규 파일**: `src/utils/weatherTheme.js` — `getWeatherTheme(main)` → `{ accent, gradientFrom, gradientTo, icon }` 반환. `weatherLabel.js`의 `LABEL_MAP` 키(Clear/Clouds/Rain/...)와 동일 키 체계 사용
- **Performance-Budget**: 신규 의존성 0개 원칙, 이미지 0개(그라디언트만) → LCP/JS 부담 사실상 무변화

## I. Build 단계에서 활성화할 스킬

- `apple-design` (핵심 — 모션/유리질감/타이포그래피 원칙 레퍼런스)
- 별도 `design:*` 스킬은 이번 프로젝트엔 랜딩페이지용이라 대부분 미해당 — Build 단계는 `apple-design` 원칙 + 기존 Vue 컴포넌트 구조를 그대로 따름

## J. Non-Goals (이번 스코프에서 하지 않는 것)

- 기능/라우팅/데이터 로직 변경 (날씨 카드 필터링, 즐겨찾기 로직 등 **그대로 유지**)
- API 키를 `.env`로 이전하는 보안 정리 (별도 요청 시 진행 — 지금은 디자인 스코프 밖)
- 다크모드 수동 토글 스위치 추가 (OS 설정 자동 대응만, UI 토글은 범위 밖)
- `PracticesArchiveView.vue` 및 `src/components/practices/**` (기초 문법 연습용 아카이브 — 원문 그대로 보존 가치가 더 큼)
- 신규 npm 의존성 추가 (애니메이션/UI 라이브러리 등)
- 컴포넌트 트리 재구조화(추가 분리/합치기) — 스타일과 필요한 최소 마크업 보정만

---

## 요약

기존 `--app-*` 토큰 체계를 다크모드까지 확장하고, 날씨 상태(맑음/흐림/비/눈/뇌우/안개) 기반 다이내믹 accent를 `weatherTheme.js`로 새로 만들어 카드·상세 히어로에 반영하며, 아직 옛 스타일로 남아있는 `AboutView`/`NotFoundView`/`CafeMenuDetailView`를 토큰 체계로 통일한다. 전체적으로 macOS/iOS 시스템 앱처럼 반투명 유리 카드(backdrop-blur), 시스템 폰트, 스프링에 가까운 모션을 입히되 기존 기능·라우팅·상태관리 로직은 전혀 건드리지 않는 순수 비주얼 리디자인이다.

**Plan 확정하고 Build로 넘어갈까요? (yes / refine)**
