import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminApi, contactApi, newsletterApi } from '../api/endpoints';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { PageLoader, SkeletonCard } from '../components/LoadingState';
import type { AdminOverview, ContactSubmission, NewsletterSubscriber } from '../types';

const STATUS_OPTIONS: ContactSubmission['status'][] = ['new', 'read', 'replied', 'archived'];

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const { showToast } = useToast();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [contactFilter, setContactFilter] = useState<'all' | ContactSubmission['status']>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [subscriberQuery, setSubscriberQuery] = useState('');
  const [subscriberStatus, setSubscriberStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [overviewResponse, contactsResponse, subscribersResponse] = await Promise.all([
        adminApi.getOverview(),
        contactApi.getAll(contactFilter),
        newsletterApi.getAll({ q: subscriberQuery, status: subscriberStatus }),
      ]);

      setOverview(overviewResponse.data.data ?? null);
      setContacts(contactsResponse.data.data?.submissions ?? []);
      setSubscribers(subscribersResponse.data.data?.subscribers ?? []);
    } catch {
      showToast('Unable to load dashboard data right now.', 'error');
    } finally {
      setLoading(false);
    }
  }, [contactFilter, showToast, subscriberQuery, subscriberStatus]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const chartBars = useMemo(() => {
    if (!overview) {
      return [];
    }

    return [
      { label: 'Contacts', value: overview.contacts },
      { label: 'Unread', value: overview.unreadContacts },
      { label: 'Subscribers', value: overview.activeSubscribers },
      { label: 'Projects', value: overview.activeProjects },
    ];
  }, [overview]);

  if (loading && !overview) {
    return <PageLoader />;
  }

  const maxChartValue = Math.max(...chartBars.map((item) => item.value), 1);

  return (
    <main className="admin-layout">
      <aside className="admin-sidebar">
        <h1>Portfolio Admin</h1>
        <p>{user?.email}</p>
        <nav aria-label="Admin navigation">
          <a href="#overview">Overview</a>
          <a href="#contacts">Contacts</a>
          <a href="#newsletter">Newsletter</a>
        </nav>
        <button className="btn btn-secondary" type="button" onClick={logout}>
          Sign out
        </button>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <div>
            <p className="welcome-text">Premium Dashboard</p>
            <h2>Overview & operations</h2>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => void loadDashboard()}>
            Refresh
          </button>
        </header>

        <section id="overview" className="admin-section">
          <div className="admin-grid">
            {(overview
              ? [
                  ['Contacts received', overview.contacts],
                  ['Unread contacts', overview.unreadContacts],
                  ['Active subscribers', overview.activeSubscribers],
                  ['Published blog posts', overview.blogPosts],
                ]
              : []
            ).map(([label, value]) => (
              <article key={label} className="admin-card">
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
            {!overview &&
              Array.from({ length: 4 }, (_, index) => <SkeletonCard key={`overview-${index}`} />)}
          </div>

          <div className="chart-card">
            <h3>Quick stats</h3>
            <div className="mini-chart">
              {chartBars.map((item) => (
                <div key={item.label} className="chart-row">
                  <span>{item.label}</span>
                  <div className="chart-track">
                    <div
                      className="chart-bar"
                      style={{ width: `${(item.value / maxChartValue) * 100}%` }}
                    />
                  </div>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contacts" className="admin-section">
          <div className="section-heading">
            <div>
              <p className="welcome-text">Inbox</p>
              <h3>Contact submissions</h3>
            </div>
            <select
              value={contactFilter}
              onChange={(event) => setContactFilter(event.target.value as typeof contactFilter)}
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="bulk-actions">
            <select
              defaultValue="read"
              onChange={async (event) => {
                if (selectedIds.length === 0) {
                  showToast('Select at least one message first.', 'warning');
                  return;
                }

                await contactApi.bulkUpdateStatus(
                  selectedIds,
                  event.target.value as ContactSubmission['status'],
                );
                showToast('Selected submissions updated.', 'success');
                setSelectedIds([]);
                await loadDashboard();
              }}
            >
              <option value="read">Mark as read</option>
              <option value="replied">Mark as replied</option>
              <option value="archived">Archive</option>
            </select>
          </div>

          <div className="table-shell">
            <table className="admin-table">
              <thead>
                <tr>
                  <th />
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(contact._id)}
                        onChange={(event) =>
                          setSelectedIds((currentIds) =>
                            event.target.checked
                              ? [...currentIds, contact._id]
                              : currentIds.filter((id) => id !== contact._id),
                          )
                        }
                      />
                    </td>
                    <td>
                      <strong>{contact.name}</strong>
                      <p>{contact.email}</p>
                    </td>
                    <td>{contact.subject}</td>
                    <td>
                      <span className={`status-badge status-${contact.status}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={contact.status}
                        onChange={async (event) => {
                          await contactApi.updateStatus(
                            contact._id,
                            event.target.value as ContactSubmission['status'],
                          );
                          showToast('Submission status updated.', 'success');
                          await loadDashboard();
                        }}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="newsletter" className="admin-section">
          <div className="section-heading">
            <div>
              <p className="welcome-text">Audience</p>
              <h3>Newsletter subscribers</h3>
            </div>
            <div className="newsletter-toolbar">
              <input
                type="search"
                placeholder="Search by email"
                value={subscriberQuery}
                onChange={(event) => setSubscriberQuery(event.target.value)}
              />
              <select
                value={subscriberStatus}
                onChange={(event) =>
                  setSubscriberStatus(event.target.value as typeof subscriberStatus)
                }
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={async () => {
                  const response = await newsletterApi.exportCsv({
                    q: subscriberQuery,
                    status: subscriberStatus,
                  });
                  const blobUrl = URL.createObjectURL(response.data);
                  const link = document.createElement('a');
                  link.href = blobUrl;
                  link.download = 'newsletter-subscribers.csv';
                  link.click();
                  URL.revokeObjectURL(blobUrl);
                  showToast('CSV export ready.', 'success');
                }}
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="subscriber-list">
            {subscribers.map((subscriber) => (
              <article key={subscriber._id} className="subscriber-card">
                <div>
                  <strong>{subscriber.email}</strong>
                  <p>{subscriber.active ? 'Active subscriber' : 'Inactive subscriber'}</p>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={async () => {
                    await newsletterApi.updateStatus(subscriber._id, !subscriber.active);
                    showToast('Subscriber status updated.', 'success');
                    await loadDashboard();
                  }}
                >
                  {subscriber.active ? 'Deactivate' : 'Reactivate'}
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
