'use client';
import { DifficultyOpinion } from './DifficultyOpinion';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

// 새로운 API 응답 타입
export interface ApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    title: string;
    difficulty: string;
    description: string;
    solution: string;
    relatedLinks: string;
  };
}

export interface IssueProps {
  title: string;
  description: string;
  solution: string;
  relatedLinks: string;
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

const getDifficultyColor = (difficulty: IssueProps['difficulty']): string => {
  switch (difficulty) {
    case 'easy':
      return 'text-green-400';
    case 'medium':
      return 'text-yellow-400';
    case 'hard':
      return 'text-red-400';
    case 'misc':
      return 'text-gray-400';
    default:
      return 'text-gray-400';
  }
};

const getDifficultyIcon = (difficulty: IssueProps['difficulty']): string => {
  switch (difficulty) {
    case 'easy':
      return '🧩';
    case 'medium':
      return '⚙️';
    case 'hard':
      return '🔥';
    case 'misc':
      return '❓';
    default:
      return '❓';
  }
};

// 개선된 로딩 컴포넌트
const LoadingSpinner = () => (
  <span className="inline-block align-middle mr-2">
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="4" opacity="0.2" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="#888" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </span>
);

// 개선된 로딩 스켈레톤
const LoadingSkeleton = () => (
  <div className="p-6 rounded-2xl shadow-lg border border-[#444] text-[#e0e0e0] space-y-4 animate-pulse gradient-bg custom-scrollbar" 
       style={{ backgroundColor: '#1a1a1a' }}>
    {/* 헤더 스켈레톤 */}
    <div className="flex items-center gap-3 animate-fade-in-up">
      <div className="w-8 h-8 bg-[#2c2c2c] rounded-full skeleton-loading"></div>
      <div className="flex-1">
        <div className="h-6 w-3/4 bg-[#2c2c2c] rounded-lg mb-2 skeleton-loading"></div>
        <div className="h-4 w-1/2 bg-[#2c2c2c] rounded skeleton-loading"></div>
      </div>
    </div>

    {/* 섹션 스켈레톤 */}
    {[1, 2, 3].map((idx) => (
      <div key={idx} className="space-y-3 border-t border-[#333] pt-4 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
        <div className="h-5 w-40 bg-[#2c2c2c] rounded skeleton-loading"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-[#2c2c2c] rounded skeleton-loading"></div>
          <div className="h-4 w-4/5 bg-[#2c2c2c] rounded skeleton-loading"></div>
          <div className="h-4 w-3/5 bg-[#2c2c2c] rounded skeleton-loading"></div>
        </div>
      </div>
    ))}
  </div>
);

// 섹션 컴포넌트
const ExpandableSection = ({ 
  title, 
  content, 
  icon, 
  isOpen, 
  onToggle 
}: { 
  title: string; 
  content: string; 
  icon: string; 
  isOpen: boolean; 
  onToggle: () => void; 
}) => (
  <div className="border-t border-[#333] pt-4 section-transition">
    <button
      onClick={onToggle}
      className="w-full text-left flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-all duration-200 group micro-interaction"
    >
      <span className="text-lg group-hover:scale-110 transition-transform duration-200 animate-pulse-glow">{icon}</span>
      <span className="flex-1">{title}</span>
      <span className={`transform transition-all duration-300 ${isOpen ? 'rotate-90 text-white' : 'rotate-0 text-gray-400'}`}>
        ▶
      </span>
    </button>
    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
      isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
    }`}>
      <div className="bg-[#1e1e1e] text-sm p-4 rounded-lg border border-[#444] text-[#dcdcdc] markdown-body shadow-inner animate-fade-in-scale custom-scrollbar hover-lift">
        <ReactMarkdown
          components={{
            a: ({ href, children, ...props }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                {...props}
              >
                {children}
                <span className="ml-1 text-xs opacity-70">↗</span>
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  </div>
);

export const IssueDetailInfo = ({
  title,
  description,
  solution,
  relatedLinks,
  difficulty,
  isLoading = false,
  myDifficulty = null,
  issueUrl,
  onSubmitMyDifficulty,
}: IssueProps) => {
  const [showDesc, setShowDesc] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div
      className="p-6 rounded-2xl shadow-lg border border-[#444] text-[#e0e0e0] space-y-4 transition-all duration-300 hover:shadow-xl hover:border-[#555] hover-lift animate-fade-in-scale gradient-bg custom-scrollbar"
      style={{ 
        backgroundColor: '#1a1a1a', 
        wordBreak: 'break-word', 
        maxWidth: '100%'
      }}
    >
      {/* 난이도 의견 */}
      <div className="transform transition-all duration-300 animate-slide-in-left">
        <DifficultyOpinion issueUrl={issueUrl} />
      </div>

      {/* 헤더 섹션 */}
      <div className="flex items-start gap-3 pb-2 animate-fade-in-up">
        <div className={`text-2xl animate-pulse-glow ${getDifficultyColor(difficulty)}`}>
          {getDifficultyIcon(difficulty)}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white mb-2 leading-tight">{title}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">예측 난이도:</span>
            <span className={`text-sm font-semibold ${getDifficultyColor(difficulty)} px-2 py-1 rounded-full bg-opacity-20 transition-all duration-300 difficulty-badge micro-interaction`}
                  style={{ backgroundColor: `${getDifficultyColor(difficulty).replace('text-', '')}20` }}>
              {getDifficultyInKorean(difficulty)}
            </span>
          </div>
        </div>
      </div>

      {/* 설명 섹션 */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <ExpandableSection
          title="이슈에 대한 설명"
          content={description}
          icon="📋"
          isOpen={showDesc}
          onToggle={() => setShowDesc(!showDesc)}
        />
      </div>

      {/* 해결 가이드 섹션 */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <ExpandableSection
          title="해결 방식에 대한 가이드"
          content={solution}
          icon="🛠️"
          isOpen={showGuide}
          onToggle={() => setShowGuide(!showGuide)}
        />
      </div>

      {/* 관련 링크 섹션 */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <ExpandableSection
          title="관련 링크"
          content={relatedLinks}
          icon="🔗"
          isOpen={showLinks}
          onToggle={() => setShowLinks(!showLinks)}
        />
      </div>
    </div>
  );
};
