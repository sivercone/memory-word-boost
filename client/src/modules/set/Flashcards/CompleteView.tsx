import React from 'react';
import { ButtonSquare } from '@src/ui';
import { BlurIcon, CheckCircleIcon, GrainIcon } from '@src/ui/Icons';

const CompleteView: React.FC<{ queryId: string; cardsLength: number; scorePercentage: string }> = ({
  queryId,
  cardsLength,
  scorePercentage,
}) => {
  return (
    <div className="flex-1 flex flex-col gap-4 animate-fadeIn">
      <div className="bg-violet-200 rounded-lg flex-1 flex flex-col justify-end gap-4 items-start p-8">
        <CheckCircleIcon height="48" width="48" className="fill-gray-800" />
        <p className="text-xl font-semibold">Well done!</p>
      </div>
      <div className="bg-gray-200 rounded-lg flex-1 flex flex-col justify-end gap-4 items-start p-8">
        <GrainIcon height="48" width="48" className="fill-gray-800" />
        <p className="text-xl font-semibold">{`Cards Completed: ${cardsLength}`}</p>
      </div>
      <div className="bg-gray-300 rounded-lg flex-1 flex flex-col justify-end gap-4 items-start p-8">
        <BlurIcon height="48" width="48" className="fill-gray-800" />
        <p className="text-xl font-semibold">{`Score: ${scorePercentage}%`}</p>
      </div>
      <ButtonSquare href={`/sets/${queryId}`} className="w-full">
        <span className="font-medium">Continue</span>
      </ButtonSquare>
    </div>
  );
};

export default CompleteView;
