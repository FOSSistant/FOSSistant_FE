
import { injectStyles } from './contentStyle';
import { handleUrlUpdate, resetLabelingState } from './content/urlHandler';

let isInitialized = false;
let lastUrl = window.location.href;
let isProcessingUrlChange = false;
let urlChangeTimeout: ReturnType<typeof setTimeout> | null = null;

// GitHub 사이트 확인
function isGitHubSite(): boolean {
  return /^https:\/\/github\.com\//.test(window.location.href);
}
// 메시지 리스너
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === 'PING') {
      sendResponse({ 
        ready: true, 
        url: window.location.href,
        isGitHub: isGitHubSite()
      });
      return true;
    } 
  
  // Background에서 감지한 모든 페이지 변화 메시지를 통합 처리
  if (['URL_NAVIGATION_DETECTED', 'PAGE_REFRESH_DETECTED', 'PAGE_LOAD_COMPLETED'].includes(message.type)) {
    
    // 디바운싱을 적용한 URL 변경 처리
    handleUrlChangeWithDebounce(message.url);
    sendResponse({ success: true });
    return true;
  }
  
  // 텍스트 하이라이트
  if (message.type === 'HIGHLIGHT_TEXT') {
    
    try {
      if (!isGitHubSite()) {
        throw new Error('GitHub 사이트가 아닙니다');
      }
      
      highlightText(message.text);
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ 
        success: false, 
        error: error instanceof Error ? error.message : '알 수 없는 오류' 
      });
    }
    return true;
  }
  
  return false;
});



// 초기화 함수
async function initialize(): Promise<void> {
  if (isInitialized) return;
    
  try {
    // 스타일 주입
    injectStyles();
    
    // URL 변화 감지 설정
    setupUrlChangeDetection();
    
    // 현재 URL 처리
    await processUrlChange();
    
    isInitialized = true;
    
    // Background에 준비 완료 신호 전송
    setTimeout(() => {
      notifyContentScriptReady();
    }, 500);
    
  } catch (error) {
  }
}

// URL 변화 감지 설정
function setupUrlChangeDetection(): void {
  // pushState/replaceState 감지
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    handleUrlChangeWithDebounce();
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    handleUrlChangeWithDebounce();
  };
  
  // popstate 이벤트 감지 (뒤로가기/앞으로가기)
  window.addEventListener('popstate', () => {
    handleUrlChangeWithDebounce();
  });
  
  // beforeunload 이벤트 감지 (새로고침/페이지 이탈)
  window.addEventListener('beforeunload', () => {
    lastUrl = ''; // 새로고침 감지를 위해 초기화
  });
  
  // MutationObserver로 DOM 변화 감지 (GitHub의 동적 페이지 변화)
  if (isGitHubSite()) {
    let mutationTimeout: ReturnType<typeof setTimeout> | null = null;
    
    const observer = new MutationObserver((mutations) => {
      // 중복 호출 방지를 위한 디바운싱
      if (mutationTimeout) {
        clearTimeout(mutationTimeout);
      }
      
      mutationTimeout = setTimeout(() => {
        // GitHub의 main 컨텐츠 영역이 변경되었는지 확인
        const hasContentChanges = mutations.some(mutation => {
          return Array.from(mutation.addedNodes).some(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              return element.matches('main, #js-repo-pjax-container, .application-main') ||
                     element.querySelector('main, #js-repo-pjax-container, .application-main');
            }
            return false;
          });
        });
        
        if (hasContentChanges) {
          handleUrlChangeWithDebounce();
        }
      }, 200);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
  }
}

// 디바운싱을 적용한 URL 변경 처리
function handleUrlChangeWithDebounce(url?: string): void {
  // 기존 타이머 취소
  if (urlChangeTimeout) {
    clearTimeout(urlChangeTimeout);
    urlChangeTimeout = null;
  }
  
  // 새 타이머 설정 (300ms 디바운스)
  urlChangeTimeout = setTimeout(() => {
    const targetUrl = url || window.location.href;
    
    // 새로고침의 경우 강제로 처리하기 위해 lastUrl 초기화
    if (url && url === lastUrl) {
      lastUrl = '';
    }
    
    processUrlChange(targetUrl);
  }, 300);
  
}

// URL 변경 처리
async function processUrlChange(targetUrl?: string): Promise<void> {
  if (isProcessingUrlChange) {
    return;
  }
  
  const currentUrl = targetUrl || window.location.href;
  
  if (currentUrl === lastUrl) {
    return;
  }
  
  isProcessingUrlChange = true;
  lastUrl = currentUrl;
  
  try {
    // GitHub에서만 라벨링 상태 리셋
    if (isGitHubSite()) {
      resetLabelingState();
    }
    
    // Background에 URL 변경 알림
    try {
      chrome.runtime.sendMessage({
        type: 'URL_CHANGED',
        data: {
          url: currentUrl,
          title: document.title,
          favicon: ''
        }
      });
    } catch (error) {
    }
    
    // GitHub URL 처리
    if (isGitHubSite()) {
      try {
        await handleUrlUpdate({ 
          url: currentUrl, 
          title: document.title, 
          favicon: '' 
        });
      } catch (error) {
      }
    }
  } finally {
    isProcessingUrlChange = false;
  }
}


// 텍스트 하이라이트 함수
function highlightText(textToHighlight: string): void {
  if (!textToHighlight?.trim()) return;
  
  
  // 기존 하이라이트 제거
  removeHighlights();
  
  // GitHub 이슈/PR 본문 찾기
  const contentSelectors = [
    '.js-comment-body',
    '.comment-body', 
    '[data-testid="issue-body"]',
    '.issue-body'
  ];
  
  let content: Element | null = null;
  for (const selector of contentSelectors) {
    content = document.querySelector(selector);
    if (content) break;
  }
  
  if (!content) {
    return;
  }
  
  // 텍스트 하이라이트 실행
  const text = content.textContent || '';
  if (text.toLowerCase().includes(textToHighlight.toLowerCase())) {
    highlightInElement(content, textToHighlight);
  }
}

// 요소 내 텍스트 하이라이트
function highlightInElement(element: Element, searchText: string): void {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  const textNodes: Text[] = [];
  let node;
  
  while (node = walker.nextNode()) {
    textNodes.push(node as Text);
  }
  
  textNodes.forEach(textNode => {
    const text = textNode.nodeValue || '';
    const lowerText = text.toLowerCase();
    const lowerSearch = searchText.toLowerCase();
    
    const index = lowerText.indexOf(lowerSearch);
    if (index === -1) return;
    
    const parent = textNode.parentNode;
    if (!parent) return;
    
    // 텍스트를 3부분으로 나누기
    const beforeText = text.substring(0, index);
    const matchText = text.substring(index, index + searchText.length);
    const afterText = text.substring(index + searchText.length);
    
    // 하이라이트 요소 생성
    const highlight = document.createElement('span');
    highlight.className = 'fossistant-highlight';
    highlight.textContent = matchText;
    highlight.style.backgroundColor = '#ffd700';
    highlight.style.color = '#000';
    highlight.style.padding = '2px 4px';
    highlight.style.borderRadius = '3px';
    highlight.style.fontWeight = 'bold';
    
    // DOM 교체
    const fragment = document.createDocumentFragment();
    if (beforeText) fragment.appendChild(document.createTextNode(beforeText));
    fragment.appendChild(highlight);
    if (afterText) fragment.appendChild(document.createTextNode(afterText));
    
    parent.replaceChild(fragment, textNode);
    
    // 첫 번째 하이라이트로 스크롤
    if (document.querySelectorAll('.fossistant-highlight').length === 1) {
      highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// 기존 하이라이트 제거
function removeHighlights(): void {
  const highlights = document.querySelectorAll('.fossistant-highlight');
  highlights.forEach(highlight => {
    const parent = highlight.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(highlight.textContent || ''), highlight);
      parent.normalize();
    }
  });
}

// Background에 준비 완료 신호 전송
function notifyContentScriptReady(): void {
  try {
    chrome.runtime.sendMessage({
      type: 'CONTENT_SCRIPT_READY',
      url: window.location.href,
      timestamp: Date.now()
    }, (response) => {
      if (chrome.runtime.lastError) {
      } else {
      }
    });
  } catch (error) {
  }
}

// 초기화 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}




