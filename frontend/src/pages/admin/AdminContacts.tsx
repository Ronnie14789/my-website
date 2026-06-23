import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { staggerContainer, fadeInUp } from '@/hooks/useStaggerAnimation';

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  createdAt: string;
  message: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400',
  read: 'bg-green-500/10 text-green-400',
  replied: 'bg-purple-500/10 text-purple-400',
  archived: 'bg-slate-500/10 text-slate-400',
};

const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [filter, setFilter] = useState('');

  const loadContacts = async () => {
    try {
      const { data } = await api.get('/contact', { params: filter ? { status: filter } : {} });
      setContacts(data.data);
    } catch {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/contact/${id}/status`, { status });
      await loadContacts();
      if (selected?._id === id) setSelected(null);
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
          <p className="mt-1 text-slate-400">{contacts.length} submissions</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-800 bg-dark-950 px-4 py-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </motion.div>

      <motion.div variants={fadeInUp} className="overflow-hidden rounded-xl border border-slate-800 bg-dark-950">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="py-12 text-center text-slate-500">No submissions found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800">
                <tr className="text-slate-500">
                  {['From', 'Subject', 'Status', 'Date', 'Actions'].map((heading) => (
                    <th key={heading} className="px-6 py-4 text-left font-medium">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="cursor-pointer border-b border-slate-800/50 transition-colors hover:bg-slate-800/20"
                    onClick={() => setSelected(contact)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{contact.name}</div>
                      <div className="text-xs text-slate-500">{contact.email}</div>
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-slate-300">{contact.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[contact.status]}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{new Date(contact.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <select
                        value={contact.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateStatus(contact._id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border border-slate-700 bg-dark-900 px-2 py-1 text-xs text-slate-300 focus:outline-none"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <motion.div
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-dark-950 p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{selected.subject}</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-slate-500">From:</span> <span className="text-white">{selected.name}</span>
              </div>
              <div>
                <span className="text-slate-500">Email:</span>{' '}
                <a href={`mailto:${selected.email}`} className="text-blue-400">
                  {selected.email}
                </a>
              </div>
              <div className="rounded-lg bg-dark-900 p-4 leading-relaxed text-slate-300">{selected.message}</div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminContacts;
