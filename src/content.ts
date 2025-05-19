import { getIssueLabels, Issue, IssueLabel } from './api';
import { injectStyles } from './contentStyle';
console.log('Content script loaded');
chrome.runtime.sendMessage({ type: 'CONTENT_SCRIPT_READY' });

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
    isButtonEnabled = false;

    chrome.runtime.sendMessage({ type: 'TOGGLE_SIDEPANEL' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('사이드 패널 열기 실패:', chrome.runtime.lastError.message);
      } else if (!response?.success) {
        console.log('사이드 패널 열기 실패:', response?.error || '알 수 없는 에러');
      }
      
      // 1초 후에 버튼 다시 활성화
      setTimeout(() => {
        isButtonEnabled = true;
      }, 1000);
    });
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
        .filter((text): text is string => !!text)
        .map((text) => text.replace('#', ''));

      let issueUrls: Issue[] = [];
      values.forEach(value => {
        issueUrls.push({
          issueId: `https://github.com/${owner}/${repo}/issues/${value}`,
        });
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
      async function labelIssuesBatch(issueUrls: Issue[]) {
        // 로딩 표시 추가
        const loadingLabel = document.createElement('div');
        loadingLabel.className = 'loading-label';
        loadingLabel.innerHTML = `
          <div class="loading-spinner"></div>
          <span>라벨 로딩 중...</span>
        `;
        document.body.appendChild(loadingLabel);

        try {
          if (!issueUrls || issueUrls.length === 0) {
            throw new Error('이슈 URL이 없습니다.');
          }

          const issueLabels: IssueLabel[] = await getIssueLabels(issueUrls);
          if (!issueLabels || !Array.isArray(issueLabels)) {
            throw new Error('이슈 라벨 정보를 가져오는데 실패했습니다.');
          }

          console.log(issueLabels);
          for (const issueLabel of issueLabels) {
            try {
              if (!issueLabel || !issueLabel.issueId) {
                console.warn('잘못된 이슈 라벨 데이터:', issueLabel);
                continue;
              }

              const match = issueLabel.issueId.match(/\/issues\/(\d+)/);
              if (!match) {
                console.warn('이슈 번호를 찾을 수 없습니다:', issueLabel.issueId);
                continue;
              }

              const issueNumber = match[1];
              console.log(issueNumber);

              // aria-label에 #이슈번호가 포함된 li 태그 찾기
              const li = Array.from(document.querySelectorAll('li[aria-label]')).find(
                (el) => el.getAttribute('aria-label')?.includes(`${issueNumber}`)
              ) as HTMLElement | undefined;

              if (!li) {
                console.warn('이슈 요소를 찾을 수 없습니다:', issueNumber);
                continue;
              }

              const titleH3 = li.querySelector('h3');
              if (!titleH3) {
                console.warn('이슈 제목 요소를 찾을 수 없습니다:', issueNumber);
                continue;
              }

              // 이미 라벨이 있으면 건너뜀
              if (titleH3.querySelector('.custom-label')) {
                console.log('이미 라벨이 있는 이슈:', issueNumber);
                continue;
              }

              // 난이도 라벨 생성
              const tier = issueLabel.difficulty;
              if (!tier) {
                console.warn('난이도 정보가 없습니다:', issueNumber);
                continue;
              }

              console.log(tier);
              const newLabel = document.createElement('span');

              newLabel.className = 'Label custom-label custom-label-style';
              const icon = tier === 'easy' ? '🧩' : 
                          tier === 'medium' ? '⚙️' :
                          tier === 'hard' ? '🔥' : '❓';
              newLabel.innerHTML = `
                <span class="tier-icon">${icon}</span>
                <span class="tier-text">${tier}</span>
              `;
              newLabel.style.backgroundColor = tier === 'easy' ? 'rgba(67, 160, 71, 0.1)' : 
                                             tier === 'medium' ? 'rgba(255, 152, 0, 0.1)' :
                                             tier === 'hard' ? 'rgba(229, 57, 53, 0.1)' : 'rgba(110, 119, 129, 0.1)';
              newLabel.style.color = tier === 'easy' ? '#43a047' : 
                                    tier === 'medium' ? '#f57c00' :
                                    tier === 'hard' ? '#e53935' : '#6e7781';
              newLabel.style.borderColor = tier === 'easy' ? 'rgba(67, 160, 71, 0.2)' : 
                                          tier === 'medium' ? 'rgba(255, 152, 0, 0.2)' :
                                          tier === 'hard' ? 'rgba(229, 57, 53, 0.2)' : 'rgba(110, 119, 129, 0.2)';

              // h3의 첫 번째 자식 앞에 삽입
              titleH3.insertBefore(newLabel, titleH3.firstChild);
            } catch (error) {
              console.error('개별 이슈 라벨 처리 중 에러:', error);
              continue; // 개별 이슈 처리 실패 시 다음 이슈로 계속 진행
            }
          }
        } catch (error) {
          console.error('라벨 처리 중 에러 발생:', error);
          // 에러 메시지 표시
          const errorMessage = document.createElement('div');
          errorMessage.className = 'error-message';
          errorMessage.textContent = '라벨 처리 중 오류가 발생했습니다.';
          document.body.appendChild(errorMessage);
          setTimeout(() => errorMessage.remove(), 3000);
        } finally {
          // 로딩 표시 제거
          loadingLabel.remove();
        }
      }

      // 전체 이슈 URL을 5개씩 나누어 순차 처리
      async function labelAllIssues(issueUrls: Issue[]) {
        if (!issueUrls || issueUrls.length === 0) {
          console.warn('처리할 이슈가 없습니다.');
          return;
        }

        try {
          const batches = chunkArray(issueUrls, 5);
          for (const batch of batches) {
            console.log('배치 처리 시작:', batch);
            await labelIssuesBatch(batch);
          }
        } catch (error) {
          console.error('전체 이슈 처리 중 에러 발생:', error);
          // 에러 메시지 표시
          const errorMessage = document.createElement('div');
          errorMessage.className = 'error-message';
          errorMessage.textContent = '이슈 처리 중 오류가 발생했습니다.';
          document.body.appendChild(errorMessage);
          setTimeout(() => errorMessage.remove(), 3000);
        }
      }

      // 라벨링 실행
      (async () => {
        try {
          await labelAllIssues(issueUrls);
        } catch (error: unknown) {
          console.error('라벨링 실행 중 에러 발생:', error);
          // 확장 프로그램 컨텍스트 무효화 에러 처리
          if (error instanceof Error && error.message === 'Extension context invalidated.') {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = '확장 프로그램을 자동으로 새로고침합니다...';
            document.body.appendChild(errorMessage);
            
            // 1초 후 자동 새로고침
            setTimeout(() => {
              try {
                chrome.runtime.reload();
              } catch (reloadError) {
                console.error('자동 새로고침 실패:', reloadError);
                errorMessage.textContent = '확장 프로그램을 수동으로 새로고침해주세요.';
                setTimeout(() => errorMessage.remove(), 3000);
              }
            }, 1000);
            return;
          }
        }
      })();
    }
  }
});


