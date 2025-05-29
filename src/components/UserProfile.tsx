import React from 'react';

interface UserProfileProps {
  nickname: string;
  avatarUrl: string;
  tier: 'easy' | 'medium' | 'hard' | 'misc' | string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ nickname, avatarUrl, tier }) => {
  // 난이도별 색상 및 아이콘
  const tierInfo = {
    easy: { color: 'bg-green-200 text-green-900', icon: '🧩', label: '입문자' },
    medium: { color: 'bg-yellow-200 text-yellow-900', icon: '⚙️', label: '중급자' },
  };
  const info = tierInfo[tier as keyof typeof tierInfo];

  return (
    <div className="flex flex-col items-center p-6 bg-zinc-800 rounded-xl shadow-md w-full max-w-xs mx-auto border border-gray-700">
      <img
        src={avatarUrl}
        alt="프로필 사진"
        className="w-20 h-20 rounded-full border-2 border-gray-700 mb-3 object-cover"
      />
      <div className="text-xl font-bold mb-1 text-gray-400">{nickname}</div>
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${info.color}`}>
        <span>{info.icon}</span>
        <span>{info.label}</span>
      </div>
    </div>
  );
};
