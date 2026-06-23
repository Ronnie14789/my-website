import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { staggerContainer, fadeInUp } from '@/hooks/useStaggerAnimation';

interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  status: string;
  createdAt: string;
}

const AdminNewsletter: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  const load = async () => {
    try {
      const { data } = await api.get('/newsletter', { params: { status: filter, limit: 100 } });
      setSubscribers(data.data);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const deleteSubscriber = async (id: string) => {
    try {
      await api.delete(`/newsletter/${id}`);
      toast.success('Subscriber deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Newsletter Subscribers</h1>
          <p className="mt-1 text-slate-400">{subscribers.length} {filter} subscribers</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-800 bg-dark-950 px-4 py-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none"
        >
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
      </motion.div>

      <motion.div variants={fadeInUp} className="overflow-hidden rounded-xl border border-slate-800 bg-dark-950">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="py-12 text-center text-slate-500">No subscribers</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800">
                <tr className="text-slate-500">
                  {['Email', 'Name', 'Status', 'Subscribed', 'Actions'].map((heading) => (
                    <th key={heading} className="px-6 py-4 text-left font-medium">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber._id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                    <td className="px-6 py-4 text-white">{subscriber.email}</td>
                    <td className="px-6 py-4 text-slate-400">{subscriber.name || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2 py-1 text-xs ${subscriber.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'}`}>
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{new Date(subscriber.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => deleteSubscriber(subscriber._id)} className="rounded border border-red-500/20 px-2 py-1 text-xs text-red-400 hover:text-red-300">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminNewsletter;
