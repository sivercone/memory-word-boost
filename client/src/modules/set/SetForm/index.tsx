import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Cards from './Cards';
import General from './General';
import { SetInterface } from '@src/interfaces';
import { useSetStore } from '@src/storage/useSetStore';
import Folders from './Folders';

const SetForm: NextPage<{ data?: SetInterface; queryId: string }> = ({ data: studySet, queryId }) => {
  const { query } = useRouter();
  const { setCurrStudySet, resetCurrStudySet } = useSetStore();

  React.useEffect(() => {
    if (queryId === 'new') resetCurrStudySet();
    else if (studySet) setCurrStudySet(studySet);
    return () => {
      resetCurrStudySet();
    };
  }, [queryId]);

  React.useEffect(() => {
    const nav = document.querySelector('#navigation');
    if (query.tab === 'cards') nav?.classList.remove('sticky');
    else nav?.classList.add('sticky');
    return () => {
      nav?.classList.add('sticky');
    };
  }, [query]);

  const tabComponentMapping = {
    cards: <Cards />,
    folders: <Folders />,
    default: <General />,
  };

  return tabComponentMapping[String(query.tab) as 'cards' | 'folders'] || tabComponentMapping['default'];
};

export default SetForm;
