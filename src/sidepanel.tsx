import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { UrlInfo, TrendingRepo, DifficultyType } from './types';
import './index.css';
import { IssueDetailInfo } from './components/IssueDetailInfo';
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

  // API 호출 관리를 위한 상태 추가
  const [fetchingUrls, setFetchingUrls] = useState<Set<string>>(new Set());
  const [issueCache, setIssueCache] = useState<Map<string, IssueGuide | null>>(new Map());
  const [trendingReposCache, setTrendingReposCache] = useState<TrendingRepo[] | null>(null);
  const [isFetchingTrending, setIsFetchingTrending] = useState(false);

  // 디바운스 관리를 위한 상태 추가
  const [currentRequest, setCurrentRequest] = useState<AbortController | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

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
    // 이전 요청이 있다면 취소
    if (currentRequest) {
      currentRequest.abort();
    }
    
    // 이전 디바운스 타이머가 있다면 취소
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // 새로운 AbortController 생성
    const abortController = new AbortController();
    setCurrentRequest(abortController);

    // 상태 업데이트는 즉시 수행
    setCurrentUrl(urlInfo);
    
    // URL 분석을 통한 페이지 타입 결정
    const analysis = analyzeUrl(urlInfo.url);
    
    if (analysis.isIssueList) {
      setPageType('list');
    } else if (analysis.isIssueDetail) {
      setPageType('detail');
      
      // API 호출을 디바운스
      const timer = setTimeout(async () => {
        try {
          await fetchDetailInfo(urlInfo.url, abortController.signal);
        } catch (error: unknown) {
          if (error instanceof Error && error.name === 'AbortError') {
            return; // 요청이 취소된 경우 무시
          }
          throw error;
        }
      }, 300); // 300ms 디바운스
      
      setDebounceTimer(timer);
    } else {
      setPageType(null);
      
      // API 호출을 디바운스
      const timer = setTimeout(async () => {
        try {
          await fetchTrendingRepos(abortController.signal);
        } catch (error: unknown) {
          if (error instanceof Error && error.name === 'AbortError') {
            return; // 요청이 취소된 경우 무시
          }
          throw error;
        }
      }, 300); // 300ms 디바운스
      
      setDebounceTimer(timer);
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
    
    // 초기 데이터 로드
    const initializeData = async () => {
      // GitHub 연결 상태 확인
      try {
        const result = await chrome.storage.local.get(['accessToken', 'refreshToken', 'currentUrlInfo']);
        const hasTokens = !!(result.accessToken && result.refreshToken);
        setIsGithubConnected(hasTokens);
        
        // 저장된 URL 정보가 있으면 먼저 사용
        if (result.currentUrlInfo) {
          await handleUrlUpdate(result.currentUrlInfo);
        }
        
        // 토큰이 있으면 현재 활성 탭의 URL 정보도 가져와서 최신 상태로 업데이트
        if (hasTokens) {
          chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (tabs[0]?.url) {
              const urlInfo = {
                url: tabs[0].url,
                title: tabs[0].title || '',
                favicon: tabs[0].favIconUrl || ''
              };
              
              // 저장된 URL과 다른 경우에만 업데이트
              if (!result.currentUrlInfo || result.currentUrlInfo.url !== urlInfo.url) {
                await handleUrlUpdate(urlInfo);
              } else {
              }
            }
          });
        }
      } catch (error) {
        setIsGithubConnected(false);
      }
    };

    initializeData();
    loadTheme();

    
    // 주기적으로 현재 활성 탭 정보 확인 (폴백 메커니즘)
    const tabCheckInterval = setInterval(() => {
      if (isGithubConnected) {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
          if (tabs[0]?.url && tabs[0].url !== currentUrl?.url) {
            const urlInfo = {
              url: tabs[0].url,
              title: tabs[0].title || '',
              favicon: tabs[0].favIconUrl || ''
            };
            await handleUrlUpdate(urlInfo);
          }
        });
      }
    }, 2000); // 3초마다 체크
    
    // 탭 활성화 감지 (사용자가 다른 탭으로 이동했다가 돌아올 때)
    const handleFocus = async () => {
      if (isGithubConnected) {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
          if (tabs[0]?.url) {
            const urlInfo = {
              url: tabs[0].url,
              title: tabs[0].title || '',
              favicon: tabs[0].favIconUrl || ''
            };
            
            if (urlInfo.url !== currentUrl?.url) {
              await handleUrlUpdate(urlInfo);
            }
          }
        });
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(tabCheckInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isGithubConnected, currentUrl?.url]); // dependency에 추가

  const fetchDetailInfo = async (url: string, signal?: AbortSignal) => {
    if (fetchingUrls.has(url)) return; // 이미 가져오는 중이면 중복 요청 방지
    
    try {
      setFetchingUrls(prev => new Set(prev).add(url));
      setIsLoading(true);
      setIssueUrl(url);

      const cachedIssue = issueCache.get(url);
      if (cachedIssue) {
        setIssueInfo(cachedIssue);
        return;
      }

      const response = await getIssueGuide({ issueId: url });
      setIssueInfo(response);
      setIssueCache(prev => new Map(prev).set(url, response));
      
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // 요청이 취소된 경우 무시
      }
      setIssueInfo(null);
    } finally {
      setIsLoading(false);
      setFetchingUrls(prev => {
        const newSet = new Set(prev);
        newSet.delete(url);
        return newSet;
      });
    }
  };

  const fetchTrendingRepos = async (signal?: AbortSignal) => {
    if (isFetchingTrending) return;
    
    try {
      setIsFetchingTrending(true);
      
      if (trendingReposCache) {
        setTrendingRepos(trendingReposCache);
        return;
      }

      const response = await fetch('YOUR_API_ENDPOINT', { signal });
      const data = await response.json();
      
      setTrendingRepos(data);
      setTrendingReposCache(data);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // 요청이 취소된 경우 무시
      }
      setTrendingRepos([]);
    } finally {
      setIsFetchingTrending(false);
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
                try {
                  chrome.runtime.sendMessage({ type: 'REQUEST_GITHUB_CODE' }, async (response) => {
                    
                    if (chrome.runtime.lastError) {
                      return;
                    }
                    
                    if (response) {
                      setIsGithubConnected(true);
                      
                      // 인증 성공 후 저장된 URL 정보 먼저 확인
                      try {
                        const storedData = await chrome.storage.local.get(['currentUrlInfo']);
                        if (storedData.currentUrlInfo) {
                          await handleUrlUpdate(storedData.currentUrlInfo);
                        } else {
                          // 저장된 정보가 없으면 현재 탭 정보 사용
                          chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                            if (tabs[0]?.url) {
                              const urlInfo = {
                                url: tabs[0].url,
                                title: tabs[0].title || '',
                                favicon: tabs[0].favIconUrl || ''
                              };
                              await handleUrlUpdate(urlInfo);
                            }
                          });
                        }
                      } catch (error) {
                      }
                    } else {
                      setIsGithubConnected(false);
                    }
                  });
                } catch (error) {
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
            difficulty={issueInfo?.difficulty as DifficultyType || 'unknown'}
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