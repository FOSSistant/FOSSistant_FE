// Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  sendResponse({ received: true });
});

// 탭 변경 이벤트 감지
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.id) {
    // 현재 탭의 정보를 가져옴
    const tabInfo = await chrome.tabs.get(tab.id);
    // 사이드 패널에 URL 정보를 전달
    await chrome.runtime.sendMessage({
      type: 'UPDATE_URL_INFO',
      data: {
        url: tabInfo.url,
        title: tabInfo.title,
        favicon: tabInfo.favIconUrl
      }
    });
  }
});

// URL 변경 이벤트 감지
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.id) {
    // 현재 탭의 정보를 가져옴
    const tabInfo = await chrome.tabs.get(tab.id);
    // 사이드 패널에 URL 정보를 전달
    await chrome.runtime.sendMessage({
      type: 'UPDATE_URL_INFO',
      data: {
        url: tabInfo.url,
        title: tabInfo.title,
        favicon: tabInfo.favIconUrl
      }
    });
  }
});

// 아이콘 클릭 시 사이드 패널 열기
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    // 현재 탭의 정보를 가져옴
    const tabInfo = await chrome.tabs.get(tab.id);
    // 사이드 패널에 URL 정보를 전달
    await chrome.runtime.sendMessage({
      type: 'UPDATE_URL_INFO',
      data: {
        url: tabInfo.url,
        title: tabInfo.title,
        favicon: tabInfo.favIconUrl
      }
    });
  }
  // 사이드 패널 열기 (사용자 상호작용에 대해서만 실행)
  await chrome.sidePanel.open({ windowId: tab.windowId });
  console.log('Side panel opened');
}); 