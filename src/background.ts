import { requestGitHubCode, patchMyLevel } from './api/githubAuth';

console.log('🚀 Background script 시작');

// Content script 주입 함수
async function injectContentScript(tabId: number): Promise<boolean> {
  try {
    console.log(`💉 Content script 주입 시도 [${tabId}]`);
    
    const tab = await chrome.tabs.get(tabId);
    if (!tab.url?.startsWith('http')) {
      console.log(`❌ HTTP(S) 페이지가 아님 [${tabId}]`);
      return false;
    }
    
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });
    
    console.log(`✅ Content script 주입 완료 [${tabId}]`);
    return true;
  } catch (error) {
    console.error(`❌ Content script 주입 실패 [${tabId}]:`, error);
    return false;
  }
}

// 강화된 메시지 전송 함수 (자동 주입 포함)
async function sendMessageToTab(tabId: number, message: any): Promise<any> {
  console.log(`📤 메시지 전송 [${tabId}]:`, message.type);
  
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
    
    console.log(`✅ 메시지 응답 [${tabId}]:`, response);
    return response;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`⚠️ 첫 번째 메시지 전송 실패 [${tabId}]:`, errorMessage);
    
    // "Could not establish connection" 오류인 경우 content script 주입 시도
    if (errorMessage.includes('Could not establish connection')) {
      console.log(`🔄 Content script 주입 후 재시도 [${tabId}]`);
      
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
            console.log(`✅ 재시도 메시지 응답 [${tabId}]:`, response);
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
  console.log('🔧 Extension installed');
});

// 메시지 리스너 (핵심 기능만)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Background 메시지:', message.type);
  
  // GitHub 코드 요청
  if (message.type === 'REQUEST_GITHUB_CODE') {
    requestGitHubCode()
      .then(result => sendResponse(result))
      .catch(() => sendResponse(false));
    return true;
  }
  
  // URL 변경 알림 - 단순 저장 및 전달
  if (message.type === 'URL_CHANGED') {
    console.log('🔄 URL 변경:', message.data?.url);
    
    // Storage에 저장
    chrome.storage.local.set({ currentUrlInfo: message.data }).catch(console.error);
    
    // 사이드패널에 알림
    chrome.runtime.sendMessage({
      type: 'UPDATE_URL_INFO',
      data: message.data
    }).catch(() => {}); // 에러 무시 (사이드패널이 열려있지 않을 수 있음)
    
    sendResponse({ success: true });
    return;
  }
  
  // 하이라이트 요청 - 단순 전달
  if (message.type === 'HIGHLIGHT_TEXT') {
    const tabId = message.tabId || sender.tab?.id;
    
    console.log('🎨 하이라이트 요청 수신:', { tabId, text: message.text?.substring(0, 50) });
    
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
      console.log('✅ 하이라이트 응답:', response);
      sendResponse(response || { success: true });
    })
    .catch((error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      console.error('❌ 하이라이트 에러:', errorMessage);
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

// 탭 업데이트 리스너 - URL 변경 감지에만 집중
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // URL 변경 감지
  if (changeInfo.url && changeInfo.url.includes('github.com')) {
    console.log(`🔄 GitHub URL 변경 감지 [${tabId}]: ${changeInfo.url}`);
    
    // Content script에 URL 변경 알림
    setTimeout(async () => {
      try {
        await sendMessageToTab(tabId, {
          type: 'URL_NAVIGATION_DETECTED',
          url: changeInfo.url
        });
        console.log(`✅ URL 변경 알림 전송 [${tabId}]`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`⚠️ URL 변경 알림 실패 [${tabId}]:`, errorMessage);
      }
    }, 300);
  }
  
  // 페이지 로딩 완료 시 (GitHub만)
  if (changeInfo.status === 'complete' && tab.url?.includes('github.com')) {
    console.log(`📄 GitHub 페이지 로딩 완료 [${tabId}]: ${tab.url}`);
    
    // Content script 상태 확인 및 필요시 주입
    setTimeout(async () => {
      const isReady = await isContentScriptReady(tabId);
      console.log(`${isReady ? '✅' : '⚠️'} Content script 상태 [${tabId}]: ${isReady ? '준비됨' : '준비 안됨'}`);
      
      // 준비되지 않았으면 주입
      if (!isReady) {
        console.log(`🔄 Content script 자동 주입 [${tabId}]`);
        await injectContentScript(tabId);
      }
    }, 1000);
  }
});

// 확장 프로그램 아이콘 클릭
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.windowId) {
    try {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    } catch (error) {
      console.error('❌ 사이드패널 열기 실패:', error);
    }
  }
});

console.log('🎉 Background script 초기화 완료');