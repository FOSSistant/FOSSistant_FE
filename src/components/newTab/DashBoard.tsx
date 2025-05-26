"use client";
import React, { useEffect, useState } from 'react';
import DifficultyContent from './DifficultyContent';
import IssueDetailContent from './IssueDetailContent';
import HomeContent from './HomeContent';
import TrendyRepo from './TrendyRepo';
import { UserProfile } from '../../types';
import { getProfile } from '../../api/githubAuth';


export const DashBoard = () => {
  // 1. 상태 추가
  const [selectedMenu, setSelectedMenu] = useState('홈');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const result = await getProfile();
      setProfile(result);
    }
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
      {/* 좌측 사이드바 */}
      <div className="flex flex-col items-center space-y-6 mr-8 w-36">
        {/* 서비스 이름 */}
        <div className="w-full h-20 bg-[#2C2C2E] rounded-md flex flex-col items-center justify-center font-bold text-sm py-2">
          <span className="text-lg font-extrabold">Fossistant</span>
          <span className="text-xs font-normal text-gray-400 mt-1">오픈소스 기여 도우미</span>
        </div>

        {/* 프로필 */}
        <div className="w-full bg-[#2C2C2E] rounded-md flex flex-col items-center justify-center text-sm py-6">
          <img
            src={profile?.profileImage}
            alt="github profile"
            className="w-16 h-16 rounded-full mb-2 border-2 border-gray-500"
          />
          <div className="font-semibold">{profile?.nickname}</div>
          <div className="mt-2 px-2 py-1 bg-green-700 rounded text-xs font-bold">{profile?.level}</div>
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
