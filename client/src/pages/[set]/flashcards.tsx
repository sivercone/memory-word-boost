import React from 'react';
import style from 'styles/pages/flashcards.module.scss';
import { motion } from 'framer-motion';
import { NextPage } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { setApi } from 'apis/setApi';
import Custom404 from 'pages/404';
import { useRouter } from 'next/router';
import Link from 'next/link';
// import { Button } from 'ui/Button';
import { CardInterface, SetInterface } from 'interfaces';
import { isBackendLess } from 'utils/staticData';
import { useLocalStore } from 'storage/useLocalStore';
import Header from 'ui/Header';

// drag - https://codesandbox.io/s/5trtt

// todo - describe how to learn with cards

export const motions = {
  init: { rotateY: 0, translateX: '0%', opacity: 1, transition: { type: 'spring', stiffness: 100, duration: 0.1 } },
  rotate: { rotateY: 180, translateX: '0%', opacity: 1, transition: { type: 'spring', stiffness: 100, duration: 0.1 } },
  translateLeft: { rotateY: 0, translateX: '100%', opacity: 0, transition: { type: 'spring', stiffness: 100, duration: 0.1 } },
  translateRight: { rotateY: 0, translateX: '-100%', opacity: 0, transition: { type: 'spring', stiffness: 100, duration: 0.1 } },
};

const FlashCardsPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
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
    if (currSet) setCards(currSet.cards);
  }, [currSet]);

  const [toggled, setToggled] = React.useState(false);
  const [isToggling, setIsToggling] = React.useState(false);
  const onToggle = () => {
    if (currentIndex >= cards.length) return;
    setIsToggling(true);
    setToggled(!toggled);
    setIsToggling(false);
    // setTimeout(() => setIsToggling(false), 100);
  };

  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const scorePercent = React.useMemo(() => Math.round((currentIndex / cards.length) * 100), [currentIndex, cards.length]);

  const [learned, setLearned] = React.useState<boolean>(false);
  const [toRepeated, setToRepeated] = React.useState<boolean>(false);

  const onLearned = () => {
    setLearned(true);
    setTimeout(() => {
      setToggled(false);
      setLearned(false);
      setCurrentIndex(currentIndex + 1);
    }, 100);
  };

  const [repeatCards, setRepeatCards] = React.useState<CardInterface[]>([]);
  const toRepeat = () => {
    setToRepeated(true);
    setRepeatCards((prev) => [...prev, cards[currentIndex]]);
    setTimeout(() => {
      setToggled(false);
      setToRepeated(false);
      setCurrentIndex(currentIndex + 1);
    }, 100);
  };

  const onStudyAgain = () => {
    setCards(repeatCards);
    setRepeatCards([]);
    setCurrentIndex(0);
  };

  const onRestart = () => {
    if (!currSet) return;
    setRepeatCards([]);
    setCards(currSet.cards);
    setCurrentIndex(0);
  };

  const onUndo = () => {
    if (currentIndex >= 1) {
      setToggled(false);
      setCurrentIndex(currentIndex - 1);
    }
    if (repeatCards.length && cards[currentIndex - 1] === repeatCards[repeatCards.length - 1]) {
      setRepeatCards(repeatCards.slice(0, -1));
    }
  };

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
      </Header>
      <div className={style.flashcards}>
        <div className={style.flashcards__score}>
          <span>{`${currentIndex >= cards.length ? currentIndex : currentIndex + 1}/${cards.length}`}</span>
          <div style={{ width: `${scorePercent}%` }}></div>
        </div>
        <motion.div
          className={style.flashcards__card}
          animate={learned ? motions.translateLeft : toRepeated ? motions.translateRight : motions.init}
        >
          <motion.button
            onClick={onToggle}
            animate={toggled ? motions.rotate : motions.init}
            disabled={currentIndex >= cards.length || isToggling}
          >
            <motion.span animate={toggled ? motions.rotate : motions.init}>
              {!isToggling ? (toggled ? cards[currentIndex]?.definition : cards[currentIndex]?.term) : ''}
              {currentIndex >= cards.length ? (
                <>
                  {repeatCards.length === currSet.cards.length ? (
                    <>
                      <p>💥</p>
                      <p>You are doing progress</p>
                    </>
                  ) : (
                    <>
                      <p>⚡️</p>
                      <p>Nice progress</p>
                    </>
                  )}
                  <p>
                    {repeatCards.length
                      ? `Keep practicing to master the ${repeatCards.length} remaining`
                      : `You just studied ${currSet.cards.length} terms!`}
                  </p>
                </>
              ) : undefined}
            </motion.span>
          </motion.button>
        </motion.div>
        <div className={style.flashcards__moves}>
          {currentIndex >= cards.length ? (
            <button onClick={onRestart} className={`${style.flashcards__arrow} ${style.flashcards__arrowleft}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                <path
                  fillRule="evenodd"
                  d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                />
              </svg>
              <span>Restart</span>
            </button>
          ) : (
            <button onClick={toRepeat} className={`${style.flashcards__arrow} ${style.flashcards__arrowleft}`}>
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
              <span>Keep learning</span>
            </button>
          )}
          {currentIndex >= cards.length && repeatCards.length ? (
            <button onClick={onStudyAgain} className={`${style.flashcards__arrow} ${style.flashcards__arrowright}`}>
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
              <span>Continue</span>
            </button>
          ) : currentIndex >= cards.length ? (
            <button onClick={() => push(`/${pagekey}`)} className={`${style.flashcards__arrow} ${style.flashcards__arrowright}`}>
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
              <span>Return to set page</span>
            </button>
          ) : (
            <button onClick={onLearned} className={`${style.flashcards__arrow} ${style.flashcards__arrowright}`}>
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
          )}
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
