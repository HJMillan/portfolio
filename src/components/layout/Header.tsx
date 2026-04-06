import { useLocation } from 'react-router-dom';
import { ExternalLink, Sun, Moon } from 'lucide-react';
import { NAV_ITEMS, CV_URL } from '@/data/personal';
import { sanitizeUrl } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';

export function Header() {
  const location = useLocation();
  const { isDark, toggle } = useTheme();
  const currentNav = NAV_ITEMS.find((item) => item.path === location.pathname);
  const pageTitle = currentNav?.label ?? 'Dashboard';

  return (
    <header className="h-16 border-b border-border-subtle bg-surface/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 shrink-0 sticky top-0 z-30">
      {/* Left: page title (with left padding on mobile for hamburger button) */}
      <div className="pl-12 lg:pl-0">
        <h1 className="text-lg font-semibold text-text-primary">{pageTitle}</h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          className="p-2.5 rounded-md border border-border-subtle bg-surface text-text-secondary hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all duration-200 cursor-pointer"
          aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <a href={sanitizeUrl(CV_URL)} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" icon={<ExternalLink size={14} />}>
            <span className="hidden sm:inline">Ver LinkedIn</span>
            <span className="sm:hidden">LinkedIn</span>
          </Button>
        </a>
      </div>
    </header>
  );
}

