import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { setApi } from 'apis/setApi';
import Custom404 from 'pages/404';
import { Button } from 'ui/Button';
import { CardInterface, SetInterface } from 'interfaces';
import { isAnswerCorrect } from 'utils/isAnswerCorrect';
import { useLocalStore } from 'storage/useLocalStore';
import { isBackendLess } from 'utils/staticData';
import Header from 'ui/Header';
import style from 'styles/pages/write.module.scss';

type Results = {
  round: number;
  incorrectCards: CardInterface[];
  correctCards: CardInterface[];
};
type SubmitData = { answer: string };

const WritePage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const { push } = useRouter();
  const { localSets } = useLocalStore();

  const set = useQuery(['set', pagekey], () => setApi.getById(pagekey));
  const [currSet, setCurrSet] = React.useState<SetInterface>();
  React.useEffect(() => {
    if (isBackendLess) setCurrSet(localSets.find(({ id }) => id === pagekey));
    else setCurrSet(set.data);
  }, [set.data, localSets]);

  const [cards, setCards] = React.useState<CardInterface[]>([]);
  React.useEffect(() => {
    if (currSet) setCards(currSet.cards.sort(() => Math.random() - 0.5));
  }, [currSet]);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const scorePercent = Math.round((currentIndex / cards.length) * 100);
  const [status, setStatus] = React.useState<'T' | 'F' | 'E'>('T');
  const [round, setRound] = React.useState<number>(1);
  const [incorrect, setIncorrect] = React.useState<CardInterface[]>([]);

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

  const { register, handleSubmit, reset } = useForm<SubmitData>();
  const onSubmit = (payload: SubmitData) => {
    if (isAnswerCorrect(cards[currentIndex].definition, payload.answer)) nextCard();
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
    if (!currSet) return;
    setIncorrect([]);
    setCards(currSet.cards.sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setRound(1);
    setResults([]);
    setStatus('T');
  };

  // TODO
  // 1. add fade animations for changing text in blocks
  // 2. add diffrent emojis, dependent on completing, for result header

  if (!currSet) return <Custom404 />;
  return (
    <>
      <Header>
        <button onClick={() => push(`/${pagekey}`)} title="close">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
          </svg>
        </button>
        <span>
          <strong>PROJECT MWB</strong>
        </span>
        <div style={{ userSelect: 'none', width: '24px', height: '24px', visibility: 'hidden' }}></div>
      </Header>
      {cards.length && status !== 'E' ? (
        <div className={style.form}>
          <div className={style.form__inner}>
            <div className={style.form__progressbar} title={`${scorePercent}%`}>
              <div style={{ width: `${scorePercent}%` }}></div>
            </div>
            <div className={style.form__main}>
              <div className={style.form__learn}>
                <span>{cards[currentIndex].term}</span>
                {status === 'F' ? (
                  <>
                    <span>correct answer</span>
                    <span>{cards[currentIndex].definition}</span>
                  </>
                ) : undefined}
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className={style.form__fields} autoComplete="off">
                <input type="text" {...register('answer')} required autoFocus />
                <div>
                  <Button type="submit">{'>'}</Button>
                  <Button onClick={loseCard} type="button" title="click if don't know">
                    ?
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : undefined}
      {status === 'E' ? (
        <div className={style.block}>
          {incorrect.length ? (
            <div className={style.block__inner}>
              <header className={style.results__header}>
                <p>Results of Round {round}</p>
                <p>Good, you&#39;re in progress</p>
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
                  <span>{`${currSet.cards.length - incorrect.length}/${currSet.cards.length}`}</span>
                </p>
              </div>
              <div className={style.results__actions}>
                <Button onClick={() => push(`/${pagekey}`)} variant="outlined">
                  Return to set page
                </Button>
                <Button onClick={nextRound} variant="outlined">
                  Continue
                </Button>
              </div>
            </div>
          ) : (
            <div className={style.block__inner}>
              <header className={style.results__header}>
                <p>Congrats!</p>
                <p>{`You've studied ${currSet.cards.length} cards.`}</p>
              </header>
              <div className={style.results__content} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '5rem' }}>🎯</div>
              </div>
              <div className={style.results__actions}>
                <Button onClick={restartRound} variant="outlined">
                  Study again
                </Button>
                <Button onClick={() => push(`/${pagekey}`)} variant="outlined">
                  Return to set page
                </Button>
              </div>
            </div>
          )}
          {!incorrect.length
            ? results.map((el, i) => (
                <div key={i} className={style.block__inner}>
                  <header className={style.results__header}>
                    <p>{`Round ${el.round}`}</p>
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
              ))
            : undefined}
        </div>
      ) : undefined}
    </>
  );
};

WritePage.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.set === 'string' ? query.set : '';
  const queryClient = new QueryClient();
  if (pagekey) await queryClient.prefetchQuery(['set', pagekey], () => setApi.getById(pagekey));
  return { pagekey, query, dehydratedState: dehydrate(queryClient) };
};

export default WritePage;
