import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useLocalStore, useRuntimeStore } from '@src/stores';

import Cards from './Cards';
import Folders from './Folders';
import General from './General';

const tabComponentMapping = {
  cards: <Cards />,
  folders: <Folders />,
  default: <General />,
};

const SetForm = () => {
  const { query } = useRouter();
  const rtStore = useRuntimeStore();
  const localStore = useLocalStore();

  useEffect(() => {
    if (query.id) {
      const studySet = localStore.sets.find((item) => item.id === query.id);
      if (studySet) rtStore.setValues({ studySetDraft: studySet });
    } else rtStore.destroy(['studySetDraft']);

    return () => rtStore.destroy(['studySetDraft']);
  }, [query.id]);

  useEffect(() => {
    const nav = document.querySelector('#navigation');
    if (query.tab === 'cards') nav?.classList.remove('sticky');
    else nav?.classList.add('sticky');
    return () => nav?.classList.add('sticky');
  }, [query]);

  return tabComponentMapping[String(query.tab) as 'cards' | 'folders'] || tabComponentMapping['default'];
};

export default SetForm;
