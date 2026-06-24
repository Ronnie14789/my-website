import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TYPING_STRINGS = [
  'Senior Technician',
  'Fleet Management Specialist',
  'Diesel Engine Expert',
  'Emerging Tech Enthusiast',
];

const Hero: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(TYPING_STRINGS[0]);
      return;
    }

    const current = TYPING_STRINGS[stringIndex];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          if (charIndex < current.length) {
            setDisplayText(current.slice(0, charIndex + 1));
            setCharIndex((c) => c + 1);
          } else {
            setTimeout(() => setDeleting(true), 1800);
          }
        } else {
          if (charIndex > 0) {
            setDisplayText(current.slice(0, charIndex - 1));
            setCharIndex((c) => c - 1);
          } else {
            setDeleting(false);
            setStringIndex((i) => (i + 1) % TYPING_STRINGS.length);
          }
        }
      },
      deleting ? 50 : 80,
    );

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, stringIndex, prefersReducedMotion]);

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950" />

      {/* Animated background orbs */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.p
            className="text-blue-400 font-medium tracking-widest uppercase text-sm mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome To My Portfolio
          </motion.p>

          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Ecatu Ronald
          </motion.h1>

          <motion.div
            className="text-2xl md:text-3xl font-semibold text-blue-300 mb-6 h-10 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span>{displayText}</span>
            <span className="animate-pulse text-blue-400 ml-0.5">|</span>
          </motion.div>

          <motion.p
            className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Dedicated automotive professional specializing in diagnostics, preventive maintenance,
            diesel engine systems, fleet reliability, and emerging vehicle technologies.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <a
              href="/Ecatu-Ronald-CV.pdf"
              download="Ecatu-Ronald-CV.pdf"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Download CV
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border border-blue-500 text-blue-400 font-semibold rounded-lg hover:bg-blue-500/10 hover:scale-105 transition-all duration-200"
            >
              Let's Connect
            </a>
          </motion.div>
        </motion.div>

        {/* Profile image */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        >
          <motion.div
            className="relative"
            animate={prefersReducedMotion ? {} : { y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-blue-500/30 shadow-2xl shadow-blue-500/20">
              <img
                src="/my photo.png"
                alt="Ecatu Ronald - Professional Profile Photo"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="absolute inset-0 rounded-full ring-8 ring-blue-500/10 pointer-events-none" />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          aria-hidden="true"
        >
          <div className="w-6 h-10 border-2 border-blue-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blue-400/70 rounded-full mt-2" />
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;
