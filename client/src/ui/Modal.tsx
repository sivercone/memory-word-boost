import React from 'react';
import style from 'styles/components/modal.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import ReactDOM from 'react-dom';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const fadeUp = {
  init: { x: '-50%', y: '-50%', scale: 2, opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  anim: { x: '-50%', y: '-50%', scale: 1, opacity: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit: { x: '-50%', y: '0%', scale: 1, opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};
const fade = {
  init: { opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  anim: { opacity: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};

export const ModalBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={style.modal__body}>{children}</div>
);
export const ModalInputs: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={style.modal__inputs}>{children}</div>
);
export const ModalList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={style.modal__list}>
    <ul className={style.modal__listWrapper}>{children}</ul>
  </div>
);
export const ModalActions: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={style.modal__actions}>{children}</div>
);

export const Modal: React.FC<Props> = ({ isOpen, onClose, children }) => {
  const nextdiv = typeof window !== 'undefined' ? document.getElementById('__next') : null;
  if (!nextdiv) return <></>;

  return ReactDOM.createPortal(
    <AnimatePresence mode="wait">
      {isOpen ? (
        <>
          <motion.div
            onClick={onClose}
            variants={fade}
            initial="init"
            animate="anim"
            exit="init"
            className={style.overlay}
            id="modal"
          />
          <motion.div variants={fadeUp} initial="init" animate="anim" exit="exit" className={style.modal}>
            {children}
          </motion.div>
        </>
      ) : undefined}
    </AnimatePresence>,
    nextdiv,
  );
};
