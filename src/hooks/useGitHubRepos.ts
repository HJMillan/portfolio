import { repos } from '@/data/github-data';
import type { GitHubRepo } from '@/types';

interface UseGitHubReposReturn {
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

/**
 * Returns all public repos from build-time GraphQL data.
 * No runtime fetch — data is pre-built.
 */
export function useGitHubRepos(): UseGitHubReposReturn {
  return { repos, loading: false, error: null };
}
