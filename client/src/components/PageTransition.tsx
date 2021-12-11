import { motion } from 'framer-motion';
import { fade } from 'utils/frameAnims';

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div variants={fade} initial="init" animate="anim" exit="init">
      {children}
    </motion.div>
  );
};
