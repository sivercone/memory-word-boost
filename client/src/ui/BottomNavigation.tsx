import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import style from 'styles/components/bottomNavigation.module.scss';
import { pathsForHidingLayout } from 'utils/staticData';
import { FolderEditing } from 'components/FolderEditing';
import { AnimatePresence, motion } from 'framer-motion';

const transition = {
  init: { y: '100%', transition: { duration: 0.1 } },
  anim: { y: '0%', transition: { duration: 0.15 } },
};

const BottomNavigation = () => {
  const { pathname, push } = useRouter();
  if (pathsForHidingLayout.includes(pathname)) return null;

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

  return (
    <>
      <div onClick={() => toggleCreationShown()} className={shownCreation ? style.overlayActive : style.overlay}></div>
      <nav className={style.navigation}>
        <div className={style.navigation__inner}>
          <Link href="/">
            <a className={style.navigation__item}>
              <span className={pathname === '/' ? style.activeItem : undefined}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                  <path d="M4 21V9l8-6 8 6v12h-6v-7h-4v7Zm2-2h2v-7h8v7h2v-9l-6-4.5L6 10Zm6-6.75Z" />
                </svg>
              </span>
              <p>Home</p>
            </a>
          </Link>
          <button onClick={() => toggleCreationShown()} className={style.navigation__item}>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
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
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                <path d="M11.95 18q.525 0 .888-.363.362-.362.362-.887t-.362-.887q-.363-.363-.888-.363t-.888.363q-.362.362-.362.887t.362.887q.363.363.888.363Zm-.9-3.85h1.85q0-.825.188-1.3.187-.475 1.062-1.3.65-.65 1.025-1.238.375-.587.375-1.412 0-1.4-1.025-2.15T12.1 6q-1.425 0-2.312.75-.888.75-1.238 1.8l1.65.65q.125-.45.563-.975Q11.2 7.7 12.1 7.7q.8 0 1.2.437.4.438.4.963 0 .5-.3.937-.3.438-.75.813-1.1.975-1.35 1.475-.25.5-.25 1.825ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z" />
              </svg>
            </span>
            <p>About</p>
          </a>
        </div>
      </nav>
      <AnimatePresence>
        {shownCreation ? (
          <motion.div className={style.creation} variants={transition} initial="init" animate="anim" exit="init">
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

export default BottomNavigation;
