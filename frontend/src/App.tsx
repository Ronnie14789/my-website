import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppErrorBoundary from '@/components/AppErrorBoundary';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';
import { initGA, usePageTracking } from '@/lib/analytics';
import { initSentry } from '@/lib/sentry';

const Home = lazy(() => import('@/pages/Home'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminContacts = lazy(() => import('@/pages/admin/AdminContacts'));
const AdminBlog = lazy(() => import('@/pages/admin/AdminBlog'));
const AdminProjects = lazy(() => import('@/pages/admin/AdminProjects'));
const AdminTestimonials = lazy(() => import('@/pages/admin/AdminTestimonials'));
const AdminNewsletter = lazy(() => import('@/pages/admin/AdminNewsletter'));

const LoadingFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-dark-900">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
  </div>
);

const AnalyticsTracker: React.FC = () => {
  usePageTracking();
  return null;
};

const App: React.FC = () => {
  usePerformanceMetrics();

  useEffect(() => {
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA(import.meta.env.VITE_GA_MEASUREMENT_ID);
    }
  }, []);

  useEffect(() => {
    if (import.meta.env.VITE_SENTRY_DSN) {
      initSentry(import.meta.env.VITE_SENTRY_DSN);
    }
  }, []);

  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <AnalyticsTracker />
        <Suspense fallback={<LoadingFallback />}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ScrollToTop />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </Suspense>
      </BrowserRouter>
    </AppErrorBoundary>
  );
};

export default App;
