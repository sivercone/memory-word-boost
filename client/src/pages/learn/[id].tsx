import { setApi } from 'api/setApi';
import { NextPage } from 'next';
import Custom404 from 'pages/404';
import React from 'react';
import { useForm } from 'react-hook-form';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import style from 'styles/pages/learn.module.scss';

const LearnPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const set = useQuery(['set', pagekey], () => setApi.getById(pagekey));
  if (!set.data) return <Custom404 />;
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const scorePercent = Math.round((currentIndex / set.data.cards.length) * 100);
  const [status, setStatus] = React.useState<'T' | 'F' | 'E'>();

  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (payload: { answer: string }) => {
    if (payload.answer === set.data.cards[currentIndex].definition) {
      setStatus('T');
      setCurrentIndex(currentIndex + 1);
      reset();
    } else setStatus('F');
  };

  return (
    <div className={style.class}>
      <div className={style.class__block}>
        <div className={style.class__progressbar}>
          <div style={{ width: `${scorePercent}%` }}></div>
        </div>
        <div className={style.class__main}>
          <div>
            <span>{set.data.cards[currentIndex].term}</span>
            {status === 'F' ? (
              <>
                <span>correct answer</span>
                <span>{set.data.cards[currentIndex].definition}</span>
              </>
            ) : undefined}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <input type="text" {...register('answer')} />
            <div>
              <button type="submit">answer</button>
              <button>don't know</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

LearnPage.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.id === 'string' ? query.id : '';
  const queryClient = new QueryClient();
  if (pagekey) await queryClient.prefetchQuery(['set', pagekey], () => setApi.getById(pagekey));
  return { pagekey, dehydratedState: dehydrate(queryClient) };
};

export default LearnPage;
