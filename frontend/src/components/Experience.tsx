import React from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { staggerContainer, fadeInUp, fadeInLeft } from '@/hooks/useStaggerAnimation';

const EXPERIENCE = [
  {
    title: 'Senior Technician',
    company: 'Tata Uganda Ltd',
    period: 'Current Role',
    details:
      'Supporting diagnostics, preventive maintenance, repair coordination, and technical reliability across commercial vehicle operations.',
  },
  {
    title: 'Fleet Reliability Contributor',
    company: 'Workshop & Field Operations',
    period: 'Ongoing',
    details:
      'Improving service turnaround, maintenance scheduling, and fault prevention for better fleet uptime and operational continuity.',
  },
  {
    title: 'Technology Growth Focus',
    company: 'Continuous Professional Development',
    period: 'Ongoing',
    details:
      'Expanding expertise in renewable energy, Linux systems, AI-driven workflows, and future-focused automotive technologies.',
  },
];

const Experience: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section id="experience" ref={ref} className="bg-dark-850 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'show' : 'hidden'}
        >
          <motion.div variants={fadeInUp} className="mb-16 text-center">
            <span className="text-sm font-medium uppercase tracking-widest text-blue-400">
              Experience
            </span>
            <h2 className="mt-2 text-4xl font-bold text-white">Professional Journey</h2>
          </motion.div>
          <div className="space-y-6">
            {EXPERIENCE.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInLeft}
                className="rounded-2xl border border-slate-800 bg-dark-900 p-6"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="text-blue-400">{item.company}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-500">{item.period}</span>
                </div>
                <p className="mt-4 leading-relaxed text-slate-400">{item.details}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
