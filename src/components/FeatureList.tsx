// src/components/FeatureList.tsx
import React from "react";
import '../index.css';  // Tailwind CSS import

interface FeatureListProps {
  onSelect: (index: number) => void;
}

const features = [
  {
    title: "🧠 이슈 난이도 자동 분류",
    summary:
      "GitHub 이슈 목록에서 각 이슈를 난이도에 따라 자동 분류해요."
  },
  {
    title: "📘 기여 가이드라인 제공",
    summary:
      "이슈 상세 페이지에 들어가면 기여 가이드를 사이드 패널로 안내해줘요."
  },
  {
    title: "🔥 트렌딩 오픈소스 레포 탐색",
    summary:
      "지금 인기 있는 레포지토리를 자동으로 보여줘요."
  }
];

export const FeatureList: React.FC<FeatureListProps> = ({ onSelect }) => {
  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-gray-400 mb-4">
        👉 <span className="text-white font-medium">브라우저 오른쪽 상단</span> 사이드 패널 아이콘을 눌러 <br />
        <span className="text-blue-400 font-semibold">"지금 바로 실행해보세요!"</span>
      </div>

      {features.map((feature, idx) => (
        <div
          key={idx}
          onClick={() => onSelect(idx)}
          className="bg-zinc-800 cursor-pointer rounded-2xl border border-zinc-700 p-6 shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-white mb-2">{feature.title}</h2>
          <p className="text-gray-400 text-sm">{feature.summary}</p>
        </div>
      ))}
    </div>
  );
};