import React from 'react';
import { authApi, setApi } from '@src/apis';
import { useQuery } from 'react-query';
import consts from '../consts';
import { exampleSets } from '../datus';

const useInitiateDefaultData = () => {
  const hasRunOnce = React.useRef(false);
  const user = useQuery('user', () => authApi.me(), { enabled: consts.isBackendLess });
  const sets = useQuery('allSets', () => setApi.get(), { enabled: consts.isBackendLess });

  const setInitialSets = async () => {
    try {
      await setApi.save(exampleSets[0]);
      await setApi.save(exampleSets[1]);
      hasRunOnce.current = true;
    } catch (error) {
      console.warn(error);
    }
  };

  React.useEffect(() => {
    if (user.data && sets.isSuccess && !sets.data?.length && consts.isBackendLess && !hasRunOnce.current) {
      setInitialSets();
    }
  }, [user.data, sets.isSuccess]);
};

export default useInitiateDefaultData;
