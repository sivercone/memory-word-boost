export const pathsForHidingLayout = [
  '/login',
  '/u/[user]/settings',
  '/[set]/flashcards',
  '/[set]/learn',
  '/[set]/exam',
  '/[set]/write',
  '/[set]/update',
  '/create-set',
];

export const flashCardMotions = {
  init: { rotateY: 0, translateX: '0%', opacity: 1, transition: { type: 'spring', stiffness: 100, duration: 0.1 } },
  rotate: { rotateY: 180, translateX: '0%', opacity: 1, transition: { type: 'spring', stiffness: 100, duration: 0.1 } },
  translateLeft: { rotateY: 0, translateX: '100%', opacity: 0, transition: { type: 'spring', stiffness: 100, duration: 0.1 } },
  translateRight: { rotateY: 0, translateX: '-100%', opacity: 0, transition: { type: 'spring', stiffness: 100, duration: 0.1 } },
  scale: { scale: 0.9, transition: { type: 'spring', stiffness: 100, duration: 0.1 } },
};

export const growUpMotions = {
  init: { y: '100%', transition: { duration: 0.1 } },
  anim: { y: '0%', transition: { duration: 0.15 } },
};

export const opacityFadeMotions = {
  init: { opacity: 0, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } },
  anim: { opacity: 1, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } },
};
