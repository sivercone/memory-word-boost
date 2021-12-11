import React from 'react';
import style from 'styles/pages/cards.module.scss';
import { motion } from 'framer-motion';
import db from 'utils/db.json';

// drag - https://codesandbox.io/s/5trtt

// todo - describe how to learn with cards

const rotateX = {
  init: { rotateX: 0, transition: { duration: 0.3 } },
  anim: { rotateX: -180, transition: { duration: 0.3 } },
};
const alignX = { translateX: 0, opacity: 1, transition: { duration: 0.3 } };
const translateLeft = { translateX: '100%', opacity: 0, transition: { duration: 0.3 } };
const translateRight = { translateX: '-100%', opacity: 0, transition: { duration: 0.3 } };

function cards() {
  const data = db.words[1].cards;
  const [toggled, setToggled] = React.useState(false);
  const onToggle = () => setToggled(!toggled);

  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [increased, setIncreased] = React.useState<boolean>(false);
  const [toRepeated, setToRepeated] = React.useState<boolean>(false);
  const increaseIndex = () => {
    // learned
    setIncreased(true);
    setTimeout(() => {
      setIncreased(false);
      setCurrentIndex(currentIndex + 1);
    }, 300);
  };
  const toRepeat = () => {
    setToRepeated(true);
    setTimeout(() => {
      setToRepeated(false);
      setCurrentIndex(currentIndex + 1);
    }, 300);
  };
  //  const decreaseIndex = () => setCurrentIndex(currentIndex < 1 ? currentIndex : currentIndex - 1);

  return (
    <div className={style.class}>
      <div className={style.class__panel}>
        <button title="close">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#181818">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
          </svg>
        </button>
        <span>{`${currentIndex + 1}/${data.length}`}</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button title="undo">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#181818">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
            </svg>
          </button>
          <button title="settings">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#181818">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
            </svg>
          </button>
        </div>
      </div>
      <div className={style.class__card}>
        {currentIndex >= data.length ? (
          <div>
            <p>nice work</p>
            <p>You just studied 35 terms! / Keep practicing to master the 34 remaining</p>
            <button>study over / study again</button>
            <button>restart</button>
          </div>
        ) : (
          <>
            <button onClick={toRepeat} title="study again">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 24 24"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                fill="#181818"
              >
                <rect fill="none" height="24" width="24" />
                <path d="M9,19l1.41-1.41L5.83,13H22V11H5.83l4.59-4.59L9,5l-7,7L9,19z" />
              </svg>
            </button>
            <motion.div animate={increased ? translateLeft : toRepeated ? translateRight : alignX}>
              <motion.button animate={toggled ? rotateX.anim : rotateX.init} onClick={onToggle} className={style.class__block}>
                <motion.span animate={toggled ? rotateX.anim : rotateX.init}>
                  {toggled ? data[currentIndex].definiton : data[currentIndex].term}
                </motion.span>
              </motion.button>
            </motion.div>
            <button onClick={increaseIndex} title="got it">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 24 24"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                fill="#181818"
              >
                <rect fill="none" height="24" width="24" />
                <path d="M15,5l-1.41,1.41L18.17,11H2V13h16.17l-4.59,4.59L15,19l7-7L15,5z" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default cards;
