console.log('Content script loaded');

// 웹 페이지 내용 변경 함수
const modifyPageContent = (text: string, replacement: string) => {
  try {
    // body의 모든 텍스트 노드를 순회하면서 변경
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while (node = walker.nextNode()) {
      if (node.textContent?.includes(text)) {
        node.textContent = node.textContent.replace(new RegExp(text, 'g'), replacement);
      }
    }
  } catch (error) {
    console.error('페이지 내용 변경 실패:', error);
  }
};

// 메시지 리스너
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  
  if (message.type === 'MODIFY_CONTENT') {
    const { text, replacement } = message.data;
    modifyPageContent(text, replacement);
    sendResponse({ success: true });
  }
  
  return true;
}); 