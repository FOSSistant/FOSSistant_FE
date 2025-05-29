import React from 'react';

const DifficultyContent = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold mb-2">난이도 분류 기준</h2>
    <div>
      <p className="mb-2">🔥 <strong>상 (Hard)</strong></p>
      <p className="text-gray-300">문제 해결을 위해 다방면의 기술적 지식이 필요하며, 시간과 리서치가 많이 소요됩니다.</p>
      <p className="text-gray-400 text-sm">예시: 비동기 동기화 이슈, 멀티쓰레드 충돌, SSR+CSR 복합 인증 이슈 등</p>
    </div>
    <div>
      <p className="mb-2">⚙️ <strong>중 (Medium)</strong></p>
      <p className="text-gray-300">도전해볼 만한 수준의 난이도이며, 명확한 원인을 알 수 있는 경우가 많고 해결 과정도 비교적 명료합니다.</p>
      <p className="text-gray-400 text-sm">예시: API 요청 실패 원인 파악, props/state 구조 오류 등</p>
    </div>
    <div>
      <p className="mb-2">🧩 <strong>하 (Easy)</strong></p>
      <p className="text-gray-300">비교적 쉽게 해결 가능한 이슈입니다. 기본적인 디버깅과 콘솔 확인만으로도 원인을 파악할 수 있습니다.</p>
      <p className="text-gray-400 text-sm">예시: 클래스 오타, 라우팅 주소 오류 등</p>
    </div>
    <div>
      <p className="mb-2">❓ <strong>알 수 없음</strong></p>
      <p className="text-gray-300">증상은 명확하지만 재현 조건이 불명확하거나, 여러 원인이 겹쳐 있어 난이도 판단이 어려운 경우입니다.</p>
      <p className="text-gray-400 text-sm">예시: 환경 의존적인 버그, 간헐적 발생 이슈 등</p>
    </div>
  </div>
);

export default DifficultyContent; 