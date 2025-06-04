import { Issue } from '../api/issueApi';

// 배열을 지정된 크기로 나누는 함수
export function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// 페이지에서 이슈 번호들을 추출하는 함수
export function extractIssueNumbers(): string[] {
  return Array.from(
    document.querySelectorAll('span[class*="defaultNumberDescription"]'))
    .map((parentSpan) => parentSpan.querySelector('span')?.textContent?.trim())
    .filter((text): text is string => !!text)
    .map((text) => text.replace('#', ''));
}

// 이슈 번호들을 이슈 URL 객체로 변환하는 함수
export function createIssueUrls(issueNumbers: string[], owner: string, repo: string): Issue[] {
  const issueUrls: Issue[] = [];
  issueNumbers.forEach(value => {
    issueUrls.push({
      issueId: `https://github.com/${owner}/${repo}/issues/${value}`,
    });
  });
  return issueUrls;
}

// 에러 메시지를 화면에 표시하는 함수
export function showErrorMessage(message: string, duration: number = 3000): void {
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  errorMessage.textContent = message;
  document.body.appendChild(errorMessage);
  setTimeout(() => errorMessage.remove(), duration);
} 