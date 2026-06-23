import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

export default function About() {
  const ref = useRevealOnScroll();

  return (
    <section id="about" role="region" aria-label="About me">
      <div className="section-header">
        <span>About Me</span>
        <h2>Building Reliability Through Engineering Excellence</h2>
      </div>

      <div className="about-content" ref={ref as React.RefObject<HTMLDivElement>}>
        <p>
          I am a professional Technician at Tata Uganda Ltd with extensive experience in
          commercial vehicle maintenance, troubleshooting, diagnostics, fleet support, and
          comprehensive workshop management.
        </p>
        <p>
          My passion extends beyond hands-on maintenance into emerging technologies,
          artificial intelligence, Linux systems administration, renewable energy
          solutions, and continuous professional growth in the automotive industry.
        </p>
      </div>
    </section>
  );
}
