import React from 'react';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { setApi } from 'api/setApi';
import Custom404 from 'pages/404';
import style from 'styles/pages/learn.module.scss';
import { useRouter } from 'next/router';
import { Button } from 'ui/Button';
import { CardInterface } from 'interfaces';
import Link from 'next/link';

type Results = {
  round: number;
  incorrectCards: CardInterface[];
  correctCards: CardInterface[];
};
type SubmitData = { answer: string };

const LearnPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const { push } = useRouter();
  const set = useQuery(['set', pagekey], () => setApi.getById(pagekey));

  const [cards, setCards] = React.useState<CardInterface[]>([]);
  React.useEffect(() => {
    if (set.data) setCards(set.data.cards.sort(() => Math.random() - 0.5));
  }, [set.data]);
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
    if (!set.data) return;
    setIncorrect([]);
    setCards(set.data.cards.sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setRound(1);
    setResults([]);
    setStatus('T');
  };

  // TODO
  // 1. add fade animations for changing text in blocks
  // 2. add diffrent emojis, dependent on completing, for result header

  if (!set.data) return <Custom404 />;
  return (
    <>
      <header className={style.header}>
        <div className={style.header__inner}>
          <button onClick={() => push(`/${pagekey}`)} title="close">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </button>
          <Link href="/">
            <a className={style.header__logo}>Project MWB</a>
          </Link>
        </div>
      </header>
      <div className={style.class}>
        <div className={style.class__block}>
          {status === 'E' ? (
            <>
              {incorrect.length ? (
                <div className={`${style.class__main} ${style.results}`}>
                  <header className={style.results__header}>
                    <span>Results of Round {round}</span>
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
                      <span>{`${set.data.cards.length - incorrect.length}/${set.data.cards.length}`}</span>
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
                      <Button onClick={() => push(`/${pagekey}`)} variant="outlined">
                        Return to set page
                      </Button>
                      <Button onClick={restartRound} variant="outlined">
                        Study again
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : undefined}
          {cards.length && status !== 'E' ? (
            <>
              <div className={style.class__progressbar} title={`${scorePercent}%`}>
                <div style={{ width: `${scorePercent}%` }}></div>
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
    </>
  );
};

LearnPage.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.set === 'string' ? query.set : '';
  const queryClient = new QueryClient();
  if (pagekey) await queryClient.prefetchQuery(['set', pagekey], () => setApi.getById(pagekey));
  return { pagekey, query, dehydratedState: dehydrate(queryClient) };
};

export default LearnPage;
