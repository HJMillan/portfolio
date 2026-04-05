import { useLocation } from 'react-router-dom';
import { Download } from 'lucide-react';
import { NAV_ITEMS, CV_URL } from '@/data/personal';
import { Button } from '@/components/ui/Button';

export function Header() {
  const location = useLocation();
  const currentNav = NAV_ITEMS.find((item) => item.path === location.pathname);
  const pageTitle = currentNav?.label ?? 'Dashboard';

  return (
    <header className="h-16 border-b border-border-subtle bg-surface/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 shrink-0 sticky top-0 z-30">
      {/* Left: page title (with left padding on mobile for hamburger button) */}
      <div className="pl-12 lg:pl-0">
        <h1 className="text-lg font-semibold text-text-primary">{pageTitle}</h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        <a href={CV_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" icon={<Download size={14} />}>
            <span className="hidden sm:inline">Descargar CV</span>
            <span className="sm:hidden">CV</span>
          </Button>
        </a>
      </div>
    </header>
  );
}
