import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import Avatar from 'boring-avatars';
import { useUserStore } from 'storage/useUserStore';
import style from 'styles/components/header.module.scss';
import { pathsForHidingLayout } from 'utils/staticData';
import { Button } from './Button';
import { useQuery } from 'react-query';
import { authApi } from 'apis/authApi';
import { sessionMemory } from 'utils/sessionMemory';

export const transition = {
  init: { y: '100%', transition: { duration: 0.1 } },
  anim: { y: '0%', transition: { duration: 0.15 } },
};

const Header: React.FC = () => {
  const { user, setUser, signAccess } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const { refetch: callLogout } = useQuery('user', () => authApi.logout(signAccess), { enabled: false });
  const onLogout = async () => {
    await callLogout();
    setUser(undefined);
    sessionMemory.set('logged', 'no');
    window.location.replace('/login');
  };

  const { pathname } = useRouter();
  if (pathsForHidingLayout.includes(pathname)) return null;
  return (
    <>
      <div style={{ height: '50px' }}></div>
      <header className={style.header}>
        <div className={style.header__inner}>
          <Link href="/">
            <a>PROJECT MWB</a>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <button onClick={toggleMenu} style={{ height: '40px', borderRadius: '50%' }}>
                <Avatar size={40} variant="ring" colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']} />
              </button>
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
      <AnimatePresence>
        {isMenuOpen && user ? (
          <motion.div className={style.menu} variants={transition} initial="init" animate="anim" exit="init">
            <div style={{ height: '50px' }}></div>
            <header className={style.header}>
              <div className={style.header__inner}>
                <Button onClick={toggleMenu} title="close" variant="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                  </svg>
                </Button>
                <p>Menu</p>
                <div></div>
              </div>
            </header>
            <div className={style.menu__inner}>
              <ul className={style.menu__list}>
                <li>
                  <Link href={`/u/${user.id}`}>
                    <a onClick={toggleMenu}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path d="M12 12q-1.65 0-2.825-1.175Q8 9.65 8 8q0-1.65 1.175-2.825Q10.35 4 12 4q1.65 0 2.825 1.175Q16 6.35 16 8q0 1.65-1.175 2.825Q13.65 12 12 12Zm-8 8v-2.8q0-.85.438-1.563.437-.712 1.162-1.087 1.55-.775 3.15-1.163Q10.35 13 12 13t3.25.387q1.6.388 3.15 1.163.725.375 1.162 1.087Q20 16.35 20 17.2V20Zm2-2h12v-.8q0-.275-.137-.5-.138-.225-.363-.35-1.35-.675-2.725-1.013Q13.4 15 12 15t-2.775.337Q7.85 15.675 6.5 16.35q-.225.125-.362.35-.138.225-.138.5Zm6-8q.825 0 1.413-.588Q14 8.825 14 8t-.587-1.412Q12.825 6 12 6q-.825 0-1.412.588Q10 7.175 10 8t.588 1.412Q11.175 10 12 10Zm0-2Zm0 10Z" />
                      </svg>
                      <span>Profile</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={`/u/${user.id}/settings`}>
                    <a onClick={toggleMenu}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path d="m9.25 22-.4-3.2q-.325-.125-.612-.3-.288-.175-.563-.375L4.7 19.375l-2.75-4.75 2.575-1.95Q4.5 12.5 4.5 12.337v-.675q0-.162.025-.337L1.95 9.375l2.75-4.75 2.975 1.25q.275-.2.575-.375.3-.175.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3.287.175.562.375l2.975-1.25 2.75 4.75-2.575 1.95q.025.175.025.337v.675q0 .163-.05.338l2.575 1.95-2.75 4.75-2.95-1.25q-.275.2-.575.375-.3.175-.6.3l-.4 3.2Zm2.8-6.5q1.45 0 2.475-1.025Q15.55 13.45 15.55 12q0-1.45-1.025-2.475Q13.5 8.5 12.05 8.5q-1.475 0-2.488 1.025Q8.55 10.55 8.55 12q0 1.45 1.012 2.475Q10.575 15.5 12.05 15.5Zm0-2q-.625 0-1.062-.438-.438-.437-.438-1.062t.438-1.062q.437-.438 1.062-.438t1.063.438q.437.437.437 1.062t-.437 1.062q-.438.438-1.063.438ZM12 12Zm-1 8h1.975l.35-2.65q.775-.2 1.438-.588.662-.387 1.212-.937l2.475 1.025.975-1.7-2.15-1.625q.125-.35.175-.738.05-.387.05-.787t-.05-.788q-.05-.387-.175-.737l2.15-1.625-.975-1.7-2.475 1.05q-.55-.575-1.212-.963-.663-.387-1.438-.587L13 4h-1.975l-.35 2.65q-.775.2-1.437.587-.663.388-1.213.938L5.55 7.15l-.975 1.7 2.15 1.6q-.125.375-.175.75-.05.375-.05.8 0 .4.05.775t.175.75l-2.15 1.625.975 1.7 2.475-1.05q.55.575 1.213.962.662.388 1.437.588Z" />
                      </svg>
                      <span>Account settings</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <a
                    onClick={toggleMenu}
                    href="https://github.com/sivercone/memory-word-boost/issues"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                      <path d="M5 21V4h9l.4 2H20v10h-7l-.4-2H7v7Zm7.5-11Zm2.15 4H18V8h-5.25l-.4-2H7v6h7.25Z" />
                    </svg>
                    <span>Report a bug</span>
                  </a>
                </li>
                <li>
                  <button onClick={onLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                      <path d="M5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h7v2H5v14h7v2Zm11-4-1.375-1.45 2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5Z" />
                    </svg>
                    <span>Log out</span>
                  </button>
                </li>
              </ul>
            </div>
          </motion.div>
        ) : undefined}
      </AnimatePresence>
    </>
  );
};

export default Header;

// https://stackoverflow.com/a/37491578 - onFocus, onBlur
// https://stackoverflow.com/questions/32553158/detect-click-outside-react-component/44378829#44378829
