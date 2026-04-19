import { fetchWithAuth } from './api';

export interface Repository {
  name: string;
  owner: string;
  description?: string;
}

export async function listRepositories(): Promise<{ repos: Repository[] }> {
  return fetchWithAuth<{ repos: Repository[] }>('/github/repos');
}

export async function getRepository(owner: string, repo: string): Promise<{ repo: Repository }> {
  return fetchWithAuth<{ repo: Repository }>(`/github/repos/${owner}/${repo}`);
}

// Additional GitHub functions would be implemented here
export async function listBranches(owner: string, repo: string): Promise<{ branches: string[] }> {
  return fetchWithAuth<{ branches: string[] }>(`/github/repos/${owner}/${repo}/branches`);
}

export async function getCommits(owner: string, repo: string, branch: string): Promise<{ commits: Array<{ id: string, message: string, author: string, date: string }> }> {
  return fetchWithAuth<{ commits: Array<{ id: string, message: string, author: string, date: string }> }>(`/github/repos/${owner}/${repo}/commits?branch=${branch}`);
}