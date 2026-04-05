import { LANGUAGE_COLORS } from '@/data/personal';

/**
 * Get the color associated with a programming language.
 */
export function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? LANGUAGE_COLORS.default;
}

/**
 * Format bytes into a human-readable string.
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Format a date string into a relative time (e.g., "hace 3 días").
 */
export function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear > 0) return `hace ${diffYear} año${diffYear > 1 ? 's' : ''}`;
  if (diffMonth > 0) return `hace ${diffMonth} mes${diffMonth > 1 ? 'es' : ''}`;
  if (diffDay > 0) return `hace ${diffDay} día${diffDay > 1 ? 's' : ''}`;
  if (diffHr > 0) return `hace ${diffHr} hora${diffHr > 1 ? 's' : ''}`;
  if (diffMin > 0) return `hace ${diffMin} minuto${diffMin > 1 ? 's' : ''}`;
  return 'justo ahora';
}

/**
 * Generate className from conditional map.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Sanitize a URL to prevent javascript: protocol injection.
 * Only allows https:, http:, and mailto: protocols.
 */
const SAFE_PROTOCOLS = new Set(['https:', 'http:', 'mailto:']);

export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '#';
  try {
    const parsed = new URL(url);
    return SAFE_PROTOCOLS.has(parsed.protocol) ? parsed.href : '#';
  } catch {
    return '#';
  }
}
