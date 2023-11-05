import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { authApi } from '@src/apis';
import { Spinner } from '@src/ui';
import { useIsClient } from '@src/lib/hooks';
import { useUserStore } from '@src/stores';

export const AuthCheck: React.FC = () => {
  const isClient = useIsClient();
  const router = useRouter();
  const { setUser } = useUserStore();
  const loggedInfo = isClient ? localStorage.logged : null;
  const { refetch } = useQuery('user', () => authApi.me(), {
    enabled: false,
    onError: () => localStorage.setItem('logged', 'no'),
    onSuccess: (data) => {
      localStorage.setItem('logged', 'yes');
      setUser(data);
    },
  });

  React.useEffect(() => {
    if (isClient) {
      if (loggedInfo === 'yes') refetch();
      else router.replace('/login');
    }
  }, [loggedInfo]);

  if (!loggedInfo)
    return (
      <div className="animate-fadeIn z-50 absolute top-0 bottom-0 left-0 right-0 w-full h-full flex items-center justify-center bg-white pointer-events-none select-none">
        <Spinner className="mx-auto m-8 h-8" />
      </div>
    );
  else return null;
};
