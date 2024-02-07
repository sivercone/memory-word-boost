import { GetServerSideProps } from 'next';
import { QueryClient, dehydrate } from 'react-query';
import { setApi } from '@src/apis';
import { consts } from '@src/lib';
import Flashcards from '@src/modules/set/Flashcards';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryId = typeof context.query.id === 'string' ? context.query.id : '';
  const queryClient = new QueryClient();
  let set = null;

  if (!consts.isBackendLess) {
    try {
      set = queryId && queryId !== 'new' ? await queryClient.fetchQuery(['set', queryId], () => setApi.getById(queryId)) : null;
      if (set && set?.cards?.length) set.cards = set.cards.sort(() => Math.random() - 0.5);
      if (!set && queryId !== 'new') return { notFound: true };
    } catch (error) {
      console.error('Error fetching set:', error);
      return { notFound: true };
    }
  }

  return { props: { data: set, queryId, dehydratedState: dehydrate(queryClient) } };
};

export default Flashcards;
