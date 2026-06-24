import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';

const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminNewsletter = lazy(() => import('./pages/admin/AdminNewsletter'));

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
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
      </ThemeProvider>
    </ErrorBoundary>
  );
}
