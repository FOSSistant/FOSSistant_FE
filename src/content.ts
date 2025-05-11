console.log('Content script loaded');

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
      transform: translate3d(0, -50%, 0);
      pointer-events: auto;
      touch-action: none;
      user-select: none;
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
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 0.75rem;
    }

    .floating-button:hover {
      transform: translateX(-4px);
      background: linear-gradient(135deg, #373E47 0%, #2D333B 100%);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
    }

    .floating-button-icon {
      stroke: currentColor;
      width: 100%;
      height: 100%;
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

// 깃허브 이슈 페이지 확인 및 라벨 변경 함수
function checkAndModifyGitHubIssues() {
  // 깃허브 이슈 페이지인지 확인
  if (!window.location.href.includes('github.com') || !window.location.href.includes('/issues')) {
    return;
  }

  // IssueRow 요소들 찾기
  const issueRows = document.querySelectorAll('.IssueRow-module__row--XmR1f');
  
  issueRows.forEach(row => {
    // h3 태그 찾기
    const titleH3 = row.querySelector('h3');
    if (!titleH3) return;

    // 이미 추가된 라벨이 있는지 확인
    const existingCustomLabel = titleH3.querySelector('.custom-label');
    if (!existingCustomLabel) {
      // 티어 라벨 생성
      const tiers = ['easy', 'hard', 'unknown'];
      const randomTier = tiers[Math.floor(Math.random() * tiers.length)];
      
      const newLabel = document.createElement('span');
      newLabel.className = 'Label custom-label';
      
      // 아이콘과 텍스트를 포함하는 HTML 생성
      const icon = randomTier === 'easy' ? '🧩' :
                  randomTier === 'hard' ? '🔥' : '❓';
      
      newLabel.innerHTML = `
        <span class="tier-icon">${icon}</span>
        <span class="tier-text">${randomTier}</span>
      `;
      
      // 스타일 적용
      newLabel.style.backgroundColor = randomTier === 'easy' ? 'rgba(67, 160, 71, 0.1)' : 
                                     randomTier === 'hard' ? 'rgba(229, 57, 53, 0.1)' : 'rgba(110, 119, 129, 0.1)';
      newLabel.style.color = randomTier === 'easy' ? '#43a047' : 
                            randomTier === 'hard' ? '#e53935' : '#6e7781';
      newLabel.style.padding = '4px 8px';
      newLabel.style.fontSize = '12px';
      newLabel.style.fontWeight = '600';
      newLabel.style.borderRadius = '6px';
      newLabel.style.marginRight = '8px';
      newLabel.style.display = 'inline-flex';
      newLabel.style.alignItems = 'center';
      newLabel.style.gap = '4px';
      newLabel.style.lineHeight = '1';
      newLabel.style.verticalAlign = 'middle';
      newLabel.style.border = '1px solid';
      newLabel.style.borderColor = randomTier === 'easy' ? 'rgba(67, 160, 71, 0.2)' : 
                                  randomTier === 'hard' ? 'rgba(229, 57, 53, 0.2)' : 'rgba(110, 119, 129, 0.2)';
      
      // h3 태그의 첫 번째 자식 요소 앞에 라벨 추가
      titleH3.insertBefore(newLabel, titleH3.firstChild);
    }
  });
}

// DOM 변경 감지를 위한 MutationObserver 설정
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      checkAndModifyGitHubIssues();
    }
  }
});

// 초기 실행
checkAndModifyGitHubIssues();

// DOM 변경 감지 시작
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 일정 시간(예: 1초) 후 observer 해제
setTimeout(() => {
  observer.disconnect();
}, 1000); 