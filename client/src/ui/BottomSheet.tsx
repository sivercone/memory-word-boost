import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { growUpMotions, opacityFadeMotions } from 'lib/staticData';
import style from 'styles/components/bottomSheet.module.scss';

interface ComponentProps {
  visible: boolean;
  toggleVisible: () => void;
  label: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<ComponentProps> = ({ visible, toggleVisible, label, children }) => {
  return (
    <AnimatePresence>
      {visible ? (
        <>
          <motion.div
            onClick={toggleVisible}
            className={style.overlay}
            variants={opacityFadeMotions}
            initial="init"
            animate="anim"
            exit="init"
          ></motion.div>
          <motion.div className={style.popup} variants={growUpMotions} initial="init" animate="anim" exit="init">
            <div className={style.popup__top}>
              <span>{label}</span>
              <button onClick={toggleVisible}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                </svg>
              </button>
            </div>
            <ul className={style.popup__list}>{children}</ul>
          </motion.div>
        </>
      ) : undefined}
    </AnimatePresence>
  );
};

export const useBottomSheet = () => {
  const [isSheetVisible, setSheetVisible] = React.useState(false);
  const toggleSheet = (bool?: boolean) => setSheetVisible(typeof bool === 'boolean' ? bool : !isSheetVisible);

  return { toggleSheet, isSheetVisible };
};
