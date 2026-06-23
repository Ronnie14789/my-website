export default function Experience() {
  return (
    <section id="experience" role="region" aria-label="Professional experience and career history">
      <div className="section-header">
        <span>Career Journey</span>
        <h2>Professional Experience</h2>
      </div>

      <div className="timeline">
        <article className="experience-card reveal">
          <span className="badge">Current</span>
          <h3>Senior Technician</h3>
          <h4>Tata Uganda Ltd</h4>
          <p className="experience-date">2020 – Present</p>
          <p>
            Responsible for comprehensive diagnostics, maintenance, inspections, repairs,
            and technical support for commercial vehicle operations. Leading diagnostic
            initiatives and mentoring junior technicians in modern automotive systems.
          </p>
          <ul className="responsibilities">
            <li>Vehicle diagnostics and troubleshooting</li>
            <li>Fleet maintenance planning</li>
            <li>Technical supervision and staff training</li>
            <li>Warranty analysis and documentation</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
