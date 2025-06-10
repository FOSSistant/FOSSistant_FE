'use client';
import { DifficultyOpinion } from './DifficultyOpinion';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast, Toaster } from 'react-hot-toast';
import { DifficultyType } from '../types';

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
    highlightedBody: string;
  };
}

export interface IssueProps {
  title: string;
  description: string;
  solution: string;
  relatedLinks: string;
  highlightedBody: string;
  difficulty: DifficultyType;
  isLoading?: boolean;
  myDifficulty?: DifficultyType | null;
  onSubmitMyDifficulty?: (difficulty: DifficultyType) => void;
  issueUrl: string;
}

const getDifficultyInKorean = (difficulty: DifficultyType): string => {
  switch (difficulty) {
    case 'easy':
      return '🧩 easy';
    case 'medium':
      return '⚙️ medium';
    case 'hard':
      return '🔥 hard';
    case 'misc':
      return '❓ misc';
    case 'unknown':
      return '❓ unknown';
    default:
      return '❓ unknown';
  }
};

const getDifficultyColor = (difficulty: DifficultyType): string => {
  switch (difficulty) {
    case 'easy':
      return 'text-[var(--color-success)]';
    case 'medium':
      return 'text-[var(--color-warning)]';
    case 'hard':
      return 'text-[var(--color-danger)]';
    case 'misc':
      return 'text-[var(--color-gray)]';
    case 'unknown':
      return 'text-[var(--color-gray)]';
    default:
      return 'text-[var(--color-gray)]';
  }
};

const getDifficultyIcon = (difficulty: DifficultyType): string => {
  switch (difficulty) {
    case 'easy':
      return '🧩';
    case 'medium':
      return '⚙️';
    case 'hard':
      return '🔥';
    case 'misc':
      return '❓';
    case 'unknown':
      return '❓';
    default:
      return '❓';
  }
};

// 개선된 로딩 컴포넌트
const LoadingSpinner = () => (
  <span className="inline-block align-middle mr-2">
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="var(--text-muted)" strokeWidth="4" opacity="0.2" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="var(--text-muted)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </span>
);

// 개선된 로딩 스켈레톤
const LoadingSkeleton = () => (
  <div className="p-6 rounded-2xl shadow-lg border border-[var(--border-primary)] text-[var(--text-primary)] space-y-4 animate-pulse gradient-bg custom-scrollbar" 
       style={{ backgroundColor: 'var(--bg-primary)' }}>
    {/* 헤더 스켈레톤 */}
    <div className="flex items-center gap-3 animate-fade-in-up">
      <div className="w-8 h-8 bg-[var(--bg-secondary)] rounded-full skeleton-loading"></div>
      <div className="flex-1">
        <div className="h-6 w-3/4 bg-[var(--bg-secondary)] rounded-lg mb-2 skeleton-loading"></div>
        <div className="h-4 w-1/2 bg-[var(--bg-secondary)] rounded skeleton-loading"></div>
      </div>
    </div>

    {/* 섹션 스켈레톤 */}
    {[1, 2, 3].map((idx) => (
      <div key={idx} className="space-y-3 border-t border-[var(--border-primary)] pt-4 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
        <div className="h-5 w-40 bg-[var(--bg-secondary)] rounded skeleton-loading"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-[var(--bg-secondary)] rounded skeleton-loading"></div>
          <div className="h-4 w-4/5 bg-[var(--bg-secondary)] rounded skeleton-loading"></div>
          <div className="h-4 w-3/5 bg-[var(--bg-secondary)] rounded skeleton-loading"></div>
        </div>
      </div>
    ))}
  </div>
);

// 섹션 컴포넌트
const ExpandableSection = ({ 
  title, 
  content, 
  isOpen, 
  onToggle 
}: { 
  title: string; 
  content: string; 
  isOpen: boolean; 
  onToggle: () => void; 
}) => (
  <div className="border-t border-[var(--border-primary)] pt-4 section-transition">
    <button
      onClick={onToggle}
      className="w-full text-left flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 group micro-interaction"
    >
      <span className="flex-1">{title}</span>
      <span className={`transform transition-all duration-300 ${isOpen ? 'rotate-90 text-[var(--text-primary)]' : 'rotate-0 text-[var(--text-muted)]'}`}>
        ▶
      </span>
    </button>
    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
      isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
    }`}>
      <div className="bg-[var(--bg-tertiary)] text-sm p-4 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] markdown-body shadow-inner animate-fade-in-scale custom-scrollbar hover-lift">
        <ReactMarkdown
          components={{
            a: ({ href, children, ...props }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:text-[var(--color-primary-light)] underline transition-colors duration-200"
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
  highlightedBody,
  difficulty,
  isLoading = false,
  myDifficulty = null,
  issueUrl,
  onSubmitMyDifficulty,
}: IssueProps) => {
  const [showDesc, setShowDesc] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);

  // 텍스트 하이라이트 기능
  // 텍스트 하이라이트 기능
  const handleHighlightText = async () => {
    if (!highlightedBody || highlightedBody.trim() === '') {
      console.log('하이라이트할 텍스트가 없음');
      toast.error('하이라이트할 텍스트가 없습니다.', {
        style: {
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-primary)',
        },
      });
      return;
    }

    setIsHighlighting(true);
    
    try {
      // 현재 활성 탭 확인
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tabs[0]?.id) {
        throw new Error('활성 탭을 찾을 수 없습니다');
      }

      const tabId = tabs[0].id;
      console.log('하이라이트 대상 탭:', tabId, tabs[0].url);

      // GitHub 이슈 페이지인지 확인
      if (!tabs[0].url?.includes('github.com') || !tabs[0].url?.includes('/issues/')) {
        throw new Error('GitHub 이슈 페이지에서만 사용할 수 있는 기능입니다');
      }

      // Content Script가 준비되어 있는지 확인
      await ensureContentScriptReady(tabId);
      
      // 메시지 전송
      const response = await sendMessageWithRetry(tabId, {
        type: 'HIGHLIGHT_TEXT',
        text: highlightedBody
      });

      if (response?.success) {
        console.log('하이라이트 성공');
        toast.success('핵심 내용이 하이라이트되었습니다!', {
          style: {
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
          },
        });
      } else {
        throw new Error('하이라이트 실행 실패');
      }
    } catch (error) {
      console.error('하이라이트 실행 중 오류:', error);
      
      // 사용자에게 친화적인 오류 메시지 표시
      if (error instanceof Error) {
        if (error.message.includes('Could not establish connection')) {
          toast.error('페이지를 새로고침 후 다시 시도해주세요.', {
            style: { background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' },
          });
        } else if (error.message.includes('GitHub 이슈 페이지')) {
          toast.error('GitHub 이슈 페이지에서만 사용할 수 있습니다.', {
            style: { background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' },
          });
        } else {
          toast.error('하이라이트 기능을 사용할 수 없습니다.', {
            style: { background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' },
          });
        }
      }
    } finally {
      setTimeout(() => {
        setIsHighlighting(false);
      }, 1000);
    }
  };

  // Content Script가 준비되어 있는지 확인하는 함수
  const ensureContentScriptReady = async (tabId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Ping 메시지를 보내서 Content Script가 응답하는지 확인
      chrome.tabs.sendMessage(tabId, { type: 'PING' }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(`Content Script 준비 안됨: ${chrome.runtime.lastError.message}`));
        } else {
          resolve();
        }
      });
    });
  };

  // 재시도 로직이 포함된 메시지 전송 함수
  const sendMessageWithRetry = async (tabId: number, message: any, maxRetries: number = 3): Promise<any> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await new Promise((resolve, reject) => {
          chrome.tabs.sendMessage(tabId, message, (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(response);
            }
          });
        });
      } catch (error) {
        console.log(`메시지 전송 시도 ${attempt}/${maxRetries} 실패:`, error);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // 재시도 전 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div
      className="p-6 rounded-2xl shadow-lg border border-[var(--border-primary)] text-[var(--text-primary)] space-y-4 transition-all duration-300 hover:shadow-xl hover:border-[var(--border-secondary)] hover-lift animate-fade-in-scale gradient-bg custom-scrollbar"
      style={{ 
        backgroundColor: 'var(--bg-primary)', 
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
        <div className="flex-1">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2 leading-tight">{title}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[var(--text-muted)]">AI 분류 모델 예측:</span>
            <span className={`text-sm font-semibold ${getDifficultyColor(difficulty)} px-3 py-1 rounded-full bg-opacity-20 transition-all duration-300 difficulty-badge micro-interaction`}
                  style={{ 
                    backgroundColor: difficulty === 'easy' ? 'var(--color-success-bg)' :
                                   difficulty === 'medium' ? 'var(--color-warning-bg)' :
                                   difficulty === 'hard' ? 'var(--color-danger-bg)' :
                                   difficulty === 'misc' ? 'var(--color-gray-bg)' :
                                   difficulty === 'unknown' ? 'var(--color-gray-bg)' : 'var(--color-gray-bg)',
                    border: `1px solid ${difficulty === 'easy' ? 'var(--color-success-border)' :
                                       difficulty === 'medium' ? 'var(--color-warning-border)' :
                                       difficulty === 'hard' ? 'var(--color-danger-border)' :
                                       difficulty === 'misc' ? 'var(--color-gray-border)' :
                                       difficulty === 'unknown' ? 'var(--color-gray-border)' : 'var(--color-gray-border)'}`
                  }}>
              {getDifficultyInKorean(difficulty)}
            </span>
            {/* 하이라이트 버튼 */}
            {highlightedBody && (
              <button
                onClick={handleHighlightText}
                disabled={isHighlighting}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning-border)] hover:bg-[var(--color-warning-bg)] hover:border-[var(--color-warning)] transition-all duration-300 micro-interaction disabled:opacity-50 disabled:cursor-not-allowed"
                title="AI가 분석한 이슈의 핵심 내용을 하이라이트합니다"
              >
                {isHighlighting ? (
                  <>
                    <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75" />
                    </svg>
                    <span>하이라이트 중...</span>
                  </>
                ) : (
                  <span>핵심 내용 찾기</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 설명 섹션 */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <ExpandableSection
          title="이슈에 대한 설명"
          content={description}
          isOpen={showDesc}
          onToggle={() => setShowDesc(!showDesc)}
        />
      </div>

      {/* 해결 가이드 섹션 */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <ExpandableSection
          title="해결 방식에 대한 가이드"
          content={solution}
          isOpen={showGuide}
          onToggle={() => setShowGuide(!showGuide)}
        />
      </div>

      {/* 관련 링크 섹션 */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <ExpandableSection
          title="관련 링크"
          content={relatedLinks}
          isOpen={showLinks}
          onToggle={() => setShowLinks(!showLinks)}
        />
      </div>
    </div>
  );
};
