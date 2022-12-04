import React from 'react';
import { useQuery } from 'react-query';
import { authApi } from 'apis/authApi';
import SetForm from 'modules/SetForm';
import { useUserStore } from 'storage/useUserStore';
import { isBackendLess } from 'lib/staticData';

const CreateSet = () => {
  const { signAccess } = useUserStore();
  const user = useQuery('user', () => authApi.me(signAccess));
  React.useEffect(() => {
    if (!user.isFetching && !user.data && typeof window !== 'undefined' && !isBackendLess)
      setTimeout(() => window.location.replace('/login'), 1);
  }, [user]);
  return <SetForm />;
};

export default CreateSet;
