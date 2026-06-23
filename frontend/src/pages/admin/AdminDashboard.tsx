import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '@/lib/api';
import { staggerContainer, fadeInUp, scaleIn } from '@/hooks/useStaggerAnimation';

interface DashboardStats {
  contacts: { total: number; new: number };
  blog: { total: number; published: number };
  projects: { total: number; featured: number };
  testimonials: { pending: number };
  newsletter: { total: number; active: number };
  topPosts: Array<{ title: string; views: number }>;
}

interface ContactTrend {
  _id: string;
  count: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trend, setTrend] = useState<ContactTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/analytics/dashboard'), api.get('/analytics/contacts/trend')])
      .then(([statsRes, trendRes]) => {
        setStats(statsRes.data.data as DashboardStats);
        setTrend(trendRes.data.data as ContactTrend[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p>Failed to load dashboard.</p>
        <p className="text-sm mt-2">Make sure the backend is running on port 3001.</p>
      </div>
    );
  }

  const trendData = trend.map((item) => ({
    date: item._id.slice(5),
    count: item.count,
  }));

  const statCards = [
    {
      label: 'Total Contacts',
      value: stats.contacts.total,
      sub: `${stats.contacts.new} new`,
      icon: '📬',
    },
    {
      label: 'Blog Posts',
      value: stats.blog.published,
      sub: `${stats.blog.total} total`,
      icon: '📝',
    },
    {
      label: 'Projects',
      value: stats.projects.total,
      sub: `${stats.projects.featured} featured`,
      icon: '🗂️',
    },
    {
      label: 'Newsletter',
      value: stats.newsletter.active,
      sub: `${stats.newsletter.total} total`,
      icon: '📧',
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back, Admin</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            variants={scaleIn}
            className="bg-slate-950 rounded-xl p-6 border border-slate-800 hover:border-blue-500/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                {card.sub}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
            <div className="text-slate-400 text-sm">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          variants={fadeInUp}
          className="bg-slate-950 rounded-xl p-6 border border-slate-800"
        >
          <h3 className="text-white font-semibold mb-4">Contact Submissions (7 Days)</h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="contactGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: 8,
                    color: '#f1f5f9',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  fill="url(#contactGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500">
              No data yet
            </div>
          )}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="bg-slate-950 rounded-xl p-6 border border-slate-800"
        >
          <h3 className="text-white font-semibold mb-4">Top Blog Posts</h3>
          {stats.topPosts.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={stats.topPosts.map((p) => ({
                  name: p.title.length > 20 ? p.title.slice(0, 20) + '…' : p.title,
                  views: p.views,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 10 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: 8,
                    color: '#f1f5f9',
                  }}
                />
                <Bar dataKey="views" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500">
              No blog posts yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Pending alert */}
      {stats.testimonials.pending > 0 && (
        <motion.div
          variants={fadeInUp}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3"
        >
          <span className="text-yellow-400 text-xl">⚠️</span>
          <span className="text-yellow-300">
            {stats.testimonials.pending} testimonial
            {stats.testimonials.pending > 1 ? 's' : ''} pending approval
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
