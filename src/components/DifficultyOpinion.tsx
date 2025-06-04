import React, { useEffect, useRef, useState } from 'react';
import { submitDifficultyOpinion, getDifficultyOpinion } from '../api/issueApi';
import { toast, Toaster } from 'react-hot-toast';

interface DifficultyOpinionProps {
  issueUrl: string;
}

const labelStyle = {
  EASY: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    border: 'border-green-400/20',
    hover: 'hover:bg-green-500/20 hover:border-green-400/30'
  },
  MEDIUM: {
    bg: 'bg-yellow-500/10', 
    text: 'text-yellow-400',
    border: 'border-yellow-400/20',
    hover: 'hover:bg-yellow-500/20 hover:border-yellow-400/30'
  },
  HARD: {
    bg: 'bg-red-500/10',
    text: 'text-red-400', 
    border: 'border-red-400/20',
    hover: 'hover:bg-red-500/20 hover:border-red-400/30'
  },
};

const labelText = {
  EASY: '쉬움',
  MEDIUM: '보통',
  HARD: '어려움',
};

const labelIcon = {
  EASY: '🧩',
  MEDIUM: '⚙️',
  HARD: '🔥',
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
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
          },
        });
        fetchDifficultyOpinion();
      } else {
        toast.error('난이도 의견을 추가하는데 실패했습니다.', {
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
          },
        });
      }
    } catch (error) {
      toast.error('오류가 발생했습니다.', {
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #333',
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
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#232323] border border-[#444] mb-3 hover-lift transition-all duration-300">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">내가 선택한 난이도:</span>
              <div className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold 
                ${labelStyle[difficultyOpinion as keyof typeof labelStyle].bg} 
                ${labelStyle[difficultyOpinion as keyof typeof labelStyle].text} 
                ${labelStyle[difficultyOpinion as keyof typeof labelStyle].border}
                border micro-interaction difficulty-badge
                animate-pulse-glow
              `}>
                <span className="text-base animate-pulse-glow">
                  {labelIcon[difficultyOpinion as keyof typeof labelIcon]}
                </span>
                <span>{labelText[difficultyOpinion as keyof typeof labelText]}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setDifficultyOpinion(null);
                setShowDifficultySelect(true);
              }}
              className="ml-auto text-gray-400 hover:text-white transition-colors duration-200 micro-interaction"
              title="난이도 변경"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                w-full flex flex-col items-center gap-2 text-sm rounded-xl px-4 py-4
                bg-gradient-to-br from-[#232323] to-[#1a1a1a] 
                border border-[#444] shadow-lg
                hover:from-[#2a2a2a] hover:to-[#212121] hover:border-[#555]
                transition-all duration-300 group micro-interaction hover-lift
              "
              onClick={() => setShowDifficultySelect(true)}
            >
              <div className="text-3xl mb-1 group-hover:scale-110 transition-transform duration-300 animate-pulse-glow">
                💡
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-200 leading-tight mb-1">
                  난이도 의견을 추가해주시면
                </div>
                <div className="font-semibold text-blue-400 leading-tight">
                  오픈소스 라벨링이 더 정확해집니다!
                </div>
              </div>
            </button>
          ) : (
            <div className="space-y-3 animate-fade-in-scale">
              <div className="text-center">
                <span className="text-sm text-gray-400">이 이슈의 난이도는?</span>
              </div>
              <div className="flex gap-3 justify-center">
                {(['EASY', 'MEDIUM', 'HARD'] as const).map((value, index) => (
                  <button
                    key={value}
                    disabled={isSubmitting}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
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
                    <span className="text-lg animate-pulse-glow">
                      {labelIcon[value]}
                    </span>
                    <span>{labelText[value]}</span>
                    {isSubmitting && (
                      <div className="ml-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
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
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200 micro-interaction"
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
