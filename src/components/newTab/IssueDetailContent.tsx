import React from 'react';

const IssueDetailContent = () => (
  <div className="space-y-6">
    {/* 헤더 섹션 */}
    <div className="text-center mb-6">
      <div className="inline-flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-xl">
          📋
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          이슈 상세 안내
        </h1>
      </div>
      <p className="text-gray-400 text-base">
        AI가 분석한 이슈 정보로 스마트하게 기여해보세요
      </p>
    </div>

    {/* 메인 설명 카드 */}
    <div className="bg-gradient-to-br from-purple-500/15 to-indigo-600/15 rounded-xl p-6 border border-purple-500/30">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-3xl shrink-0">
          🤖
        </div>
        <div>
          <h2 className="text-lg font-bold text-purple-300 mb-3">AI 기반 이슈 분석</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            이슈 상세 페이지에서는 이슈의 본문과 메타데이터를 분석하여 
            <span className="text-purple-300 font-bold bg-purple-500/20 px-2 py-1 rounded-lg mx-1">예측 난이도</span>, 
            <span className="text-blue-300 font-bold bg-blue-500/20 px-2 py-1 rounded-lg mx-1">핵심 설명</span>, 
            <span className="text-orange-300 font-bold bg-orange-500/20 px-2 py-1 rounded-lg mx-1">유의점</span>을 
            자동으로 제공합니다.
          </p>
          <p className="text-gray-400 text-sm">
            사용자는 별도의 검색이나 분석 없이도 쉽게 실마리를 잡고 기여를 시작할 수 있습니다.
          </p>
        </div>
      </div>
    </div>

    {/* 제공되는 정보들 */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 예측 난이도 */}
      <div className="group bg-gradient-to-br from-red-500/10 to-orange-600/10 rounded-xl p-4 border border-red-500/20 hover:border-red-400/40 transition-all duration-300 hover:scale-[1.05]">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform">
            🎯
          </div>
          <h3 className="text-base font-bold text-red-300 mb-2">예측 난이도</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            AI가 이슈의 복잡도를 분석하여 상/중/하 난이도로 분류해 도전 여부를 쉽게 결정할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 핵심 설명 */}
      <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-600/10 rounded-xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-[1.05]">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform">
            💡
          </div>
          <h3 className="text-base font-bold text-blue-300 mb-2">핵심 설명</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            이슈의 본질을 빠르게 파악할 수 있도록 요약된 설명과 해결 방향을 제시합니다.
          </p>
        </div>
      </div>

      {/* 유의점 */}
      <div className="group bg-gradient-to-br from-yellow-500/10 to-orange-600/10 rounded-xl p-4 border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300 hover:scale-[1.05]">
        <div className="text-center">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform">
            ⚠️
          </div>
          <h3 className="text-base font-bold text-yellow-300 mb-2">유의점</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            작업 시 주의해야 할 부분이나 참고할 만한 정보를 미리 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>

    {/* 이용 방법 단계 */}
    <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl p-6 border border-green-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-xl">
          📖
        </div>
        <h3 className="text-lg font-bold text-green-300">이용 방법</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center text-lg font-bold text-green-300 mx-auto mb-2">
            1
          </div>
          <h4 className="font-bold text-green-300 mb-1 text-sm">이슈 페이지 방문</h4>
          <p className="text-gray-400 text-xs">GitHub 이슈 페이지에서 확장 프로그램을 실행하세요</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center text-lg font-bold text-green-300 mx-auto mb-2">
            2
          </div>
          <h4 className="font-bold text-green-300 mb-1 text-sm">AI 분석 결과 확인</h4>
          <p className="text-gray-400 text-xs">자동으로 제공되는 난이도와 설명을 확인하세요</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center text-lg font-bold text-green-300 mx-auto mb-2">
            3
          </div>
          <h4 className="font-bold text-green-300 mb-1 text-sm">기여 시작</h4>
          <p className="text-gray-400 text-xs">가이드에 따라 자신있게 기여를 시작하세요</p>
        </div>
      </div>
    </div>

    {/* 커뮤니티 참여 섹션 */}
    <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-indigo-500/20">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-2xl shrink-0">
          🤝
        </div>
        <div>
          <h3 className="text-lg font-bold text-indigo-300 mb-3">커뮤니티와 함께 성장하기</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 shrink-0"></span>
              <p className="text-gray-300 text-sm">
                <span className="font-bold text-indigo-300">직접 라벨링 참여:</span> 
                이슈에 직접 난이도 라벨을 붙여 다른 개발자들을 도울 수 있습니다
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 shrink-0"></span>
              <p className="text-gray-300 text-sm">
                <span className="font-bold text-purple-300">정확도 향상:</span> 
                더 많은 참여로 AI 분석의 정확도가 지속적으로 개선됩니다
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2 shrink-0"></span>
              <p className="text-gray-300 text-sm">
                <span className="font-bold text-pink-300">생태계 기여:</span> 
                초심자와 경험자 모두의 참여가 오픈소스 생태계에 큰 힘이 됩니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* 시작하기 CTA */}
    <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-blue-500/20 text-center">
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl animate-pulse">
          🚀
        </div>
      </div>
      <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        지금 바로 시작해보세요!
      </h3>
      <p className="text-gray-400 text-sm">
        GitHub 이슈 페이지에서 FOSSistant 확장 프로그램을 활용해 스마트한 기여를 경험해보세요.
      </p>
    </div>
  </div>
);

export default IssueDetailContent;