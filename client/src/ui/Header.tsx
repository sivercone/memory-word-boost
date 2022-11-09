import React from 'react';
import scss from 'styles/components/header.module.scss';

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Header: React.FC<Props> = ({ children, style }) => {
  return (
    <>
      <div style={{ height: '50px' }}></div>
      <header className={scss.header} style={style}>
        <div className={scss.header__inner}>{children}</div>
      </header>
    </>
  );
};

export default Header;
