import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { UrlInfo, TrendingRepo, IssueInfo } from './types';
import './index.css';

const SidePanel: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<UrlInfo | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [pageType, setPageType] = useState<'list' | 'detail' | null>(null);
  const [trendingRepos, setTrendingRepos] = useState<TrendingRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [issueInfo, setIssueInfo] = useState<IssueInfo | null>(null);

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
            <p className="url">{currentUrl.url}</p>
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
            <div className="issue-callout">
              <div className="issue-title">{issueInfo.title}</div>
              <div className="issue-solution">
                <ul>
                  <li>이슈의 주요 문제점을 명확히 파악하고 우선순위를 정합니다.</li>
                  <li>관련된 코드나 문서를 검토하여 문제의 원인을 파악합니다.</li>
                  <li>필요한 경우 테스트 케이스를 작성하여 문제를 재현합니다.</li>
                  <li>해결 방안을 구현하고 테스트를 진행합니다.</li>
                  <li>변경사항을 문서화하고 PR을 생성합니다.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="error">이슈 정보를 불러올 수 없습니다.</div>
          )}
        </div>
      )}

      {/* 트렌딩 레포지토리 */}
      {!pageType && (
        <div className="trending-repos">
          <h3>🔥 트렌딩 레포지토리</h3>
          {isLoading ? (
            <div className="loading">로딩 중...</div>
          ) : (
            <div className="repos-list">
              {trendingRepos.map((repo, index) => (
                <a key={index} href={repo.url} className="repo-item" target="_blank" rel="noopener noreferrer">
                  <div className="repo-header">
                    <h4>{repo.name}</h4>
                    <span className="stars">⭐ {repo.stars.toLocaleString()}</span>
                  </div>
                  <p className="description">{repo.description}</p>
                  <div className="repo-footer">
                    <span className="language">{repo.language}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
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