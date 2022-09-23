import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Avatar from 'boring-avatars';
import { useUserStore } from 'storage/useUserStore';
import style from 'styles/components/header.module.scss';
import { pathsForHidingLayout } from 'utils/staticData';

const fade = {
  init: { opacity: 0, height: 0, display: 'none', transition: { duration: 0.1 } },
  anim: { opacity: 1, height: 'auto', display: 'block', transition: { duration: 0.15 } },
};

const Header: React.FC = () => {
  const { user } = useUserStore();
  const [shownDropdown, setShownDropdown] = React.useState(false);
  const openDropdown = () => setShownDropdown(true);
  const closeDropdown = () => setShownDropdown(false);

  const { pathname } = useRouter();
  if (pathsForHidingLayout.includes(pathname)) return null;
  return (
    <>
      <div style={{ height: '50px', width: '100%' }}></div>
      <header className={style.header}>
        <div className={style.header__inner}>
          <Link href="/">
            <a>PROJECT MWB</a>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <div
                style={{ display: 'flex', alignItems: 'center' }}
                onFocus={openDropdown}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) closeDropdown();
                }}
              >
                <button style={{ height: '40px', borderRadius: '50%' }}>
                  <Avatar size={40} variant="ring" colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']} />
                </button>
                <motion.ul animate={shownDropdown ? fade.anim : fade.init} className={style.plus__menu} role="menu">
                  <li onClick={closeDropdown}>
                    <Link href={`/u/${user.id}`}>
                      <a>Profile</a>
                    </Link>
                  </li>
                  <li onClick={closeDropdown}>
                    <Link href={`/u/${user.id}/settings`}>
                      <a>Settings</a>
                    </Link>
                  </li>
                  <li onClick={closeDropdown}>
                    <a href="https://github.com/sivercone/memory-word-boost/issues" target="_blank" rel="noreferrer">
                      Report a bug
                    </a>
                  </li>
                  <li onClick={closeDropdown}>
                    <button>Log out</button>
                  </li>
                </motion.ul>
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
        </div>
      </header>
    </>
  );
};

export default Header;

// https://stackoverflow.com/a/37491578 - onFocus, onBlur
// https://stackoverflow.com/questions/32553158/detect-click-outside-react-component/44378829#44378829
