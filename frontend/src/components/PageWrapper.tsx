import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTransition } from '@/hooks/usePageTransition';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const { key, variants, transition } = usePageTransition();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageWrapper;
