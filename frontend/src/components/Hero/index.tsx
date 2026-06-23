import { useEffect, useRef } from 'react';
import profilePhoto from '../../assets/photo.png';

export default function Hero() {
  const subtitleRef = useRef<HTMLHeadingElement>(null);

  // Typing effect
  useEffect(() => {
    const el = subtitleRef.current;
    if (!el) return;
    const text = el.textContent ?? '';
    el.textContent = '';
    let i = 0;
    const timer = setTimeout(function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i++);
        setTimeout(type, 60);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Parallax on hero image
  useEffect(() => {
    const img = document.querySelector<HTMLImageElement>('.hero-image img');
    const onMove = (e: MouseEvent) => {
      if (!img) return;
      const x = (window.innerWidth / 2 - e.pageX) / 60;
      const y = (window.innerHeight / 2 - e.pageY) / 60;
      img.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const handleRipple = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    ripple.classList.add('ripple');
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <section id="hero" role="region" aria-label="Hero introduction">
      <div className="hero-content">
        <p className="welcome-text">Welcome To My Portfolio</p>
        <h1>Ecatu Ronald</h1>
        <h2 ref={subtitleRef}>Technician at Tata Uganda Ltd</h2>
        <p className="hero-description">
          Dedicated automotive professional specializing in diagnostics, preventive
          maintenance, diesel engine systems, fleet reliability, workshop operations, and
          emerging vehicle technologies. Committed to excellence in service delivery and
          continuous professional development.
        </p>
        <div className="hero-buttons">
          <a
            href="/Ecatu-Ronald-CV.pdf"
            download="Ecatu-Ronald-CV.pdf"
            className="btn btn-primary"
            role="button"
            onClick={handleRipple}
          >
            Download CV
          </a>
          <a
            href="#contact"
            className="btn btn-secondary"
            role="button"
            onClick={handleRipple}
          >
            Let&apos;s Connect
          </a>
        </div>
      </div>

      <div className="hero-image">
        <img src={profilePhoto} alt="Ecatu Ronald - Professional Profile Photo" loading="lazy" />
      </div>
    </section>
  );
}
