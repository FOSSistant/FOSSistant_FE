import { getIssueLabels, Issue, IssueLabel } from '../api/issueApi';
import { getProfile } from '../api/githubAuth';
import { showErrorMessage } from './utils';

// 라벨링 진행 상태 추적
const labelingStates = new Set<string>();

// 사용자 수준 확인 함수
async function getUserLevel(): Promise<'BEGINNER' | 'EXPERIENCED' | null> {
  try {
    const profile = await getProfile();
    return profile.level;
  } catch (error) {
    console.log('사용자 프로필을 가져올 수 없음:', error);
    return null;
  }
}

// 난이도가 사용자 수준보다 낮은지 확인하는 함수
function shouldAddHighlight(userLevel: 'BEGINNER' | 'EXPERIENCED' | null, issueDifficulty: string): boolean {
  if (!userLevel) return false;
  
  // BEGINNER 사용자: easy 난이도만 하이라이트
  if (userLevel === 'BEGINNER') {
    return issueDifficulty === 'easy';
  }
  
  // EXPERIENCED 사용자: easy, medium 난이도 하이라이트
  if (userLevel === 'EXPERIENCED') {
    return issueDifficulty === 'easy' || issueDifficulty === 'medium';
  }
  
  return false;
}

// 로딩 라벨을 생성하는 함수
function createLoadingLabel(): HTMLSpanElement {
  const loadingLabel = document.createElement('span');
  loadingLabel.className = 'Label custom-label custom-label-style loading-label';
  loadingLabel.innerHTML = `
    <div class="loading-spinner"></div>
    <span>Loading ...</span>
  `;
  loadingLabel.style.backgroundColor = 'rgba(110, 119, 129, 0.1)';
  loadingLabel.style.color = '#6e7781';
  loadingLabel.style.borderColor = 'rgba(110, 119, 129, 0.2)';
  return loadingLabel;
}

// 난이도 라벨을 생성하는 함수
function createDifficultyLabel(tier: string, shouldHighlight: boolean = false): HTMLSpanElement {
  const newLabel = document.createElement('span');
  newLabel.className = 'Label custom-label custom-label-style';
  
  const icon = tier === 'easy' ? '🧩' : 
              tier === 'medium' ? '⚙️' :
              tier === 'hard' ? '🔥' :
              tier === 'misc' ? '📌' :
              tier === 'unknown' ? '❓' : '❓';
              
  newLabel.innerHTML = `
    <span class="tier-icon">${icon}</span>
    <span class="tier-text">${tier}</span>
  `;
  
  newLabel.style.backgroundColor = tier === 'easy' ? 'rgba(67, 160, 71, 0.1)' : 
                                 tier === 'medium' ? 'rgba(255, 152, 0, 0.1)' :
                                 tier === 'hard' ? 'rgba(229, 57, 53, 0.1)' :
                                 tier === 'misc' ? 'rgba(110, 119, 129, 0.1)' :
                                 tier === 'unknown' ? 'rgba(110, 119, 129, 0.1)' : 'rgba(110, 119, 129, 0.1)';
  newLabel.style.color = tier === 'easy' ? '#43a047' : 
                        tier === 'medium' ? '#f57c00' :
                        tier === 'hard' ? '#e53935' :
                        tier === 'misc' ? '#6e7781' :
                        tier === 'unknown' ? '#6e7781' : '#6e7781';
  newLabel.style.borderColor = tier === 'easy' ? 'rgba(67, 160, 71, 0.2)' : 
                              tier === 'medium' ? 'rgba(255, 152, 0, 0.2)' :
                              tier === 'hard' ? 'rgba(229, 57, 53, 0.2)' :
                              tier === 'misc' ? 'rgba(110, 119, 129, 0.2)' :
                              tier === 'unknown' ? 'rgba(110, 119, 129, 0.2)' : 'rgba(110, 119, 129, 0.2)';
  
  // 하이라이트 효과 추가
  if (shouldHighlight) {
    newLabel.style.boxShadow = '0 0 8px rgba(255, 193, 7, 0.6)';
    newLabel.style.border = '2px solid #ffc107';
    newLabel.style.animation = 'recommend-pulse 2s ease-in-out infinite';
    newLabel.title = '추천: 당신의 수준에 적합한 이슈입니다!';
  }
  
  return newLabel;
}

// 이슈 번호로 DOM 요소를 찾는 함수 (개선된 버전)
function findIssueElement(issueNumber: string): Element | null {
  console.log(`🔍 이슈 #${issueNumber} DOM 요소 검색 중...`);
  
  // 여러 가지 방법으로 이슈 요소 찾기
  const selectors = [
    // GitHub 이슈 제목 링크
    `a[href*="/issues/${issueNumber}"]`,
    // 이슈 번호가 포함된 링크
    `a[href$="/issues/${issueNumber}"]`,
    // 이슈 제목 클래스 기반
    'a[class*="IssuePullRequestTitle"]'
  ];
  
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      const href = element.getAttribute('href');
      if (href && href.match(new RegExp(`/issues/${issueNumber}$`))) {
        console.log(`✅ 이슈 #${issueNumber} 요소 찾음 (${selector})`);
        return element;
      }
    }
  }
  
  console.log(`❌ 이슈 #${issueNumber} 요소를 찾을 수 없음`);
  return null;
}

// 특정 이슈에 대한 기존 라벨 제거
function clearIssueLabels(issueNumber: string): void {
  const titleElement = findIssueElement(issueNumber);
  if (titleElement) {
    const existingLabels = titleElement.querySelectorAll('.custom-label');
    existingLabels.forEach(label => label.remove());
    console.log(`🧹 이슈 #${issueNumber} 기존 라벨 ${existingLabels.length}개 제거`);
  }
}

// 난이도 라벨을 이슈 제목 앞에 삽입하는 함수
export async function labelIssuesBatch(issueUrls: Issue[]): Promise<void> {
  console.log(`📦 배치 라벨링 시작: ${issueUrls.length}개 이슈`);
  
  if (!issueUrls || issueUrls.length === 0) {
    console.log('⚠️ 라벨링할 이슈가 없음');
    return;
  }

  // 중복 처리 방지
  const batchId = Date.now().toString();
  const processedIssues = new Set<string>();

  try {
    // 1. 먼저 모든 이슈에 로딩 라벨 추가
    console.log('⏳ 로딩 라벨 추가 중...');
    for (const issueUrl of issueUrls) {
      const match = issueUrl.issueId.match(/\/issues\/(\d+)/);
      if (!match) {
        console.log('❌ 잘못된 이슈 URL:', issueUrl.issueId);
        continue;
      }
      
      const issueNumber = match[1];
      
      // 중복 처리 방지
      if (processedIssues.has(issueNumber) || labelingStates.has(issueNumber)) {
        console.log(`🚫 이슈 #${issueNumber} 이미 처리 중, 건너뜀`);
        continue;
      }
      
      processedIssues.add(issueNumber);
      labelingStates.add(issueNumber);
      
      // 기존 라벨 제거
      clearIssueLabels(issueNumber);
      
      const titleElement = findIssueElement(issueNumber);
      if (!titleElement) {
        console.log(`⚠️ 이슈 #${issueNumber} 제목 요소를 찾을 수 없음`);
        labelingStates.delete(issueNumber);
        continue;
      }

      // 로딩 라벨 생성 및 추가
      const loadingLabel = createLoadingLabel();
      titleElement.insertBefore(loadingLabel, titleElement.firstChild);
      console.log(`⏳ 이슈 #${issueNumber} 로딩 라벨 추가`);
    }

    // 2. 실제 라벨 정보 가져오기
    console.log('📡 서버에서 라벨 정보 요청 중...');
    const issueLabels: IssueLabel[] = await getIssueLabels(issueUrls);
    
    if (!issueLabels || !Array.isArray(issueLabels)) {
      throw new Error('서버에서 라벨 정보를 가져올 수 없습니다.');
    }

    console.log(`📋 서버 응답: ${issueLabels.length}개 라벨 정보 수신`);

    // 3. 로딩 라벨을 실제 라벨로 교체
    for (const issueLabel of issueLabels) {
      try {
        if (!issueLabel || !issueLabel.issueId) {
          console.log('⚠️ 유효하지 않은 라벨 정보:', issueLabel);
          continue;
        }

        const match = issueLabel.issueId.match(/\/issues\/(\d+)/);
        if (!match) {
          console.log('❌ 잘못된 이슈 URL:', issueLabel.issueId);
          continue;
        }

        const issueNumber = match[1];
        const titleElement = findIssueElement(issueNumber);

        if (!titleElement) {
          console.log(`⚠️ 이슈 #${issueNumber} 제목 요소를 찾을 수 없음 (라벨 교체 시)`);
          continue;
        }

        // 로딩 라벨 제거
        const loadingLabel = titleElement.querySelector('.loading-label');
        if (loadingLabel) {
          loadingLabel.remove();
          console.log(`🗑️ 이슈 #${issueNumber} 로딩 라벨 제거`);
        }

        // 실제 라벨 생성 및 추가
        const tier = issueLabel.difficulty;
        if (!tier) {
          console.log(`⚠️ 이슈 #${issueNumber} 난이도 정보 없음`);
          continue;
        }

        const userLevel = await getUserLevel();
        const shouldHighlight = shouldAddHighlight(userLevel, tier);
        const difficultyLabel = createDifficultyLabel(tier, shouldHighlight);
        titleElement.insertBefore(difficultyLabel, titleElement.firstChild);
        console.log(`✅ 이슈 #${issueNumber} 라벨 교체 완료: ${tier}`);
        
      } catch (error) {
        console.error('❌ 개별 이슈 라벨 처리 중 에러:', error);
        continue;
      }
    }
    
    console.log('✅ 배치 라벨링 완료');
    
  } catch (error) {
    console.error('❌ 배치 라벨링 중 에러 발생:', error);
    
    // 에러 발생 시 모든 로딩 라벨 제거
    document.querySelectorAll('.loading-label').forEach(label => label.remove());
    
    showErrorMessage('라벨 처리 중 오류가 발생했습니다.');
  } finally {
    // 처리 상태 정리
    for (const issueNumber of processedIssues) {
      labelingStates.delete(issueNumber);
    }
    console.log('🧹 라벨링 상태 정리 완료');
  }
}

// 전체 이슈 URL을 한 번에 처리하는 함수 (배치 처리 제거)
export async function labelAllIssues(issueUrls: Issue[]): Promise<void> {
  if (!issueUrls || issueUrls.length === 0) {
    console.log('⚠️ 처리할 이슈가 없습니다.');
    return;
  }

  console.log(`🎯 전체 라벨링 시작: ${issueUrls.length}개 이슈 (한 번에 모든 요청)`);

  try {
    // 중복 제거
    const uniqueIssues = issueUrls.filter((issue, index, array) => 
      array.findIndex(i => i.issueId === issue.issueId) === index
    );
    
    if (uniqueIssues.length !== issueUrls.length) {
      console.log(`🔄 중복 이슈 제거: ${issueUrls.length} → ${uniqueIssues.length}`);
    }
    
    console.log(`📦 한 번에 ${uniqueIssues.length}개 이슈 처리`);
    
    // 배치 처리 없이 모든 이슈를 한 번에 처리
    await labelIssuesBatch(uniqueIssues);
    
    console.log('🎉 전체 라벨링 완료');
  } catch (error) {
    console.error('❌ 전체 이슈 처리 중 에러 발생:', error);
    showErrorMessage('이슈 처리 중 오류가 발생했습니다.');
  }
} 