import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { authApi } from 'apis/authApi';
import { useUserStore } from 'storage/useUserStore';
import { sessionMemory } from 'utils/browserMemory';
import { growUpMotions, isBackendLess, pathsForHidingLayout } from 'utils/staticData';
import { FolderEditing } from 'modules/FolderEditing';
import { Button } from 'ui/Button';
import Header from 'ui/Header';
import style from 'styles/components/layout.module.scss';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <TopBar />
      {children}
      <BottomBar />
    </>
  );
};

const TopBar = () => {
  const { pathname } = useRouter();
  const [isHovered, setIsHovered] = React.useState(false);
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

  if (pathsForHidingLayout.includes(pathname)) return null;
  return (
    <>
      <Header>
        <Link href="/">
          <a>PROJECT MWB</a>
        </Link>
        {isBackendLess ? undefined : (
          <>
            {user ? (
              <button
                onClick={toggleMenu}
                style={{ height: '40px', borderRadius: '50%', color: 'inherit' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {isHovered ? (
                  <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" fill="currentColor">
                    <path d="M20 29.125q2.792 0 5.104-1.521 2.313-1.521 3.354-4.062H11.542q1.083 2.541 3.375 4.062 2.291 1.521 5.083 1.521Zm-7.292-11.167 1.875-1.833 1.834 1.833L18 16.375l-3.417-3.417-3.458 3.417Zm10.917 0 1.833-1.833 1.834 1.833 1.583-1.583-3.417-3.417-3.416 3.417ZM20 36.667q-3.458 0-6.5-1.313-3.042-1.312-5.292-3.562T4.646 26.5Q3.333 23.458 3.333 20t1.313-6.5q1.312-3.042 3.562-5.292T13.5 4.646q3.042-1.313 6.5-1.313t6.5 1.313q3.042 1.312 5.292 3.562t3.562 5.292q1.313 3.042 1.313 6.5t-1.313 6.5q-1.312 3.042-3.562 5.292T26.5 35.354q-3.042 1.313-6.5 1.313ZM20 20Zm0 13.875q5.833 0 9.854-4.021 4.021-4.021 4.021-9.854 0-5.833-4.021-9.854Q25.833 6.125 20 6.125q-5.833 0-9.854 4.021Q6.125 14.167 6.125 20q0 5.833 4.021 9.854 4.021 4.021 9.854 4.021Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" fill="currentColor">
                    <path d="M26 17.958q.958 0 1.646-.666.687-.667.687-1.667 0-.958-.687-1.646-.688-.687-1.646-.687t-1.646.687q-.687.688-.687 1.646 0 1 .687 1.667.688.666 1.646.666Zm-12 0q.958 0 1.646-.666.687-.667.687-1.667 0-.958-.687-1.646-.688-.687-1.646-.687t-1.646.687q-.687.688-.687 1.646 0 1 .687 1.667.688.666 1.646.666Zm6 11.167q2.792 0 5.104-1.521 2.313-1.521 3.354-4.062h-2.375q-.958 1.625-2.562 2.52-1.604.896-3.521.896-1.875 0-3.5-.896-1.625-.895-2.542-2.52h-2.416q1.083 2.541 3.375 4.062 2.291 1.521 5.083 1.521Zm0 7.542q-3.458 0-6.5-1.313-3.042-1.312-5.292-3.562T4.646 26.5Q3.333 23.458 3.333 20t1.313-6.5q1.312-3.042 3.562-5.292T13.5 4.646q3.042-1.313 6.5-1.313t6.5 1.313q3.042 1.312 5.292 3.562t3.562 5.292q1.313 3.042 1.313 6.5t-1.313 6.5q-1.312 3.042-3.562 5.292T26.5 35.354q-3.042 1.313-6.5 1.313ZM20 20Zm0 13.875q5.833 0 9.854-4.021 4.021-4.021 4.021-9.854 0-5.833-4.021-9.854Q25.833 6.125 20 6.125q-5.833 0-9.854 4.021Q6.125 14.167 6.125 20q0 5.833 4.021 9.854 4.021 4.021 9.854 4.021Z" />
                  </svg>
                )}
              </button>
            ) : (
              <Link href="/login">
                <a className={style.smile}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                    <path d="M15.5 11q.625 0 1.062-.438Q17 10.125 17 9.5t-.438-1.062Q16.125 8 15.5 8t-1.062.438Q14 8.875 14 9.5t.438 1.062Q14.875 11 15.5 11Zm-7 0q.625 0 1.062-.438Q10 10.125 10 9.5t-.438-1.062Q9.125 8 8.5 8t-1.062.438Q7 8.875 7 9.5t.438 1.062Q7.875 11 8.5 11Zm3.5 6.5q1.7 0 3.088-.962Q16.475 15.575 17.1 14h-1.65q-.55.925-1.462 1.462Q13.075 16 12 16t-1.988-.538Q9.1 14.925 8.55 14H6.9q.625 1.575 2.013 2.538Q10.3 17.5 12 17.5Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Z" />
                  </svg>
                  <span>Login</span>
                </a>
              </Link>
            )}
          </>
        )}
      </Header>
      <AnimatePresence>
        {isMenuOpen && user ? (
          <motion.div className={style.menu} variants={growUpMotions} initial="init" animate="anim" exit="init">
            <Header>
              <Button onClick={toggleMenu} title="close" variant="icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                </svg>
              </Button>
              <p>Menu</p>
              <div></div>
            </Header>
            <div className={style.menu__inner}>
              <ul className={style.menu__list}>
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
                  <a
                    onClick={toggleMenu}
                    href="https://github.com/sivercone/memory-word-boost/issues"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                      <path d="M5 21V4h9l.4 2H20v10h-7l-.4-2H7v7Zm7.5-11Zm2.15 4H18V8h-5.25l-.4-2H7v6h7.25Z" />
                    </svg>
                    <span>Report a bug</span>
                  </a>
                </li>
                <li>
                  <button onClick={onLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
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

const BottomBar = () => {
  const { pathname, push } = useRouter();

  const [shownCreation, setShownCreation] = React.useState(false);
  const toggleCreationShown = (url?: string) => {
    setShownCreation(!shownCreation);
    if (url) push(url);
  };
  const [shownFolder, setShownFolder] = React.useState(false);
  const toggleShownFolder = () => {
    setShownCreation(false);
    setShownFolder(!shownFolder);
  };

  if (pathsForHidingLayout.includes(pathname)) return null;
  return (
    <>
      <div onClick={() => setShownCreation(false)} className={shownCreation ? style.overlayActive : style.overlay}></div>
      <nav className={style.navigation}>
        <div className={style.navigation__inner}>
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
          <button onClick={() => toggleCreationShown()} className={style.navigation__item}>
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
      <AnimatePresence>
        {shownCreation ? (
          <motion.div className={style.creation} variants={growUpMotions} initial="init" animate="anim" exit="init">
            <div className={style.creation__top}>
              <span>Create</span>
              <button onClick={() => toggleCreationShown()}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                </svg>
              </button>
            </div>
            <ul>
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
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <FolderEditing isOpen={shownFolder} onClose={toggleShownFolder} />
    </>
  );
};

export default Layout;
