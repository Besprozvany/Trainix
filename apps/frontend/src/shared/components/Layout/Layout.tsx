import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { CustomCursor } from '../CustomCursor/CustomCursor';
import { Navbar } from '../Navbar/Navbar';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0f0f13]">
      <CustomCursor />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="mx-auto max-w-6xl px-6 py-10"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
