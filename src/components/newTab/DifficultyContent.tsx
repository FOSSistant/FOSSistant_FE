import React from 'react';

const DifficultyContent = () => (
  <div className="space-y-6">
    {/* 헤더 섹션 */}
    <div className="text-center mb-6">
      <div className="inline-flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-xl">
          🎯
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          난이도 분류 기준
        </h1>
      </div>
      <p className="text-gray-400 text-base">
        이슈의 복잡도와 해결 난이도에 따라 4단계로 분류됩니다
      </p>
    </div>

    {/* 난이도 카드들 */}
    <div className="grid gap-4">
      {/* 상 (Hard) */}
      <div className="group bg-gradient-to-br from-red-500/15 to-pink-600/15 rounded-xl p-5 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
            🔥
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-bold text-red-300">상급 (Hard)</h2>
              <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs font-bold rounded-full border border-red-500/30">
                고난도
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              문제 해결을 위해 다방면의 기술적 지식이 필요하며, 시간과 리서치가 많이 소요됩니다.
            </p>
            <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
              <p className="text-xs text-gray-400 mb-2 font-semibold">예시:</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-red-500/20 text-red-200 text-xs rounded-full">비동기 동기화 이슈</span>
                <span className="px-2 py-1 bg-red-500/20 text-red-200 text-xs rounded-full">멀티쓰레드 충돌</span>
                <span className="px-2 py-1 bg-red-500/20 text-red-200 text-xs rounded-full">SSR+CSR 복합 인증</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 중 (Medium) */}
      <div className="group bg-gradient-to-br from-yellow-500/15 to-orange-600/15 rounded-xl p-5 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
            ⚙️
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-bold text-yellow-300">중급 (Medium)</h2>
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-bold rounded-full border border-yellow-500/30">
                적당함
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              도전해볼 만한 수준의 난이도이며, 명확한 원인을 알 수 있는 경우가 많고 해결 과정도 비교적 명료합니다.
            </p>
            <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
              <p className="text-xs text-gray-400 mb-2 font-semibold">예시:</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-200 text-xs rounded-full">API 요청 실패 원인 파악</span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-200 text-xs rounded-full">props/state 구조 오류</span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-200 text-xs rounded-full">로직 흐름 개선</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하 (Easy) */}
      <div className="group bg-gradient-to-br from-green-500/15 to-emerald-600/15 rounded-xl p-5 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
            🧩
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-bold text-green-300">하급 (Easy)</h2>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full border border-green-500/30">
                초보자용
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              비교적 쉽게 해결 가능한 이슈입니다. 기본적인 디버깅과 콘솔 확인만으로도 원인을 파악할 수 있습니다.
            </p>
            <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
              <p className="text-xs text-gray-400 mb-2 font-semibold">예시:</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-green-500/20 text-green-200 text-xs rounded-full">클래스명 오타</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-200 text-xs rounded-full">라우팅 주소 오류</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-200 text-xs rounded-full">간단한 UI 수정</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 알 수 없음 */}
      <div className="group bg-gradient-to-br from-gray-500/15 to-slate-600/15 rounded-xl p-5 border border-gray-500/30 hover:border-gray-400/50 transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-500/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
            ❓
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-bold text-gray-300">알 수 없음 (Unknown)</h2>
              <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs font-bold rounded-full border border-gray-500/30">
                미분류
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              증상은 명확하지만 재현 조건이 불명확하거나, 여러 원인이 겹쳐 있어 난이도 판단이 어려운 경우입니다.
            </p>
            <div className="bg-gray-500/10 rounded-lg p-3 border border-gray-500/20">
              <p className="text-xs text-gray-400 mb-2 font-semibold">예시:</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-gray-500/20 text-gray-200 text-xs rounded-full">환경 의존적 버그</span>
                <span className="px-2 py-1 bg-gray-500/20 text-gray-200 text-xs rounded-full">간헐적 발생 이슈</span>
                <span className="px-2 py-1 bg-gray-500/20 text-gray-200 text-xs rounded-full">재현 불가능</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* 팁 섹션 */}
    <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-xl p-5 border border-blue-500/20">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-xl shrink-0">
          💡
        </div>
        <div>
          <h3 className="text-lg font-bold text-blue-300 mb-3">난이도 선택 팁</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0"></span>
              <span className="text-sm">처음 기여한다면 <strong className="text-green-300">하급(Easy)</strong> 이슈부터 시작해보세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0"></span>
              <span className="text-sm">경험이 있다면 <strong className="text-yellow-300">중급(Medium)</strong> 이슈에 도전해보세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0"></span>
              <span className="text-sm">전문가라면 <strong className="text-red-300">상급(Hard)</strong> 이슈로 큰 기여를 해보세요</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default DifficultyContent; 