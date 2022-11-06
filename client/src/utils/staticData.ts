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

export const isBackendLess = process.env.NEXT_PUBLIC_BACKENDLESS === 'TRUE';
