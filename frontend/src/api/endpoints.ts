import api from './client';
import type { ContactFormData, ApiResponse, Project, BlogPost, Testimonial } from '../types';

export const contactApi = {
  submit: (data: ContactFormData) =>
    api.post<ApiResponse>('/contact', data),
};

export const projectsApi = {
  getAll: () => api.get<ApiResponse<Project[]>>('/projects'),
  getById: (id: string) => api.get<ApiResponse<Project>>(`/projects/${id}`),
};

export const blogApi = {
  getAll: () => api.get<ApiResponse<BlogPost[]>>('/blog'),
  getBySlug: (slug: string) => api.get<ApiResponse<BlogPost>>(`/blog/${slug}`),
};

export const testimonialsApi = {
  getAll: () => api.get<ApiResponse<Testimonial[]>>('/testimonials'),
};

export const newsletterApi = {
  subscribe: (email: string) =>
    api.post<ApiResponse>('/newsletter/subscribe', { email }),
};
