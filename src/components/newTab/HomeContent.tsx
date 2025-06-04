import React from 'react';

const HomeContent = () => (
  <div className="space-y-6">
    {/* 메인 히어로 섹션 */}
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl">
            🚀
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              FOSSistant
            </h1>
            <p className="text-xs text-gray-400 font-medium">오픈소스 기여 도우미</p>
          </div>
        </div>
        
        <p className="text-base text-gray-300 leading-relaxed mb-4">
          오픈소스 이슈에 <span className="text-blue-300 font-bold bg-blue-500/10 px-2 py-1 rounded-lg">난이도 라벨</span>을 부여해
          <br />
          <span className="text-purple-300 font-bold bg-purple-500/10 px-2 py-1 rounded-lg">초심자도 쉽게 도전할 수 있는 이슈</span>를 한눈에 찾을 수 있도록 도와줍니다.
        </p>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-300">AI 기반 난이도 분석</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-300">커뮤니티 기반 라벨링</span>
          </div>
        </div>
      </div>
    </div>

    {/* 기능 카드들 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="group bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl p-4 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
            🎯
          </div>
          <h3 className="text-base font-bold text-green-300">맞춤형 이슈 추천</h3>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          난이도별로 분류된 이슈를 통해 자신에게 맞는 첫 기여를 쉽게 찾을 수 있습니다.
        </p>
      </div>

      <div className="group bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
            📚
          </div>
          <h3 className="text-base font-bold text-blue-300">단계별 가이드</h3>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          오픈소스 참여 과정을 처음부터 끝까지 상세하게 안내받을 수 있습니다.
        </p>
      </div>

      <div className="group bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-xl p-4 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
            👥
          </div>
          <h3 className="text-base font-bold text-purple-300">커뮤니티 참여</h3>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          커뮤니티의 라벨링 참여로 더 많은 초심자가 오픈소스에 진입할 수 있습니다.
        </p>
      </div>

      <div className="group bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-xl p-4 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
            🌱
          </div>
          <h3 className="text-base font-bold text-orange-300">생태계 성장</h3>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          경험자들의 라벨링 참여로 오픈소스 생태계 성장에 기여할 수 있습니다.
        </p>
      </div>
    </div>

    {/* 시작하기 CTA */}
    <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-blue-500/20 text-center">
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl animate-bounce">
          ✨
        </div>
      </div>
      <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        오픈소스의 첫걸음을 시작해보세요!
      </h3>
      <p className="text-gray-400 mb-4 text-sm">
        FOSSistant와 함께 오픈소스 기여의 문턱을 낮춰보세요.
      </p>
      <div className="flex justify-center gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span className="text-green-400">●</span>
          <span>무료로 시작</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span className="text-blue-400">●</span>
          <span>AI 기반 분석</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span className="text-purple-400">●</span>
          <span>커뮤니티 지원</span>
        </div>
      </div>
    </div>
  </div>
);

export default HomeContent; 