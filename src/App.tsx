import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Skeleton } from '@/components/ui/Skeleton';

// Lazy load pages for code splitting
const Overview = lazy(() => import('@/pages/Overview'));
const Repositories = lazy(() => import('@/pages/Repositories'));
const Experience = lazy(() => import('@/pages/Experience'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function PageLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <Skeleton height="110px" className="rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton height="200px" className="rounded-lg" />
        <Skeleton height="200px" className="rounded-lg" />
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <Overview />
                </Suspense>
              }
            />
            <Route
              path="repos"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Repositories />
                </Suspense>
              }
            />
            <Route
              path="experience"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Experience />
                </Suspense>
              }
            />
            <Route
              path="contact"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Contact />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<PageLoader />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}

export default App;
