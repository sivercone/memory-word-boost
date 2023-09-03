import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { authApi } from 'apis/authApi';
import { useUserStore } from 'storage/useUserStore';
import { localMemory, sessionMemory } from 'lib/browserMemory';
import { growUpMotions, pathsForHidingLayout } from 'lib/staticData';
import { FolderForm } from 'modules/FolderForm';
import { NextHead } from 'modules/NextHead';
import { Button } from 'ui/Button';
import Header from 'ui/Header';
import { Toggle } from 'ui/Toggle';
import { BottomSheet, useBottomSheet } from './BottomSheet';
import style from 'styles/components/layout.module.scss';

type ThemeType = 'light' | 'dark' | 'system';
interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <TopBar />
      {children}
      <BottomBar />
      <div style={{ backgroundColor: 'var(--color-background)', zIndex: -1, position: 'fixed', top: 0, bottom: 0, width: '100%' }} />
    </>
  );
};

const TopBar = () => {
  const { pathname } = useRouter();
  const { user, setUser, signAccess } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [theme, setTheme] = React.useState<ThemeType>('system');
  const onThemeChange = (payload: ThemeType) => {
    setTheme(payload);
    document.body.classList.replace(theme, payload);
    localMemory.set('mwb_theme', payload);
  };

  const { refetch: callLogout } = useQuery('user', () => authApi.logout(signAccess), { enabled: false });
  const onLogout = async () => {
    await callLogout();
    setUser(undefined);
    sessionMemory.set('logged', 'no');
    window.location.replace('/login');
  };

  React.useEffect(() => {
    const localTheme = localMemory.get('mwb_theme');
    if (['light', 'dark', 'system'].includes(localTheme)) {
      document.body.classList.add(localTheme);
      onThemeChange(localTheme);
    } else {
      document.body.classList.add('system');
      onThemeChange('system');
    }
  }, []);

  const isPreferedDark =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const themeColor = theme === 'dark' || (theme === 'system' && isPreferedDark) ? '#252522' : '#f0f0ea';

  return (
    <>
      <NextHead themeColor={themeColor} />
      <Header style={pathsForHidingLayout.includes(pathname) ? { zIndex: 0, display: 'none' } : undefined}>
        <button onClick={toggleMenu} style={{ height: '40px', borderRadius: '50%', color: 'inherit' }} title="Menu">
          <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" fill="currentColor">
            <path d="M6.667 24.167v-2.792h26.666v2.792Zm0-5.542v-2.792h26.666v2.792Z" />
          </svg>
        </button>
        <span>
          <strong>PROJECT MWB</strong>
        </span>
        <div style={{ userSelect: 'none', width: '40px', height: '40px', visibility: 'hidden' }}></div>
      </Header>
      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div className={style.menu} variants={growUpMotions} initial="init" animate="anim" exit="init">
            <Header>
              <Button onClick={toggleMenu} title="Close" variant="icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                </svg>
              </Button>
              <span>
                <strong>MENU</strong>
              </span>
              <div style={{ userSelect: 'none', width: '24px', height: '24px', visibility: 'hidden' }}></div>
            </Header>
            <div className={style.menu__inner}>
              <ul className={style.menu__list}>
                {user ? (
                  <>
                    <li>
                      <Link href={`/u/${user.id}`}>
                        <a onClick={toggleMenu}>
                          <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                            <path d="M12 12q-1.65 0-2.825-1.175Q8 9.65 8 8q0-1.65 1.175-2.825Q10.35 4 12 4q1.65 0 2.825 1.175Q16 6.35 16 8q0 1.65-1.175 2.825Q13.65 12 12 12Zm-8 8v-2.8q0-.85.438-1.563.437-.712 1.162-1.087 1.55-.775 3.15-1.163Q10.35 13 12 13t3.25.387q1.6.388 3.15 1.163.725.375 1.162 1.087Q20 16.35 20 17.2V20Zm2-2h12v-.8q0-.275-.137-.5-.138-.225-.363-.35-1.35-.675-2.725-1.013Q13.4 15 12 15t-2.775.337Q7.85 15.675 6.5 16.35q-.225.125-.362.35-.138.225-.138.5Zm6-8q.825 0 1.413-.588Q14 8.825 14 8t-.587-1.412Q12.825 6 12 6q-.825 0-1.412.588Q10 7.175 10 8t.588 1.412Q11.175 10 12 10Zm0-2Zm0 10Z" />
                          </svg>
                          <span>Profile</span>
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={`/u/${user.id}/settings`}>
                        <a onClick={toggleMenu}>
                          <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                            <path d="m9.25 22-.4-3.2q-.325-.125-.612-.3-.288-.175-.563-.375L4.7 19.375l-2.75-4.75 2.575-1.95Q4.5 12.5 4.5 12.337v-.675q0-.162.025-.337L1.95 9.375l2.75-4.75 2.975 1.25q.275-.2.575-.375.3-.175.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3.287.175.562.375l2.975-1.25 2.75 4.75-2.575 1.95q.025.175.025.337v.675q0 .163-.05.338l2.575 1.95-2.75 4.75-2.95-1.25q-.275.2-.575.375-.3.175-.6.3l-.4 3.2Zm2.8-6.5q1.45 0 2.475-1.025Q15.55 13.45 15.55 12q0-1.45-1.025-2.475Q13.5 8.5 12.05 8.5q-1.475 0-2.488 1.025Q8.55 10.55 8.55 12q0 1.45 1.012 2.475Q10.575 15.5 12.05 15.5Zm0-2q-.625 0-1.062-.438-.438-.437-.438-1.062t.438-1.062q.437-.438 1.062-.438t1.063.438q.437.437.437 1.062t-.437 1.062q-.438.438-1.063.438ZM12 12Zm-1 8h1.975l.35-2.65q.775-.2 1.438-.588.662-.387 1.212-.937l2.475 1.025.975-1.7-2.15-1.625q.125-.35.175-.738.05-.387.05-.787t-.05-.788q-.05-.387-.175-.737l2.15-1.625-.975-1.7-2.475 1.05q-.55-.575-1.212-.963-.663-.387-1.438-.587L13 4h-1.975l-.35 2.65q-.775.2-1.437.587-.663.388-1.213.938L5.55 7.15l-.975 1.7 2.15 1.6q-.125.375-.175.75-.05.375-.05.8 0 .4.05.775t.175.75l-2.15 1.625.975 1.7 2.475-1.05q.55.575 1.213.962.662.388 1.437.588Z" />
                          </svg>
                          <span>Account settings</span>
                        </a>
                      </Link>
                    </li>
                    <li>
                      <button onClick={onLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                          <path d="M5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h7v2H5v14h7v2Zm11-4-1.375-1.45 2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5Z" />
                        </svg>
                        <span>Log out</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link href="/login">
                      <a onClick={toggleMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                          <path d="M12 21v-2h7V5h-7V3h7q.825 0 1.413.587Q21 4.175 21 5v14q0 .825-.587 1.413Q19.825 21 19 21Zm-2-4-1.375-1.45 2.55-2.55H3v-2h8.175l-2.55-2.55L10 7l5 5Z" />
                        </svg>
                        <span>Login</span>
                      </a>
                    </Link>
                  </li>
                )}
              </ul>
              <ul className={style.menu__list}>
                <li>
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                      <path
                        d="M12 23.3 8.65 20H4v-4.65L.7 12 4 8.65V4h4.65L12 .7 15.35 4H20v4.65L23.3 12 20 15.35V20h-4.65Zm0-5.3q2.5 0 4.25-1.75T18 12q0-2.5-1.75-4.25T12 6Zm0 2.5 2.5-2.5H18v-3.5l2.5-2.5L18 9.5V6h-3.5L12 3.5 9.5 6H6v3.5L3.5 12 6 14.5V18h3.5Zm0-8.5Z"
                        fill="currentColor"
                      />
                    </svg>
                    <Toggle
                      onChange={() => onThemeChange(theme !== 'system' ? 'system' : 'dark')}
                      checked={theme === 'system'}
                      label="Match system theme"
                      style={{ width: '100%' }}
                    />
                  </button>
                </li>
                {theme !== 'system' ? (
                  <li>
                    <button>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                        <path d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025.337.025.662.075-1.025.725-1.637 1.887Q11.1 6.15 11.1 7.5q0 2.25 1.575 3.825Q14.25 12.9 16.5 12.9q1.375 0 2.525-.613 1.15-.612 1.875-1.637.05.325.075.662Q21 11.65 21 12q0 3.75-2.625 6.375T12 21Zm0-2q2.2 0 3.95-1.212 1.75-1.213 2.55-3.163-.5.125-1 .2-.5.075-1 .075-3.075 0-5.238-2.162Q9.1 10.575 9.1 7.5q0-.5.075-1t.2-1q-1.95.8-3.162 2.55Q5 9.8 5 12q0 2.9 2.05 4.95Q9.1 19 12 19Zm-.25-6.75Z" />
                      </svg>
                      <Toggle
                        onChange={() => onThemeChange(theme !== 'light' ? 'light' : 'dark')}
                        checked={theme === 'dark'}
                        label="Dark theme"
                        style={{ width: '100%' }}
                      />
                    </button>
                  </li>
                ) : undefined}
                {/* <li>
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                      <path d="M13 14h2v-3h3V9h-3V6h-2v3h-3v2h3Zm-5 4q-.825 0-1.412-.587Q6 16.825 6 16V4q0-.825.588-1.413Q7.175 2 8 2h12q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18Zm0-2h12V4H8v12Zm-4 6q-.825 0-1.412-.587Q2 20.825 2 20V6h2v14h14v2ZM8 4v12V4Z" />
                    </svg>
                    <span>Add application shortcut</span>
                  </button>
                </li> */}
              </ul>
              <ul className={style.menu__list}>
                {/* <li>
                  <a
                    onClick={toggleMenu}
                    href="https://github.com/sivercone/memory-word-boost/issues"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                      <path d="M5 21V4h9l.4 2H20v10h-7l-.4-2H7v7Zm7.5-11Zm2.15 4H18V8h-5.25l-.4-2H7v6h7.25Z" />
                    </svg>
                    <span>Share feedback</span>
                  </a>
                </li> */}
                <li>
                  <a
                    onClick={toggleMenu}
                    href="https://github.com/sivercone/memory-word-boost/issues"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                      <path d="M12 17q.425 0 .713-.288Q13 16.425 13 16t-.287-.713Q12.425 15 12 15t-.712.287Q11 15.575 11 16t.288.712Q11.575 17 12 17Zm-1-4h2V7h-2Zm-2.75 8L3 15.75v-7.5L8.25 3h7.5L21 8.25v7.5L15.75 21Zm.85-2h5.8l4.1-4.1V9.1L14.9 5H9.1L5 9.1v5.8Zm2.9-7Z" />
                    </svg>
                    <span>Report an issue</span>
                  </a>
                </li>
                <li>
                  <a onClick={toggleMenu} href="https://sivercone.vercel.app/" target="_blank" rel="noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                      <path d="M5.4 20 4 18.6 15.6 7H9V5h10v10h-2V8.4Z" />
                    </svg>
                    <span>Visit developer&#39;s site</span>
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        ) : undefined}
      </AnimatePresence>
    </>
  );
};

const BottomBar = () => {
  const { pathname, push } = useRouter();
  const { toggleSheet, isSheetVisible } = useBottomSheet();

  const toggleCreationShown = (url?: string) => {
    toggleSheet();
    if (url) push(url);
  };
  const [shownFolder, setShownFolder] = React.useState(false);
  const toggleShownFolder = () => {
    toggleSheet(false);
    setShownFolder(!shownFolder);
  };
  const isStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
  if (pathsForHidingLayout.includes(pathname)) return null;
  return (
    <>
      <div style={isStandalone ? { height: 'calc(50px + 1.5rem)' } : { height: 'calc(50px + 0.5rem)' }}></div>
      <nav className={style.navigation}>
        <div className={style.navigation__inner} style={isStandalone ? undefined : { paddingBottom: '0.5rem' }}>
          <Link href="/">
            <a className={style.navigation__item}>
              <span className={pathname === '/' ? style.activeItem : undefined}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                  <path d="M4 21V9l8-6 8 6v12h-6v-7h-4v7Zm2-2h2v-7h8v7h2v-9l-6-4.5L6 10Zm6-6.75Z" />
                </svg>
              </span>
              <p>Home</p>
            </a>
          </Link>
          <button onClick={() => toggleSheet()} className={style.navigation__item}>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                <path d="M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4Zm1 5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z" />
              </svg>
            </span>
            <p>Create</p>
          </button>
          <a
            href="https://github.com/sivercone/memory-word-boost#readme"
            target="_blank"
            rel="noreferrer"
            className={style.navigation__item}
          >
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                <path d="M11.95 18q.525 0 .888-.363.362-.362.362-.887t-.362-.887q-.363-.363-.888-.363t-.888.363q-.362.362-.362.887t.362.887q.363.363.888.363Zm-.9-3.85h1.85q0-.825.188-1.3.187-.475 1.062-1.3.65-.65 1.025-1.238.375-.587.375-1.412 0-1.4-1.025-2.15T12.1 6q-1.425 0-2.312.75-.888.75-1.238 1.8l1.65.65q.125-.45.563-.975Q11.2 7.7 12.1 7.7q.8 0 1.2.437.4.438.4.963 0 .5-.3.937-.3.438-.75.813-1.1.975-1.35 1.475-.25.5-.25 1.825ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z" />
              </svg>
            </span>
            <p>About</p>
          </a>
        </div>
      </nav>
      <BottomSheet visible={isSheetVisible} toggleVisible={toggleSheet} label="Create">
        <li>
          <button onClick={() => toggleCreationShown('/create-set')}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
              <path d="M12 20q-1.2-.95-2.6-1.475Q8 18 6.5 18q-1.05 0-2.062.275-1.013.275-1.938.775-.525.275-1.012-.025Q1 18.725 1 18.15V6.1q0-.275.138-.525.137-.25.412-.375 1.15-.6 2.4-.9Q5.2 4 6.5 4q1.45 0 2.838.375Q10.725 4.75 12 5.5v12.1q1.275-.8 2.675-1.2 1.4-.4 2.825-.4.9 0 1.763.15.862.15 1.737.45v-12q.375.125.738.262.362.138.712.338.275.125.413.375.137.25.137.525v12.05q0 .575-.487.875-.488.3-1.013.025-.925-.5-1.938-.775Q18.55 18 17.5 18q-1.5 0-2.9.525T12 20Zm2-5V5.5l5-5v10Zm-4 1.625v-9.9q-.825-.35-1.712-.537Q7.4 6 6.5 6q-.925 0-1.8.175T3 6.7v9.925q.875-.325 1.738-.475Q5.6 16 6.5 16t1.762.15q.863.15 1.738.475Zm0 0v-9.9Z" />
            </svg>
            <span>Create study set</span>
          </button>
        </li>
        <li>
          <button onClick={toggleShownFolder}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
              <path d="M4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h6l2 2h8q.825 0 1.413.588Q22 7.175 22 8H11.175l-2-2H4v12l2.4-8h17.1l-2.575 8.575q-.2.65-.737 1.038Q19.65 20 19 20Zm2.1-2H19l1.8-6H7.9Zm0 0 1.8-6-1.8 6ZM4 8V6v2Z" />
            </svg>
            <span>Create folder</span>
          </button>
        </li>
      </BottomSheet>
      <FolderForm isOpen={shownFolder} onClose={toggleShownFolder} />
    </>
  );
};

export default Layout;
