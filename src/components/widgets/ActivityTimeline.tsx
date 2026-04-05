import { useMemo } from 'react';
import {
  GitCommitHorizontal,
  Briefcase,
  GraduationCap,
  Award,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { GitHubRepo } from '@/types';
import linkedinData from '@/data/linkedin-data';
import { cn, timeAgo } from '@/lib/utils';

interface ActivityTimelineProps {
  repos: GitHubRepo[];
}

interface TimelineItem {
  id: string;
  type: 'commit' | 'work' | 'education' | 'certification';
  title: string;
  subtitle: string;
  date: string;
  sortDate: number;
}

const iconMap = {
  commit: GitCommitHorizontal,
  work: Briefcase,
  education: GraduationCap,
  certification: Award,
} as const;

const colorMap = {
  commit: 'text-accent bg-accent/10 border-accent/20',
  work: 'text-accent-alt bg-accent-alt/10 border-accent-alt/20',
  education: 'text-warning bg-warning/10 border-warning/20',
  certification: 'text-success bg-success/10 border-success/20',
} as const;

export function ActivityTimeline({ repos }: Readonly<ActivityTimelineProps>) {
  const items = useMemo(() => buildTimeline(repos), [repos]);

  return (
    <Card padding="lg">
      <h3 className="text-sm font-semibold text-text-primary mb-6">
        Actividad Reciente
      </h3>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-2 bottom-2 w-px bg-border-subtle" />

        <div className="space-y-4">
          {items.slice(0, 10).map((item, index) => {
            const Icon = iconMap[item.type];
            return (
              <div
                key={item.id}
                className="relative flex gap-4 items-start animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'relative z-10 size-8 rounded-full border flex items-center justify-center shrink-0',
                    colorMap[item.type]
                  )}
                >
                  <Icon size={14} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-1">
                  <p className="text-sm text-text-primary font-medium truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-text-muted">
                    {item.subtitle}
                  </p>
                </div>

                {/* Time */}
                <span className="text-xs text-text-muted font-mono whitespace-nowrap pt-1">
                  {item.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function buildTimeline(repos: GitHubRepo[]): TimelineItem[] {
  const items: TimelineItem[] = [];

  // Recent repo activity
  for (const repo of repos.slice(0, 6)) {
    items.push({
      id: `repo-${repo.id}`,
      type: 'commit',
      title: `Push en ${repo.name}`,
      subtitle: repo.description ?? 'Sin descripción',
      date: timeAgo(repo.pushed_at || repo.updated_at),
      sortDate: new Date(repo.pushed_at || repo.updated_at).getTime(),
    });
  }

  // Work experience
  for (const exp of linkedinData.experience) {
    items.push({
      id: exp.id,
      type: 'work',
      title: exp.role,
      subtitle: `${exp.company} · ${exp.period}`,
      date: exp.period.split(' – ')[0],
      sortDate: new Date(exp.startDate).getTime(),
    });
  }

  // Education
  for (const edu of linkedinData.education) {
    items.push({
      id: edu.id,
      type: 'education',
      title: edu.degree,
      subtitle: `${edu.institution} · ${edu.period}`,
      date: edu.period.split(' – ')[0],
      sortDate: new Date(`${edu.period.split(' – ')[0]}-01-01`).getTime(),
    });
  }

  // Sort by date descending
  return items.sort((a, b) => b.sortDate - a.sortDate);
}
