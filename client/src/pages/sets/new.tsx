import { GetServerSideProps } from 'next';
import SetForm from '@src/modules/set/SetForm';

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: { data: null, queryId: 'new' } };
};
export default SetForm;
