/* eslint-disable @next/next/no-img-element */
import React from 'react';
import style from 'styles/pages/landing.module.scss';

// https://crackmagazine.digital/

const Landing = () => {
  const [rotate, setRotate] = React.useState<number>(0);
  React.useEffect(() => (window.onscroll = () => setRotate(window.pageYOffset / 2)), []);

  return (
    <div style={{ perspective: '1200px', minHeight: '200vh' }} className="container">
      <div style={{ transform: `rotateY(${rotate}deg)` }} className={style.flipper}>
        <img style={{ transform: 'rotateY(180deg)' }} className={style.flipper__picture} src="/assets/download.webp" alt="" />
        <img style={{ zIndex: 2 }} className={style.flipper__picture} src="/assets/rei.jpg" alt="" />
      </div>
    </div>
  );
};

export default Landing;
