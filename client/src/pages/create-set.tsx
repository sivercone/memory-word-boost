import React from 'react';
import { useQuery } from 'react-query';
import { authApi } from 'apis/authApi';
import SetEditing from 'modules/SetEditing';
import { useUserStore } from 'storage/useUserStore';
import { isBackendLess } from 'utils/staticData';

const CreateSet = () => {
  const { signAccess } = useUserStore();
  const user = useQuery('user', () => authApi.me(signAccess));
  React.useEffect(() => {
    if (!user.isFetching && !user.data && typeof window !== 'undefined' && !isBackendLess)
      setTimeout(() => window.location.replace('/login'), 1);
  }, [user]);
  return <SetEditing />;
};

export default CreateSet;
