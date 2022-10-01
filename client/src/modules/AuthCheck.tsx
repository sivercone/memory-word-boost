import React from 'react';
import { useQuery } from 'react-query';
import { authApi } from 'apis/authApi';
import { useUserStore } from 'storage/useUserStore';
import { sessionMemory } from 'utils/sessionMemory';

export const AuthCheck: React.FC = () => {
  const { setUser, setSignAccess, signAccess } = useUserStore();
  const { data, status, refetch } = useQuery('user', () => authApi.me(signAccess), { enabled: false });

  React.useEffect(() => {
    const loggedInfo = sessionMemory.get('logged');
    if (!loggedInfo || loggedInfo === 'yes') refetch();
  }, []);

  React.useEffect(() => {
    if (status === 'error') sessionMemory.set('logged', 'no');
    if (status === 'success' && data) {
      const { signAccess, ...user } = data;
      setUser(user);
      setSignAccess(signAccess);
      sessionMemory.set('logged', 'yes');
    }
  }, [status, data, setUser]);

  React.useEffect(() => {
    if (status === 'error') window.location.replace('/login');
  }, [status]);

  return <></>;
};
