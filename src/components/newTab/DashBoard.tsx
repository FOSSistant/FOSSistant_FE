"use client";
import React, { useEffect, useState } from 'react';
import DifficultyContent from './DifficultyContent';
import IssueDetailContent from './IssueDetailContent';
import HomeContent from './HomeContent';
import TrendyRepo from './TrendyRepo';
import { UserProfile } from '../../types';
import { getProfile, patchMyLevel, requestGitHubCode } from '../../api/githubAuth';
import { toast, Toaster } from 'react-hot-toast';


export const DashBoard = () => {
  // 1. 상태 추가
  const [selectedMenu, setSelectedMenu] = useState('홈');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const levelOptions = [
    { value: 'BEGINNER', label: 'Beginner', color: 'bg-[var(--color-success-bg)] text-[var(--color-success)]' },
    { value: 'EXPERIENCED', label: 'Experienced', color: 'bg-[var(--color-primary-bg)] text-[var(--color-primary)]' }
  ];

  const fetchProfile = async () => {
    const result = await getProfile();
    setProfile(result);
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const connectGithub = async () => {
    const result = await requestGitHubCode();
    if (result) {
      toast.success('깃허브 연동에 성공했습니다.', {
        style: { background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' },
      });
      fetchProfile();
    }
    else {
      toast.error('깃허브 연동에 실패했습니다.', {
        style: { background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' },
      });
    }
  }

  // 2. 메뉴별로 보여줄 UI 정의
  const renderContent = () => {
    switch (selectedMenu) {
      case '홈':
        return <HomeContent />;
      case '난이도':
        return <DifficultyContent />;
      case '이슈 상세':
        return <IssueDetailContent />;
      case '버튼':
        return <TrendyRepo />;
      default:
        return null;
    }
  };

  const patchLevel = async (level: 'BEGINNER' | 'EXPERIENCED') => {
    if (profile && profile.level === level) return; // 이미 같은 레벨이면 아무것도 하지 않음
    const result = await patchMyLevel(level);
    if (result) {
      setProfile({
        ...profile!,
        level: level
      });
      toast.success(`${level} 로 레벨이 변경되었습니다.`, {
        style: { background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' },
      });
    }
    else {
      toast.error('레벨 변경에 실패했습니다.', {
        style: { background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' },
      });
    }
  } 

  const menuItems = [
    { key: '홈', label: '홈' },
    { key: '난이도', label: '난이도' },
    { key: '이슈 상세', label: '이슈 상세' },
    { key: '버튼', label: '인기 레포지토리' }
  ];

  return (
    <div 
      className="min-h-screen w-screen text-white overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1f36 50%, #0f1419 100%)'
      }}
    >
      {/* 배경 장식 */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex h-full min-h-screen p-6">
        <Toaster position="top-center"/>

        {/* 좌측 사이드바 */}
        <div className="flex flex-col items-center space-y-6 mr-8 w-40 animate-fade-in-up">
          {/* 서비스 이름 */}
          <div className="w-full h-24 bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] flex flex-col items-center justify-center font-bold text-sm py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
            <span className="text-lg font-extrabold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent">FOSSistant</span>
            <span className="text-xs font-normal text-[var(--text-muted)] mt-1 text-center">오픈소스 기여 도우미</span>
          </div>

          {/* 프로필 */}
          <div className="w-full bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] flex flex-col items-center justify-center text-sm py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
            {profile ? (
              <div className="flex flex-col items-center animate-fade-in-scale">
                {/* 프로필 이미지 */}
                <div className="relative mb-3">
                  <div className="absolute inset-0 rounded-full blur-lg bg-[var(--color-primary)] opacity-30 animate-pulse"></div>
                  <img
                    src={profile.profileImage}
                    alt="github profile"
                    className="relative w-16 h-16 rounded-full border-2 border-[var(--border-secondary)] hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-[var(--color-success)] rounded-full border-2 border-[var(--bg-tertiary)] animate-pulse"></div>
                </div>
                
                {/* 사용자명 */}
                <div className="font-semibold text-[var(--text-primary)] mb-2 text-center hover:text-[var(--color-primary)] transition-colors duration-200">
                  {profile.nickname}
                </div>
                
                {/* 레벨 드롭다운 */}
                <div className="relative">
                  <div
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer select-none transition-all duration-300 micro-interaction border ${
                      profile.level === 'BEGINNER' 
                        ? 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success-border)] hover:bg-[var(--color-success-bg)]' 
                        : 'bg-[var(--color-primary-bg)] text-[var(--color-primary)] border-[var(--color-primary-border)] hover:bg-[var(--color-primary-bg)]'
                    }`}
                    onClick={() => setLevelDropdownOpen((open) => !open)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{profile.level === 'BEGINNER' ? 'Beginner' : 'Experienced'}</span>
                      <span className={`transform transition-transform duration-200 ${levelDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                    </div>
                  </div>
                  {levelDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-36 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in-scale">
                      {levelOptions.map(opt => (
                        <div
                          key={opt.value}
                          className={`px-3 py-2.5 cursor-pointer hover:bg-[var(--bg-secondary)] text-xs transition-all duration-200 ${
                            profile.level === opt.value ? 'font-bold text-[var(--color-primary)] bg-[var(--color-primary-bg)]' : 'text-[var(--text-secondary)]'
                          }`}
                          onClick={async () => {
                            setLevelDropdownOpen(false);
                            patchLevel(opt.value as 'BEGINNER' | 'EXPERIENCED');
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span>{opt.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 animate-fade-in-up">
                <div className="text-[var(--text-secondary)] font-semibold mb-2 text-xs text-center">깃허브 연동이 필요합니다</div>
                <button
                  onClick={connectGithub}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-primary)] text-[var(--text-primary)] text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-[var(--border-primary)] hover:border-[var(--border-secondary)] flex items-center gap-2 w-full justify-center hover-lift micro-interaction"
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                  <span>Github 연동</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 메인 영역 */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* 네비게이션 */}
          <div className="w-full flex justify-center px-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex space-x-2 bg-[var(--bg-primary)] rounded-2xl p-1.5 border border-[var(--border-primary)] shadow-lg">
              {menuItems.map((item, index) => (
                <button
                  key={item.key}
                  onClick={() => setSelectedMenu(item.key)}
                  className={`group flex items-center justify-center px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm micro-interaction animate-fade-in-up ${
                    selectedMenu === item.key
                      ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white shadow-lg hover:shadow-xl scale-[1.02]'
                      : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="flex items-center gap-2">
                    {item.key === '홈' && <span className={`text-lg transition-transform group-hover:scale-110 ${selectedMenu === item.key ? '' : 'opacity-60'}`}>🏠</span>}
                    {item.key === '난이도' && <span className={`text-lg transition-transform group-hover:scale-110 ${selectedMenu === item.key ? '' : 'opacity-60'}`}>📊</span>}
                    {item.key === '이슈 상세' && <span className={`text-lg transition-transform group-hover:scale-110 ${selectedMenu === item.key ? '' : 'opacity-60'}`}>📋</span>}
                    {item.key === '버튼' && <span className={`text-lg transition-transform group-hover:scale-110 ${selectedMenu === item.key ? '' : 'opacity-60'}`}>🔥</span>}
                    <span className="whitespace-nowrap">{item.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-full max-w-4xl bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] rounded-2xl p-8 overflow-y-auto text-base mx-auto border border-[var(--border-primary)] shadow-xl custom-scrollbar">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
