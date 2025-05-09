import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { UrlInfo, TrendingRepo, IssueInfo } from './types';
import './index.css';
import { IssueDetailInfo, IssueProps } from './components/IssueDetailInfo';
import { IssueList } from './components/IssueList';
import { TrendyRepos } from './components/TrendyRepos';

const SidePanel: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<UrlInfo | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [pageType, setPageType] = useState<'list' | 'detail' | null>(null);
  const [trendingRepos, setTrendingRepos] = useState<TrendingRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [issueInfo, setIssueInfo] = useState<IssueInfo | null>(null);

  const dummyIssueInfo: IssueProps = {
    tags: ['이슈', '해결', '방법'],
    title: '이슈 제목',
    description: '이슈 설명',
    solution: '이슈 해결 방법',
    cautions: '이슈 주의 사항',
    difficulty: '상',
  };
  
  useEffect(() => {
    // 현재 URL 정보 로드
    chrome.storage.local.get(['currentUrlInfo'], (result) => {
      if (result.currentUrlInfo) {
        setCurrentUrl(result.currentUrlInfo);
        // URL을 기반으로 페이지 타입 결정
        const url = result.currentUrlInfo.url;
        if (url.endsWith('/issues')) {
          setPageType('list');
        } else if (/\/issues\/\d+$/.test(url)) {
          setPageType('detail');
          fetchIssueInfo(url);
        } else {
          setPageType(null);
          fetchTrendingRepos();
        }
      }
    });

    // 테마 로드
    chrome.storage.sync.get(['theme'], (result) => {
      if (result.theme) {
        setTheme(result.theme);
      }
    });

    // 메시지 리스너
    const messageListener = (message: any) => {
      if (message.type === 'UPDATE_URL_INFO') {
        setCurrentUrl(message.data);
        // URL을 기반으로 페이지 타입 결정
        const url = message.data.url;
        if (url.endsWith('/issues')) {
          setPageType('list');
        } else if (/\/issues\/\d+$/.test(url)) {
          setPageType('detail');
          fetchIssueInfo(url);
        } else {
          setPageType(null);
          fetchTrendingRepos();
        }
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const fetchIssueInfo = async (url: string) => {
    setIsLoading(true);
    try {
      // URL에서 owner, repo, issue_number 추출
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/);
      if (!match) {
        throw new Error('Invalid issue URL');
      }
      
      const [, owner, repo, issueNumber] = match;
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setIssueInfo(data);
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
    chrome.storage.sync.set({ theme: newTheme });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`sidepanel-container ${theme}`}>
      {/* 테마 토글 버튼 */}
      <button className="theme-toggle-button" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

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
          {isLoading ? (
            <div className="loading">로딩 중...</div>
          ) : issueInfo ? (
                <IssueDetailInfo
                  tags={dummyIssueInfo.tags}
                  title={dummyIssueInfo.title}
                  description={dummyIssueInfo.description}
                  solution={dummyIssueInfo.solution}
                  cautions={dummyIssueInfo.cautions}
                  difficulty={dummyIssueInfo.difficulty}
                />
          ) : (
            <div className="error">이슈 정보를 불러올 수 없습니다.</div>
          )}
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