// Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  sendResponse({ received: true });
});

// URL 정보 업데이트 함수
const updateUrlInfo = async (tabId: number) => {
  try {
    const tabInfo = await chrome.tabs.get(tabId);
    chrome.runtime.sendMessage({
      type: 'UPDATE_URL_INFO',
      data: {
        url: tabInfo.url,
        title: tabInfo.title,
        favicon: tabInfo.favIconUrl
      }
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('메시지 전송 실패:', chrome.runtime.lastError);
      }
    });
  } catch (error) {
    console.error('URL 정보 업데이트 실패:', error);
  }
};

// 탭 변경 이벤트 감지
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (activeInfo.tabId) {
    await updateUrlInfo(activeInfo.tabId);
  }
});

// URL 변경 이벤트 감지
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tabId) {
    await updateUrlInfo(tabId);
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
  updateUrlInfo(tab.id);
}); 