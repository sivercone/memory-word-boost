import { useRouter } from 'next/router';
import { useState } from 'react';

import { useLocalStore } from '@src/stores';

import CardView from './CardView';
import CompleteView from './CompleteView';

const Flashcards = () => {
  const router = useRouter();

  const localStore = useLocalStore();
  const studySet = localStore.sets.find((item) => item.id === router.query.id);
  const cards = studySet?.cards || [];
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const scorePercentage = ((correctAnswers / cards.length) * 100).toFixed(0);

  const onSwipe = (markAsCorrect: boolean) => {
    setCurrentCardIndex((prev) => {
      if (prev < cards.length) {
        if (markAsCorrect) setCorrectAnswers((prev) => prev + 1);
        return prev + 1;
      } else return prev;
    });
  };

  if (!studySet) return null;
  return (
    <div className="h-[calc(100%-65px)] overflow-x-hidden">
      <div className="mx-auto flex h-full max-w-3xl flex-col gap-4 p-4">
        {currentCardIndex < cards.length ? (
          <CardView
            front={cards[currentCardIndex].front}
            back={cards[currentCardIndex].back}
            onSwipeLeft={() => onSwipe(false)}
            onSwipeRight={() => onSwipe(true)}
          />
        ) : cards.length ? (
          <CompleteView queryId={studySet.id} scorePercentage={scorePercentage} cardsLength={cards.length} />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-onBackground">There are no cards..</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
