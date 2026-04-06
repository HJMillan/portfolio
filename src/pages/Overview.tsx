import { kpis, languages } from '@/data/github-data';
import { KPIRow } from '@/components/widgets/KPIRow';
import { ProfileWidget } from '@/components/widgets/ProfileWidget';
import { StackChart } from '@/components/widgets/StackChart';
import { GitHubCalendarWidget } from '@/components/widgets/GitHubCalendarWidget';
import { FeaturedProjectsWidget } from '@/components/widgets/FeaturedProjectsWidget';

export default function Overview() {

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <KPIRow
        kpis={kpis}
        languageCount={languages.length}
      />

      {/* Main grid: Profile + Stack Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfileWidget />
        </div>
        <div className="md:col-span-2">
          <StackChart languages={languages} loading={false} />
        </div>
      </div>

      {/* GitHub Calendar */}
      <GitHubCalendarWidget />

      {/* Featured Projects */}
      <FeaturedProjectsWidget />
    </div>
  );
}
