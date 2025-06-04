import { UrlInfo } from '../types';

export class UrlManager {
  private static instance: UrlManager;
  private currentUrl: UrlInfo | null = null;
  private subscribers: ((urlInfo: UrlInfo | null) => void)[] = [];
  private lastProcessedUrl: string = '';

  private constructor() {
    console.log('🏗️ UrlManager 생성자 호출');
  }

  static getInstance(): UrlManager {
    if (!UrlManager.instance) {
      console.log('🆕 UrlManager 새 인스턴스 생성');
      UrlManager.instance = new UrlManager();
    } else {
      console.log('♻️ UrlManager 기존 인스턴스 반환');
    }
    return UrlManager.instance;
  }

  // URL 변화 감지 및 브로드캐스트
  async updateUrl(url: string, title?: string, favicon?: string): Promise<void> {
    console.log('🔄 UrlManager.updateUrl 호출:', { url, title, favicon });
    
    // 중복 처리 방지
    if (this.lastProcessedUrl === url) {
      console.log('🚫 중복 URL 처리 방지:', url);
      return;
    }

    console.log('✅ 새로운 URL 처리 시작:', url);
    this.lastProcessedUrl = url;

    const urlInfo: UrlInfo = {
      url,
      title: title || '',
      favicon: favicon || ''
    };

    this.currentUrl = urlInfo;
    console.log('📝 현재 URL 정보 업데이트됨:', urlInfo);

    // 로컬 스토리지에 저장
    try {
      console.log('💾 로컬 스토리지에 저장 시작...');
      await chrome.storage.local.set({ currentUrlInfo: urlInfo });
      console.log('✅ 로컬 스토리지 저장 완료');
    } catch (error) {
      console.error('❌ URL 정보 저장 실패:', error);
    }

    // 모든 구독자에게 브로드캐스트
    console.log('📡 구독자들에게 브로드캐스트 시작, 구독자 수:', this.subscribers.length);
    this.notifySubscribers(urlInfo);
  }

  // URL 정보 구독
  subscribe(callback: (urlInfo: UrlInfo | null) => void): () => void {
    console.log('🔗 새 구독자 추가, 현재 구독자 수:', this.subscribers.length);
    this.subscribers.push(callback);
    
    // 현재 URL 정보 즉시 전달
    if (this.currentUrl) {
      console.log('📤 구독자에게 현재 URL 즉시 전달:', this.currentUrl.url);
      callback(this.currentUrl);
    } else {
      console.log('⚠️ 전달할 현재 URL이 없음');
    }

    // 구독 해제 함수 반환
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index !== -1) {
        this.subscribers.splice(index, 1);
        console.log('🔌 구독자 해제, 남은 구독자 수:', this.subscribers.length);
      }
    };
  }

  // 현재 URL 정보 반환
  getCurrentUrl(): UrlInfo | null {
    console.log('📍 현재 URL 정보 요청, 반환값:', this.currentUrl);
    return this.currentUrl;
  }

  // 저장된 URL 정보 로드
  async loadStoredUrl(): Promise<UrlInfo | null> {
    console.log('📂 저장된 URL 정보 로드 시작...');
    try {
      const result = await chrome.storage.local.get(['currentUrlInfo']);
      if (result.currentUrlInfo) {
        this.currentUrl = result.currentUrlInfo;
        this.lastProcessedUrl = result.currentUrlInfo.url;
        console.log('✅ 저장된 URL 로드 성공:', result.currentUrlInfo.url);
        return result.currentUrlInfo;
      } else {
        console.log('⚠️ 저장된 URL 정보가 없음');
      }
    } catch (error) {
      console.error('❌ URL 정보 로드 실패:', error);
    }
    return null;
  }

  // 모든 구독자에게 알림
  private notifySubscribers(urlInfo: UrlInfo | null): void {
    console.log('📢 구독자들에게 알림 전송, 대상:', this.subscribers.length);
    this.subscribers.forEach((callback, index) => {
      try {
        console.log(`📤 구독자 ${index + 1}에게 알림 전송`);
        callback(urlInfo);
        console.log(`✅ 구독자 ${index + 1} 알림 성공`);
      } catch (error) {
        console.error(`❌ 구독자 ${index + 1} 알림 실패:`, error);
      }
    });
    console.log('📢 모든 구독자 알림 완료');
  }

  // URL이 GitHub 관련인지 확인
  static isGitHubUrl(url: string): boolean {
    const isGitHub = /^https:\/\/github\.com\//.test(url);
    console.log('🔍 GitHub URL 확인:', { url, isGitHub });
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
    console.log('🔍 URL 분석 시작:', url);
    
    const isGitHub = this.isGitHubUrl(url);
    
    if (!isGitHub) {
      console.log('❌ GitHub URL이 아님');
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
      console.log('✅ 이슈 리스트 페이지 감지:', result);
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
      console.log('✅ 이슈 상세 페이지 감지:', result);
      return result;
    }

    console.log('⚠️ 일반 GitHub 페이지');
    return { isGitHub: true, isIssueList: false, isIssueDetail: false };
  }
} 