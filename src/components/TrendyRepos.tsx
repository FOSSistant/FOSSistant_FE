export const TrendyRepos = ({repos}: {repos: any}) => {

  
  return (
    <div
      className="p-4 rounded-xl shadow-md border border-[#444] text-[#e0e0e0] space-y-3"
      style={{ backgroundColor: '#232323' }}
    >
      <h3 className="text-base font-bold mb-2">🔥 트렌딩 레포지토리</h3>
      <div className="space-y-2">
        {repos.map((repo: any) => (
          <div 
            key={repo.name} 
            className="bg-[#2c2c2c] border border-[#444] rounded-md p-3 hover:border-[#666] transition-colors"
          >
            <a 
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer" 
              className="text-sm font-semibold text-blue-300 hover:text-blue-200"
            >
              {repo.name}
            </a>
            <p className="text-xs text-[#bbbbbb] mt-1">{repo.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
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
