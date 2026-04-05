import { Star, ExternalLink, GitFork } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getLanguageColor, timeAgo, sanitizeUrl } from '@/lib/utils';
import type { GitHubRepo } from '@/types';

interface RepoCardProps {
  repo: GitHubRepo;
  index?: number;
}

export function RepoCard({ repo, index = 0 }: Readonly<RepoCardProps>) {
  return (
    <a
      href={sanitizeUrl(repo.html_url)}
      target="_blank"
      rel="noopener noreferrer"
      className="block group animate-scale-in opacity-0"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <Card
        padding="md"
        className="h-full hover:border-accent/40 cursor-pointer"
      >
        <div className="flex flex-col h-full gap-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-text-primary font-mono group-hover:text-accent transition-colors truncate">
              {repo.name}
            </h3>
            <ExternalLink
              size={14}
              className="text-text-muted group-hover:text-accent transition-colors shrink-0 mt-0.5"
            />
          </div>

          {/* Description */}
          <p className="text-xs text-text-secondary leading-relaxed flex-1 line-clamp-2">
            {repo.description ?? 'Sin descripción disponible'}
          </p>

          {/* Topics */}
          {repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {repo.topics.slice(0, 4).map((topic) => (
                <Badge key={topic} size="sm" variant="outline">
                  {topic}
                </Badge>
              ))}
              {repo.topics.length > 4 && (
                <Badge size="sm" variant="outline">
                  +{repo.topics.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 pt-1 border-t border-border-subtle">
            {/* Language */}
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                />
                <span className="text-xs text-text-secondary font-mono">
                  {repo.language}
                </span>
              </div>
            )}

            {/* Stars */}
            {repo.stargazers_count > 0 && (
              <div className="flex items-center gap-1 text-text-muted">
                <Star size={12} />
                <span className="text-xs font-mono">
                  {repo.stargazers_count}
                </span>
              </div>
            )}

            {/* Forks */}
            {repo.forks_count > 0 && (
              <div className="flex items-center gap-1 text-text-muted">
                <GitFork size={12} />
                <span className="text-xs font-mono">
                  {repo.forks_count}
                </span>
              </div>
            )}

            {/* Updated */}
            <span className="text-xs text-text-muted ml-auto font-mono">
              {timeAgo(repo.updated_at)}
            </span>
          </div>
        </div>
      </Card>
    </a>
  );
}
