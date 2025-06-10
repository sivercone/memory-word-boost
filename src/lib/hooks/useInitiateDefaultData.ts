import { useEffect, useRef } from 'react';

import { exampleSets } from '../datus';
import utils from '../utils';
import { useLocalStore } from '@src/stores';

const useInitiateDefaultData = () => {
  const hasRunOnce = useRef(false);
  const { userId, ...localStore } = useLocalStore();
  const userStudySets = localStore.sets.filter((item) => item.userId === userId);

  const setInitialSets = (userId: string) => {
    try {
      localStore.setValues((prev) => ({ ...prev, sets: [...prev.sets, ...exampleSets.map((item) => ({ ...item, userId }))] }));
      hasRunOnce.current = true;
    } catch (error) {
      utils.func.handleError(error);
    }
  };

  useEffect(() => {
    if (userId && !userStudySets.length && !hasRunOnce.current) {
      setInitialSets(userId);
    }
  }, [userId, userStudySets]);
};

export default useInitiateDefaultData;
