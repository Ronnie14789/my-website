interface ProjectItem {
  title: string;
  description: string;
  tags: string[];
}

const PROJECTS: ProjectItem[] = [
  {
    title: 'Engine Rebuild & Optimization',
    description:
      'Complete engine overhaul, performance restoration, and modern system integration for commercial vehicles.',
    tags: ['Engine Systems', 'Diagnostics'],
  },
  {
    title: 'Fleet Reliability Program',
    description:
      'Implemented comprehensive maintenance procedures reducing vehicle downtime by 35% and extending fleet asset life.',
    tags: ['Fleet Management', 'Process Optimization'],
  },
  {
    title: 'Solar Energy Integration',
    description:
      'Design, installation, and maintenance of solar power systems for workshop operations and facility efficiency.',
    tags: ['Renewable Energy', 'Installation'],
  },
];

export default function Projects() {
  return (
    <section id="projects" role="region" aria-label="Technical projects and achievements">
      <div className="section-header">
        <span>Selected Work</span>
        <h2>Technical Projects</h2>
      </div>

      <div className="project-grid">
        {PROJECTS.map((project) => (
          <article key={project.title} className="project-card reveal">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
