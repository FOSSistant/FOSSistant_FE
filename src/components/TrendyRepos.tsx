export const TrendyRepos = ({repos}: {repos: any}) => {
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
          <h3 className="text-lg font-bold text-[var(--text-primary)]">트렌딩 레포지토리</h3>
          <p className="text-xs text-[var(--text-muted)]">AI가 분석한 GitHub의 인기 오픈소스 프로젝트</p>
        </div>
      </div>

      {/* 레포지토리 리스트 */}
      <div className="space-y-3">
        {repos.map((repo: any, index: number) => (
          <div 
            key={repo.name}
            className="group relative p-4 rounded-xl border border-[var(--border-primary)] bg-gradient-to-r from-[var(--bg-tertiary)] to-[var(--bg-secondary)] hover:from-[var(--bg-secondary)] hover:to-[var(--bg-secondary)] hover:border-[var(--border-secondary)] transition-all duration-300 hover-lift animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* 레포지토리 이름 */}
            <a 
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer" 
              className="block text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors duration-200 mb-2 group-hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-2">
                <span>{repo.name}</span>
                <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">↗</span>
              </div>
            </a>

            {/* 설명 */}
            <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
              {repo.description || '설명이 없습니다.'}
            </p>

            {/* 메타 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning-border)]">
                  <span className="font-medium">{repo.stars.toLocaleString()} Stars</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--color-primary-bg)] text-[var(--color-primary)] border border-[var(--color-primary-border)]">
                  <span className="font-medium">{repo.language || 'Unknown'}</span>
                </div>
              </div>
              
              {/* 호버 시 더보기 버튼 */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 푸터 */}
      <div className="pt-3 border-t border-[var(--border-primary)] text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <p className="text-xs text-[var(--text-muted)]">
          더 많은 프로젝트를 찾아보세요
        </p>
      </div>
    </div>
  );
};
