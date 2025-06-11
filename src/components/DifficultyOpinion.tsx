import React, { useEffect, useRef, useState } from 'react';
import { submitDifficultyOpinion, getDifficultyOpinion } from '../api/issueApi';
import { toast, Toaster } from 'react-hot-toast';

interface DifficultyOpinionProps {
  issueUrl: string;
}

const labelStyle = {
  EASY: {
    bg: 'bg-[var(--color-success-bg)]',
    text: 'text-[var(--color-success)]',
    border: 'border-[var(--color-success-border)]',
    hover: 'hover:bg-[var(--color-success-bg)] hover:border-[var(--color-success)]'
  },
  MEDIUM: {
    bg: 'bg-[var(--color-warning-bg)]', 
    text: 'text-[var(--color-warning)]',
    border: 'border-[var(--color-warning-border)]',
    hover: 'hover:bg-[var(--color-warning-bg)] hover:border-[var(--color-warning)]'
  },
  HARD: {
    bg: 'bg-[var(--color-danger-bg)]',
    text: 'text-[var(--color-danger)]', 
    border: 'border-[var(--color-danger-border)]',
    hover: 'hover:bg-[var(--color-danger-bg)] hover:border-[var(--color-danger)]'
  },
  MISC: {
    bg: 'bg-[var(--color-gray-bg)]',
    text: 'text-[var(--color-gray)]', 
    border: 'border-[var(--color-gray-border)]',
    hover: 'hover:bg-[var(--color-gray-bg)] hover:border-[var(--color-gray)]'
  },
  UNKNOWN: {
    bg: 'bg-[var(--color-gray-bg)]',
    text: 'text-[var(--color-gray)]', 
    border: 'border-[var(--color-gray-border)]',
    hover: 'hover:bg-[var(--color-gray-bg)] hover:border-[var(--color-gray)]'
  },
};

const labelText = {
  EASY: '🧩 easy',
  MEDIUM: '⚙️ medium',
  HARD: '🔥 hard',
  MISC: '📌 misc',
  UNKNOWN: '❓ unknown',
};

export const DifficultyOpinion: React.FC<DifficultyOpinionProps> = ({ issueUrl }) => {
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);
  const [difficultyOpinion, setDifficultyOpinion] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postDifficultyOpinion = async (issueId: string, feedBackTag: string): Promise<any> => {
    setIsSubmitting(true);
    try {
      const response = await submitDifficultyOpinion(issueId, feedBackTag);
      if (response) {
        setDifficultyOpinion(feedBackTag);
        setShowDifficultySelect(false);
        toast.success('난이도 의견을 추가했습니다.', {
          style: {
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
          },
        });
        fetchDifficultyOpinion();
      } else {
        toast.error('난이도 의견을 추가하는데 실패했습니다.', {
          style: {
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
          },
        });
      }
    } catch (error) {
      toast.error('오류가 발생했습니다.', {
        style: {
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-primary)',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchDifficultyOpinion = async () => {
    const opinion = await getDifficultyOpinion(issueUrl);
    if (opinion) {
      setDifficultyOpinion(opinion);
    }
  };

  useEffect(() => {
    fetchDifficultyOpinion();
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      {difficultyOpinion ? (
        <div className="animate-fade-in-scale">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] mb-3 hover-lift transition-all duration-300">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-muted)]">내가 선택한 난이도:</span>
              <div className={`
                flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold 
                ${labelStyle[difficultyOpinion as keyof typeof labelStyle].bg} 
                ${labelStyle[difficultyOpinion as keyof typeof labelStyle].text} 
                ${labelStyle[difficultyOpinion as keyof typeof labelStyle].border}
                border micro-interaction difficulty-badge
              `}>
                <span>{labelText[difficultyOpinion as keyof typeof labelText]}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setDifficultyOpinion(null);
                setShowDifficultySelect(true);
              }}
              className="ml-auto text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200 micro-interaction"
              title="난이도 변경"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-3 animate-fade-in-up">
          {!showDifficultySelect ? (
            <button
              className="
                w-full flex flex-col items-center gap-2 text-sm rounded-xl px-4 py-3
                bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] 
                border border-[var(--border-primary)] shadow-lg
                hover:border-[var(--border-secondary)]
                transition-all duration-300 group micro-interaction hover-lift
              "
              onClick={() => setShowDifficultySelect(true)}
            >
              <div className="text-center">
                <div className="font-semibold text-[var(--text-secondary)] leading-tight mb-1 text-xs">
                  AI 분류 모델의 정확도 향상을 위해
                </div>
                <div className="font-semibold text-[var(--color-primary)] leading-tight text-xs">
                  난이도 의견을 추가해주세요!
                </div>
              </div>
            </button>
          ) : (
            <div className="space-y-3 animate-fade-in-scale">
              <div className="text-center">
                <span className="text-xs text-[var(--text-muted)]">이 이슈의 난이도는?</span>
              </div>
              <div className="flex gap-2 justify-center">
                {(['EASY', 'MEDIUM', 'HARD', 'MISC'] as const).map((value, index) => (
                  <button
                    key={value}
                    disabled={isSubmitting}
                    className={`
                      flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg text-2xs font-semibold
                      ${labelStyle[value].bg} ${labelStyle[value].text} ${labelStyle[value].border}
                      ${labelStyle[value].hover}
                      border transition-all duration-300 micro-interaction hover-lift
                      disabled:opacity-50 disabled:cursor-not-allowed
                      animate-fade-in-up
                    `}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => {
                      postDifficultyOpinion(issueUrl, value);
                    }}
                  >
                    <span>{labelText[value]}</span>
                    {isSubmitting && (
                      <div className="ml-1">
                        <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowDifficultySelect(false)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-200 micro-interaction"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
