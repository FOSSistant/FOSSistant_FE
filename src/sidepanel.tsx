import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { UrlInfo, TrendingRepo } from './types';
import './index.css';

const SidePanel: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<UrlInfo | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [pageType, setPageType] = useState<'list' | 'detail' | null>(null);
  const [trendingRepos, setTrendingRepos] = useState<TrendingRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      // 에러 발생 시 빈 배열로 설정
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
            {pageType === 'list' ? '이슈 리스트 페이지' : '이슈 상세 페이지'}
          </div>
        </div>
      )}

      {/* 페이지 설명 */}
      {pageType && (
        <div className="page-description">
          {pageType === 'list' && (
            <div className="description-content">
              <h3>이슈 리스트 페이지</h3>
              <p>현재 보고 계신 페이지는 GitHub 이슈 목록 페이지입니다.</p>
              <ul>
                <li>모든 이슈를 한눈에 볼 수 있습니다.</li>
                <li>이슈의 상태, 라벨, 담당자 등을 확인할 수 있습니다.</li>
                <li>새로운 이슈를 생성할 수 있습니다.</li>
              </ul>
            </div>
          )}
          {pageType === 'detail' && (
            <div className="description-content">
              <h3>이슈 상세 페이지</h3>
              <p>현재 보고 계신 페이지는 특정 이슈의 상세 정보 페이지입니다.</p>
              <ul>
                <li>이슈의 제목과 내용을 확인할 수 있습니다.</li>
                <li>댓글을 작성하고 이슈를 수정할 수 있습니다.</li>
                <li>이슈의 상태를 변경할 수 있습니다.</li>
              </ul>
            </div>
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