import type { GitHubPortfolioData } from '@/types';
import raw from './github-data.json';

// ✅ H-5: Type guard — valida estructura mínima antes del cast
function isValidPortfolioData(data: unknown): data is GitHubPortfolioData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.fetchedAt === 'string' &&
    Array.isArray(d.repos) &&
    Array.isArray(d.pinnedRepos) &&
    typeof d.profile === 'object' && d.profile !== null &&
    typeof d.kpis === 'object' && d.kpis !== null &&
    Array.isArray(d.languages)
  );
}

if (!isValidPortfolioData(raw)) {
  throw new Error(
    '[github-data] Estructura de datos inválida. Re-ejecutá: npm run fetch:data'
  );
}

/** Typed GitHub portfolio data fetched at build time via GraphQL. */
const githubData: GitHubPortfolioData = raw;

export const { profile, kpis, pinnedRepos, repos, languages, contributedTo, fetchedAt } = githubData;
export default githubData;
