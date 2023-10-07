import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Cards from './Cards';
import General from './General';
import { SetInterface } from '@src/interfaces';

const SetForm: NextPage<{ data?: SetInterface }> = ({ data: studySet }) => {
  const { query } = useRouter();

  React.useEffect(() => {
    const nav = document.querySelector('#navigation');
    if (query.tab === 'cards') nav?.classList.remove('sticky');
    else nav?.classList.add('sticky');
    return () => {
      nav?.classList.add('sticky');
    };
  }, [query]);

  return <>{query.tab === 'cards' ? <Cards data={studySet} /> : query.tab === 'folders' ? <></> : <General data={studySet} />}</>;
};

export default SetForm;
