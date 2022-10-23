import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { setApi } from 'apis/setApi';
import { CardInterface } from 'interfaces';
import style from 'styles/pages/learn.module.scss';
import { motion } from 'framer-motion';
import { motions } from './flashcards';
import Custom404 from 'pages/404';

type StudyCard = CardInterface & { flash: boolean; write: boolean; quiz: boolean };

const LearnPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const { push } = useRouter();
  const set = useQuery(['set', pagekey], () => setApi.getById(pagekey));

  const [cards, setCards] = React.useState<StudyCard[]>([]);
  React.useEffect(() => {
    if (set.data) {
      const studyCards = set.data.cards.map((card) => ({ ...card, flash: false, write: false, quiz: false }));
      setCards(studyCards.sort(() => Math.random() - 0.5));
    }
  }, [set.data]);

  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [cardsLength, scorePercent] = React.useMemo(() => {
    const cardsLength = cards.length * 3;
    const scorePercent = Math.round((currentIndex / cardsLength) * 100);
    return [cardsLength, scorePercent];
  }, [currentIndex, cards.length]);

  const [toggled, setToggled] = React.useState(false);
  const [isToggling, setIsToggling] = React.useState(false);
  const onToggle = () => {
    if (currentIndex >= cardsLength || cards[currentIndex].flash) return;
    setIsToggling(true);
    setToggled(!toggled);
    setTimeout(() => setIsToggling(false), 300);
  };

  const onFlash = () => {
    const studyCards: StudyCard[] = JSON.parse(JSON.stringify(cards));
    if (!studyCards[currentIndex].flash) studyCards[currentIndex].flash = true;
    // else if (studyCards[currentIndex].flash && !studyCards[currentIndex].quiz) studyCards[currentIndex].quiz = true;
    // else studyCards[currentIndex].write = true;
    setCards(studyCards);
    if (currentIndex + 1 >= cards.length) setCurrentIndex(0);
    else setCurrentIndex((prev) => prev + 1);
    setToggled(false);
  };

  const onQuiz = (answer: string) => {
    if (cards[currentIndex].definition === answer) {
      const studyCards: StudyCard[] = JSON.parse(JSON.stringify(cards));
      studyCards[currentIndex].quiz = true;
      setCards(studyCards);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const quizItems = React.useMemo(() => {
    const studyCards = cards
      .sort(() => Math.random() - 0.5)
      .filter((c) => c.term + c.definition !== cards[currentIndex].term + cards[currentIndex].definition)
      .slice(0, 3);
    return [...studyCards, cards[currentIndex]].sort(() => Math.random() - 0.5);
  }, [currentIndex, cardsLength]);

  console.log(cards);

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
      <div className={style.learn}>
        <div className={style.progressbar}>
          <span>{`${currentIndex >= cardsLength ? currentIndex : currentIndex + 1}/${cardsLength}`}</span>
          <div style={{ width: `${scorePercent}%` }}></div>
        </div>
        <motion.div
          className={style.learn__card}
          // eslint-disable-next-line no-constant-condition
          // animate={!'learned' ? motions.translateLeft : !'toRepeated' ? motions.translateRight : motions.init}
        >
          <motion.button
            onClick={onToggle}
            animate={toggled ? motions.rotate : motions.init}
            disabled={currentIndex >= cardsLength || isToggling}
          >
            <motion.span animate={toggled ? motions.rotate : motions.init}>
              {!isToggling ? (toggled ? cards[currentIndex]?.definition : cards[currentIndex]?.term) : ''}
              {currentIndex >= cardsLength ? (
                <>
                  <p>⚡️</p>
                  <p>Nice progress</p>
                  <p>{`You just studied ${cardsLength} terms!`}</p>
                </>
              ) : undefined}
            </motion.span>
          </motion.button>
        </motion.div>
        <div className={style.learn__moves}>
          {currentIndex >= cardsLength ? (
            <>
              <button className={style.learn__arrow}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                  <path
                    fillRule="evenodd"
                    d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                  />
                </svg>
                <span>Restart</span>
              </button>
              <button onClick={() => push(`/${pagekey}`)} className={style.learn__arrow}>
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
            </>
          ) : !cards[currentIndex].flash ? (
            <>
              <button className={style.learn__arrow}>
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
              <button onClick={onFlash} className={style.learn__arrow}>
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
            </>
          ) : !cards[currentIndex].quiz ? (
            quizItems.map((card, i) => (
              <button
                onClick={() => onQuiz(card.definition)}
                key={card.term + card.definition + i}
                className={`${style.learn__arrow} ${style.learn__arrowright}`}
              >
                <span>{card.definition}</span>
              </button>
            ))
          ) : undefined}
        </div>
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
