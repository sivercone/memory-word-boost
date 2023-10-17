import { GetServerSideProps } from 'next';
import { QueryClient, dehydrate } from 'react-query';
import { folderApi } from '@src/apis';
import FolderDetails from '@src/modules/folder/FolderDetails';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryId = typeof context.query.folder === 'string' ? context.query.folder : '';
  const queryUser = typeof context.query.user === 'string' ? context.query.user : '';
  const queryClient = new QueryClient();
  let folder;

  try {
    folder = queryId && queryId !== 'new' ? await queryClient.fetchQuery(['folder', queryId], () => folderApi.getById(queryId)) : null;
    if (!folder && !queryUser && queryId !== 'new') return { notFound: true };
  } catch (error) {
    console.error('Error fetching folder:', error);
    return { notFound: true };
  }

  return { props: { data: folder, queryId, queryUser, dehydratedState: dehydrate(queryClient) } };
};
export default FolderDetails;
