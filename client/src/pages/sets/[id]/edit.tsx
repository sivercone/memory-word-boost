import { GetServerSideProps } from 'next';
import { QueryClient, dehydrate } from 'react-query';
import SetForm from '@src/modules/set/SetForm';
import { setApi } from '@src/apis';
import consts from '@src/lib/consts';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryId = typeof context.query.id === 'string' ? context.query.id : '';
  const queryClient = new QueryClient();
  let set = null;

  if (!consts.isBackendLess) {
    try {
      set = await queryClient.fetchQuery(['set', queryId], () => setApi.getById(queryId));
      if (!set && !queryId) return { notFound: true };
    } catch (error) {
      console.error('Error fetching set:', error);
      return { notFound: true };
    }
  }

  return { props: { data: set, queryId, dehydratedState: dehydrate(queryClient) } };
};
export default SetForm;
