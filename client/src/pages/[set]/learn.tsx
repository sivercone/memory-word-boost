import React from 'react';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { setApi } from 'api/setApi';
import Custom404 from 'pages/404';
import style from 'styles/pages/learn.module.scss';
import { useRouter } from 'next/router';

type Results = {
  round: number;
  incorrectCards: { term: string; definition: string }[];
  correctCards: { term: string; definition: string }[];
};

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

  const loseCard = () => {
    setStatus('F');
    if (!incorrect.find((el) => el === cards[currentIndex])) {
      setIncorrect((prev) => [...prev, cards[currentIndex]]);
    }
  };

  const nextCard = () => {
    if (currentIndex + 1 >= cards.length) {
      setStatus('E');
      setResults((prev) => [...prev, { round: round, incorrectCards: incorrect, correctCards: cards }]);
    } else {
      setStatus('T');
      setCurrentIndex((prev) => prev + 1);
    }
    reset();
  };

  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (payload: { answer: string }) => {
    if (payload.answer === cards[currentIndex].definition) nextCard();
    else loseCard();
  };

  const [results, setResults] = React.useState<Results[]>([]);

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

  console.log(results);

  // TODO
  // 1. add fade animations for changing text in blocks
  // 2. add diffrent emojis, dependent on completing, for result header

  return (
    <div className={style.class}>
      <div className={style.class__block}>
        {status === 'E' ? (
          <>
            {incorrect.length ? (
              <div className={`${style.class__main} ${style.results}`}>
                <header className={style.results__header}>
                  <span>Results of Round {round}</span>
                  <p>Good, you're in progress 🤩</p>
                  <p>Don't give up 😡 you can pull it up 💪</p>
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
                    <span>{`${set.data.cards.length - incorrect.length}/${set.data.cards.length}`}</span>
                  </p>
                </div>
                <div className={style.results__actions}>
                  <button onClick={() => push(`/${pagekey}`)} className="button button_light">
                    Return to set page
                  </button>
                  <button onClick={nextRound} className="button button_light">
                    Continue
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={`${style.class__main} ${style.results}`}>
                  <header className={style.results__header}>
                    <span>Congrats!</span>
                    <span>{`You've studied ${set.data.cards.length} cards.`}</span>
                  </header>
                  <div className={style.results__content} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem' }}>🎯</div>
                  </div>
                  <div className={style.results__actions}>
                    <button onClick={() => push(`/${pagekey}`)} className="button button_light">
                      Return to set page
                    </button>
                    <button onClick={restartRound} className="button button_light">
                      Study again
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
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
                  <button onClick={loseCard} type="button" title="click if don't know">
                    ?
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : undefined}
      </div>
      {status === 'E' && !incorrect.length
        ? results.map((el, i) => (
            <div key={i} className={style.class__block} style={{ height: 'auto' }}>
              <div className={`${style.class__main} ${style.results}`}>
                <header className={style.results__header}>
                  <span>{`Round ${el.round}`}</span>
                </header>
                <div className={style.results__content}>
                  {el.correctCards.map((card, i) => (
                    <p key={i} style={el.incorrectCards.includes(card) ? { color: 'tomato' } : { color: 'green' }}>
                      <span>
                        {el.incorrectCards.includes(card) ? '✕' : '✓'} {card.term}
                      </span>
                      <span>{card.definition}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))
        : undefined}
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
