import React from 'react';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { setApi } from 'api/setApi';
import Custom404 from 'pages/404';
import style from 'styles/pages/learn.module.scss';
import { useRouter } from 'next/router';

const LearnPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const set = useQuery(['set', pagekey], () => setApi.getById(pagekey));
  if (!set.data) return <Custom404 />;

  const { push } = useRouter();

  const [cards, setCards] = React.useState<{ term: string; definition: string }[]>([]);
  React.useEffect(() => {
    if (set.data) setCards(set.data.cards.sort(() => Math.random() - 0.5));
  }, [set.data]);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const scorePercent = Math.round((currentIndex / cards.length) * 100);
  const [status, setStatus] = React.useState<'T' | 'F' | 'E'>('T');
  const [round, setRound] = React.useState<number>(1);
  const [incorrect, setIncorrect] = React.useState<{ term: string; definition: string }[]>([]);

  const idk = () => {
    setStatus('F');
    setIncorrect((prev) =>
      !prev.find((el) => el.term === cards[currentIndex].term && el.definition === cards[currentIndex].definition)
        ? [...prev, cards[currentIndex]]
        : prev,
    );
  };

  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (payload: { answer: string }) => {
    if (payload.answer === cards[currentIndex].definition) {
      if (currentIndex + 1 >= cards.length) setStatus('E');
      else {
        setStatus('T');
        setCurrentIndex((prev) => prev + 1);
      }
      reset();
    } else {
      idk();
    }
  };

  const nextRound = () => {
    setCurrentIndex(0);
    setCards(incorrect);
    setIncorrect([]);
    setRound((prev) => prev + 1);
    setStatus('T');
  };

  const restartRound = () => {
    setIncorrect([]);
    setCards(set.data.cards.sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setRound(1);
    setStatus('T');
  };

  // TODO
  // 1. add fade animations for changing text in blocks
  // 2. add diffrent emojis, dependent on completing, for result header
  // 3. add info about all completed rounds

  return (
    <div className={style.class}>
      <div className={style.class__block}>
        {status === 'E' ? (
          <div className={`${style.class__main} ${style.results}`}>
            <header className={style.results__header}>
              <span>Results</span>
              <p>{`Round ${round}`}</p>
            </header>
            <div className={style.results__content}>
              <p style={{ color: 'green' }}>
                <span>Correct</span>
                <span>{cards.length - incorrect.length}</span>
              </p>
              <p style={{ color: 'tomato' }}>
                <span>Incorrect</span>
                <span>{incorrect.length}</span>
              </p>
              <p>
                <span>Overall progress</span>
                <span>{`${cards.length - incorrect.length}/${cards.length}`}</span>
              </p>
            </div>
            <div className={style.results__actions}>
              <button onClick={() => push(`/${pagekey}`)} className="button button_light">
                Return to set page
              </button>
              {cards.length - incorrect.length === cards.length ? (
                <button onClick={restartRound} className="button button_light">
                  Restart this study set
                </button>
              ) : (
                <button onClick={nextRound} className="button button_light">
                  Continue
                </button>
              )}
            </div>
          </div>
        ) : undefined}
        {cards.length && status !== 'E' ? (
          <>
            <div className={style.class__progressbar}>
              <div title={`${scorePercent}%`} style={{ width: `${scorePercent}%` }}></div>
            </div>
            <div className={style.class__main}>
              <div className={style.class__learn}>
                <span>{cards[currentIndex].term}</span>
                {status === 'F' ? (
                  <>
                    <span>correct answer</span>
                    <span>{cards[currentIndex].definition}</span>
                  </>
                ) : undefined}
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className={style.class__form} autoComplete="off">
                <input type="text" {...register('answer')} required autoFocus />
                <div>
                  <button type="submit">answer</button>
                  <button onClick={idk} type="button" title="click if don't know">
                    ?
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : undefined}
      </div>
    </div>
  );
};

LearnPage.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.set === 'string' ? query.set : '';
  const queryClient = new QueryClient();
  if (pagekey) await queryClient.prefetchQuery(['set', pagekey], () => setApi.getById(pagekey));
  return { pagekey, query, dehydratedState: dehydrate(queryClient) };
};

export default LearnPage;
