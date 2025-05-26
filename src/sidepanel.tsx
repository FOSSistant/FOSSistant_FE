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

  const dummyIssueInfo: IssueProps = {
    tags: ['이슈', '해결', '방법'],
    title: '이슈 제목',
    description: '이슈 설명',
    solution: '이슈 해결 방법',
    cautions: '이슈 주의 사항',
    difficulty: 'easy',
  };
  
  // URL 처리 및 페이지 타입 설정 로직을 함수로 분리
  const handleUrlUpdate = async (url: string) => {
    if (url.endsWith('/issues')) {
      setPageType('list');
    } else if (/\/issues\/\d+$/.test(url)) {
      setPageType('detail');
      await fetchDetailInfo(url);
    } else {
      setPageType(null);
      await fetchTrendingRepos();
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
    chrome.storage.local.get(['currentUrlInfo'], (result) => {
      if (result.currentUrlInfo) {
        setCurrentUrl(result.currentUrlInfo);
        handleUrlUpdate(result.currentUrlInfo.url);
      }
    });

    chrome.storage.local.get(['accessToken', 'refreshToken'], (result) => {
      if (result.accessToken && result.refreshToken) {
        setIsGithubConnected(true);
      } else {
        setIsGithubConnected(false);
      }
    });

    
    // 테마 로드
    loadTheme();

    // 메시지 리스너
    const messageListener = (message: any) => {
      if (message.type === 'UPDATE_URL_INFO') {
        setCurrentUrl(message.data);
        handleUrlUpdate(message.data.url);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const fetchDetailInfo = async (url: string) => {
    setIsLoading(true);
    try {
      // URL에서 owner, repo, issue_number 추출
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/);
      console.log(match);
      if (!match) {
        throw new Error('Invalid issue URL');
      }
      
      const [, owner, repo, issueNumber] = match;
      console.log(owner, repo, issueNumber);
      const issueGuide: IssueGuide | null = await getIssueGuide({
        issueId: `https://github.com/${owner}/${repo}/issues/${issueNumber}`
      });
      setIssueInfo(issueGuide);
    } catch (error) {
      console.error('Error fetching issue info:', error);
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
      console.error('Error fetching trending repos:', error);
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
    <div className="github-auth-button flex justify-center my-4">
    <button
    onClick={() => {
      chrome.runtime.sendMessage({ type: 'REQUEST_GITHUB_CODE' });
      console.log('GitHub code requested');
    }}
    className="px-5 py-2 rounded-lg bg-black text-white font-semibold shadow-md hover:bg-gray-900 transition-all duration-200 border border-gray-800 flex items-center gap-2"
  >
    <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
    </svg>
      Github 인증
    </button>
    </div>
  );
  }
  
  return (
    <div className={`sidepanel-container ${theme}`}>

      {/* 현재 페이지 정보 */}
      <div className="current-page">
        {currentUrl && (
          <>
            <img src={currentUrl.favicon} alt="" className="favicon" />
            <h2>{currentUrl.title}</h2>
          </>
        )}
      </div>

      {/* 페이지 타입 정보 */}
      {pageType && (
        <div className="page-type-info">
          <div className={`page-type-badge ${pageType}`}>
            {pageType === 'list' ? '이슈 리스트 페이지' : '이슈 해결 가이드라인'}
          </div>
        </div>
      )}

      {/* 이슈 상세 정보 */}
      {pageType === 'detail' && (
        <div className="issue-detail">
          <IssueDetailInfo
            tags={dummyIssueInfo.tags}
            title={issueInfo?.title || ''}
            description={issueInfo?.description || ''}
            solution={issueInfo?.solution || ''}
            cautions={issueInfo?.caution || ''}
            difficulty={issueInfo?.difficulty as 'easy' | 'medium' | 'hard' | 'misc' || 'misc'}
            isLoading={isLoading}
          />
        </div>
      )}

      {pageType === 'list' && (
        <IssueList />
      )}

      {/* 트렌딩 레포지토리 */}
      {!pageType && (
        <TrendyRepos repos={trendingRepos} />
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