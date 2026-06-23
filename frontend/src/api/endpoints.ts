import api from './client';
import type {
  ContactFormData,
  ApiResponse,
  Project,
  BlogPost,
  Testimonial,
  AdminOverview,
  AuthResponse,
  ContactSubmission,
  PaginationMeta,
  NewsletterSubscriber,
  AdminUser,
} from '../types';

interface LoginPayload {
  email: string;
  password: string;
}

interface ContactListResponse {
  submissions: ContactSubmission[];
  pagination: PaginationMeta;
}

interface SubscriberListResponse {
  subscribers: NewsletterSubscriber[];
  pagination: PaginationMeta;
}

export const contactApi = {
  submit: (data: ContactFormData) => api.post<ApiResponse>('/contact', data),
  getAll: (status = 'all') =>
    api.get<ApiResponse<ContactListResponse>>('/contact', {
      params: status === 'all' ? {} : { status },
    }),
  updateStatus: (id: string, status: ContactSubmission['status']) =>
    api.patch<ApiResponse<ContactSubmission>>(`/contact/${id}/status`, { status }),
  bulkUpdateStatus: (ids: string[], status: ContactSubmission['status']) =>
    api.patch<ApiResponse>('/contact/bulk-status', { ids, status }),
};

export const projectsApi = {
  getAll: () => api.get<ApiResponse<Project[]>>('/projects'),
  getById: (id: string) => api.get<ApiResponse<Project>>(`/projects/${id}`),
};

export const blogApi = {
  getAll: (params?: { q?: string; tag?: string }) =>
    api.get<ApiResponse<{ posts: BlogPost[] }>>('/blog', { params }),
  getBySlug: (slug: string) =>
    api.get<ApiResponse<{ post: BlogPost; relatedPosts: BlogPost[] }>>(`/blog/${slug}`),
};

export const testimonialsApi = {
  getAll: () => api.get<ApiResponse<Testimonial[]>>('/testimonials'),
};

export const newsletterApi = {
  subscribe: (email: string) => api.post<ApiResponse>('/newsletter/subscribe', { email }),
  getAll: (params?: { q?: string; status?: 'all' | 'active' | 'inactive' }) =>
    api.get<ApiResponse<SubscriberListResponse>>('/newsletter', { params }),
  updateStatus: (id: string, active: boolean) =>
    api.patch<ApiResponse<NewsletterSubscriber>>(`/newsletter/${id}/status`, { active }),
  exportCsv: (params?: { q?: string; status?: 'all' | 'active' | 'inactive' }) =>
    api.get('/newsletter/export', { params, responseType: 'blob' }),
};

export const authApi = {
  login: (payload: LoginPayload) => api.post<ApiResponse<AuthResponse>>('/auth/login', payload),
  getSession: () => api.get<ApiResponse<AdminUser>>('/auth/me'),
};

export const adminApi = {
  getOverview: () => api.get<ApiResponse<AdminOverview>>('/admin/overview'),
};
