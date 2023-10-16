import React from 'react';
import { useQuery } from 'react-query';
import { authApi } from 'apis/authApi';
import { useUserStore } from '@src/stores';

export const AuthCheck: React.FC = () => {
  const { setUser, setSignAccess, signAccess } = useUserStore();
  const { data, status, refetch } = useQuery('user', () => authApi.me(signAccess), { enabled: false });

  React.useEffect(() => {
    const loggedInfo = sessionStorage.logged;
    if (!loggedInfo || loggedInfo === 'yes') refetch();
  }, []);

  React.useEffect(() => {
    if (status === 'error') sessionStorage.setItem('logged', 'no');
    if (status === 'success' && data) {
      const { signAccess, ...user } = data;
      setUser(user);
      setSignAccess(signAccess);
      sessionStorage.setItem('logged', 'yes');
    }
  }, [status, data, setUser]);

  React.useEffect(() => {
    if (status === 'error') window.location.replace('/login');
  }, [status]);

  return <></>;
};
