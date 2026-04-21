import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  const trailX = useSpring(cursorX, { damping: 40, stiffness: 150 });
  const trailY = useSpring(cursorY, { damping: 40, stiffness: 150 });

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(
        target.matches('a, button, [role="button"], input, textarea, label, select, [data-hover]'),
      );
    };

    const handleDown = () => setIsClicking(true);
    const handleUp = () => setIsClicking(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', handleOver);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Dot cursor */}
      <motion.div
        style={{ translateX: x, translateY: y }}
        animate={{
          scale: isClicking ? 0.7 : 1,
          opacity: 1,
        }}
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className="h-3 w-3 rounded-full bg-indigo-400 transition-transform duration-100"
          style={{ boxShadow: '0 0 10px rgba(99,102,241,0.8)' }}
        />
      </motion.div>

      {/* Trail ring */}
      <motion.div
        style={{ translateX: trailX, translateY: trailY }}
        animate={{
          scale: isHovering ? 1.8 : isClicking ? 0.8 : 1,
          borderColor: isHovering ? 'rgba(167,139,250,0.9)' : 'rgba(99,102,241,0.4)',
        }}
        transition={{ duration: 0.15 }}
        className="pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-2 border-indigo-500/40"
      />
    </>
  );
}
