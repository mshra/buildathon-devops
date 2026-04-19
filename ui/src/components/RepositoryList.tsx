import React from 'react';
import { Repository } from '../services/githubService';

interface RepositoryListProps {
  repositories: Repository[];
  onSelect?: (repo: Repository) => void;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories, onSelect }) => {
  return (
    <div className="border border-[#33FF00]/30 p-2">
      <div className="text-center mb-2 border-b border-[#33FF00]/30 pb-1">GITHUB REPOSITORIES</div>
      <div className="grid grid-cols-1 gap-1">
        {repositories.length === 0 ? (
          <div className="text-[#33FF00]/70">No repositories found</div>
        ) : (
          repositories.map((repo) => (
            <button
              key={`${repo.owner}/${repo.name}`}
              onClick={() => onSelect?.(repo)}
              className="text-left px-2 py-1 hover:bg-[#33FF00]/20 transition-colors text-sm flex justify-between"
            >
              <span>{repo.name}</span>
              <span className="text-[#33FF00]/70">{repo.owner}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default RepositoryList;