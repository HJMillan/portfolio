import { profile, kpis } from '@/data/github-data';
import type { GitHubUser, PortfolioKPIs } from '@/types';

interface UseGitHubStatsReturn {
  profile: GitHubUser;
  kpis: PortfolioKPIs;
  loading: boolean;
  error: string | null;
}

/**
 * Returns profile and KPI data from build-time GraphQL data.
 * No runtime fetch — data is pre-built.
 */
export function useGitHubStats(): UseGitHubStatsReturn {
  return { profile, kpis, loading: false, error: null };
}
