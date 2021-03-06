import React from 'react';
import { useQuery } from 'react-query';
import { authApi } from 'api/authApi';
import { useUserStore } from 'storage/useUserStore';
import { sessionMemory } from 'utils/sessionMemory';

export const AuthCheck: React.FC = () => {
  const { setUser } = useUserStore();
  const { data, status, refetch } = useQuery('user', () => authApi.me(), { enabled: false });

  React.useEffect(() => {
    if (!sessionMemory.get('logged') || sessionMemory.get('logged') === 'yes') refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (status === 'error') sessionMemory.set('logged', 'no');
    if (status === 'success' && data) {
      setUser(data);
      sessionMemory.set('logged', 'yes');
    }
  }, [status, data, setUser]);

  React.useEffect(() => {
    if (status === 'error') window.location.replace('/login');
  }, [status]);

  return <></>;
};
