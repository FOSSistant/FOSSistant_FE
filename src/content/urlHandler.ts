import { extractIssueNumbers, createIssueUrls, showErrorMessage } from './utils';
import { labelAllIssues } from './issueLabeling';
import { UrlManager } from '../utils/urlManager';
import { UrlInfo } from '../types';

// 라벨링 상태 관리
let isLabeling = false;
let lastProcessedUrl = '';
let labelingTimeout: ReturnType<typeof setTimeout> | null = null;

// GitHub 페이지 로딩 완료 대기 함수

async function waitForGitHubPageLoad(): Promise<boolean> {
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 50; // 5초 대기
    
    const checkPageReady = () => {
      attempts++;
      
      // GitHub 이슈 리스트의 핵심 요소들이 로드되었는지 확인
      const issueElements = document.querySelectorAll('span[class*="defaultNumberDescription"]');
      const hasIssueList = issueElements.length > 0;
      const hasNavigation = document.querySelector('[data-testid="issue-results-header"]') !== null;
      
      
      if (hasIssueList || attempts >= maxAttempts) {
        resolve(hasIssueList);
        return;
      }
      
      setTimeout(checkPageReady, 100);
    };
    
    checkPageReady();
  });
}

// 기존 라벨 정리 함수
function clearExistingLabels(): void {
  const existingLabels = document.querySelectorAll('.custom-label');
  
  existingLabels.forEach(label => {
    label.remove();
  });
}

// 라벨링 실행 함수 (디바운싱 적용)
async function executeLabelingWithDebounce(urlInfo: UrlInfo): Promise<void> {
  // 기존 타이머 취소
  if (labelingTimeout) {
    clearTimeout(labelingTimeout);
    labelingTimeout = null;
  }
  
  // 새 타이머 설정 (500ms 디바운스)
  labelingTimeout = setTimeout(async () => {
    await performLabeling(urlInfo);
  }, 500);
  
}

// 실제 라벨링 수행 함수
async function performLabeling(urlInfo: UrlInfo): Promise<void> {
  if (isLabeling) {
    return;
  }
  
  if (lastProcessedUrl === urlInfo.url) {
    return;
  }
  
  isLabeling = true;
  lastProcessedUrl = urlInfo.url;
  
  try {
    // URL 분석
    const analysis = UrlManager.analyzeUrl(urlInfo.url);
    
    if (!analysis.isIssueList) {
      return;
    }

    if (!analysis.owner || !analysis.repo) {  
      return;
    }

    const { owner, repo } = analysis;

    // 기존 라벨 정리
    clearExistingLabels();
    
    // GitHub 페이지 로딩 완료 대기
    const isPageReady = await waitForGitHubPageLoad();
    
    if (!isPageReady) {
      return;
    }

    // 페이지에서 이슈 번호들 추출
    const issueNumbers = extractIssueNumbers();
    
    if (issueNumbers.length === 0) {
      return;
    }

    const issueUrls = createIssueUrls(issueNumbers, owner, repo);

    // 라벨링 실행
    await labelAllIssues(issueUrls);
    
  } catch (error: unknown) {
    
    // 확장 프로그램 컨텍스트 무효화 에러 처리
    if (error instanceof Error && error.message === 'Extension context invalidated.') {
      showErrorMessage('확장 프로그램을 자동으로 새로고침합니다...', 3000);
      
      setTimeout(() => {
        try {
          chrome.runtime.reload();
        } catch (reloadError) {
          showErrorMessage('확장 프로그램을 수동으로 새로고침해주세요.', 3000);
        }
      }, 1000);
      return;
    }
    
    showErrorMessage('라벨링 처리 중 오류가 발생했습니다.');
  } finally {
    isLabeling = false;
  }
}

// URL 업데이트 메시지를 처리하는 함수 (메인 진입점)
export async function handleUrlUpdate(urlInfo: UrlInfo): Promise<void> {
  
  // 디바운싱을 적용한 라벨링 실행
  await executeLabelingWithDebounce(urlInfo);
}

// 라벨링 상태 초기화 함수 (필요시 사용)
export function resetLabelingState(): void {
  
  isLabeling = false;
  lastProcessedUrl = '';
  
  if (labelingTimeout) {
    clearTimeout(labelingTimeout);
    labelingTimeout = null;
  }
} 