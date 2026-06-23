interface ExpertiseCard {
  title: string;
  description: string;
  skills: string[];
}

const EXPERTISE: ExpertiseCard[] = [
  {
    title: 'Vehicle Diagnostics',
    description:
      'Advanced fault finding, troubleshooting, and comprehensive diagnostic analysis using modern equipment.',
    skills: ['OBD2 Scanning', 'Fault Code Analysis', 'System Testing'],
  },
  {
    title: 'Fleet Maintenance',
    description:
      'Strategic preventive and corrective maintenance planning to maximize uptime and fleet reliability.',
    skills: ['Maintenance Planning', 'Inventory Management', 'Cost Optimization'],
  },
  {
    title: 'Diesel Engine Systems',
    description:
      'Comprehensive inspection, repair, and performance optimization of diesel powertrains.',
    skills: ['Engine Overhaul', 'Fuel Systems', 'Performance Tuning'],
  },
  {
    title: 'BS6 Technologies',
    description:
      'Modern emission control systems and after-treatment technologies for environmental compliance.',
    skills: ['DPF Regeneration', 'SCR Systems', 'Emission Testing'],
  },
  {
    title: 'Warranty Analysis',
    description:
      'In-depth root cause investigation and technical reporting for warranty claims and analysis.',
    skills: ['RCA Documentation', 'Technical Reports', 'Claim Analysis'],
  },
  {
    title: 'Workshop Operations',
    description:
      'Strategic efficiency improvement and technical supervision for smooth workshop management.',
    skills: ['Process Optimization', 'Team Leadership', 'Quality Assurance'],
  },
];

export default function Expertise() {
  return (
    <section id="expertise" role="region" aria-label="Professional expertise and skills">
      <div className="section-header">
        <span>Core Expertise</span>
        <h2>Professional Capabilities</h2>
      </div>

      <div className="expertise-grid">
        {EXPERTISE.map((card) => (
          <article key={card.title} className="reveal">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <ul className="skills-list">
              {card.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
