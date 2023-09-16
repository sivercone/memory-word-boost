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
            className="fixed w-full h-full top-0 bottom-0 left-0 right-0 bg-gray-800 bg-opacity-50 z-40 backdrop-blur-[2px]"
            variants={opacityFadeMotions}
            initial="init"
            animate="anim"
            exit="init"
          ></motion.div>
          <motion.div
            className="z-50 fixed bottom-0 left-0 right-0 w-full mx-auto px-4 pt-4 pb-12 bg-gray-50 rounded-t-2xl max-w-3xl"
            variants={growUpMotions}
            initial="init"
            animate="anim"
            exit="init"
          >
            {children}
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
