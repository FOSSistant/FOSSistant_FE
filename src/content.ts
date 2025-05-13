import { getIssueLabels, getIssuesFromGithub, Issue } from './api';
import { injectStyles } from './contentStyle';
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
  
chrome.storage.local.get('currentUrlInfo', async (result) => {
  if (result.currentUrlInfo) {
    console.log(result.currentUrlInfo.url);
  }
  
  const rawIssues: any = await getIssuesFromGithub('freeCodeCamp', 'freeCodeCamp', 1);
  const issues: Issue[] = rawIssues.map((issue: any) => ({
    id: issue.html_url,
    title: issue.title,
    body: issue.body,
  }));

});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_URL_INFO') {
    const urlInfo = message.data;

    // 깃허브 이슈 리스트 페이지(https://github.com/{owner}/{repo}/issues)에서만 동작
    const listMatch = urlInfo.url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/issues(\/?(\?.*)?)?$/);
    if (listMatch) {
      const owner = listMatch[1];
      const repo = listMatch[2];
      console.log('URL 정보 수신:', urlInfo);
      console.log('owner:', owner);
      console.log('repo:', repo);

      const values: string[] = Array.from(
        document.querySelectorAll('span[class^="issue-item-module__defaultNumberDescription"]')
      )
        .map((parentSpan) => parentSpan.querySelector('span')?.textContent?.trim())
        .filter((text): text is string => !!text);

      let issueUrls: string[] = [];
      values.forEach(value => {
        issueUrls.push(`https://github.com/${owner}/${repo}/issues/${value}`);
      });

      console.log('🎯 추출된 이슈 URL들:', issueUrls);

      // 5개씩 나누는 함수
      function chunkArray<T>(array: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
          result.push(array.slice(i, i + size));
        }
        return result;
      }

      // 난이도 라벨을 li > h3 앞에 삽입하는 함수
      async function labelIssuesBatch(issueUrls: string[]) {
        for (const url of issueUrls) {
          const match = url.match(/\/issues\/(#\d+)/);
          if (!match) continue;
          const issueNumber = match[1];
          console.log(issueNumber);
          // aria-label에 #이슈번호가 포함된 li 태그 찾기
          const li = Array.from(document.querySelectorAll('li[aria-label]')).find(
            (el) => el.getAttribute('aria-label')?.includes(`${issueNumber}`)
          ) as HTMLElement | undefined;
          console.log(li);
          if (!li) continue;
          const titleH3 = li.querySelector('h3');
          if (!titleH3) continue;
          // 이미 라벨이 있으면 건너뜀
          if (titleH3.querySelector('.custom-label')) continue;
          // 난이도 라벨 생성
          const tiers = ['easy', 'hard', 'unknown'];
          const randomTier = tiers[Math.floor(Math.random() * tiers.length)];
          const newLabel = document.createElement('span');
          newLabel.className = 'Label custom-label custom-label-style';
          const icon = randomTier === 'easy' ? '🧩' : randomTier === 'hard' ? '🔥' : '❓';
          newLabel.innerHTML = `
            <span class="tier-icon">${icon}</span>
            <span class="tier-text">${randomTier}</span>
          `;
          newLabel.style.backgroundColor = randomTier === 'easy' ? 'rgba(67, 160, 71, 0.1)' : 
                                         randomTier === 'hard' ? 'rgba(229, 57, 53, 0.1)' : 'rgba(110, 119, 129, 0.1)';
          newLabel.style.color = randomTier === 'easy' ? '#43a047' : 
                                randomTier === 'hard' ? '#e53935' : '#6e7781';
          newLabel.style.borderColor = randomTier === 'easy' ? 'rgba(67, 160, 71, 0.2)' : 
                                      randomTier === 'hard' ? 'rgba(229, 57, 53, 0.2)' : 'rgba(110, 119, 129, 0.2)';
          // h3의 첫 번째 자식 앞에 삽입
          titleH3.insertBefore(newLabel, titleH3.firstChild);
        }
      }

      // 전체 이슈 URL을 5개씩 나누어 순차 처리
      async function labelAllIssues(issueUrls: string[]) {
        const batches = chunkArray(issueUrls, 5);
        for (const batch of batches) {
          console.log(batch);
          await labelIssuesBatch(batch);
          // 필요시 약간의 딜레이
          // await new Promise(res => setTimeout(res, 100));
        }
      }

      // 라벨링 실행
      labelAllIssues(issueUrls);
    }
  }
});


