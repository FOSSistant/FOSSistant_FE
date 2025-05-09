export const TrendyRepos = ({repos}: {repos: any}) => {

  
  return (
    <div
      className="p-6 rounded-2xl shadow-lg border border-[#444] text-[#e0e0e0] space-y-4"
      style={{ backgroundColor: '#2d2d2d' }}
    >
      <h3>🔥 트렌딩 레포지토리</h3>
      <div className="space-y-4">
        {repos.map((repo: any) => (
          <div 
            key={repo.name} 
            className="bg-[#3a3a3a] border border-[#555] rounded-lg p-4 hover:border-[#666] transition-colors"
          >
            <a 
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer" 
              className="text-lg font-semibold text-blue-400 hover:text-blue-300"
            >
              {repo.name}
            </a>
            <p className="text-[#cccccc] mt-2 text-sm">{repo.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                ⭐ {repo.stars.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                💻 {repo.language}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
