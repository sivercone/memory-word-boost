import { GetServerSideProps } from 'next';
import { QueryClient, dehydrate } from 'react-query';
import UserDetails from '@src/modules/user/UserDetails';
import { authApi } from '@src/apis';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryId = typeof context.query.id === 'string' ? context.query.id : '';
  const queryClient = new QueryClient();
  let user;

  try {
    user = queryId && queryId !== 'new' ? await queryClient.fetchQuery(['user', queryId], () => authApi.getById(queryId)) : null;
    if (!user) return { notFound: true };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { notFound: true };
  }

  return { props: { data: user, queryId, dehydratedState: dehydrate(queryClient) } };
};

export default UserDetails;
