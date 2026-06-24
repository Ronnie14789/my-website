import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { staggerContainer, fadeInUp } from '@/hooks/useStaggerAnimation';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  readTime: number;
  publishedAt?: string;
  createdAt: string;
  tags: string[];
}

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  status: string;
}

const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<PostForm>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    status: 'draft',
  });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      const { data } = await api.get('/blog?limit=50');
      setPosts(data.data || []);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', slug: '', excerpt: '', content: '', tags: '', status: 'draft' });
    setShowForm(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: '',
      content: '',
      tags: post.tags.join(', '),
      status: post.status,
    });
    setShowForm(true);
  };

  const savePost = async () => {
    if (!form.title || !form.excerpt || !form.content) {
      toast.error('Title, excerpt, and content are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };
      if (editing) {
        await api.put(`/blog/${editing._id}`, payload);
        toast.success('Post updated');
      } else {
        await api.post('/blog', payload);
        toast.success('Post created');
      }
      setShowForm(false);
      loadPosts();
    } catch (err: unknown) {
      const errResp = err as { response?: { data?: { message?: string } } };
      toast.error(errResp?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id: string) => {
    try {
      await api.delete(`/blog/${id}`);
      toast.success('Post deleted');
      setConfirmDelete(null);
      loadPosts();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="mt-1 text-slate-400">{posts.length} posts</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + New Post
        </button>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        className="overflow-hidden rounded-xl border border-slate-800 bg-dark-950"
      >
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No posts yet. Create your first post!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800">
                <tr className="text-slate-500">
                  {['Title', 'Status', 'Views', 'Read Time', 'Date', 'Actions'].map((heading) => (
                    <th key={heading} className="px-6 py-4 text-left font-medium">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{post.title}</div>
                      <div className="text-xs text-slate-500">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-green-500/10 text-green-400'
                            : post.status === 'draft'
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : 'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{post.views}</td>
                    <td className="px-6 py-4 text-slate-400">{post.readTime} min</td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(post)}
                          className="rounded border border-blue-500/30 px-2 py-1 text-xs text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDelete(post._id)}
                          className="rounded border border-red-500/30 px-2 py-1 text-xs text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            className="my-8 w-full max-w-2xl rounded-2xl border border-slate-800 bg-dark-950 p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {editing ? 'Edit Post' : 'New Post'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {[
                { key: 'title', label: 'Title *', placeholder: 'Post title' },
                {
                  key: 'slug',
                  label: 'Slug (auto-generated if empty)',
                  placeholder: 'post-url-slug',
                },
                { key: 'excerpt', label: 'Excerpt *', placeholder: 'Brief description...' },
                {
                  key: 'tags',
                  label: 'Tags (comma-separated)',
                  placeholder: 'automotive, diagnostics, technology',
                },
              ].map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-sm text-slate-300">{field.label}</label>
                  <input
                    value={form[field.key as keyof PostForm]}
                    onChange={(e) =>
                      setForm((current) => ({ ...current, [field.key]: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-800 bg-dark-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-sm text-slate-300">Content *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((current) => ({ ...current, content: e.target.value }))}
                  rows={8}
                  className="w-full resize-none rounded-lg border border-slate-800 bg-dark-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Write your post content here (supports Markdown)..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-300">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
                  className="rounded-lg border border-slate-800 bg-dark-900 px-3 py-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={savePost}
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-700 px-6 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div
            className="w-full max-w-sm rounded-xl border border-slate-800 bg-dark-950 p-6"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <h3 className="mb-2 font-semibold text-white">Delete Post?</h3>
            <p className="mb-6 text-sm text-slate-400">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => deletePost(confirmDelete)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminBlog;
