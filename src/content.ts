import { injectStyles } from './contentStyle';
import { createFloatingButton } from './content/floatingButton';
import { handleUrlUpdate, resetLabelingState } from './content/urlHandler';

console.log('🚀 Content script loaded');
console.log('📍 Current URL:', window.location.href);

let isInitialized = false;
let lastProcessedUrl = '';

// 현재 사이트가 GitHub인지 확인
function isGitHubSite(): boolean {
  return /^https:\/\/github\.com\//.test(window.location.href);
}

// 현재 사이트가 크롬 새 탭인지 확인
function isChromeNewTab(): boolean {
  return window.location.href.startsWith('chrome://newtab/') || 
         window.location.href.startsWith('chrome-search://local-ntp/');
}

// 초기화 함수
async function init() {
  console.log('🔧 Content script 초기화 시작');
  
  if (isInitialized) {
    console.log('⚠️ 이미 초기화됨, 중복 초기화 방지');
    return;
  }
  
  try {
    // 모든 사이트에서 스타일 주입
    injectStyles();
    console.log('✅ 스타일 주입 완료');
    
    // GitHub에서만 플로팅 버튼 생성
    if (isGitHubSite()) {
      // createFloatingButton();
      console.log('✅ GitHub 사이트 - 플로팅 버튼 생성 완료');
    } else {
      console.log('ℹ️ GitHub이 아닌 사이트 - 플로팅 버튼 생략');
    }
    
    // 모든 사이트에서 현재 페이지 URL 즉시 처리
    console.log('📍 현재 페이지 URL 즉시 처리:', window.location.href);
    lastProcessedUrl = window.location.href;
    await sendUrlUpdate(window.location.href, document.title);
    console.log('✅ 현재 URL 즉시 처리 완료');

    isInitialized = true;
    console.log('🎉 Content script 초기화 완료');

    // cleanup function은 페이지 언로드 시 호출
    window.addEventListener('beforeunload', () => {
      console.log('👋 페이지 언로드, 상태 초기화');
      if (isGitHubSite()) {
        resetLabelingState();
      }
    });
  } catch (error) {
    console.error('❌ Content script 초기화 실패:', error);
  }
}

// URL 업데이트를 background와 sidepanel에 전송하는 함수
async function sendUrlUpdate(url: string, title: string): Promise<void> {
  const urlInfo = {
    url,
    title: title || '',
    favicon: ''
  };
  
  console.log('📡 URL 업데이트 전송:', urlInfo);
  
  // Background script에 전송
  try {
    chrome.runtime.sendMessage({
      type: 'URL_CHANGED',
      data: urlInfo
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('❌ Background script 메시지 전송 실패:', chrome.runtime.lastError);
      } else {
        console.log('✅ Background script에 URL 전송 완료');
      }
    });
  } catch (error) {
    console.error('❌ URL 전송 오류:', error);
  }
  
  // GitHub에서만 라벨링 처리
  if (isGitHubSite()) {
    try {
      await handleUrlUpdate(urlInfo);
    } catch (error) {
      console.error('❌ URL 핸들러 처리 오류:', error);
    }
  }
}

// 즉시 초기화
console.log('✅ 사이트 감지, 즉시 초기화 시작');
init();

// Background script에 준비 완료 신호 전송
console.log('📡 Background script에 준비 완료 신호 전송');
chrome.runtime.sendMessage({ type: 'CONTENT_SCRIPT_READY' }, (response) => {
  if (chrome.runtime.lastError) {
    console.log('❌ Background script와 통신 실패:', chrome.runtime.lastError);
  } else {
    console.log('✅ Background script와 통신 성공:', response);
  }
});

// URL 변화만 감지하는 함수
function shouldProcessPathChange(newUrl: string): boolean {
  console.log('🔍 URL 변화 분석:', {
    newUrl,
    lastUrl: lastProcessedUrl,
    shouldProcess: newUrl !== lastProcessedUrl
  });
  
  return newUrl !== lastProcessedUrl;
}

// URL 변화 처리 함수
async function handlePathChange(reason: string): Promise<void> {
  const currentUrl = window.location.href;
  
  if (!shouldProcessPathChange(currentUrl)) {
    return;
  }
  
  console.log(`🔄 URL 변화 처리 (${reason}):`, {
    from: lastProcessedUrl,
    to: currentUrl
  });
  
  lastProcessedUrl = currentUrl;
  
  // GitHub에서만 라벨링 상태 초기화
  if (isGitHubSite()) {
    resetLabelingState();
  }
  
  // 새 URL 업데이트 전송
  await sendUrlUpdate(currentUrl, document.title);
}

// SPA 네비게이션 감지를 위한 MutationObserver (모든 사이트)
console.log('👁️ SPA 감지용 MutationObserver 설정 중...');

let observerTimeout: ReturnType<typeof setTimeout> | null = null;

const observer = new MutationObserver(async (mutations) => {
  // 디바운싱: 연속된 DOM 변화를 하나로 묶어서 처리
  if (observerTimeout) {
    clearTimeout(observerTimeout);
  }
  
  observerTimeout = setTimeout(async () => {
    await handlePathChange('MutationObserver');
  }, 300);
});

// 메인 컨테이너 관찰
function startObserving(): void {
  let targetContainer = document.body;
  console.log('✅ body 관찰 시작');
  
  observer.observe(targetContainer, {
    childList: true,
    subtree: true,
    attributes: false
  });
  
  console.log('✅ 컨테이너 관찰 시작');
}

// DOM이 준비되면 관찰 시작
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startObserving);
} else {
  startObserving();
}

// popstate 이벤트 감지 (브라우저 뒤로가기/앞으로가기)
window.addEventListener('popstate', async () => {
  console.log('🔙 popstate 이벤트 감지');
  await handlePathChange('popstate');
});

// History API 감지 (pushState/replaceState)
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function(data: any, unused: string, url?: string | URL | null) {
  originalPushState.call(history, data, unused, url);
  
  setTimeout(async () => {
    console.log('📍 pushState 감지:', window.location.href);
    await handlePathChange('pushState');
  }, 100);
};

history.replaceState = function(data: any, unused: string, url?: string | URL | null) {
  originalReplaceState.call(history, data, unused, url);
  
  setTimeout(async () => {
    console.log('🔄 replaceState 감지:', window.location.href);
    await handlePathChange('replaceState');
  }, 100);
};

console.log('✅ 전체 사이트 URL 감지 시스템 설정 완료');


