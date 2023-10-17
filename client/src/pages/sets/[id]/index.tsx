import { GetServerSideProps } from 'next';
import { QueryClient, dehydrate } from 'react-query';
import SetDetails from '@src/modules/set/SetDetails';
import { setApi } from '@src/apis';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryId = typeof context.query.id === 'string' ? context.query.id : '';
  const queryClient = new QueryClient();
  let set;

  try {
    set = queryId && queryId !== 'new' ? await queryClient.fetchQuery(['set', queryId], () => setApi.getById(queryId)) : null;
    if (!set && queryId !== 'new') return { notFound: true };
  } catch (error) {
    console.error('Error fetching set:', error);
    return { notFound: true };
  }

  return { props: { data: set, queryId, dehydratedState: dehydrate(queryClient) } };
};
export default SetDetails;
