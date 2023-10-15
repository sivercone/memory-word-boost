import React from 'react';

const useScroll = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const element = document.querySelector('#__next');

    const handleScroll = () => {
      const scrollTop = element?.scrollTop || 0;
      setScrollY(scrollTop);
      scrollTop > 0 ? setScrolled(true) : setScrolled(false);
    };

    element?.addEventListener('scroll', handleScroll);
    return () => {
      element?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { scrolled, scrollY };
};

export default useScroll;
