import { useEffect, useRef } from 'react';

export function useRevealOnScroll() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      },
      { threshold: 0.15 },
    );

    el.classList.add('reveal');
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return ref;
}
