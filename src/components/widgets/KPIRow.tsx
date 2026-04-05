import {
  FolderGit2,
  Code2,
  GitPullRequest,
  GitCommitHorizontal,
} from 'lucide-react';
import { KPICard } from './KPICard';
import type { PortfolioKPIs } from '@/types';

interface KPIRowProps {
  kpis: PortfolioKPIs;
  languageCount: number;
}

export function KPIRow({ kpis, languageCount }: Readonly<KPIRowProps>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        label="Repositorios"
        value={kpis.publicRepos}
        icon={<FolderGit2 size={20} className="text-accent" />}
        description="Proyectos públicos"
        accentColor="teal"
      />
      <KPICard
        label="Commits este año"
        value={kpis.totalCommits}
        icon={<GitCommitHorizontal size={20} className="text-accent-alt" />}
        description={`${kpis.totalContributions} contribuciones totales`}
        accentColor="purple"
      />
      <KPICard
        label="PRs Mergeados"
        value={kpis.mergedPRs}
        icon={<GitPullRequest size={20} className="text-success" />}
        description="Pull Requests integrados"
        accentColor="green"
      />
      <KPICard
        label="Lenguajes"
        value={languageCount}
        icon={<Code2 size={20} className="text-warning" />}
        description="Tecnologías en stack"
        accentColor="amber"
      />
    </div>
  );
}
