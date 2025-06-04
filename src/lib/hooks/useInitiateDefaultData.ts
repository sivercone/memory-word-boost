import { useEffect, useRef } from 'react';

import { exampleSets } from '../datus';
import { useLocalStore } from '@src/stores';

const useInitiateDefaultData = () => {
  const hasRunOnce = useRef(false);
  const { user, sets, ...localStore } = useLocalStore();

  const setInitialSets = () => {
    if (!user || (hasRunOnce.current && sets.length)) return;
    try {
      localStore.setValues({ sets: exampleSets.map((item) => ({ ...item, userId: user.id })) });
      hasRunOnce.current = true;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user && !sets?.length && !hasRunOnce.current) {
      setInitialSets();
    }
  }, [user, sets]);
};

export default useInitiateDefaultData;
