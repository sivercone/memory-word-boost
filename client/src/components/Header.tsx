import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useUserStore } from 'storage/useUserStore';
import style from 'styles/components/header.module.scss';
import { FolderEditing } from './FolderEditing';

// https://stackoverflow.com/a/37491578 - onFocus, onBlur
// https://stackoverflow.com/questions/32553158/detect-click-outside-react-component/44378829#44378829
type DropdownTypes = 'create' | 'profile';

const fade = {
  init: { opacity: 0, height: 0, display: 'none', transition: { duration: 0.1 } },
  anim: { opacity: 1, height: 'auto', display: 'block', transition: { duration: 0.15 } },
};

export const Header: React.FC = () => {
  const { pathname } = useRouter();
  if (pathname === '/login') return <></>;

  const { user } = useUserStore();

  const [shownDropdown, setShownDropdown] = React.useState<DropdownTypes>();
  const closeDropdown = () => setShownDropdown(undefined);

  const [shownFolder, setShownFolder] = React.useState<boolean>(false);
  const toggleShownFolder = () => setShownFolder(!shownFolder);

  return (
    <header className={style.header}>
      <Link href="/">
        <a>Memory Word Boost</a>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div
          onFocus={() => setShownDropdown('create')}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) closeDropdown();
          }}
          className={style.plus}>
          <button className={style.plus__button}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#cccccc">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#cccccc">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          </button>
          <motion.ul animate={shownDropdown === 'create' ? fade.anim : fade.init} className={style.plus__menu} role="menu">
            <li onClick={closeDropdown}>
              <Link href="/create-set">
                <a>New study set</a>
              </Link>
            </li>
            <li onClick={closeDropdown}>
              <button onClick={toggleShownFolder}>New folder</button>
            </li>
          </motion.ul>
        </div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href={`/u/${user.id}`}>
              <a className={style.avatarpic}>
                <img className={style.avatarpic} src={user.avatar} alt="" />
              </a>
            </Link>
            <div
              onFocus={() => setShownDropdown('profile')}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) closeDropdown();
              }}
              className={style.plus}>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#cccccc">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              </button>
              <motion.ul animate={shownDropdown === 'profile' ? fade.anim : fade.init} className={style.plus__menu} role="menu">
                <li onClick={closeDropdown}>
                  <Link href="/u/settings">
                    <a>Settings</a>
                  </Link>
                </li>
                <li onClick={closeDropdown}>
                  <button>Log out</button>
                </li>
              </motion.ul>
            </div>
          </div>
        ) : (
          <Link href="/login">
            <a className={style.avatarbutton}>
              <img className={style.avatarpic} src={'/assets/avatar.svg'} alt="" />
              <span>Login</span>
            </a>
          </Link>
        )}
      </div>
      <FolderEditing isOpen={shownFolder} onClose={toggleShownFolder} />
    </header>
  );
};
