import { UrlInfo } from '../types';

export class UrlManager {
  private static instance: UrlManager;
  private currentUrl: UrlInfo | null = null;
  private subscribers: ((urlInfo: UrlInfo | null) => void)[] = [];
  private lastProcessedUrl: string = '';

  private constructor() {
  }

  static getInstance(): UrlManager {
    if (!UrlManager.instance) {
      UrlManager.instance = new UrlManager();
    }
    return UrlManager.instance;
  }

  // URL 변화 감지 및 브로드캐스트
  async updateUrl(url: string, title?: string, favicon?: string): Promise<void> {
    
    // 중복 처리 방지
    if (this.lastProcessedUrl === url) {
      return;
    }

    this.lastProcessedUrl = url;

    const urlInfo: UrlInfo = {
      url,
      title: title || '',
      favicon: favicon || ''
    };

    this.currentUrl = urlInfo;

    // 로컬 스토리지에 저장
    try {
      await chrome.storage.local.set({ currentUrlInfo: urlInfo });
    } catch (error) {
    }

    // 모든 구독자에게 브로드캐스트
    this.notifySubscribers(urlInfo);
  }

  // URL 정보 구독
  subscribe(callback: (urlInfo: UrlInfo | null) => void): () => void {
    this.subscribers.push(callback);
    
    // 현재 URL 정보 즉시 전달
    if (this.currentUrl) {
      callback(this.currentUrl);
    } else {
    }

    // 구독 해제 함수 반환
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index !== -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // 현재 URL 정보 반환
  getCurrentUrl(): UrlInfo | null {
    return this.currentUrl;
  }

  // 저장된 URL 정보 로드
  async loadStoredUrl(): Promise<UrlInfo | null> {
    try {
      const result = await chrome.storage.local.get(['currentUrlInfo']);
      if (result.currentUrlInfo) {
        this.currentUrl = result.currentUrlInfo;
        this.lastProcessedUrl = result.currentUrlInfo.url;
        return result.currentUrlInfo;
      } else {
      }
    } catch (error) {
    }
    return null;
  }

  // 모든 구독자에게 알림
  private notifySubscribers(urlInfo: UrlInfo | null): void {
    this.subscribers.forEach((callback, index) => {
      try {
        callback(urlInfo);
      } catch (error) {
      }
    });
  }

  // URL이 GitHub 관련인지 확인
  static isGitHubUrl(url: string): boolean {
    const isGitHub = /^https:\/\/github\.com\//.test(url);
    return isGitHub;
  }

  // URL 타입 분석
  static analyzeUrl(url: string): {
    isGitHub: boolean;
    isIssueList: boolean;
    isIssueDetail: boolean;
    owner?: string;
    repo?: string;
    issueNumber?: string;
  } {
    
    const isGitHub = this.isGitHubUrl(url);
    
    if (!isGitHub) {
      return { isGitHub: false, isIssueList: false, isIssueDetail: false };
    }

    // 이슈 리스트 페이지 검사
    const listMatch = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/issues(\/?(\?.*)?)?$/);
    if (listMatch) {
      const result = {
        isGitHub: true,
        isIssueList: true,
        isIssueDetail: false,
        owner: listMatch[1],
        repo: listMatch[2]
      };
      return result;
    }

    // 이슈 상세 페이지 검사
    const detailMatch = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)$/);
    if (detailMatch) {
      const result = {
        isGitHub: true,
        isIssueList: false,
        isIssueDetail: true,
        owner: detailMatch[1],
        repo: detailMatch[2],
        issueNumber: detailMatch[3]
      };
      return result;
    }

    return { isGitHub: true, isIssueList: false, isIssueDetail: false };
  }
} 