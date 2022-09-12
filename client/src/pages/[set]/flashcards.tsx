import React from 'react';
import style from 'styles/pages/flashcards.module.scss';
import { motion } from 'framer-motion';
import { NextPage } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { setApi } from 'api/setApi';
import Custom404 from 'pages/404';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from 'ui/Button';
import { CardInterface } from 'interfaces';

// drag - https://codesandbox.io/s/5trtt

// todo - describe how to learn with cards

const rotateX = {
  init: { rotateX: 0, transition: { duration: 0.3 } },
  anim: { rotateX: -180, transition: { duration: 0.3 } },
};
const alignX = { translateX: 0, opacity: 1, transition: { duration: 0.3 } };
const translateLeft = { translateX: '100%', opacity: 0, transition: { duration: 0.5 } };
const translateRight = { translateX: '-100%', opacity: 0, transition: { duration: 0.5 } };

const FlashCardsPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const set = useQuery(['set', pagekey], () => setApi.getById(pagekey));

  const [cards, setCards] = React.useState<CardInterface[]>([]);
  React.useEffect(() => {
    if (set.data) setCards(set.data.cards);
  }, [set.data]);

  const { push } = useRouter();

  const [toggled, setToggled] = React.useState(false);
  const onToggle = () => setToggled(!toggled);

  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const scorePercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  const [learned, setLearned] = React.useState<boolean>(false);
  const [toRepeated, setToRepeated] = React.useState<boolean>(false);

  const onLearned = () => {
    setLearned(true);
    setTimeout(() => {
      setLearned(false);
      setCurrentIndex(currentIndex + 1);
    }, 300);
  };

  const [repeatCards, setRepeatCards] = React.useState<CardInterface[]>([]);
  const toRepeat = () => {
    setToRepeated(true);
    setRepeatCards((prev) => [...prev, cards[currentIndex]]);
    setTimeout(() => {
      setToRepeated(false);
      setCurrentIndex(currentIndex + 1);
    }, 300);
  };

  const onStudyAgain = () => {
    setCards(repeatCards);
    setRepeatCards([]);
    setCurrentIndex(0);
  };

  const onRestart = () => {
    if (!set.data) return;
    setRepeatCards([]);
    setCards(set.data.cards);
    setCurrentIndex(0);
  };

  const onUndo = () => {
    if (currentIndex >= 1) {
      setCurrentIndex(currentIndex - 1);
      // setLearned(true);
      // setTimeout(() => setLearned(false), 150);
    }
    if (repeatCards.length && cards[currentIndex - 1] === repeatCards[repeatCards.length - 1]) {
      setRepeatCards(repeatCards.slice(0, -1));
      // setToRepeated(true);
      // setTimeout(() => setToRepeated(false), 150);
    }
  };

  if (!set.data) return <Custom404 />;
  return (
    <>
      <header className={style.header}>
        <button onClick={() => push(`/${pagekey}`)} title="close">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
          </svg>
        </button>
        <Link href="/">
          <a className={style.header__logo}>Project MWB</a>
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onUndo} title="undo">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
            </svg>
          </button>
          {/* <button title="settings">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
            </svg>
          </button> */}
        </div>
      </header>
      <div className={style.flashcards}>
        {currentIndex < cards.length ? (
          <div className={style.flashcards__score}>
            <span>{`${currentIndex + 1}/${cards.length}`}</span>
            <div style={{ width: `${scorePercent}%` }}></div>
          </div>
        ) : undefined}
        <div className={style.flashcards__card} onClick={onToggle} role="button">
          <div className={style.flashcards__content}>
            <span>{toggled ? cards[currentIndex].definition : cards[currentIndex]?.term}</span>
          </div>
          <div className={style.flashcards__moves}>
            <button
              onClick={toRepeat}
              style={toRepeated || learned ? { visibility: 'visible' } : { visibility: 'visible' }}
              className={`${style.flashcards__arrow} ${style.flashcards__arrowleft}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 24 24"
                height="1em"
                viewBox="0 0 24 24"
                width="1em"
                fill="currentColor"
              >
                <rect fill="none" height="24" width="24" />
                <path d="M9,19l1.41-1.41L5.83,13H22V11H5.83l4.59-4.59L9,5l-7,7L9,19z" />
              </svg>
              <span>Study again</span>
            </button>
            <button
              onClick={onLearned}
              style={learned || toRepeated ? { visibility: 'visible' } : { visibility: 'visible' }}
              className={`${style.flashcards__arrow} ${style.flashcards__arrowright}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 24 24"
                height="1em"
                viewBox="0 0 24 24"
                width="1em"
                fill="currentColor"
              >
                <rect fill="none" height="24" width="24" />
                <path d="M15,5l-1.41,1.41L18.17,11H2V13h16.17l-4.59,4.59L15,19l7-7L15,5z" />
              </svg>
              <span>Got it</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

FlashCardsPage.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.set === 'string' ? query.set : '';
  const queryClient = new QueryClient();
  if (pagekey) await queryClient.prefetchQuery(['set', pagekey], () => setApi.getById(pagekey));
  return { pagekey, query, dehydratedState: dehydrate(queryClient) };
};

export default FlashCardsPage;
