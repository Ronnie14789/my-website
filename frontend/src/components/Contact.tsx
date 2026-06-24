import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { staggerContainer, fadeInUp, fadeInLeft } from '@/hooks/useStaggerAnimation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const Contact: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name || form.name.trim().length < 2)
      newErrors.name = 'Name must be at least 2 characters';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.subject || form.subject.trim().length < 5)
      newErrors.subject = 'Subject must be at least 5 characters';
    if (!form.message || form.message.trim().length < 10)
      newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.post('/contact', form);
      toast.success("Message sent! I'll get back to you soon.");
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (err: unknown) {
      const errResponse = err as { response?: { data?: { message?: string } } };
      toast.error(
        errResponse?.response?.data?.message || 'Failed to send message. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((er) => ({ ...er, [name]: undefined }));
    }
  };

  const FIELDS = [
    { name: 'name', label: 'Full Name *', type: 'text', placeholder: 'Your name' },
    {
      name: 'email',
      label: 'Email Address *',
      type: 'email',
      placeholder: 'your@email.com',
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+256 XXX XXX XXX',
    },
    {
      name: 'subject',
      label: 'Subject *',
      type: 'text',
      placeholder: 'What is this about?',
    },
  ] as const;

  return (
    <section id="contact" ref={ref} className="py-24 bg-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'show' : 'hidden'}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="text-blue-400 font-medium uppercase tracking-widest text-sm">
              Get In Touch
            </span>
            <h2 className="text-4xl font-bold text-white mt-2">Let's Connect</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact info */}
            <motion.div variants={fadeInLeft}>
              <h3 className="text-xl font-bold text-white mb-8">Contact Information</h3>
              {[
                {
                  icon: '📞',
                  label: 'Phone',
                  value: '+256 780 697 149',
                  href: 'tel:+256780697149',
                },
                {
                  icon: '📧',
                  label: 'Email',
                  value: 'ronaldecatu@gmail.com',
                  href: 'mailto:ronaldecatu@gmail.com',
                },
                {
                  icon: '🏢',
                  label: 'Organization',
                  value: 'Tata Uganda Ltd',
                  href: null,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-xl shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-slate-500 text-sm">{item.label}</div>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-white">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-4 mt-8">
                {[
                  {
                    href: 'https://linkedin.com/in/ecaturonald',
                    label: 'LinkedIn',
                  },
                  { href: 'https://github.com/ecaturonald', label: 'GitHub' },
                  {
                    href: 'https://twitter.com/ecaturonald',
                    label: 'Twitter',
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-900 text-slate-400 rounded-lg border border-slate-700 hover:border-blue-500/50 hover:text-blue-400 transition-all text-sm"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div variants={fadeInUp}>
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {FIELDS.map((field) => (
                  <div key={field.name}>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      {field.label}
                    </label>
                    <motion.input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={`w-full bg-slate-900 border ${
                        errors[field.name] ? 'border-red-500' : 'border-slate-700'
                      } rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors`}
                      whileFocus={{ scale: 1.01 }}
                    />
                    {errors[field.name] && (
                      <motion.p
                        className="text-red-400 text-sm mt-1"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors[field.name]}
                      </motion.p>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Message *</label>
                  <motion.textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Your message..."
                    className={`w-full bg-slate-900 border ${
                      errors.message ? 'border-red-500' : 'border-slate-700'
                    } rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none`}
                    whileFocus={{ scale: 1.01 }}
                  />
                  {errors.message && (
                    <motion.p
                      className="text-red-400 text-sm mt-1"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.message}
                    </motion.p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
