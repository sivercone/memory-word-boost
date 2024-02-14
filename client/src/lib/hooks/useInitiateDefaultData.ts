import React from 'react';
import { useQuery } from 'react-query';
import { authApi, setApi } from '@src/apis';
import consts from '../consts';
import { exampleSets } from '../datus';

const useInitiateDefaultData = () => {
  const hasRunOnce = React.useRef(false);
  const user = useQuery('user', () => authApi.me(), { enabled: consts.isBackendLess });
  const sets = useQuery('allSets', () => setApi.get(), { enabled: consts.isBackendLess });

  const setInitialSets = async () => {
    if (hasRunOnce.current && sets.data?.length) return;
    try {
      for (const set of exampleSets) {
        await setApi.save(set);
      }
      hasRunOnce.current = true;
    } catch (error) {
      console.warn(error);
    }
  };

  React.useEffect(() => {
    if (user.data && sets.isSuccess && !sets.data?.length && consts.isBackendLess && !hasRunOnce.current) {
      setInitialSets();
    }
  }, [user.data, sets.data]);
};

export default useInitiateDefaultData;
