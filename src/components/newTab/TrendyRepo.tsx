import React, { useEffect, useState } from 'react';
import { getReposByLanguage, getTrendyRepos, RepoInfo } from '../../api/issueApi';






const TrendyRepo = () => {
  // 언어 목록
  const languages: String[] = ["all", "Java", "TypeScript", "JavaScript", "Python", "Jupyter Notebook"];
  const [currentLanguage, setCurrentLanguage] = useState<string>("all");
  const [currentRepos, setCurrentRepos] = useState<RepoInfo[]>([
    {
      name: "freeCodeCamp",
      fullName: "freeCodeCamp/freeCodeCamp",
      description: "freeCodeCamp.org's open-source codebase and curriculum. Learn math, programming, and computer science for free.",
      stars: 418855,
      language: "JavaScript",
      url: "https://github.com/freeCodeCamp/freeCodeCamp",
    }
  ]);

  const fetchTrendyRepos = async () => {
    const repos: RepoInfo[] = await getTrendyRepos();
    setCurrentRepos(repos);
  };

  const fetchReposByLanguage = async (language: string) => {
    if (language === "all") {
      fetchTrendyRepos();
    } else {
    const repos = await getReposByLanguage(language);
    setCurrentRepos(repos);
  };
  }

  
  useEffect(() => {
    fetchTrendyRepos();
  }, []);
  


  return (
  <div className="space-y-6">
    {/* 헤더 섹션 */}
    <div className="text-center mb-6">
      <div className="mb-3">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          인기 레포지토리 추천
        </h1>
      </div>
      <p className="text-gray-400 text-base">
        지금 가장 핫한 오픈소스 프로젝트들을 확인해보세요
      </p>
    </div>

    {/* 설명 카드 */}
    <div className="bg-gradient-to-br from-orange-500/15 to-red-600/15 rounded-xl p-6 border border-orange-500/30">
      <div>
        <h2 className="text-lg font-bold text-orange-300 mb-3">스마트한 레포지토리 추천</h2>
        <p className="text-gray-300 text-sm leading-relaxed mb-3">
          사용자가 사이드 패널을 열 경우 
          <span className="text-orange-300 font-bold bg-orange-500/20 px-2 py-1 rounded-lg mx-1">최근 인기있는 오픈소스 레포지토리</span>를 
          자동으로 탐색해 추천해줍니다.
        </p>
        <p className="text-gray-400 text-sm">
          스타 수 기준 상위에 위치한 레포지토리를 한눈에 확인하고, 바로 기여를 시작해보세요!
        </p>
      </div>
    </div>

    {/* 추천 레포지토리들 */}
    <div className="space-y-4">
      <div className="flex justify-between">
      <h3 className="text-lg font-bold text-gray-300">
        추천 레포지토리
      </h3>
      {languages.map((language) => (
      <button
        key={language as string}
        className={`px-3 py-1 mx-1 rounded-lg border text-sm transition
          ${currentLanguage === language
            ? 'bg-orange-500/70 text-white border-orange-400 font-bold shadow'
            : 'bg-transparent text-gray-400 border-transparent hover:bg-orange-500/20 hover:text-orange-300'}
        `}
        onClick={() => {
          setCurrentLanguage(language as string);
          fetchReposByLanguage(language as string);
        }}
      >
        {language}
      </button>))}

      </div>

      <div className="grid gap-4">
        {/* 첫 번째 레포지토리 - 이미 동적임 */}
        {currentRepos.length > 0 && (
          <div className="group bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <a 
                    href={currentRepos[0].url}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-base font-bold text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    {currentRepos[0].fullName}
                  </a>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-yellow-400 font-semibold">
                      ⭐ {currentRepos[0].stars.toLocaleString()}
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                      {currentRepos[0].language}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {currentRepos[0].description}
              </p>
            </div>
          </div>
        )}

        {/* 두 번째 레포지토리 - 동적으로 변경 */}
        {currentRepos.length > 1 && (
          <div className="group bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl p-4 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <a 
                    href={currentRepos[1].url}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-base font-bold text-green-300 hover:text-green-200 transition-colors"
                  >
                    {currentRepos[1].fullName}
                  </a>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-yellow-400 font-semibold">
                      ⭐ {currentRepos[1].stars.toLocaleString()}
                    </span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                      {currentRepos[1].language}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {currentRepos[1].description}
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">인기</span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">트렌딩</span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">추천</span>
              </div>
            </div>
          </div>
        )}

        {/* 세 번째 레포지토리 - 동적으로 변경 */}
        {currentRepos.length > 2 && (
          <div className="group bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-xl p-4 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <a 
                    href={currentRepos[2].url}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-base font-bold text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    {currentRepos[2].fullName}
                  </a>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-yellow-400 font-semibold">
                      ⭐ {currentRepos[2].stars.toLocaleString()}
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                      {currentRepos[2].language}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {currentRepos[2].description}
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">인기</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">오픈소스</span>
                <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">활발함</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* 기능 설명 */}
    <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-indigo-500/20">
      <div>
        <h3 className="text-lg font-bold text-indigo-300 mb-3">스마트 추천 시스템</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 shrink-0"></span>
            <p className="text-gray-300 text-sm">
              <span className="font-bold text-indigo-300">실시간 트렌딩:</span> 
              GitHub API를 통해 실시간으로 인기 상승 중인 레포지토리를 분석합니다
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 shrink-0"></span>
            <p className="text-gray-300 text-sm">
              <span className="font-bold text-purple-300">개인화 추천:</span> 
              사용자의 관심사와 기술 스택을 고려한 맞춤형 레포지토리를 제안합니다
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2 shrink-0"></span>
            <p className="text-gray-300 text-sm">
              <span className="font-bold text-pink-300">기여 가능성:</span> 
              초심자도 기여할 수 있는 이슈가 있는 프로젝트를 우선적으로 추천합니다
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* 시작하기 CTA */}
    <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-blue-500/20 text-center">
      <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        오픈소스 기여를 시작해보세요!
      </h3>
      <p className="text-gray-400 text-sm">
        추천된 레포지토리에서 여러분에게 맞는 프로젝트를 찾아 첫 기여를 시작해보세요.
      </p>
    </div>
  </div>
  );
};

export default TrendyRepo;