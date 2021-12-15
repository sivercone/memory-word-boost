import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';
import style from 'styles/components/header.module.scss';
import { FolderEditing } from './FolderEditing';

const fade = {
  init: { opacity: 0, height: 0, display: 'none', transition: { duration: 0.1 } },
  anim: { opacity: 1, height: 'auto', display: 'block', transition: { duration: 0.15 } },
};

export const Header: React.FC = () => {
  const [shownDropdown, setShownDropdown] = React.useState(false);
  const toggleShownDropdown = () => setShownDropdown(!shownDropdown);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const nonDropdownClick = (event: any) => {
    const path = event.path || (event.composedPath && event.composedPath());
    if (!path.includes(dropdownRef.current)) setShownDropdown(false);
  };
  React.useEffect(() => {
    document.body.addEventListener('click', nonDropdownClick);
    return () => document.body.removeEventListener('click', nonDropdownClick);
  }, []);

  const [shownFolder, setShownFolder] = React.useState<boolean>(false);
  const toggleShownFolder = () => setShownFolder(!shownFolder);

  return (
    <header className={style.header}>
      <Link href="/">
        <a>Memory Word Boost</a>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div ref={dropdownRef} className={style.plus}>
          <button onClick={toggleShownDropdown} className={style.plus__button}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#cccccc">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#cccccc">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          </button>
          <motion.ul animate={shownDropdown ? fade.anim : fade.init} className={style.plus__menu} role="menu">
            <li onClick={toggleShownDropdown}>
              <Link href="/create-set">
                <a>New study set</a>
              </Link>
            </li>
            <li onClick={toggleShownDropdown}>
              <button onClick={toggleShownFolder}>New folder</button>
            </li>
          </motion.ul>
        </div>
        <Link href={`/u/1`}>
          <a className={style.header__profilepic}>
            <img src="/assets/download.webp" alt="" />
          </a>
        </Link>
      </div>
      <FolderEditing isOpen={shownFolder} onClose={toggleShownFolder} />
    </header>
  );
};
