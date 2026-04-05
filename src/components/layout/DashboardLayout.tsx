import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      {/* Skip to content — a11y */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:z-60 focus:px-4 focus:py-2 focus:bg-accent focus:text-bg focus:rounded-md focus:text-sm focus:font-medium"
      >
        Saltar al contenido
      </a>

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Main content area */}
      <div
        className={cn(
          'transition-all duration-300 min-h-screen flex flex-col',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
        )}
      >
        <Header />

        <main id="main-content" className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
