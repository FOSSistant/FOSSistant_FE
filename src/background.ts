import { UrlInfo } from './types';

// Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  
  // 초기 설정 저장
  chrome.storage.sync.set({
    userSettings: {
      backgroundImage: '',
      showClock: true,
      gridColumns: 4,
      themeColor: '#ffffff'
    }
  });
});

// 메시지 리스너
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  
  if (message.type === 'MODIFY_CONTENT') {
    const { text, replacement } = message.data;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'MODIFY_CONTENT',
          data: { text, replacement }
        });
      }
    });
    return true; // 비동기 응답을 위해 true 반환
  }
  
  // URL 정보 요청에 대한 응답 처리
  if (message.type === 'GET_URL_INFO') {
    chrome.storage.local.get(['currentUrlInfo'], (result) => {
      sendResponse(result.currentUrlInfo || null);
    });
    return true; // 비동기 응답을 위해 true 반환
  }

  // 사이드패널 토글 메시지 처리
  if (message.type === 'TOGGLE_SIDEPANEL') {
    try {
      chrome.windows.getCurrent((window) => {
        if (window.id) {
          chrome.sidePanel.open({ windowId: window.id }).then(() => {
            console.log('Sidepanel opened successfully');
            sendResponse({ success: true });
          }).catch((error: Error) => {
            console.error('Error opening sidepanel:', error);
            sendResponse({ success: false, error: error.message });
          });
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error in TOGGLE_SIDEPANEL handler:', error);
        sendResponse({ success: false, error: error.message });
      }
    }
    return true;
  }
});

const debounceMap: { [tabId: number]: ReturnType<typeof setTimeout> } = {};
const lastUrlMap: { [tabId: number]: string } = {};

// URL 정보 업데이트 함수
const updateUrlInfo = async (tabId: number) => {
  if (debounceMap[tabId]) {
    clearTimeout(debounceMap[tabId]);
  }
  debounceMap[tabId] = setTimeout(async () => {
    try {
      const tabInfo = await chrome.tabs.get(tabId);
      if (!tabInfo.url || tabInfo.url.startsWith('chrome://')) return;

      // 중복 URL 방지
      if (lastUrlMap[tabId] === tabInfo.url) return;
      lastUrlMap[tabId] = tabInfo.url;

      const urlInfo: UrlInfo = {
        url: tabInfo.url,
        title: tabInfo.title || '',
        favicon: tabInfo.favIconUrl || ''
      };
      
      // 로컬 스토리지에 저장
      await chrome.storage.local.set({ currentUrlInfo: urlInfo });
      
      // 최근 방문 URL 목록 업데이트
      chrome.storage.local.get(['recentUrls'], (result) => {
        const recentUrls = result.recentUrls || [];
        const updatedUrls = [urlInfo, ...recentUrls.filter((url: UrlInfo) => url.url !== urlInfo.url)].slice(0, 12);
        chrome.storage.local.set({ recentUrls: updatedUrls });
      });
      
      // 메시지 전송 시도
      try {
        await chrome.tabs.sendMessage(tabId, { type: 'UPDATE_URL_INFO', data: urlInfo });
        await chrome.runtime.sendMessage({ type: 'UPDATE_URL_INFO', data: urlInfo });
      } catch (error) {
        console.log('메시지 전송 실패 (수신자가 없음):', error);
      }
    } catch (error) {
      console.error('URL 정보 업데이트 실패:', error);
    }
  }, 2000);
};

// 탭이 활성화될 때마다 URL 정보 업데이트
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await updateUrlInfo(activeInfo.tabId);
});

// 탭이 업데이트될 때마다 URL 정보 업데이트
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log('onUpdated', tabId, changeInfo.status);

  if (changeInfo.status === 'complete') {
    await updateUrlInfo(tabId);
  }
});

// 웹 페이지 네비게이션 이벤트 리스너 추가
chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
  await updateUrlInfo(details.tabId);
});

// 확장 프로그램 아이콘 클릭 시 사이드패널 열기
chrome.action.onClicked.addListener((tab) => {
  if (tab.windowId) {
    chrome.sidePanel.open({
      windowId: tab.windowId
    });
  }
}); 