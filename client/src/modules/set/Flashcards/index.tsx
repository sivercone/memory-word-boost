import React from 'react';
import { NextPage } from 'next';
import CardView from './CardView';
import { SetInterface } from '@src/interfaces';

const Flashcards: NextPage<{ data: SetInterface }> = ({ data }) => {
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);

  const cards = data.cards;

  const moveLeft = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  const moveRight = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    }
  };

  return (
    <>
      <CardView
        front={cards[currentCardIndex].term}
        back={cards[currentCardIndex].definition}
        onSwipeLeft={moveLeft}
        onSwipeRight={moveRight}
      />
    </>
  );
};

export default Flashcards;
