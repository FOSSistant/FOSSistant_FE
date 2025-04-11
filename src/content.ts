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

// 플로팅 버튼 생성 및 추가
function createFloatingButton() {
  const existingButton = document.getElementById('floating-button-container');
  if (existingButton) {
    existingButton.remove();
  }

  const container = document.createElement('div');
  container.id = 'floating-button-container';

  const button = document.createElement('button');
  button.className = 'floating-button';
  button.setAttribute('aria-label', '사이드 패널 열기');
  
  // SVG 아이콘 추가
  button.innerHTML = `
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      class="floating-button-icon"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
  `;

  // 클릭 이벤트 추가
  let isButtonEnabled = true;
  button.addEventListener('click', () => {
    if (!isButtonEnabled) return;
    
    try {
      chrome.runtime.sendMessage({ type: 'TOGGLE_SIDEPANEL' }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('Extension context invalidated, reloading...');
          isButtonEnabled = false;
          setTimeout(() => {
            isButtonEnabled = true;
            init();
          }, 1000);
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
      isButtonEnabled = false;
      setTimeout(() => {
        isButtonEnabled = true;
        init();
      }, 1000);
    }
  });

  container.appendChild(button);
  document.body.appendChild(container);
}

// 스타일 주입
function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #floating-button-container {
      position: fixed;
      z-index: 2147483647;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }

    .floating-button {
      pointer-events: auto;
      width: 3.5rem;
      height: 3.5rem;
      border: none;
      border-radius: 50%;
      background: linear-gradient(135deg, #2D333B 0%, #22272E 100%);
      color: white;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 0.75rem;
    }

    .floating-button-icon {
      stroke: currentColor;
      width: 100%;
      height: 100%;
    }

    .floating-button:hover {
      transform: translateX(-4px);
      background: linear-gradient(135deg, #373E47 0%, #2D333B 100%);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
    }
  `;
  document.head.appendChild(style);
}

// 초기화
function init() {
  injectStyles();
  createFloatingButton();
}

// DOM이 로드되면 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 동적 페이지 변경 감지를 위한 옵저버 설정
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
      const buttonExists = document.getElementById('floating-button-container');
      if (!buttonExists) {
        init();
        break;
      }
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
}); 