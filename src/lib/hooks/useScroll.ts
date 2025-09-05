import { useEffect, useState } from 'react';

const useScroll = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const container = document.getElementById('__next');
    if (!container) return;

    let frame: number | null = null;

    const update = () => {
      frame = null;
      const y = container.scrollTop || 0;
      setScrollY(y);
      setScrolled(y > 0);
    };

    // Batch setState updates so we don’t update React state on every scroll event
    const onScroll = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    // Initialize state immediately to match current position
    update();

    container.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      container.removeEventListener('scroll', onScroll);
    };
  }, []);

  return { scrolled, scrollY };
};

export default useScroll;
