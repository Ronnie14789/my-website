import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { staggerContainer, scaleIn, fadeInUp } from '@/hooks/useStaggerAnimation';
import api from '@/lib/api';

interface Project {
  _id: string;
  title: string;
  shortDescription: string;
  tags: string[];
  status: string;
}

const STATIC_PROJECTS: Project[] = [
  {
    _id: '1',
    title: 'Fleet Reliability Program',
    shortDescription:
      'Implemented comprehensive maintenance procedures reducing vehicle downtime by 35% and extending fleet asset life.',
    tags: ['Fleet Management', 'Process Optimization'],
    status: 'completed',
  },
  {
    _id: '2',
    title: 'Solar Energy Integration',
    shortDescription:
      'Design, installation, and maintenance of solar power systems for workshop operations and facility efficiency.',
    tags: ['Renewable Energy', 'Installation'],
    status: 'completed',
  },
  {
    _id: '3',
    title: 'Diagnostic System Upgrade',
    shortDescription:
      'Led implementation of advanced OBD diagnostic tools reducing fault diagnosis time by 50%.',
    tags: ['Diagnostics', 'Technology'],
    status: 'active',
  },
  {
    _id: '4',
    title: 'Workshop Safety Protocol',
    shortDescription:
      'Developed and implemented comprehensive safety protocols improving workplace safety standards.',
    tags: ['Safety', 'Management'],
    status: 'completed',
  },
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(STATIC_PROJECTS);
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  useEffect(() => {
    api
      .get('/projects')
      .then(({ data }) => {
        if (Array.isArray(data.data) && data.data.length > 0) {
          setProjects(data.data as Project[]);
        }
      })
      .catch(() => {
        // Keep static projects as fallback
      });
  }, []);

  return (
    <section id="projects" ref={ref} className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'show' : 'hidden'}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="text-blue-400 font-medium uppercase tracking-widest text-sm">
              Portfolio
            </span>
            <h2 className="text-4xl font-bold text-white mt-2">Featured Projects</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <motion.article
                key={project._id}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-blue-500/40 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <svg
                      className="w-6 h-6 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      project.status === 'active'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-blue-500/10 text-blue-400'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 leading-relaxed mb-6">{project.shortDescription}</p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-3 py-1 bg-slate-900 text-slate-400 rounded-full border border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
