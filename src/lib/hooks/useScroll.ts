import { useState, useEffect } from 'react';

const useScroll = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const element = document.querySelector('#__next');

    const handleScroll = () => {
      const scrollTop = element?.scrollTop || 0;
      setScrollY(scrollTop);
      setScrolled(scrollTop > 0);
    };

    element?.addEventListener('scroll', handleScroll);
    return () => {
      element?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { scrolled, scrollY };
};

export default useScroll;
