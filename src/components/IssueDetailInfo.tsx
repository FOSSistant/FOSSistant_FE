'use client';
import { DifficultyOpinion } from './DifficultyOpinion';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export interface IssueProps {
  title: string;
  description: string;
  solution: string;
  cautions: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'misc';
  isLoading?: boolean;
  myDifficulty?: 'easy' | 'medium' | 'hard' | null;
  onSubmitMyDifficulty?: (difficulty: 'easy' | 'medium' | 'hard') => void;
  issueUrl: string;
}

const getDifficultyInKorean = (difficulty: IssueProps['difficulty']): string => {
  switch (difficulty) {
    case 'easy':
      return '쉬움';
    case 'medium':
      return '보통';
    case 'hard':
      return '어려움';
    case 'misc':
      return '기타';
    default:
      return '알 수 없음';
  }
};

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <span className="inline-block align-middle mr-2">
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="4" opacity="0.2" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="#888" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </span>
);

const LoadingSkeleton = () => (
  <div className="p-4 rounded-xl shadow-md border border-[#444] text-[#e0e0e0] space-y-3 animate-pulse" style={{ backgroundColor: '#232323' }}>
    {/* 태그 스켈레톤 */}
    <div className="flex flex-wrap gap-2 items-center">
      <span className="flex items-center gap-2">
        <LoadingSpinner />
        <span className="h-5 w-14 bg-[#2c2c2c] rounded-full block"></span>
      </span>
      <span className="h-5 w-14 bg-[#2c2c2c] rounded-full"></span>
      <span className="h-5 w-14 bg-[#2c2c2c] rounded-full"></span>
    </div>

    {/* 제목 스켈레톤 */}
    <div className="h-6 w-2/3 bg-[#2c2c2c] rounded"></div>

    {/* 난이도 스켈레톤 */}
    <div className="h-3 w-20 bg-[#2c2c2c] rounded"></div>

    {/* 설명 섹션 스켈레톤 */}
    {[1, 2, 3].map((idx) => (
      <div key={idx} className="space-y-1">
        <div className="h-4 w-32 bg-[#2c2c2c] rounded"></div>
        <div className="h-12 bg-[#2c2c2c] rounded-lg"></div>
      </div>
    ))}
  </div>
);

export const IssueDetailInfo = ({
  title,
  description,
  solution,
  cautions,
  difficulty,
  isLoading = false,
  myDifficulty = null,
  issueUrl,
  onSubmitMyDifficulty,
}: IssueProps) => {
  const [showDesc, setShowDesc] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showCaution, setShowCaution] = useState(false);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div
      className="p-4 rounded-xl shadow-md border border-[#444] text-[#e0e0e0] space-y-3"
      style={{ backgroundColor: '#232323', wordBreak: 'break-word', maxWidth: '100%' }}
    >
      <DifficultyOpinion issueUrl={issueUrl} />

      {/* 제목 */}
      <h2 className="text-lg font-bold text-white">{title}</h2>

      {/* 난이도 */}
      <div className="text-xs text-gray-400">예측 난이도: {getDifficultyInKorean(difficulty)}</div>

      {/* 설명 */}
      <div>
        <button
          onClick={() => setShowDesc(!showDesc)}
          className="w-full text-left text-xs font-semibold text-gray-300 hover:text-white transition"
        >
          {showDesc ? '▾ 이슈에 대한 설명' : '▸ 이슈에 대한 설명'}
        </button>
        {showDesc && (
          <div className="mt-1 bg-[#2c2c2c] text-xs p-3 rounded-md border border-[#444] text-[#dcdcdc] markdown-body">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* 가이드 */}
      <div>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="w-full text-left text-xs font-semibold text-gray-300 hover:text-white transition"
        >
          {showGuide ? '▾ 해결 방식에 대한 가이드' : '▸ 해결 방식에 대한 가이드'}
        </button>
        {showGuide && (
          <div className="mt-1 bg-[#2c2c2c] text-xs p-3 rounded-md border border-[#444] text-[#dcdcdc] markdown-body">
            <ReactMarkdown>{solution}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* 유의점 */}
      <div>
        <button
          onClick={() => setShowCaution(!showCaution)}
          className="w-full text-left text-xs font-semibold text-gray-300 hover:text-white transition"
        >
          {showCaution ? '▾ 유의점' : '▸ 유의점'}
        </button>
        {showCaution && (
          <div className="mt-1 bg-[#2c2c2c] text-xs p-3 rounded-md border border-[#444] text-[#dcdcdc] markdown-body">
            <ReactMarkdown>{cautions}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
