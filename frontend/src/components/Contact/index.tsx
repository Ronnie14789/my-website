import { useState, type FormEvent } from 'react';
import { contactApi } from '../../api/endpoints';
import type { ContactFormData } from '../../types';
import { useToast } from '../../contexts/ToastContext';

const INITIAL: ContactFormData = { name: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState<ContactFormData>(INITIAL);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await contactApi.submit(form);
      setStatus('success');
      setForm(INITIAL);
      showToast("Message sent successfully. I'll get back to you soon.", 'success');
    } catch {
      setStatus('error');
      showToast('Something went wrong. Please try again or email me directly.', 'error');
    }
  };

  return (
    <section id="contact" role="region" aria-label="Contact information and form">
      <div className="section-header">
        <span>Get In Touch</span>
        <h2>Let&apos;s Connect</h2>
      </div>

      <div className="contact-container">
        {/* Contact Info */}
        <div className="contact-info reveal">
          <article className="contact-method">
            <h3>Phone</h3>
            <p>
              <a href="tel:+256780697149" className="contact-link">
                +256 780 697 149
              </a>
            </p>
            <p className="secondary">
              <a href="tel:+256757106218" className="contact-link">
                +256 757 106 218
              </a>
            </p>
          </article>

          <article className="contact-method">
            <h3>Email</h3>
            <p>
              <a href="mailto:ronaldecatu@gmail.com" className="contact-link">
                ronaldecatu@gmail.com
              </a>
            </p>
          </article>

          <article className="contact-method">
            <h3>Organization</h3>
            <p>Tata Uganda Ltd</p>
          </article>

          <article className="contact-method">
            <h3>Social Links</h3>
            <div className="social-links">
              <a
                href="https://linkedin.com/in/ecaturonald"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/ecaturonald"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/ecaturonald"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter Profile"
              >
                Twitter
              </a>
            </div>
          </article>
        </div>

        {/* Contact Form */}
        <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Send me a message</legend>

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                minLength={2}
                maxLength={100}
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="your.email@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+256 XXX XXX XXX"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                minLength={5}
                maxLength={200}
                placeholder="What's this about?"
                value={form.subject}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                required
                minLength={10}
                maxLength={2000}
                rows={6}
                placeholder="Your message here..."
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>

            {status === 'success' && (
              <p className="form-message form-message-success">✓ Message sent successfully!</p>
            )}
            {status === 'error' && (
              <p className="form-message form-message-error">
                Please review your details and try again.
              </p>
            )}
          </fieldset>
        </form>
      </div>
    </section>
  );
}
