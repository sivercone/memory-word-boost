import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { setApi } from 'apis/setApi';
import { CardInterface, SetInterface } from 'interfaces';
import Custom404 from 'pages/404';
import { isAnswerCorrect } from 'utils/isAnswerCorrect';
import { flashCardMotions, isBackendLess } from 'utils/staticData';
import { useLocalStore } from 'storage/useLocalStore';
import Header from 'ui/Header';
import style from 'styles/pages/study.module.scss';
import { fontSizeBasedOnLength } from 'utils/fontSizeBasedOnLength';

type StudyCard = CardInterface & { flash: boolean; write: boolean; quiz: boolean };

const LearnPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const { push } = useRouter();
  const { localSets } = useLocalStore();

  const set = useQuery(['set', pagekey], () => setApi.getById(pagekey));

  const [currSet, setCurrSet] = React.useState<SetInterface>();
  React.useEffect(() => {
    if (isBackendLess) setCurrSet(localSets.find(({ id }) => id === pagekey));
    else setCurrSet(set.data);
  }, [set.data, localSets]);

  const [currCard, setCurrCard] = React.useState<StudyCard>();
  const [cards, setCards] = React.useState<StudyCard[]>([]);
  const onRestart = () => {
    if (!currSet?.cards) return;
    const studyCards = currSet.cards.map((card) => ({ ...card, flash: false, write: false, quiz: false }));
    setCards(studyCards);
    setCurrCard(studyCards[0]);
  };
  React.useEffect(() => {
    if (currSet) onRestart();
  }, [currSet]);

  const score = React.useMemo(() => {
    const completion = cards.filter((c) => c.flash && c.quiz && c.write).length;
    return Math.round((completion / cards.length) * 100);
  }, [cards]);

  const isEnd = React.useMemo(() => cards.every((c) => c.flash && c.quiz && c.write), [cards]);

  const [toggled, setToggled] = React.useState(false);
  const [isToggling, setIsToggling] = React.useState(false);
  const onToggle = () => {
    if (currCard?.flash) return;
    setIsToggling(true);
    setToggled(!toggled);
    setTimeout(() => setIsToggling(false), 100);
  };

  const [isProceedTransition, setIsProceedTransition] = React.useState(false);
  const proceedTransition = () => {
    setIsProceedTransition(true);
    setTimeout(() => setIsProceedTransition(false), 100);
  };

  const onFlash = (alreadyKnow?: boolean) => {
    const nextCards = cards.map((c) =>
      c.order === currCard?.order && !c.flash
        ? alreadyKnow
          ? { ...c, flash: true, quiz: true, write: true }
          : { ...c, flash: true }
        : c,
    );
    setCards(nextCards);
    const nextCurrCard = nextCards.find((c) => !c.write || !c.quiz || !c.flash);
    setCurrCard(nextCurrCard);
    setToggled(false);
    proceedTransition();
  };

  const onQuiz = (answer: string) => {
    if (currCard?.definition === answer) {
      const nextCards = cards.map((c) => (c.order === currCard?.order ? { ...c, quiz: true } : c));
      setCards(nextCards);
      const nextCurrCard = nextCards.sort(() => Math.random() - 0.5).find((c) => !c.flash || !c.quiz || !c.write);
      setCurrCard(nextCurrCard);
      proceedTransition();
    }
  };

  const quizItems = React.useMemo(() => {
    const studyCards = cards
      .sort(() => Math.random() - 0.5)
      .filter((c) => c.order !== currCard?.order)
      .slice(0, 3); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return [...studyCards, currCard!].sort(() => Math.random() - 0.5);
  }, [currCard, cards.length]);

  const [inputValue, setInputValue] = React.useState('');
  const onWrite = (event?: React.ChangeEvent<HTMLInputElement>, idk?: boolean) => {
    const value = event?.target.value || '';
    setInputValue(value);
    if (currCard && (idk || isAnswerCorrect(currCard.definition, value))) {
      setInputValue('');
      const nextCards = cards.map((c) =>
        c.order === currCard?.order ? (idk ? { ...c, quiz: false, write: false } : { ...c, write: true }) : c,
      );
      setCards(nextCards);
      const nextCurrCard = nextCards.sort((a, b) => a.order - b.order).find((c) => !c.flash || !c.quiz || !c.write);
      setCurrCard(nextCurrCard);
      proceedTransition();
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
        <span>
          <strong>PROJECT MWB</strong>
        </span>
        <div style={{ userSelect: 'none', width: '24px', height: '24px', visibility: 'hidden' }}></div>
      </Header>
      <div className={style.study}>
        <div className={style.study__score}>
          <span>{score}%</span>
          <div style={{ width: `${score}%` }}></div>
        </div>
        <motion.div
          className={style.study__card}
          animate={isProceedTransition ? flashCardMotions.scale : flashCardMotions.init}
          id="learn__card"
        >
          <motion.button
            onClick={onToggle}
            animate={toggled ? flashCardMotions.rotate : flashCardMotions.init}
            disabled={currCard?.flash || isToggling}
            style={currCard?.flash ? { cursor: 'default' } : undefined}
          >
            <motion.div
              animate={toggled ? flashCardMotions.rotate : flashCardMotions.init}
              style={
                currCard ? { fontSize: fontSizeBasedOnLength(toggled ? currCard.definition.length : currCard.term.length) } : undefined
              }
            >
              {!isToggling ? (toggled ? currCard?.definition : currCard?.term) : ''}
              {isEnd ? (
                <>
                  <p>⚡️</p>
                  <p>Nice progress</p>
                  <p>{`You just studied ${cards.length} terms!`}</p>
                </>
              ) : undefined}
            </motion.div>
          </motion.button>
        </motion.div>
        {isEnd ? (
          <div className={style.study__moves}>
            <button onClick={onRestart} className={style.study__arrow}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                <path
                  fillRule="evenodd"
                  d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                />
              </svg>
              <span>Restart</span>
            </button>
            <button onClick={() => push(`/${pagekey}`)} className={style.study__arrow}>
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
          </div>
        ) : !currCard?.flash ? (
          <div className={style.study__moves} style={{ height: 'auto' }}>
            <style>{'#learn__card {height: 100%}'}</style>
            <button onClick={() => onFlash(true)} className={style.study__arrow}>
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
              <span>Already know</span>
            </button>
            <button onClick={() => onFlash()} className={style.study__arrow}>
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
        ) : !currCard?.quiz ? (
          <div className={style.study__moves} style={{ flexWrap: 'wrap' }}>
            {quizItems.map((card) => (
              <motion.button
                onClick={() => onQuiz(card.definition)}
                key={card.order}
                className={style.study__arrow}
                style={{ padding: '1rem' }}
              >
                <span>{card.definition}</span>
              </motion.button>
            ))}
          </div>
        ) : !currCard?.write ? (
          <div className={style.study__moves} style={{ height: '10%' }}>
            <style>{'#learn__card {height: 20%}'}</style>
            <input
              value={inputValue}
              onChange={onWrite}
              placeholder="Enter the answer"
              className={style.study__arrow}
              style={{ textAlign: 'center' }}
              autoFocus
            />
            <button onClick={() => onWrite(undefined, true)} className={style.study__arrow} style={{ width: '15%' }}>
              <span>?</span>
            </button>
          </div>
        ) : undefined}
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
