import { useEffect, useState } from 'react';

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      id="preloader"
      aria-label="Loading page"
      style={{ transition: 'opacity 0.8s', opacity: visible ? 1 : 0 }}
    >
      <span>ER</span>
    </div>
  );
}
