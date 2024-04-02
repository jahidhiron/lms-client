import { AnimationProps } from 'framer-motion';

type Animations = AnimationProps;
export const FADE_IN: Animations = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
  transition: {
    duration: 0.4,
    ease: 'anticipate',
  },
};
export const FADE_IN_LTR: Animations = {
  initial: {
    translateX: -10,
    opacity: 0,
  },
  animate: {
    translateX: 0,
    opacity: 1,
  },
  exit: {
    translateX: -10,
    opacity: 0,
  },
  transition: {
    duration: 0.4,
    ease: 'anticipate',
  },
};
export const FADE_IN_RTL: Animations = {
  initial: {
    translateX: 10,
    opacity: 0,
  },
  animate: {
    translateX: 0,
    opacity: 1,
  },
  exit: {
    translateX: -10,
    opacity: 0,
  },
  transition: {
    duration: 0.4,
    ease: 'anticipate',
  },
};

export const SLIDE_UP: AnimationProps = {
  initial: {
    opacity: 0,
    translateY: 100,
    position: 'fixed',
  },
  animate: {
    opacity: 1,
    translateY: 0,
    position: 'relative',
  },
  exit: {
    opacity: 0,
    translateY: 50,
    position: 'relative',
  },
  transition: {
    duration: 0.5,
    ease: 'anticipate',
  },
};
