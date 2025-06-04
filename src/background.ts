import { requestGitHubCode, patchMyLevel } from './api/githubAuth';

console.log('🚀 Background script 시작');

// Service Worker
chrome.runtime.onInstalled.addListener(async () => {
  console.log('🔧 Extension installed');
});

// 메시지 리스너
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log('📨 Background 메시지 수신:', message.type, message);
  
  if (message.type === 'REQUEST_GITHUB_CODE') {
    requestGitHubCode().then((result) => {
      console.log('background sendResponse', result);
      sendResponse(result);
    }).catch((e) => {
      sendResponse(false);
    });
    return true;
  }

  if (message.type === 'URL_CHANGED') {
    console.log('🔄 URL 변경 메시지 수신:', message.data);
    
    // 사이드패널에 URL 변경 전달
    try {
      chrome.runtime.sendMessage({
        type: 'UPDATE_URL_INFO',
        data: message.data
      }, () => {
        if (chrome.runtime.lastError) {
          console.log('❌ 사이드패널 메시지 전송 실패:', chrome.runtime.lastError);
        } else {
          console.log('✅ 사이드패널에 URL 전송 완료');
        }
      });
    } catch (error) {
      console.error('❌ 사이드패널 메시지 전송 오류:', error);
    }
    
    sendResponse({ success: true });
    return;
  }

  if (message.type === 'CONTENT_SCRIPT_READY') {
    console.log('🎯 Content script 준비 완료, 탭 ID:', sender.tab?.id);
    sendResponse({ success: true });
    return;
  }

  // 사이드패널 토글 메시지 처리
  if (message.type === 'TOGGLE_SIDEPANEL') {
    console.log('🔄 사이드패널 토글 요청, windowId:', sender.tab?.windowId);
    
    if (sender.tab?.windowId) {
      try {
        await chrome.sidePanel.open({ windowId: sender.tab.windowId });
        console.log('✅ 사이드패널 열기 성공');
        sendResponse({ success: true });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ 사이드패널 열기 실패:', error);
        sendResponse({ success: false, error: errorMessage });
      }
      return true;
    } else {
      console.error('❌ Window ID not found');
      sendResponse({ success: false, error: 'Window ID not found' });
    }
  }
});

console.log('✅ 메시지 리스너 등록 완료');

chrome.action.onClicked.addListener(async (tab) => {
  console.log('🖱️ 확장 프로그램 아이콘 클릭:', tab.id, tab.windowId);
  
  if (!tab.windowId) {
    console.error('❌ 윈도우 ID가 없음');
    return;
  }

  try {
    console.log('🚀 사이드패널 열기 시도...');
    await chrome.sidePanel.open({ windowId: tab.windowId });
    console.log('✅ 사이드패널 열기 성공');
  } catch (error) {
    console.error('❌ 사이드패널 열기 실패:', error);
  }
});

console.log('🎉 Background script 초기화 완료');