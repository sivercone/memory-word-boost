import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useIsClient } from '@src/lib/hooks';
import { useLocalStore } from '@src/stores';
import { Spinner } from '@src/ui';

const AuthCheck: React.FC = () => {
  const router = useRouter();
  const localStore = useLocalStore();
  const isClient = useIsClient();
  const unauthenticated = !localStore.user && router.pathname !== '/login';

  useEffect(() => {
    if (isClient && unauthenticated) router.replace('/login');
  }, [isClient]);

  if (unauthenticated)
    return (
      <div className="animate-fadeIn z-50 absolute top-0 bottom-0 left-0 right-0 w-full h-full flex items-center justify-center bg-white pointer-events-none select-none">
        <Spinner className="mx-auto m-8 h-8" />
      </div>
    );
  else return null;
};

export default AuthCheck;
