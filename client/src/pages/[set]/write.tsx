import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { setApi } from 'apis/setApi';
import Custom404 from 'pages/404';
import { Button } from 'ui/Button';
import { CardInterface, SetInterface } from 'interfaces';
import { fontSizeBasedOnLength, isAnswerCorrect } from 'lib/utils';
import { useLocalStore } from 'storage/useLocalStore';
import { isBackendLess } from 'lib/staticData';
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
    if (isAnswerCorrect(cards[currentIndex].term, payload.answer)) nextCard();
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
              <div
                className={style.form__learn}
                style={cards[currentIndex] ? { fontSize: fontSizeBasedOnLength(cards[currentIndex].definition.length) } : undefined}
              >
                <span>{cards[currentIndex].definition}</span>
                {status === 'F' ? (
                  <>
                    <span>Correct Answer</span>
                    <span>{cards[currentIndex].term}</span>
                  </>
                ) : undefined}
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className={style.form__fields} autoComplete="off">
                <input type="text" {...register('answer')} required autoFocus />
                <div>
                  <Button type="submit" title="Submit">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                      <path d="m14 18-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45 14 6l6 6Z" />
                    </svg>
                  </Button>
                  <Button onClick={loseCard} type="button" title="I don't know">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                      <path d="M10.6 16q0-2.025.363-2.913.362-.887 1.537-1.937 1.025-.9 1.562-1.563.538-.662.538-1.512 0-1.025-.687-1.7Q13.225 5.7 12 5.7q-1.275 0-1.938.775-.662.775-.937 1.575L6.55 6.95q.525-1.6 1.925-2.775Q9.875 3 12 3q2.625 0 4.038 1.463 1.412 1.462 1.412 3.512 0 1.25-.537 2.138-.538.887-1.688 2.012Q14 13.3 13.738 13.912q-.263.613-.263 2.088Zm1.4 6q-.825 0-1.412-.587Q10 20.825 10 20q0-.825.588-1.413Q11.175 18 12 18t1.413.587Q14 19.175 14 20q0 .825-.587 1.413Q12.825 22 12 22Z" />
                    </svg>
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
