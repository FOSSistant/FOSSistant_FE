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

// 메시지 리스너 설정
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script - 메시지 수신:', message.type, message);
  
  // PING 메시지에 응답 (Content Script 준비 상태 확인용)
  if (message.type === 'PING') {
    console.log('PING 메시지 수신, PONG 응답');
    sendResponse({ ready: true, url: window.location.href });
    return true; // 비동기 응답을 위해 true 반환
  }
  
  // 하이라이트 메시지 처리
  if (message.type === 'HIGHLIGHT_TEXT') {
    try {
      highlightTextInPage(message.text);
      sendResponse({ success: true });
    } catch (error) {
      console.error('하이라이트 처리 중 오류:', error);
      sendResponse({ success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' });
    }
    return true; // 비동기 응답을 위해 true 반환
  }
  
  // 다른 메시지 타입은 무시
  return false;
});

// 텍스트 하이라이트 기능
function highlightTextInPage(textToHighlight: string) {
  if (!textToHighlight || textToHighlight.trim() === '') {
    console.log('하이라이트할 텍스트가 없음');
    return;
  }

  console.log('텍스트 하이라이트 시작:', textToHighlight);
  
  // 기존 하이라이트 제거
  removeExistingHighlights();
  
  // GitHub 이슈 본문 영역 찾기
  const issueBodySelectors = [
    '.js-comment-body',
    '.comment-body',
    '[data-testid="issue-body"]',
    '.issue-body',
    '.timeline-comment-group .comment .comment-body'
  ];
  
  let issueBody: Element | null = null;
  for (const selector of issueBodySelectors) {
    issueBody = document.querySelector(selector);
    if (issueBody) {
      console.log('이슈 본문 영역 찾음:', selector);
      break;
    }
  }
  
  if (!issueBody) {
    console.log('이슈 본문 영역을 찾을 수 없음');
    return;
  }
  
  // 텍스트 하이라이트 실행
  const walker = document.createTreeWalker(
    issueBody,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  const textNodes: Text[] = [];
  let node;
  
  while (node = walker.nextNode()) {
    if (node.nodeValue && node.nodeValue.trim().length > 0) {
      textNodes.push(node as Text);
    }
  }
  
  let highlightCount = 0;
  
  textNodes.forEach(textNode => {
    const text = textNode.nodeValue || '';
    const highlightText = textToHighlight.trim();
    
    // 대소문자 구분 없이 검색
    const index = text.toLowerCase().indexOf(highlightText.toLowerCase());
    
    if (index !== -1) {
      const parent = textNode.parentNode;
      if (!parent) return;
      
      // 텍스트를 3부분으로 나누기: 이전 텍스트, 하이라이트할 텍스트, 이후 텍스트
      const beforeText = text.substring(0, index);
      const matchText = text.substring(index, index + highlightText.length);
      const afterText = text.substring(index + highlightText.length);
      
      // 하이라이트 요소 생성
      const highlightSpan = document.createElement('span');
      highlightSpan.className = 'fossistant-highlight';
      highlightSpan.textContent = matchText;
      highlightSpan.style.backgroundColor = '#ffd700';
      highlightSpan.style.color = '#000';
      highlightSpan.style.padding = '2px 4px';
      highlightSpan.style.borderRadius = '3px';
      highlightSpan.style.fontWeight = 'bold';
      highlightSpan.style.boxShadow = '0 2px 4px rgba(255, 215, 0, 0.3)';
      highlightSpan.style.transition = 'all 0.3s ease';
      
      // 새로운 노드들로 교체
      const fragment = document.createDocumentFragment();
      
      if (beforeText) {
        fragment.appendChild(document.createTextNode(beforeText));
      }
      
      fragment.appendChild(highlightSpan);
      
      if (afterText) {
        fragment.appendChild(document.createTextNode(afterText));
      }
      
      parent.replaceChild(fragment, textNode);
      highlightCount++;
      
      console.log(`하이라이트 적용: "${matchText}"`);
    }
  });
  
  console.log(`총 ${highlightCount}개 텍스트 하이라이트 완료`);
  
  // 하이라이트된 첫 번째 요소로 스크롤
  if (highlightCount > 0) {
    setTimeout(() => {
      const firstHighlight = document.querySelector('.fossistant-highlight');
      if (firstHighlight) {
        firstHighlight.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // 깜빡임 효과
        let opacity = 1;
        const blink = setInterval(() => {
          (firstHighlight as HTMLElement).style.opacity = opacity.toString();
          opacity = opacity === 1 ? 0.3 : 1;
        }, 300);
        
        setTimeout(() => {
          clearInterval(blink);
          (firstHighlight as HTMLElement).style.opacity = '1';
        }, 1500);
      }
    }, 100);
  }
}

// 기존 하이라이트 제거
function removeExistingHighlights() {
  const existingHighlights = document.querySelectorAll('.fossistant-highlight');
  existingHighlights.forEach(highlight => {
    const parent = highlight.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(highlight.textContent || ''), highlight);
      parent.normalize(); // 인접한 텍스트 노드들을 병합
    }
  });
  
  console.log(`기존 하이라이트 ${existingHighlights.length}개 제거`);
}


