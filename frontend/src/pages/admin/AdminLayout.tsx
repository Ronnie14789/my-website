import React, { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/admin/blog', label: 'Blog Posts', icon: '📝', exact: false },
  { path: '/admin/projects', label: 'Projects', icon: '🗂️', exact: false },
  { path: '/admin/testimonials', label: 'Testimonials', icon: '⭐', exact: false },
  { path: '/admin/contacts', label: 'Contacts', icon: '📬', exact: false },
  { path: '/admin/newsletter', label: 'Newsletter', icon: '📧', exact: false },
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const token = localStorage.getItem('admin_token');

  if (!token) return <Navigate to="/admin/login" replace />;

  const logout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  };

  const isActive = (item: (typeof NAV_ITEMS)[0]) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path) && item.path !== '/admin';
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-slate-950 border-r border-slate-800 flex flex-col transition-all duration-300 shrink-0`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-800 h-16">
          {sidebarOpen && (
            <span className="text-white font-bold text-lg">
              <span className="text-blue-400">E</span>R Admin
            </span>
          )}
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="text-slate-400 hover:text-white p-1 ml-auto"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                isActive(item) || (item.exact && location.pathname === '/admin')
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 text-slate-400 hover:text-red-400 w-full px-3 py-2 text-sm rounded-lg hover:bg-red-500/5 transition-all"
          >
            <span>🚪</span>
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-slate-900">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
