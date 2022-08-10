import { NextPage } from 'next';
import { useSetStore } from 'storage/useSetStore';
import { useQuery } from 'react-query';
import { setApi } from 'api/setApi';
import SetEditing from 'components/SetEditing';
import Custom404 from 'pages/404';

const UpdateSet: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const { setFigure } = useSetStore();

  const fetch = useQuery(['set', pagekey], () => setApi.getById(pagekey), { enabled: !setFigure });

  const data = setFigure || fetch.data;

  if (!data) return <Custom404 />;

  return <SetEditing setFigure={data} />;
};

UpdateSet.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.set === 'string' ? query.set : '';
  return { pagekey };
};

export default UpdateSet;
