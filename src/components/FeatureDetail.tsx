// src/components/FeatureDetail.tsx
import React from "react";
import '../index.css';  // Tailwind CSS import

interface FeatureDetailProps {
  index: number;
  onBack: () => void;
}

const features = [
  {
    title: "🧠 이슈 난이도 자동 분류",
    description:
      "GitHub 이슈 목록에서 각 이슈를 '하', '중', '상', '알 수 없음' 네 단계로 자동 분류해요.",
    detail: `✅ 분류 기준

🔥 상 (Hard)
문제 해결을 위해 다방면의 기술적 지식이 필요하며, 시간과 리서치가 많이 소요됩니다.
예시: 비동기 동기화 이슈, 멀티쓰레드 충돌, SSR+CSR 복합 인증 이슈 등

⚙️ 중 (Medium)
도전해볼 만한 수준의 난이도이며, 명확한 원인을 알 수 있는 경우가 많고 해결 과정도 비교적 명료합니다.
예시: API 요청 실패 원인 파악, props/state 구조 오류 등

🧩 하 (Easy)
비교적 쉽게 해결 가능한 이슈입니다. 기본적인 디버깅과 콘솔 확인만으로도 원인을 파악할 수 있습니다.
예시: 클래스 오타, 라우팅 주소 오류 등

❓ 알 수 없음
증상은 명확하지만 재현 조건이 불명확하거나, 여러 원인이 겹쳐 있어 난이도 판단이 어려운 경우입니다.
예시: 환경 의존적인 버그, 간헐적 발생 이슈 등`
  },
  {
    title: "📘 기여 가이드라인 제공",
    description:
      "이슈 상세 페이지에 들어가면 사이드 패널이 자동으로 열리며, 오픈소스 기여를 위한 실질적인 가이드를 단계별로 제공합니다.",
    detail: `🛠️ 제공 항목:
- 레포지토리 포크 및 클론 방법
- 새로운 브랜치 생성
- 커밋 메시지 작성 팁
- Pull Request 올리는 법
- 리뷰 요청 및 머지 대기 방법`
  },
  {
    title: "🔥 트렌딩 오픈소스 레포 탐색",
    description:
      "GitHub 트렌딩 페이지에 접속하면, 지금 뜨고 있는 인기 오픈소스 레포들을 자동으로 정리해서 보여줘요.",
    detail: `👀 정렬 기준:
- 별 개수 변화량
- 포크 횟수
- 최근 기여자 활동

직접 탐색하지 않아도, 관심 가질만한 레포를 한눈에 확인할 수 있어요.`,
    cta: {
      label: "트렌딩 레포 보기",
      href: "https://github.com/trending"
    }
  }
];

export const FeatureDetail: React.FC<FeatureDetailProps> = ({ index, onBack }) => {
  const feature = features[index];

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-sm text-blue-400 hover:underline mb-2"
      >
        ← 돌아가기
      </button>
      <h2 className="text-2xl font-semibold text-white">{feature.title}</h2>
      <p className="text-gray-300">{feature.description}</p>
      <pre className="whitespace-pre-wrap text-sm text-gray-400 bg-zinc-900 p-4 rounded-xl overflow-x-auto border border-zinc-700">
        {feature.detail}
      </pre>

      {feature.cta && (
        <div className="text-center mt-4">
          <a
            href={feature.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            {feature.cta.label}
          </a>
        </div>
      )}
    </div>
  );
};
