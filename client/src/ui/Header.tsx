import React from 'react';
import style from 'styles/components/header.module.scss';

interface Props {
  children: React.ReactNode;
}

const Header: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div style={{ height: '50px' }}></div>
      <header className={style.header}>
        <div className={style.header__inner}>{children}</div>
      </header>
    </>
  );
};

export default Header;
