import { requestGitHubCode, patchMyLevel } from './api/githubAuth';


// Content script 주입 함수
async function injectContentScript(tabId: number): Promise<boolean> {
  try {
    
    const tab = await chrome.tabs.get(tabId);
    if (!tab.url?.startsWith('http')) {
      return false;
    }
    
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });
    
    return true;
  } catch (error) {
    return false;
  }
}

// 강화된 메시지 전송 함수 (자동 주입 포함)
async function sendMessageToTab(tabId: number, message: any): Promise<any> {
  
  // 첫 번째 시도
  try {
    const response = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
    
    return response;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // "Could not establish connection" 오류인 경우 content script 주입 시도
    if (errorMessage.includes('Could not establish connection')) {
      
      const injected = await injectContentScript(tabId);
      if (!injected) {
        throw new Error('Content script 주입 실패');
      }
      
      // 주입 후 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 재시도
      return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, message, (response) => {
          if (chrome.runtime.lastError) {
            console.error(`❌ 재시도 메시지 전송 실패 [${tabId}]:`, chrome.runtime.lastError.message);
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
    } else {
      // 다른 종류의 오류는 그대로 throw
      throw error;
    }
  }
}

// Content script 간단 확인
async function isContentScriptReady(tabId: number): Promise<boolean> {
  try {
    const response = await sendMessageToTab(tabId, { type: 'PING' });
    return response?.ready === true;
  } catch (error) {
    return false;
  }
}

// Service Worker 이벤트
chrome.runtime.onInstalled.addListener(() => {
});

// 메시지 리스너 (핵심 기능만)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  // GitHub 코드 요청
  if (message.type === 'REQUEST_GITHUB_CODE') {
    requestGitHubCode()
      .then(result => sendResponse(result))
      .catch(() => sendResponse(false));
    return true;
  }
  
  // URL 변경 알림 - 단순 저장 및 전달
  if (message.type === 'URL_CHANGED') {
    
    // Storage에 저장
    chrome.storage.local.set({ currentUrlInfo: message.data }).catch(console.error);
    return;
  }

  // 하이라이트 요청 - 단순 전달
  if (message.type === 'HIGHLIGHT_TEXT') {
    const tabId = message.tabId || sender.tab?.id;
    
    
    if (!tabId) {
      console.error('❌ 탭 정보 없음');
      sendResponse({ success: false, error: '탭 정보 없음' });
      return;
    }
    
    // 단순히 content script에 전달
    sendMessageToTab(tabId, {
      type: 'HIGHLIGHT_TEXT',
      text: message.text
    })
    .then(response => {
      sendResponse(response || { success: true });
    })
    .catch((error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      sendResponse({ success: false, error: errorMessage });
    });
    
    return true;
  }
  
  // 사이드패널 토글
  if (message.type === 'TOGGLE_SIDEPANEL') {
    if (sender.tab?.windowId) {
      chrome.sidePanel.open({ windowId: sender.tab.windowId })
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
    }
  }
  
  return false;
});

// 탭별 이벤트 디바운싱을 위한 타이머 관리
const tabEventTimers = new Map<number, ReturnType<typeof setTimeout>>();

// 탭 업데이트 리스너 - 새로고침 및 URL 변경 감지 (디바운싱 적용)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // GitHub 페이지가 아니면 무시
  if (!tab.url?.includes('github.com')) {
    return;
  }

  // 기존 타이머 취소
  if (tabEventTimers.has(tabId)) {
    clearTimeout(tabEventTimers.get(tabId)!);
    tabEventTimers.delete(tabId);
  }

  // URL 변경 감지 (새로운 페이지로 이동) - 최우선 처리
  if (changeInfo.url) {
    
    // 즉시 처리 (디바운싱 없이)
    try {
      await sendMessageToTab(tabId, {
        type: 'URL_NAVIGATION_DETECTED',
        url: changeInfo.url
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
    }
    return; // URL 변경시에는 다른 처리 생략
  }
  
  // 새로고침 감지 (로딩 시작, URL 변경 없음)
  if (changeInfo.status === 'loading' && !changeInfo.url) {
    
    // 디바운싱 적용 (200ms)
    const timer = setTimeout(async () => {
      try {
        await sendMessageToTab(tabId, {
          type: 'PAGE_REFRESH_DETECTED',
          url: tab.url
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
      }
      tabEventTimers.delete(tabId);
    }, 200);
    
    tabEventTimers.set(tabId, timer);
    return;
  }
  
  // 페이지 로딩 완료
  if (changeInfo.status === 'complete') {
    
    // 디바운싱 적용 (500ms)
    const timer = setTimeout(async () => {
      // Content script 상태 확인 및 필요시 주입
      const isReady = await isContentScriptReady(tabId);
      
      // 준비되지 않았으면 주입
      if (!isReady) {
        await injectContentScript(tabId);
        
        // 주입 후 추가 대기
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // 페이지 로딩 완료 알림
      try {
        await sendMessageToTab(tabId, {
          type: 'PAGE_LOAD_COMPLETED',
          url: tab.url
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
      }
      
      tabEventTimers.delete(tabId);
    }, 500);
    
    tabEventTimers.set(tabId, timer);
  }
});

// 확장 프로그램 아이콘 클릭
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.windowId) {
    try {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    } catch (error) {
    }
  }
});

