export const IssueList = () => {
  const difficulties = [
    {
      level: '🔥 hard',
      color: 'text-[var(--color-danger)]',
      bgColor: 'bg-[var(--color-danger-bg)]',
      borderColor: 'border-[var(--color-danger-border)]',
      hoverBg: 'hover:bg-[var(--color-danger-bg)]',
      title: '고난도',
      description: '문제 해결을 위해 다방면의 기술적 지식이 필요하며, 시간과 리서치가 많이 소요됩니다.',
      examples: '비동기 동기화 이슈, 멀티쓰레드 충돌, SSR+CSR 복합 인증 등'
    },
    {
      level: '⚙️ medium',
      color: 'text-[var(--color-warning)]',
      bgColor: 'bg-[var(--color-warning-bg)]',
      borderColor: 'border-[var(--color-warning-border)]',
      hoverBg: 'hover:bg-[var(--color-warning-bg)]',
      title: '적당함',
      description: '도전해볼 만한 수준의 난이도이며, 명확한 원인을 알 수 있는 경우가 많고 해결 과정도 비교적 명료합니다.',
      examples: 'API 요청 실패 원인 파악, props/state 구조 오류, 로직 흐름 개선 등'
    },
    {
      level: '🧩 easy',
      color: 'text-[var(--color-success)]',
      bgColor: 'bg-[var(--color-success-bg)]',
      borderColor: 'border-[var(--color-success-border)]',
      hoverBg: 'hover:bg-[var(--color-success-bg)]',
      title: '초보자용',
      description: '비교적 쉽게 해결 가능한 이슈입니다. 기본적인 디버깅과 콘솔 확인만으로도 원인을 파악할 수 있습니다.',
      examples: '클래스명 오타, 라우팅 주소 오류, 간단한 UI 수정 등'
    },
    {
      level: '📌 misc',
      color: 'text-[var(--color-gray)]',
      bgColor: 'bg-[var(--color-gray-bg)]',
      borderColor: 'border-[var(--color-gray-border)]',
      hoverBg: 'hover:bg-[var(--color-gray-bg)]',
      title: '기타',
      description: '개발 난이도와 무관한 이슈입니다. 기능 요청, 질문, 토론 등이 해당됩니다.',
      examples: '기능 요청, 질문/토론, 문서화 요청 등'
    },
    {
      level: '❓ unknown',
      color: 'text-[var(--color-gray)]',
      bgColor: 'bg-[var(--color-gray-bg)]',
      borderColor: 'border-[var(--color-gray-border)]',
      hoverBg: 'hover:bg-[var(--color-gray-bg)]',
      title: '미분류',
      description: 'AI 모델이 분류에 확신을 가지지 못할 때 사용됩니다. 정보가 부족하거나 애매한 경우입니다.',
      examples: '정보 부족, 모델 분류 실패, 분석 필요 등'
    }
  ];

  return (
    <div
      className="p-6 rounded-2xl shadow-lg border border-[var(--border-primary)] text-[var(--text-primary)] space-y-4 transition-all duration-300 hover:shadow-xl hover:border-[var(--border-secondary)] hover-lift animate-fade-in-scale gradient-bg custom-scrollbar"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)'
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center gap-3 pb-2 border-b border-[var(--border-primary)] animate-fade-in-up">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-primary)]">이슈 난이도 분류 기준</h1>
          <p className="text-xs text-[var(--text-muted)]">AI 분류 모델이 평가하는 오픈소스 이슈의 난이도 가이드라인</p>
        </div>
      </div>

      {/* 난이도 카드들 */}
      <div className="space-y-3">
        {difficulties.map((item, index) => (
          <div
            key={item.level}
            className={`group relative p-4 rounded-xl border transition-all duration-300 hover-lift animate-fade-in-up ${item.bgColor} ${item.borderColor} ${item.hoverBg}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* 헤더 */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <h2 className={`text-sm font-bold ${item.color}`}>
                  {item.title}
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.bgColor} ${item.color} border ${item.borderColor}`}>
                  {item.level}
                </span>
              </div>
            </div>

            {/* 설명 */}
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
              {item.description}
            </p>

            {/* 예시 */}
            <div className="text-xs">
              <span className="font-medium text-[var(--text-secondary)]">예시: </span>
              <span className="text-[var(--text-muted)] italic">
                {item.examples}
              </span>
            </div>

            {/* 호버 효과 */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className={`w-2 h-2 rounded-full animate-pulse ${item.color.replace('text-[var(--color-', 'bg-[var(--color-').replace(')]', '-bg)]')}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* 푸터 */}
      <div className="pt-3 border-t border-[var(--border-primary)] text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <p className="text-xs text-[var(--text-muted)]">
          여러분의 피드백이 AI 모델을 더 똑똑하게 만듭니다
        </p>
      </div>
    </div>
  );
};
