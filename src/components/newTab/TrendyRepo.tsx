import React from 'react';

const TrendyRepo = () => (
  <div>
    <h2 className="text-xl font-semibold mb-2">최근 인기있는 오픈소스 추천</h2>
    <p className="text-gray-300 mb-3">
      사용자가 사이드 패널을 열 경우 <span className="text-blue-300 font-semibold">최근 인기있는 오픈소스 레포지토리</span>를 자동으로 탐색해 추천해줍니다.<br />
      <span className="text-gray-200">스타 수 기준 상위에 위치한 레포지토리</span>를 한눈에 확인하고, 바로 기여를 시작해보세요!
    </p>
    <ul className="space-y-4">
      <li className="bg-[#232326] rounded-lg p-4 border border-[#2d2d30]">
        <a href="https://github.com/freeCodeCamp/freeCodeCamp" target="_blank" rel="noopener noreferrer" className="text-blue-200 font-bold hover:underline text-lg flex items-center gap-2">
          freeCodeCamp/freeCodeCamp
        </a>
        <div className="text-gray-300 text-sm mb-1">freeCodeCamp.org's open-source codebase and curriculum. Learn math, programming, and computer science for free.</div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>⭐ 418,855</span>
          <span>💻 TypeScript</span>
        </div>
      </li>
      <li className="bg-[#232326] rounded-lg p-4 border border-[#2d2d30]">
        <a href="https://github.com/codecrafters-io/build-your-own-x" target="_blank" rel="noopener noreferrer" className="text-blue-200 font-bold hover:underline text-lg flex items-center gap-2">
          codecrafters-io/build-your-own-x
        </a>
        <div className="text-gray-300 text-sm mb-1">Master programming by recreating your favorite technologies from scratch.</div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>⭐ 381,978</span>
          <span>💻 Markdown</span>
        </div>
      </li>
      <li className="bg-[#232326] rounded-lg p-4 border border-[#2d2d30]">
        <a href="https://github.com/sindresorhus/awesome" target="_blank" rel="noopener noreferrer" className="text-blue-200 font-bold hover:underline text-lg flex items-center gap-2">
          sindresorhus/awesome
        </a>
        <div className="text-gray-300 text-sm mb-1">😎 Awesome lists about all kinds of interesting topics</div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>⭐ 362,185</span>
          <span>💻 Unknown</span>
        </div>
      </li>
    </ul>
  </div>
);

export default TrendyRepo; 