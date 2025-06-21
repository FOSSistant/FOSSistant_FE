# GitHub Issues Helper 🚀

GitHub Issues 페이지를 향상시켜 오픈소스 프로젝트 기여를 돕는 Chrome 확장 프로그램입니다.

## ✨ 주요 기능

### 이슈 목록 페이지
- **자동 라벨 추천**: 이슈 내용 분석을 통한 지능형 라벨 자동 추천
- **사용자 수준별 하이라이트**: 개인 스킬 레벨에 맞는 이슈 강조 표시
- **비침투적 통합**: 기존 GitHub UI와 자연스럽게 통합되어 원활한 사용 경험

### 이슈 상세 페이지  
- **AI 분석**: LLM을 활용한 이슈 상세 분석
- **직접 기여 지원**: 이슈에 바로 기여할 수 있는 실행 가능한 액션 제공
- **기여 가이드**: 구체적인 해결 방법과 코드 작성 가이드라인

### GitHub 연동
- **OAuth 인증**: 안전한 GitHub 계정 연동
- **개인화된 추천**: 개인 저장소와 기여 이력을 반영한 맞춤형 이슈 추천
- **URL 자동 감지**: GitHub 이슈 페이지 자동 인식

## 🛠️ 기술 스택

- **React 18** + **TypeScript**
- **Chrome Extension API** (Manifest V3)
- **GitHub OAuth** 인증
- **React Markdown** 렌더링
- **Content Script** 페이지 주입

## 설치 방법

### 수동 설치
```bash
# 저장소 클론
git clone https://github.com/yourusername/github-issues-helper.git
cd github-issues-helper

# 의존성 설치
npm install

# 빌드
npm run build
```

Chrome에서 확장 프로그램 로드:
1. `chrome://extensions/` 접속
2. "개발자 모드" 활성화  
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `dist` 폴더 선택

## 사용법

### 이슈 목록에서
1. GitHub 저장소의 Issues 페이지 방문
2. 각 이슈 옆에 표시되는 추천 라벨 확인
3. 라벨 클릭으로 바로 적용 (권한 필요)

### 이슈 상세에서  
1. GitHub 이슈 상세 페이지 열기
2. "AI 분석" 패널에서 "이슈 분석" 클릭
3. 분석 결과 확인:
   - **이슈 상세 설명**: 문제 요약 및 해결 방향
   - **본문 하이라이팅**: 핵심 키워드 및 중요 부분 강조
   - **사용자 라벨링**: 맞춤형 라벨 추천으로 기여 활동 지원
   - **유의점 및 링크**: 주의사항과 관련 문서/리소스 제공
