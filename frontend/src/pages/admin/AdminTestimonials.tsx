import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { staggerContainer, fadeInUp } from '@/hooks/useStaggerAnimation';

interface Testimonial {
  _id: string;
  name: string;
  company?: string;
  role?: string;
  content: string;
  rating: number;
  approved: boolean;
  featured: boolean;
  createdAt: string;
}

const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    try {
      const { data } = await api.get('/testimonials?admin=true');
      setTestimonials(data.data);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    try {
      await api.patch(`/testimonials/${id}/approve`);
      toast.success('Testimonial approved');
      load();
    } catch {
      toast.error('Failed to approve');
    }
  };

  const del = async (id: string) => {
    try {
      await api.delete(`/testimonials/${id}`);
      toast.success('Testimonial deleted');
      setConfirmDelete(null);
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl font-bold text-white">Testimonials</h1>
        <p className="mt-1 text-slate-400">{testimonials.filter((testimonial) => !testimonial.approved).length} pending approval</p>
      </motion.div>

      <motion.div variants={fadeInUp} className="space-y-4">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="py-12 text-center text-slate-500">No testimonials yet</div>
        ) : (
          testimonials.map((testimonial) => (
            <div key={testimonial._id} className={`rounded-xl border p-5 ${testimonial.approved ? 'border-slate-800 bg-dark-950' : 'border-yellow-500/20 bg-dark-950'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="font-semibold text-white">{testimonial.name}</span>
                    {testimonial.company && <span className="text-sm text-slate-500">@ {testimonial.company}</span>}
                    <span className="text-yellow-400">{'★'.repeat(testimonial.rating)}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${testimonial.approved ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {testimonial.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400">{testimonial.content}</p>
                </div>
                <div className="ml-4 flex gap-2">
                  {!testimonial.approved && (
                    <button onClick={() => approve(testimonial._id)} className="rounded border border-green-500/30 bg-green-600/20 px-3 py-1 text-xs text-green-400 hover:bg-green-600/30">
                      Approve
                    </button>
                  )}
                  <button onClick={() => setConfirmDelete(testimonial._id)} className="rounded border border-red-500/20 bg-red-600/10 px-3 py-1 text-xs text-red-400 hover:bg-red-600/20">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </motion.div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div className="w-full max-w-sm rounded-xl border border-slate-800 bg-dark-950 p-6" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
            <h3 className="mb-2 font-semibold text-white">Delete Testimonial?</h3>
            <p className="mb-6 text-sm text-slate-400">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => del(confirmDelete)} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white">Delete</button>
              <button onClick={() => setConfirmDelete(null)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminTestimonials;
