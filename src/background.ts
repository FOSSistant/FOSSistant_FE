import { UrlInfo } from './types';

// Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
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
});

// URL 정보 업데이트 함수
const updateUrlInfo = async (tabId: number) => {
  try {
    const tabInfo = await chrome.tabs.get(tabId);
    const message = {
      type: 'UPDATE_URL_INFO',
      data: {
        url: tabInfo.url,
        title: tabInfo.title,
        favicon: tabInfo.favIconUrl
      }
    };

    // 사이드 패널이 준비되었는지 확인 후 메시지 전송
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        console.log('사이드 패널이 아직 준비되지 않음');
      } else {
        console.log('URL 정보 업데이트 성공');
      }
    });
  } catch (error) {
    console.error('URL 정보 업데이트 실패:', error);
  }
};

// 탭이 활성화될 때마다 URL 정보 업데이트
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url && !tab.url.startsWith('chrome://')) {
      const urlInfo: UrlInfo = {
        url: tab.url,
        title: tab.title || '',
        favicon: tab.favIconUrl || ''
      };
      await chrome.storage.local.set({ currentUrlInfo: urlInfo });
      chrome.runtime.sendMessage({ type: 'UPDATE_URL_INFO', data: urlInfo });
    }
  } catch (error) {
    console.error('Error updating URL info:', error);
  }
});

// 탭이 업데이트될 때마다 URL 정보 업데이트
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    try {
      const urlInfo: UrlInfo = {
        url: tab.url,
        title: tab.title || '',
        favicon: tab.favIconUrl || ''
      };
      await chrome.storage.local.set({ currentUrlInfo: urlInfo });
      chrome.runtime.sendMessage({ type: 'UPDATE_URL_INFO', data: urlInfo });
    } catch (error) {
      console.error('Error updating URL info:', error);
    }
  }
});

// 웹 페이지 네비게이션 이벤트 리스너 추가
chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
  try {
    const tab = await chrome.tabs.get(details.tabId);
    if (tab.url && !tab.url.startsWith('chrome://')) {
      const urlInfo: UrlInfo = {
        url: tab.url,
        title: tab.title || '',
        favicon: tab.favIconUrl || ''
      };
      await chrome.storage.local.set({ currentUrlInfo: urlInfo });
      chrome.runtime.sendMessage({ type: 'UPDATE_URL_INFO', data: urlInfo });
    }
  } catch (error) {
    console.error('Error updating URL info:', error);
  }
});

// 아이콘 클릭 시 사이드 패널 열기
chrome.action.onClicked.addListener((tab) => {
  if (!tab.id || !tab.windowId) return;
  
  // 사이드 패널 옵션 설정
  chrome.sidePanel.setOptions({
    path: 'sidepanel.html',
    enabled: true
  });
  
  // 즉시 사이드 패널 열기
  chrome.sidePanel.open({ windowId: tab.windowId });
  console.log('Side panel opened');
  
  // URL 정보 업데이트
  if (tab.id) {
    updateUrlInfo(tab.id);
  }
}); 