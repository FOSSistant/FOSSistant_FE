export const IssueList = () => {
  return (
    <div
      className="p-6 rounded-2xl shadow-lg border border-[#444] text-[#e0e0e0] space-y-6"
      style={{ backgroundColor: '#2d2d2d' }}
    >
      <h1 className="text-2xl font-bold text-white">이슈 난이도 분류 기준</h1>

      <div className="space-y-4 text-sm">
        {/* 상 */}
        <div className="bg-[#3a3a3a] border border-[#555] rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-400">상 🔥</h2>
          <p className="text-[#cccccc] mt-1">
            문제 해결을 위해 다방면의 기술적 지식이 필요하며, 시간과 리서치가 많이 소요됩니다.
            <br />
            예시: 비동기 동기화 이슈, 멀티쓰레드 충돌, SSR+CSR 복합 인증 이슈 등
          </p>
        </div>

        {/* 중 */}
        <div className="bg-[#3a3a3a] border border-[#555] rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-400">중 ⚙️</h2>
          <p className="text-[#cccccc] mt-1">
            도전해볼 만한 수준의 난이도이며, 명확한 원인을 알 수 있는 경우가 많고 해결 과정도 비교적 명료합니다.
            <br />
            예시: API 요청 실패 원인 파악, props/state 구조 오류 등
          </p>
        </div>

        {/* 하 */}
        <div className="bg-[#3a3a3a] border border-[#555] rounded-lg p-4">
          <h2 className="text-lg font-semibold text-green-400">하 🧩</h2>
          <p className="text-[#cccccc] mt-1">
            비교적 쉽게 해결 가능한 이슈입니다. 기본적인 디버깅과 콘솔 확인만으로도 원인을 파악할 수 있습니다.
            <br />
            예시: 클래스 오타, 라우팅 주소 오류 등
          </p>
        </div>

        {/* 알 수 없음 */}
        <div className="bg-[#3a3a3a] border border-[#555] rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-400">알 수 없음 ❓</h2>
          <p className="text-[#cccccc] mt-1">
            증상은 명확하지만 재현 조건이 불명확하거나, 여러 원인이 겹쳐 있어 난이도 판단이 어려운 경우입니다.
            <br />
            예시: 환경 의존적인 버그, 간헐적 발생 이슈 등
          </p>
        </div>
      </div>
    </div>
  );
};
