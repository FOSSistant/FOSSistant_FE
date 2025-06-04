import React from 'react';

interface UserProfileProps {
  nickname: string;
  avatarUrl: string;
  tier: 'easy' | 'medium' | 'hard' | 'misc' | string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ nickname, avatarUrl, tier }) => {
  // 난이도별 색상 및 아이콘
  const tierInfo = {
    easy: { 
      color: 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success-border)]', 
      label: '입문자',
      gradient: 'from-[var(--color-success-bg)] to-[var(--color-success-bg)]',
      glow: 'shadow-[var(--color-success)]'
    },
    medium: { 
      color: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning-border)]', 
      label: '중급자',
      gradient: 'from-[var(--color-warning-bg)] to-[var(--color-warning-bg)]',
      glow: 'shadow-[var(--color-warning)]'
    },
    hard: { 
      color: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)] border-[var(--color-danger-border)]', 
      label: '고급자',
      gradient: 'from-[var(--color-danger-bg)] to-[var(--color-danger-bg)]',
      glow: 'shadow-[var(--color-danger)]'
    },
    misc: { 
      color: 'bg-[var(--color-gray-bg)] text-[var(--color-gray)] border-[var(--color-gray-border)]', 
      label: '기타',
      gradient: 'from-[var(--color-gray-bg)] to-[var(--color-gray-bg)]',
      glow: 'shadow-[var(--color-gray)]'
    }
  };
  
  const info = tierInfo[tier as keyof typeof tierInfo] || tierInfo.misc;

  return (
    <div 
      className={`
        relative overflow-hidden
        flex flex-col items-center p-6 
        rounded-2xl shadow-lg border border-[var(--border-primary)] 
        text-[var(--text-primary)] w-full max-w-xs mx-auto
        transition-all duration-300 hover:shadow-xl hover:border-[var(--border-secondary)] 
        hover-lift animate-fade-in-scale gradient-bg custom-scrollbar
        bg-gradient-to-br ${info.gradient}
      `}
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)'
      }}
    >
      {/* 프로필 이미지 */}
      <div className="relative mb-4 animate-fade-in-up">
        <div className={`absolute inset-0 rounded-full blur-lg ${info.glow} opacity-30 animate-pulse`}></div>
        <img
          src={avatarUrl}
          alt="프로필 사진"
          className="relative w-20 h-20 rounded-full border-2 border-[var(--border-primary)] object-cover hover:scale-105 transition-transform duration-300 hover:border-[var(--border-secondary)]"
        />
        {/* 온라인 상태 표시 */}
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-[var(--color-success)] rounded-full border-2 border-[var(--bg-primary)] animate-pulse"></div>
      </div>
      
      {/* 사용자 정보 */}
      <div className="text-center space-y-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {/* 닉네임 */}
        <div>
          <div className="text-xl font-bold text-[var(--text-primary)] mb-1 hover:text-[var(--color-primary)] transition-colors duration-200">
            {nickname}
          </div>
          <div className="text-xs text-[var(--text-muted)]">오픈소스 기여자</div>
        </div>
        
        {/* 티어 배지 */}
        <div className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold 
          ${info.color} border transition-all duration-300 micro-interaction hover-lift
        `}>
          <span>{info.label}</span>
        </div>
      </div>

      {/* 하단 장식 */}
      <div className="mt-4 w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-center space-x-1">
          {[...Array(3)].map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full ${info.color.split(' ')[1]} animate-pulse`}
              style={{ animationDelay: `${index * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* 호버 시 글로우 효과 */}
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-10 transition-opacity duration-300 bg-gradient-to-t from-[var(--color-primary-bg)] to-[var(--color-primary-bg)]"></div>
    </div>
  );
};
