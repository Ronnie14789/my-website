const CERTS = [
  'Automotive Diagnostics Certification',
  'Fleet Maintenance Systems',
  'BS6 Emission Technologies',
  'Workshop Safety Management',
  'Professional Technical Leadership',
];

export default function Certifications() {
  return (
    <section id="certifications" role="region" aria-label="Professional certifications and training">
      <div className="section-header">
        <span>Achievements</span>
        <h2>Training &amp; Certifications</h2>
      </div>

      <ul className="certifications-list">
        {CERTS.map((cert) => (
          <li key={cert} className="certification-item reveal">
            <span className="cert-icon">✓</span>
            <span>{cert}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
