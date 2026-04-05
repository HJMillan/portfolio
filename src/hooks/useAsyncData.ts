import { useState, useEffect, useRef } from 'react';

/**
 * Generic async data fetching hook.
 * Eliminates boilerplate across useGitHubRepos, useGitHubStats, etc.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[],
  initialData: T | null = null
): { data: T | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetcherRef.current();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
