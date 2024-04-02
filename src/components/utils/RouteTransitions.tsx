import { AnimatePresence, AnimationProps, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useMemo, useRef, type FC, type ReactNode } from 'react';
import { SLIDE_UP } from '~/helpers/animations';

interface RouteTransitionsProps {
  children: ReactNode;
  animation?: AnimationProps;
}
const RouteTransitions: FC<RouteTransitionsProps> = ({
  children,
  animation = SLIDE_UP,
}) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <AnimatePresence initial={true} mode="wait">
      <motion.div
        ref={ref}
        style={useMemo(() => ({ width: '100%' }), [])}
        key={router.pathname}
        onAnimationStart={() => {
          // @ts-ignore
          if (ref?.current) {
            // @ts-ignore
            ref.current.parentElement.parentElement.style.overflow = 'hidden';
          }
        }}
        onAnimationComplete={() => {
          // @ts-ignore
          if (ref?.current) {
            // @ts-ignore
            ref.current.parentElement.parentElement.style.overflow = 'unset';
          }
        }}
        {...animation}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default RouteTransitions;
