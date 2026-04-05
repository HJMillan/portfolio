import { useGitHubRepos } from '@/hooks/useGitHubRepos';
import { useGitHubStats } from '@/hooks/useGitHubStats';
import { languages } from '@/data/github-data';
import { KPIRow } from '@/components/widgets/KPIRow';
import { ProfileWidget } from '@/components/widgets/ProfileWidget';
import { StackChart } from '@/components/widgets/StackChart';
import { GitHubCalendarWidget } from '@/components/widgets/GitHubCalendarWidget';
import { ActivityTimeline } from '@/components/widgets/ActivityTimeline';
import { FeaturedProjectsWidget } from '@/components/widgets/FeaturedProjectsWidget';

export default function Overview() {
  const { repos } = useGitHubRepos();
  const { kpis } = useGitHubStats();

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <KPIRow
        kpis={kpis}
        languageCount={languages.length}
      />

      {/* Main grid: Profile + Stack Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProfileWidget />
        </div>
        <div className="lg:col-span-2">
          <StackChart languages={languages} loading={false} />
        </div>
      </div>

      {/* GitHub Calendar */}
      <GitHubCalendarWidget />

      {/* Featured Projects */}
      <FeaturedProjectsWidget />

      {/* Activity Timeline */}
      <ActivityTimeline repos={repos} />
    </div>
  );
}
