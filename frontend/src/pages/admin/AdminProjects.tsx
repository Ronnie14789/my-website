import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { staggerContainer, fadeInUp } from '@/hooks/useStaggerAnimation';

interface Project {
  _id: string;
  title: string;
  shortDescription: string;
  status: string;
  featured: boolean;
  order: number;
  createdAt: string;
  tags: string[];
}

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ title: '', description: '', shortDescription: '', tags: '', technologies: '', status: 'active', featured: false, order: 0 });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', shortDescription: '', tags: '', technologies: '', status: 'active', featured: false, order: 0 });
    setShowForm(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: '',
      shortDescription: project.shortDescription,
      tags: project.tags.join(', '),
      technologies: '',
      status: project.status,
      featured: project.featured,
      order: project.order,
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title || !form.shortDescription) {
      toast.error('Title and description required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        technologies: form.technologies.split(',').map((tech) => tech.trim()).filter(Boolean),
        description: form.description || form.shortDescription,
      };
      if (editing) {
        await api.put(`/projects/${editing._id}`, payload);
        toast.success('Updated');
      } else {
        await api.post('/projects', payload);
        toast.success('Created');
      }
      setShowForm(false);
      load();
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Deleted');
      setConfirmDelete(null);
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="mt-1 text-slate-400">{projects.length} projects</p>
        </div>
        <button onClick={openCreate} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">+ New Project</button>
      </motion.div>

      <motion.div variants={fadeInUp} className="overflow-hidden rounded-xl border border-slate-800 bg-dark-950">
        {loading ? (
          <div className="flex h-32 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" /></div>
        ) : projects.length === 0 ? (
          <div className="py-12 text-center text-slate-500">No projects yet</div>
        ) : (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="border-b border-slate-800"><tr className="text-slate-500">{['Title', 'Status', 'Featured', 'Order', 'Actions'].map((heading) => <th key={heading} className="px-6 py-4 text-left font-medium">{heading}</th>)}</tr></thead>
            <tbody>{projects.map((project) => <tr key={project._id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
              <td className="px-6 py-4"><div className="font-medium text-white">{project.title}</div><div className="max-w-xs truncate text-xs text-slate-500">{project.shortDescription}</div></td>
              <td className="px-6 py-4"><span className={`rounded-full px-2 py-1 text-xs font-medium ${project.status === 'active' ? 'bg-green-500/10 text-green-400' : project.status === 'completed' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'}`}>{project.status}</span></td>
              <td className="px-6 py-4 text-slate-400">{project.featured ? '⭐' : '—'}</td>
              <td className="px-6 py-4 text-slate-400">{project.order}</td>
              <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => openEdit(project)} className="rounded border border-blue-500/30 px-2 py-1 text-xs text-blue-400">Edit</button><button onClick={() => setConfirmDelete(project._id)} className="rounded border border-red-500/30 px-2 py-1 text-xs text-red-400">Delete</button></div></td>
            </tr>)}</tbody>
          </table></div>
        )}
      </motion.div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <motion.div className="my-8 w-full max-w-lg rounded-2xl border border-slate-800 bg-dark-950 p-6" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
            <div className="mb-6 flex justify-between"><h3 className="text-lg font-semibold text-white">{editing ? 'Edit' : 'New'} Project</h3><button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">✕</button></div>
            <div className="space-y-4">
              {[['title','Title *','Project title'],['shortDescription','Short Description *','Brief description (max 300 chars)'],['description','Full Description','Full project description'],['tags','Tags (comma-sep)','Fleet Management, Diagnostics'],['technologies','Technologies (comma-sep)','React, Node.js']].map(([key,label,placeholder]) => (
                <div key={key}><label className="mb-1 block text-sm text-slate-300">{label}</label>
                  {key === 'description' ? <textarea value={form[key as keyof typeof form] as string} onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))} rows={3} className="w-full resize-none rounded-lg border border-slate-800 bg-dark-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" placeholder={placeholder} />
                  : <input value={form[key as keyof typeof form] as string} onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))} className="w-full rounded-lg border border-slate-800 bg-dark-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" placeholder={placeholder} />}
                </div>
              ))}
              <div className="flex gap-4">
                <div className="flex-1"><label className="mb-1 block text-sm text-slate-300">Status</label><select value={form.status} onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))} className="w-full rounded-lg border border-slate-800 bg-dark-900 px-3 py-2 text-sm text-slate-300"><option value="active">Active</option><option value="completed">Completed</option><option value="archived">Archived</option></select></div>
                <div><label className="mb-1 block text-sm text-slate-300">Order</label><input type="number" min="0" value={form.order} onChange={(e) => setForm((current) => ({ ...current, order: parseInt(e.target.value, 10) || 0 }))} className="w-20 rounded-lg border border-slate-800 bg-dark-900 px-3 py-2 text-sm text-white" /></div>
                <div className="flex flex-col justify-end"><label className="cursor-pointer items-center gap-2 pb-2 text-sm text-slate-300 inline-flex"><input type="checkbox" checked={form.featured} onChange={(e) => setForm((current) => ({ ...current, featured: e.target.checked }))} className="h-4 w-4 accent-blue-500" /><span>Featured</span></label></div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={save} disabled={saving} className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              <button onClick={() => setShowForm(false)} className="rounded-lg border border-slate-700 px-6 py-2 text-sm text-slate-300">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
      {confirmDelete && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><motion.div className="w-full max-w-sm rounded-xl border border-slate-800 bg-dark-950 p-6" initial={{ scale: 0.95 }} animate={{ scale: 1 }}><h3 className="mb-2 font-semibold text-white">Delete Project?</h3><p className="mb-6 text-sm text-slate-400">This action cannot be undone.</p><div className="flex gap-3"><button onClick={() => del(confirmDelete)} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white">Delete</button><button onClick={() => setConfirmDelete(null)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300">Cancel</button></div></motion.div></div>)}
    </motion.div>
  );
};

export default AdminProjects;
