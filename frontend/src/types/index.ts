export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
}

export interface AdminUser {
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}

export interface AdminOverview {
  contacts: number;
  unreadContacts: number;
  activeSubscribers: number;
  blogPosts: number;
  activeProjects: number;
  approvedTestimonials: number;
}

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  active: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order?: number;
  status?: 'active' | 'completed' | 'archived';
  createdAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  views?: number;
  createdAt: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  message: string;
  rating: number;
  avatarUrl?: string;
}
