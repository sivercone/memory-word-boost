import React from 'react';
import { useQuery } from 'react-query';
import { authApi } from 'apis/authApi';
import SetEditing from 'modules/SetEditing';

const CreateSet = () => {
  const user = useQuery('user', () => authApi.me());
  React.useEffect(() => {
    if (!user.isFetching && !user.data && typeof window !== 'undefined') setTimeout(() => window.location.replace('/login'), 1);
  }, [user]);
  return <SetEditing />;
};

export default CreateSet;
