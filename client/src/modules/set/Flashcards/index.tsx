import React from 'react';
import { NextPage } from 'next';
import { useQuery } from 'react-query';
import { SetInterface } from '@src/interfaces';
import { useIsClient } from '@src/lib/hooks';
import { setApi } from '@src/apis';
import CardView from './CardView';
import CompleteView from './CompleteView';

const Flashcards: NextPage<{ data: SetInterface; queryId: string }> = ({ data, queryId }) => {
  const isClient = useIsClient();
  const { data: studySet = data } = useQuery(['set', queryId], () => setApi.getById(queryId));
  const cards = studySet?.cards || [];
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
    <div className="max-w-3xl mx-auto flex flex-col gap-4 p-4" style={{ height: 'calc(100% - 65px)' }}>
      {currentCardIndex < cards.length ? (
        <CardView
          front={cards[currentCardIndex].front}
          back={cards[currentCardIndex].back}
          onSwipeLeft={() => onSwipe(false)}
          onSwipeRight={() => onSwipe(true)}
        />
      ) : cards.length ? (
        <CompleteView queryId={queryId} scorePercentage={scorePercentage} cardsLength={cards.length} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">There are no cards..</p>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
