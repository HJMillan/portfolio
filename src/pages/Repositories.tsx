import { useState, useMemo } from 'react';
import { useGitHubRepos } from '@/hooks/useGitHubRepos';
import { RepoCard } from '@/components/widgets/RepoCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { getLanguageColor } from '@/lib/utils';

const SORT_LABELS: Record<'updated' | 'stars' | 'name', string> = {
  updated: 'Recientes',
  stars: 'Estrellas',
  name: 'Nombre',
};

export default function Repositories() {
  const { repos } = useGitHubRepos();
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'name'>('updated');

  // Extract unique languages
  const languages = useMemo(() => {
    const set = new Set(
      repos.map((r) => r.language).filter((lang): lang is string => !!lang)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [repos]);

  // Filter and sort
  const filtered = useMemo(() => {
    let result = repos;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.topics.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (languageFilter) {
      result = result.filter((r) => r.language === languageFilter);
    }

    switch (sortBy) {
      case 'stars':
        result = [...result].sort((a, b) => b.stargazers_count - a.stargazers_count);
        break;
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'updated':
      default:
        // Already sorted by API
        break;
    }

    return result;
  }, [repos, search, languageFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar repositorios..."
          className="w-full sm:w-64"
        />

        {/* Sort buttons */}
        <div className="flex gap-2">
          {(['updated', 'stars', 'name'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-3 py-1.5 text-xs rounded-md border transition-all duration-200 cursor-pointer ${
                sortBy === option
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border-subtle bg-surface text-text-muted hover:text-text-secondary'
              }`}
            >
              {SORT_LABELS[option]}
            </button>
          ))}
        </div>
      </div>

      {/* Language filter chips */}
      {languages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setLanguageFilter(null)}
            className={`cursor-pointer ${languageFilter ? 'opacity-50 hover:opacity-80' : ''}`}
          >
            <Badge size="md" variant={languageFilter ? 'outline' : 'filled'}>
              Todos
            </Badge>
          </button>
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() =>
                setLanguageFilter(languageFilter === lang ? null : lang)
              }
              className={`cursor-pointer ${languageFilter === lang ? '' : 'opacity-60 hover:opacity-90'}`}
            >
              <Badge
                size="md"
                color={getLanguageColor(lang)}
                variant={languageFilter === lang ? 'filled' : 'outline'}
              >
                {lang}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {/* Repos grid */}
      <p className="text-xs text-text-muted">
        {filtered.length} repositorio{filtered.length === 1 ? '' : 's'}
        {search && ` para "${search}"`}
        {languageFilter && ` en ${languageFilter}`}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((repo, index) => (
          <RepoCard key={repo.id} repo={repo} index={index} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center py-12 text-text-muted text-sm">
          No se encontraron repositorios
        </p>
      )}
    </div>
  );
}
