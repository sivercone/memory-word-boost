import React from 'react';
import { NextPage } from 'next';
import CardView from './CardView';
import { SetInterface } from '@src/interfaces';
import { useIsClient } from '@src/lib/hooks';

const Flashcards: NextPage<{ data: SetInterface }> = ({ data }) => {
  const isClient = useIsClient();
  const cards = data.cards;
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
  const [correctAnswers, setCorrectAnswers] = React.useState(0);
  const scorePercentage = ((correctAnswers / cards.length) * 100).toFixed(0);

  const onSwipe = (markAsCorrect: boolean) => {
    setCurrentCardIndex((prev) => {
      if (prev < cards.length) {
        if (markAsCorrect) setCorrectAnswers((prev) => prev + 1);
        return prev + 1;
      } else return prev;
    });
  };

  if (!isClient) return null;
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4 p-4">
      {currentCardIndex !== cards.length ? (
        <CardView
          front={cards[currentCardIndex].term}
          back={cards[currentCardIndex].definition}
          onSwipeLeft={() => onSwipe(false)}
          onSwipeRight={() => onSwipe(true)}
        />
      ) : (
        <p>Score:{scorePercentage}%</p>
      )}
    </div>
  );
};

export default Flashcards;
