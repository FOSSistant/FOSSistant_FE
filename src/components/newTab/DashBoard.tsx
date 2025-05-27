"use client";
import React, { useEffect, useState } from 'react';
import DifficultyContent from './DifficultyContent';
import IssueDetailContent from './IssueDetailContent';
import HomeContent from './HomeContent';
import TrendyRepo from './TrendyRepo';
import { UserProfile } from '../../types';
import { getProfile, requestGitHubCode } from '../../api/githubAuth';
import { toast, Toaster } from 'react-hot-toast';


export const DashBoard = () => {
  // 1. 상태 추가
  const [selectedMenu, setSelectedMenu] = useState('홈');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const levelOptions = [
    { value: 'BEGINNER', label: 'Beginner' },
    { value: 'EXPERIENCED', label: 'Experienced' }
  ];

  const fetchProfile = async () => {
    const result = await getProfile();
    setProfile(result);
  }

  useEffect(() => {
    fetchProfile();
  }, []);


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

  return (
    <div className="flex h-screen w-screen bg-[#1C1C1E] text-white p-6">
          <Toaster position="top-center"/>

      {/* 좌측 사이드바 */}
      <div className="flex flex-col items-center space-y-6 mr-8 w-36">
        {/* 서비스 이름 */}
        <div className="w-full h-20 bg-[#2C2C2E] rounded-md flex flex-col items-center justify-center font-bold text-sm py-2">
          <span className="text-lg font-extrabold">Fossistant</span>
          <span className="text-xs font-normal text-gray-400 mt-1">오픈소스 기여 도우미</span>
        </div>

        {/* 프로필 */}
        <div className="w-full bg-[#2C2C2E] rounded-md flex flex-col items-center justify-center text-sm py-6">
          {profile ? (
            <>
              <img
                src={profile.profileImage}
                alt="github profile"
                className="w-16 h-16 rounded-full mb-2 border-2 border-gray-500"
              />
              <div className="font-semibold">{profile.nickname}</div>
              {/* 레벨 드롭다운 */}
              <div className="relative">
                <div
                  className={`mt-2 px-2 py-1 rounded text-xs font-bold cursor-pointer select-none ${profile.level === 'BEGINNER' ? 'bg-green-700' : 'bg-blue-700'}`}
                  onClick={() => setLevelDropdownOpen((open) => !open)}
                >
                  {profile.level === 'BEGINNER' ? 'Beginner' : 'Experienced'}
                </div>
                {levelDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-32 bg-gray-800 border border-gray-600 rounded shadow-lg z-10">
                    {levelOptions.map(opt => (
                      <div
                        key={opt.value}
                        className={`px-3 py-2 cursor-pointer hover:bg-gray-700 text-xs ${profile.level === opt.value ? 'font-bold text-blue-400' : 'text-gray-200'}`}
                        onClick={() => {
                          setLevelDropdownOpen(false);
                          chrome.runtime.sendMessage({ type: 'PATCH_USER_LEVEL', data: { level: opt.value as 'BEGINNER' | 'EXPERIENCED' } }, (response) => {
                            if (response.success) {
                              setProfile({ ...profile, level: opt.value as 'BEGINNER' | 'EXPERIENCED' });
                              toast.success(`${opt.label} 로 레벨이 변경되었습니다.`);
                            } else {
                              toast.error('레벨 변경에 실패했습니다.');
                            }
                          });
                        }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="text-gray-300 font-semibold mb-2 text-xs">깃허브 연동이 필요합니다</div>
              <button
                onClick={() => {
                  chrome.runtime.sendMessage({ type: 'REQUEST_GITHUB_CODE' }, (response) => {
                    if (response.success) {
                      fetchProfile();
                    } else {
                      console.log('GitHub code request failed');
                    }
                  });
                }}
                className="px-4 py-1.5 rounded-lg bg-black text-white text-sm font-semibold shadow-md hover:bg-gray-800 transition-all duration-200 border border-gray-800 flex items-center gap-1 w-full justify-center"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                <span className="text-xs">Github 연동</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 메인 영역 */}
      <div className="flex flex-col flex-1">
        {/* 네비게이션 */}
        <div className="w-full flex justify-center px-2 mb-6">
          <div className="flex space-x-4 w-full max-w-3xl">
            <button
              onClick={() => setSelectedMenu('홈')}
              className={`px-5 py-2 rounded-lg transition
                ${selectedMenu === '홈'
                  ? 'bg-[#384B6A] text-blue-100 shadow font-bold'
                  : 'bg-[#3A3A3C] text-gray-200 hover:bg-[#48484A]'}`}
            >
              홈
            </button>
            <button
              onClick={() => setSelectedMenu('난이도')}
              className={`px-5 py-2 rounded-lg transition
                ${selectedMenu === '난이도'
                  ? 'bg-[#384B6A] text-blue-100 shadow font-bold'
                  : 'bg-[#3A3A3C] text-gray-200 hover:bg-[#48484A]'}`}
            >
              난이도
            </button>
            <button
              onClick={() => setSelectedMenu('이슈 상세')}
              className={`px-5 py-2 rounded-lg transition
                ${selectedMenu === '이슈 상세'
                  ? 'bg-[#384B6A] text-blue-100 shadow font-bold'
                  : 'bg-[#3A3A3C] text-gray-200 hover:bg-[#48484A]'}`}
            >
              이슈 상세
            </button>
            <button
              onClick={() => setSelectedMenu('버튼')}
              className={`px-5 py-2 rounded-lg transition
                ${selectedMenu === '버튼'
                  ? 'bg-[#384B6A] text-blue-100 shadow font-bold'
                  : 'bg-[#3A3A3C] text-gray-200 hover:bg-[#48484A]'}`}
            >
              인기 레포지토리 추천
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 flex justify-center items-start">
          <div className="w-full max-w-3xl min-h-[400px] bg-[#2C2C2E] rounded-xl p-6 overflow-y-auto text-base space-y-4 mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
