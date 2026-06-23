import React from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { staggerContainer, fadeInUp, fadeInLeft } from '@/hooks/useStaggerAnimation';

const STATS = [
  { value: '5+', label: 'Years Experience' },
  { value: '100+', label: 'Vehicles Serviced' },
  { value: '35%', label: 'Downtime Reduction' },
  { value: '98%', label: 'Customer Satisfaction' },
];

const About: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section id="about" ref={ref} className="py-24 bg-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'show' : 'hidden'}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="text-blue-400 font-medium uppercase tracking-widest text-sm">
              About Me
            </span>
            <h2 className="text-4xl font-bold text-white mt-2">
              Building Reliability Through Engineering Excellence
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInLeft}>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                I am a professional Technician at{' '}
                <span className="text-blue-400 font-semibold">Tata Uganda Ltd</span> with
                extensive experience in commercial vehicle maintenance, troubleshooting,
                diagnostics, fleet support, and comprehensive workshop management.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed">
                My passion extends beyond hands-on maintenance into emerging technologies,
                artificial intelligence, Linux systems administration, renewable energy
                solutions, and continuous professional growth in the automotive industry.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-6">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-slate-900 rounded-xl p-6 text-center border border-slate-700 hover:border-blue-500/30 transition-colors"
                >
                  <div className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
