import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { UrlInfo, TrendingRepo, IssueInfo } from './types';
import './index.css';
import { IssueDetailInfo, IssueProps } from './components/IssueDetailInfo';
import { IssueList } from './components/IssueList';
import { TrendyRepos } from './components/TrendyRepos';
import { getIssueGuide, IssueGuide } from './api/issueApi';

const SidePanel: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<UrlInfo | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [pageType, setPageType] = useState<'list' | 'detail' | null>(null);
  const [trendingRepos, setTrendingRepos] = useState<TrendingRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [issueInfo, setIssueInfo] = useState<IssueGuide | null>(null);
  const [isGithubConnected, setIsGithubConnected] = useState<boolean>(false);
  const [issueUrl, setIssueUrl] = useState<string | null>(null);

  // URL 분석 함수
  const analyzeUrl = (url: string) => {
    // 크롬 새 탭 확인
    if (url.startsWith('chrome://newtab/') || url.startsWith('chrome-search://local-ntp/')) {
      return { 
        isGitHub: false, 
        isIssueList: false, 
        isIssueDetail: false,
        isChromeNewTab: true,
        siteType: 'chrome-newtab'
      };
    }

    // GitHub URL 확인
    const isGitHub = /^https:\/\/github\.com\//.test(url);
    
    if (!isGitHub) {
      // 일반 웹사이트
      try {
        const urlObj = new URL(url);
        return { 
          isGitHub: false, 
          isIssueList: false, 
          isIssueDetail: false,
          isChromeNewTab: false,
          siteType: 'website',
          domain: urlObj.hostname,
          protocol: urlObj.protocol
        };
      } catch {
        return { 
          isGitHub: false, 
          isIssueList: false, 
          isIssueDetail: false,
          isChromeNewTab: false,
          siteType: 'unknown'
        };
      }
    }

    // 이슈 리스트 페이지 검사
    const listMatch = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/issues(\/?(\?.*)?)?$/);
    if (listMatch) {
      return {
        isGitHub: true,
        isIssueList: true,
        isIssueDetail: false,
        isChromeNewTab: false,
        siteType: 'github-issues',
        owner: listMatch[1],
        repo: listMatch[2]
      };
    }

    // 이슈 상세 페이지 검사
    const detailMatch = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)$/);
    if (detailMatch) {
      return {
        isGitHub: true,
        isIssueList: false,
        isIssueDetail: true,
        isChromeNewTab: false,
        siteType: 'github-issue-detail',
        owner: detailMatch[1],
        repo: detailMatch[2],
        issueNumber: detailMatch[3]
      };
    }

    // 일반 GitHub 페이지
    const githubMatch = url.match(/^https:\/\/github\.com\/([^/]+)\/?([^/]+)?\/?/);
    if (githubMatch) {
      return { 
        isGitHub: true, 
        isIssueList: false, 
        isIssueDetail: false,
        isChromeNewTab: false,
        siteType: 'github-general',
        owner: githubMatch[1],
        repo: githubMatch[2] || null
      };
    }

    return { 
      isGitHub: true, 
      isIssueList: false, 
      isIssueDetail: false,
      isChromeNewTab: false,
      siteType: 'github-unknown'
    };
  };

  // URL 처리 및 페이지 타입 설정 로직을 함수로 분리
  const handleUrlUpdate = async (urlInfo: UrlInfo) => {
    console.log('Sidepanel - URL 업데이트:', urlInfo.url);
    
    setCurrentUrl(urlInfo);
    
    // URL 분석을 통한 페이지 타입 결정
    const analysis = analyzeUrl(urlInfo.url);
    
    if (analysis.isIssueList) {
      console.log('Sidepanel - 이슈 리스트 페이지 감지');
      setPageType('list');
    } else if (analysis.isIssueDetail) {
      console.log('Sidepanel - 이슈 상세 페이지 감지');
      setPageType('detail');
      await fetchDetailInfo(urlInfo.url);
    } else {
      console.log('Sidepanel - 기본 페이지 (' + analysis.siteType + ')');
      setPageType(null);
      
      // GitHub이 아닌 사이트에서는 트렌딩 레포지토리 표시
      if (!analysis.isGitHub) {
        await fetchTrendingRepos();
      }
    }
  };

  // 테마 로드 함수
  const loadTheme = () => {
    chrome.storage.sync.get(['theme'], (result) => {
      if (result.theme) {
        setTheme(result.theme);
      }
    });
  };

  useEffect(() => {
    console.log('🚀 사이드패널 초기화 시작');
    
    // 초기 데이터 로드
    const initializeData = async () => {
      // GitHub 연결 상태 확인
      console.log('🔍 GitHub 연결 상태 확인 중...');
      try {
        const result = await chrome.storage.local.get(['accessToken', 'refreshToken']);
        const hasTokens = !!(result.accessToken && result.refreshToken);
        console.log('🔑 토큰 상태:', { 
          hasAccessToken: !!result.accessToken, 
          hasRefreshToken: !!result.refreshToken,
          connected: hasTokens
        });
        setIsGithubConnected(hasTokens);
        
        // 토큰이 있으면 현재 활성 탭의 URL 정보 가져오기
        if (hasTokens) {
          console.log('📍 현재 탭 URL 정보 요청');
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.url) {
              const urlInfo = {
                url: tabs[0].url,
                title: tabs[0].title || '',
                favicon: tabs[0].favIconUrl || ''
              };
              console.log('📍 현재 탭 정보:', urlInfo);
              handleUrlUpdate(urlInfo);
            }
          });
        }
      } catch (error) {
        console.error('❌ 인증 상태 확인 실패:', error);
        setIsGithubConnected(false);
      }
    };

    initializeData();
    loadTheme();

    // 메시지 리스너 (URL 업데이트 수신)
    const messageListener = (message: any) => {
      console.log('📨 사이드패널 메시지 수신:', message.type, message);
      if (message.type === 'UPDATE_URL_INFO') {
        console.log('Sidepanel - URL 업데이트 메시지 수신:', message.data);
        handleUrlUpdate(message.data);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    
    return () => {
      console.log('🧹 사이드패널 정리');
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const fetchDetailInfo = async (url: string) => {
    setIsLoading(true);
    try {
      // URL 분석을 통한 정보 추출
      const analysis = analyzeUrl(url);
      
      if (!analysis.isIssueDetail || !analysis.owner || !analysis.repo || !analysis.issueNumber) {
        throw new Error('유효하지 않은 이슈 URL입니다.');
      }
      
      const issueId = `https://github.com/${analysis.owner}/${analysis.repo}/issues/${analysis.issueNumber}`;
      console.log('Sidepanel - 이슈 정보 요청:', issueId);
      
      const issueGuide: IssueGuide | null = await getIssueGuide({ issueId });
      setIssueUrl(issueId);
      setIssueInfo(issueGuide);
    } catch (error) {
      console.error('이슈 정보 가져오기 실패:', error);
      setIssueInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingRepos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=5');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (!data || !data.items || !Array.isArray(data.items)) {
        throw new Error('Invalid API response format');
      }

      const repos = data.items.map((repo: any) => ({
        name: repo.full_name,
        description: repo.description || 'No description available',
        stars: repo.stargazers_count,
        language: repo.language || 'Unknown',
        url: repo.html_url
      }));
      setTrendingRepos(repos);
    } catch (error) {
      console.error('트렌딩 레포지토리 가져오기 실패:', error);
      setTrendingRepos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    chrome.storage.sync.set({ theme: 'dark' });
  };

  if (!isGithubConnected) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#18181b]">
        <div className="github-auth-button flex justify-center my-8">
          <div className="bg-[#2C2C2E] border border-gray-800 rounded-xl shadow-lg px-8 py-7 flex flex-col items-center w-full max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
              <span className="text-gray-200 font-semibold text-base">서비스를 이용하시려면 <span className="text-blue-400 font-bold">깃허브 연동</span>이 필요합니다</span>
            </div>
            <button
              onClick={async () => {
                console.log('🔑 GitHub 로그인 시도 중...');
                try {
                  chrome.runtime.sendMessage({ type: 'REQUEST_GITHUB_CODE' }, async (response) => {
                    console.log('📥 GitHub 인증 응답:', response);
                    
                    if (chrome.runtime.lastError) {
                      console.error('❌ 런타임 에러:', chrome.runtime.lastError);
                      return;
                    }
                    
                    if (response) {
                      console.log('✅ GitHub 인증 성공');
                      setIsGithubConnected(true);
                      
                      // 인증 성공 후 현재 URL 정보 다시 로드
                      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs[0]?.url) {
                          const urlInfo = {
                            url: tabs[0].url,
                            title: tabs[0].title || '',
                            favicon: tabs[0].favIconUrl || ''
                          };
                          console.log('📍 인증 후 현재 탭 정보:', urlInfo);
                          handleUrlUpdate(urlInfo);
                        }
                      });
                    } else {
                      console.log('❌ GitHub 인증 실패');
                      setIsGithubConnected(false);
                    }
                  });
                } catch (error) {
                  console.error('❌ GitHub 로그인 에러:', error);
                  setIsGithubConnected(false);
                }
              }}
              className="px-5 py-2 rounded-lg bg-black text-white font-semibold shadow-md hover:bg-gray-800 transition-all duration-200 border border-gray-800 flex items-center gap-2 w-full justify-center"
            >
              <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              Github 연동
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`sidepanel-container ${theme} min-h-screen bg-[#18181b] p-2 flex flex-col gap-2`}>
      {/* 현재 페이지 정보 */}
      {currentUrl && (
        <div className="flex flex-col gap-2 mb-1 p-3 rounded-lg bg-[#232323] border border-[#444]">
          {/* 사이트 정보 */}
          <div className="flex items-center gap-2">
            {currentUrl.favicon ? (
              <img src={currentUrl.favicon} alt="" className="w-5 h-5 rounded" />
            ) : (
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            )}
            <span className="text-xs text-[#e0e0e0] truncate font-medium flex-1">{currentUrl.title}</span>
          </div>
          
          {/* 사이트 타입별 추가 정보 */}
          {(() => {
            const analysis = analyzeUrl(currentUrl.url);
            
            if (analysis.isChromeNewTab) {
              return (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#888]">📋</span>
                  <span className="text-[#4ade80]">Chrome 새 탭</span>
                </div>
              );
            } else if (analysis.isGitHub) {
              return (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#888]">🐙</span>
                  <span className="text-[#f97316]">GitHub</span>
                  {analysis.owner && (
                    <>
                      <span className="text-[#666]">·</span>
                      <span className="text-[#ccc]">{analysis.owner}</span>
                      {analysis.repo && (
                        <>
                          <span className="text-[#666]">/</span>
                          <span className="text-[#ccc]">{analysis.repo}</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            } else if (analysis.siteType === 'website' && analysis.domain) {
              return (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#888]">🌍</span>
                  <span className="text-[#60a5fa]">{analysis.domain}</span>
                  <span className="text-[#666]">·</span>
                  <span className="text-[#888]">{analysis.protocol?.replace(':', '')}</span>
                </div>
              );
            }
            
            return null;
          })()}
        </div>
      )}

      {/* 이슈 상세 정보 (GitHub 이슈 페이지에서만) */}
      {pageType === 'detail' && (
        <div className="mb-2">
          <IssueDetailInfo
            title={issueInfo?.title || ''}
            description={issueInfo?.description || ''}
            solution={issueInfo?.solution || ''}
            relatedLinks={issueInfo?.relatedLinks || issueInfo?.caution || ''}
            highlightedBody={issueInfo?.highlightedBody || ''}
            difficulty={issueInfo?.difficulty as 'easy' | 'medium' | 'hard' | 'misc' || 'misc'}
            isLoading={isLoading}
            issueUrl={issueUrl || ''}
          />
        </div>
      )}

      {/* 이슈 리스트 (GitHub 이슈 리스트 페이지에서만) */}
      {pageType === 'list' && (
        <div className="mb-2">
          <IssueList />
        </div>
      )}

      {/* 트렌딩 레포지토리 (GitHub이 아닌 사이트 또는 일반 GitHub 페이지) */}
      {!pageType && (
        <div className="mb-2">
          <TrendyRepos repos={trendingRepos} />
        </div>
      )}

      {/* GitHub이 아닌 사이트에서 추가 정보 */}
      {currentUrl && !analyzeUrl(currentUrl.url).isGitHub && (
        <div className="mt-auto p-3 rounded-lg bg-[#1a1a1a] border border-[#333]">
          <div className="text-xs text-[#888] text-center">
            💡 GitHub 페이지에서 FOSSistant의 모든 기능을 사용할 수 있습니다
          </div>
        </div>
      )}
    </div>
  );
};

// 컴포넌트 렌더링
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<SidePanel />);
} 