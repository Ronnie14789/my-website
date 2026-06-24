import React from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { staggerContainer, fadeInUp, scaleIn } from '@/hooks/useStaggerAnimation';

const AREAS = [
  {
    title: 'Automotive Diagnostics',
    description:
      'Advanced fault tracing, ECU diagnostics, OBD analysis, and root-cause resolution for commercial vehicles.',
  },
  {
    title: 'Fleet Management',
    description:
      'Preventive maintenance planning, asset reliability, workshop coordination, and downtime reduction initiatives.',
  },
  {
    title: 'Diesel Engine Systems',
    description:
      'Engine overhaul support, fuel system optimization, cooling systems, and heavy-duty powertrain maintenance.',
  },
  {
    title: 'Emerging Technologies',
    description:
      'Interest in EV trends, AI-assisted troubleshooting, Linux systems, and digital tools for smarter operations.',
  },
];

const Expertise: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section id="expertise" ref={ref} className="bg-dark-900 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'show' : 'hidden'}
        >
          <motion.div variants={fadeInUp} className="mb-16 text-center">
            <span className="text-sm font-medium uppercase tracking-widest text-blue-400">
              Expertise
            </span>
            <h2 className="mt-2 text-4xl font-bold text-white">Core Technical Strengths</h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {AREAS.map((area) => (
              <motion.article
                key={area.title}
                variants={scaleIn}
                className="rounded-2xl border border-slate-800 bg-dark-850 p-6 transition-colors hover:border-blue-500/30"
              >
                <h3 className="mb-3 text-xl font-semibold text-white">{area.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{area.description}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Expertise;
