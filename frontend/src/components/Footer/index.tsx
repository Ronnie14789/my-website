export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo">
      <div className="footer-content">
        <p>© {year} Ecatu Ronald. All Rights Reserved.</p>
        <p className="footer-credits">
          Designed &amp; Built by{' '}
          <a href="#hero" rel="noopener noreferrer">
            Ecatu Ronald
          </a>
        </p>
      </div>
    </footer>
  );
}
