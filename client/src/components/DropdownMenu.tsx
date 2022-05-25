import { motion } from 'framer-motion';
import React from 'react';
import style from 'styles/components/header.module.scss';

const fade = {
  init: { opacity: 0, height: 0, display: 'none', transition: { duration: 0.1 } },
  anim: { opacity: 1, height: 'auto', display: 'block', transition: { duration: 0.15 } },
};

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

export const DropdownButton: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const DropdownList: React.FC<{ children?: React.ReactNode; isOpen: boolean }> = ({ children, isOpen }) => {
  return (
    <motion.ul animate={isOpen ? fade.anim : fade.init} className={style.plus__menu} role="menu">
      {children}
    </motion.ul>
  );
};

export const DropdownMenu: React.FC<Props> = ({ children, onClose }) => {
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const nonDropdownClick = React.useCallback(
    (event: any) => {
      const path = event.path || (event.composedPath && event.composedPath());
      if (!path.includes(dropdownRef.current)) onClose();
    },
    [onClose],
  );
  React.useEffect(() => {
    document.body.addEventListener('click', nonDropdownClick);
    return () => document.body.removeEventListener('click', nonDropdownClick);
  }, [nonDropdownClick]);

  return (
    <div ref={dropdownRef} className={style.plus}>
      {children}
    </div>
  );
};
