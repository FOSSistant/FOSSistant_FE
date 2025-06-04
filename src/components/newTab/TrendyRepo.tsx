import React from 'react';

const TrendyRepo = () => (
  <div className="space-y-6">
    {/* 헤더 섹션 */}
    <div className="text-center mb-6">
      <div className="inline-flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-xl">
          🔥
        </div>
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
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center text-3xl shrink-0">
          🚀
        </div>
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
    </div>

    {/* 추천 레포지토리들 */}
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-300 flex items-center gap-2">
        <span className="text-xl">⭐</span>
        추천 레포지토리
      </h3>

      <div className="grid gap-4">
        {/* freeCodeCamp */}
        <div className="group bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              📚
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <a 
                    href="https://github.com/freeCodeCamp/freeCodeCamp" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-base font-bold text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    freeCodeCamp/freeCodeCamp
                  </a>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-yellow-400 font-semibold">
                      ⭐ 418,855
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                      TypeScript
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                freeCodeCamp.org's open-source codebase and curriculum. Learn math, programming, and computer science for free.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">교육용</span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">초보자 친화적</span>
                <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">커뮤니티 활발</span>
              </div>
            </div>
          </div>
        </div>

        {/* build-your-own-x */}
        <div className="group bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl p-4 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              🔧
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <a 
                    href="https://github.com/codecrafters-io/build-your-own-x" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-base font-bold text-green-300 hover:text-green-200 transition-colors"
                  >
                    codecrafters-io/build-your-own-x
                  </a>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-yellow-400 font-semibold">
                      ⭐ 381,978
                    </span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                      Markdown
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Master programming by recreating your favorite technologies from scratch.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">학습 자료</span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">프로젝트 기반</span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">실습 중심</span>
              </div>
            </div>
          </div>
        </div>

        {/* 더 많은 추천 레포지토리 (예시) */}
        <div className="group bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-xl p-4 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <a 
                    href="https://github.com/microsoft/vscode" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-base font-bold text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    microsoft/vscode
                  </a>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-yellow-400 font-semibold">
                      ⭐ 162,159
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                      TypeScript
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Visual Studio Code - 전 세계에서 가장 많이 사용되는 코드 에디터의 오픈소스 버전입니다.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">에디터</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">도구</span>
                <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">대규모 프로젝트</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* 기능 설명 */}
    <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-indigo-500/20">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-2xl shrink-0">
          💡
        </div>
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
    </div>

    {/* 시작하기 CTA */}
    <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 rounded-xl p-5 border border-orange-500/20 text-center">
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-2xl animate-bounce">
          🔥
        </div>
      </div>
      <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
        지금 바로 탐험해보세요!
      </h3>
      <p className="text-gray-400 text-sm">
        사이드 패널을 열어 개인화된 추천 레포지토리를 확인하고 새로운 기여 기회를 발견해보세요.
      </p>
    </div>
  </div>
);

export default TrendyRepo; 