import { NextPage } from 'next';
import { useSetStore } from 'storage/useSetStore';
import { useQuery } from 'react-query';
import { setApi } from 'apis/setApi';
import Custom404 from 'pages/404';
import { useUserStore } from 'storage/useUserStore';
import ErrorPage from 'modules/ErrorPage';
import SetForm from '@src/modules/set/SetForm';

const UpdateSet: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const { setFigure } = useSetStore();
  const { user } = useUserStore();

  const fetch = useQuery(['set', pagekey], () => setApi.getById(pagekey), { enabled: !setFigure });

  const data = setFigure || fetch.data;

  if (!data) return <Custom404 />;
  if (user?.id !== data.user.id)
    return (
      <ErrorPage>
        <p>Error 403</p>
        <p>Good news, we didn&#39;t forget to check permissions in this place.</p>
      </ErrorPage>
    );

  return <SetForm setFigure={data} />;
};

UpdateSet.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.set === 'string' ? query.set : '';
  return { pagekey };
};

export default UpdateSet;
