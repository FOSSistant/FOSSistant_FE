'use client';

import { useState } from 'react';

export interface IssueProps {
  tags: string[];
  title: string;
  description: string;
  solution: string;
  cautions: string;
  difficulty: 'easy' | 'hard' | 'unknown';
}

export const IssueDetailInfo = ({
  tags,
  title,
  description,
  solution,
  cautions,
  difficulty,
}: IssueProps) => {
  const [showDesc, setShowDesc] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showCaution, setShowCaution] = useState(false);

  return (
    <div
      className="p-6 rounded-2xl shadow-lg border border-[#444] text-[#e0e0e0] space-y-4"
      style={{ backgroundColor: '#2d2d2d' }}
    >
      {/* 태그 */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, idx) => (
          <span key={idx} className="bg-[#047857] text-white text-xs px-2 py-1 rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      {/* 제목 */}
      <h2 className="text-2xl font-bold text-white">{title}</h2>

      {/* 난이도 */}
      <div className="text-sm text-gray-400">예측 난이도: {difficulty}</div>

      {/* 설명 */}
      <div>
        <button
          onClick={() => setShowDesc(!showDesc)}
          className="w-full text-left text-sm font-semibold text-gray-300 hover:text-white transition"
        >
          {showDesc ? '▾ 이슈에 대한 설명' : '▸ 이슈에 대한 설명'}
        </button>
        {showDesc && (
          <div className="mt-2 bg-[#3a3a3a] text-sm p-4 rounded-lg border border-[#555] text-[#dcdcdc]">
            {description}
          </div>
        )}
      </div>

      {/* 가이드 */}
      <div>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="w-full text-left text-sm font-semibold text-gray-300 hover:text-white transition"
        >
          {showGuide ? '▾ 해결 방식에 대한 가이드' : '▸ 해결 방식에 대한 가이드'}
        </button>
        {showGuide && (
          <div className="mt-2 bg-[#3a3a3a] text-sm p-4 rounded-lg border border-[#555] text-[#dcdcdc]">
            {solution}
          </div>
        )}
      </div>

      {/* 유의점 */}
      <div>
        <button
          onClick={() => setShowCaution(!showCaution)}
          className="w-full text-left text-sm font-semibold text-gray-300 hover:text-white transition"
        >
          {showCaution ? '▾ 유의점' : '▸ 유의점'}
        </button>
        {showCaution && (
          <div className="mt-2 bg-[#3a3a3a] text-sm p-4 rounded-lg border border-[#555] text-[#dcdcdc]">
            {cautions}
          </div>
        )}
      </div>
    </div>
  );
};
