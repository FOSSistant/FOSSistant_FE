import React, { useEffect, useRef, useState } from 'react';
import { submitDifficultyOpinion, getDifficultyOpinion } from '../api/issueApi';
import { toast, Toaster } from 'react-hot-toast';
interface DifficultyOpinionProps {
  issueUrl: string;
}

const labelStyle = {
  EASY: 'bg-#43a047 text-green-700 border border-rgba(67, 160, 71, 0.2)',
  MEDIUM: 'bg-#f57c00 text-yellow-700 border border-rgba(255, 152, 0, 0.2)',
  HARD: 'bg-#e53935 text-red-700 border border-rgba(229, 57, 53, 0.2)',
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



  const postDifficultyOpinion = async (issueId: string, feedBackTag: string): Promise<any> => {
    const response = await submitDifficultyOpinion(issueId, feedBackTag);
    if (response) {
      setDifficultyOpinion(feedBackTag);
      setShowDifficultySelect(false);
      toast.success('난이도 의견을 추가했습니다.');
      fetchDifficultyOpinion();
    }
    else {
      toast.error('난이도 의견을 추가하는데 실패했습니다.');
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
      <Toaster position="top-center"/>
      {difficultyOpinion ? (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-300">내가 선택한 난이도:</span>
          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${labelStyle[difficultyOpinion as keyof typeof labelStyle]}`}
          >
            <span>{labelIcon[difficultyOpinion as keyof typeof labelIcon]}</span>
            <span>{labelText[difficultyOpinion as keyof typeof labelText]}</span>
          </span>
        </div>
      ) : (
        <div className="mb-2 flex flex-col items-center">
          {!showDifficultySelect ? (
            <button
              className="flex flex-col items-center gap-1 text-sm bg-gray-800 shadow-md rounded-2xl px-4 py-3 mb-2 text-center hover:bg-gray-700 transition border border-gray-700"
              onClick={() => setShowDifficultySelect(true)}
            >
              <span className="text-2xl mb-1">💡</span>
              <span className="font-semibold text-gray-200 leading-tight">난이도 의견을 추가해주시면</span>
              <span className="font-semibold text-blue-400 leading-tight">오픈소스 라벨링이 더 정확해집니다!</span>
            </button>
          ) : (
            <div className="flex gap-2 mt-2">
              {(['EASY', 'MEDIUM', 'HARD'] as const).map((value) => (
                <button
                  key={value}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${labelStyle[value as keyof typeof labelStyle]} shadow-sm hover:scale-105 transition-transform`}
                  onClick={() => {
                    postDifficultyOpinion(issueUrl, value);
                  }}
                >
                  <span>{labelIcon[value as keyof typeof labelIcon]}</span>
                  <span>{labelText[value as keyof typeof labelText]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
