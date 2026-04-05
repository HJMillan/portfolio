import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  Mail,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Terminal,
} from 'lucide-react';
import { NAV_ITEMS, FULL_NAME } from '@/data/personal';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  Mail,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-surface border border-border-subtle text-text-secondary hover:text-accent transition-colors cursor-pointer"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Navegación"
        />
      )}

      {/* Sidebar — Desktop */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-50 bg-surface border-r border-border-subtle flex flex-col transition-all duration-300',
          'hidden lg:flex',
          collapsed ? 'w-16' : 'w-60',
        )}
        aria-label="Navegación principal"
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      </aside>

      {/* Sidebar — Mobile */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 h-full z-50 bg-surface border-r border-border-subtle flex flex-col w-60 transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Navegación principal"
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          aria-label="Cerrar menú"
        >
          <X size={18} />
        </button>
        <SidebarContent
          collapsed={false}
          onToggle={() => setMobileOpen(false)}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>
    </>
  );
}

function SidebarContent({
  collapsed,
  onToggle,
  onNavigate,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 h-16 border-b border-border-subtle shrink-0',
        collapsed && 'justify-center px-0'
      )}>
        <div className="w-8 h-8 rounded-sm bg-accent/20 flex items-center justify-center shrink-0">
          <Terminal size={16} className="text-accent" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-text-primary truncate animate-slide-right">
            {FULL_NAME}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group',
                  collapsed ? 'justify-center px-2' : 'px-3',
                  isActive
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-transparent'
                )
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden lg:block border-t border-border-subtle p-2">
        <button
          onClick={onToggle}
          className={cn(
            'flex items-center gap-2 w-full py-2 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer text-xs',
            collapsed ? 'justify-center px-2' : 'px-3'
          )}
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Colapsar</span>}
        </button>
      </div>
    </>
  );
}
