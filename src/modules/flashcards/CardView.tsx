import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { Button, Icons } from '@src/ui';

type CardViewProps = {
  front: string;
  back: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
};

const CardView: React.FC<CardViewProps> = ({ front, back, onSwipeLeft, onSwipeRight }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const handleCardClick = () => {
    if (!swipeDirection) setIsFlipped((prev) => !prev);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => {
      if (direction === 'left') onSwipeLeft();
      else if (direction === 'right') onSwipeRight();
      setIsFlipped(false); // Set card to its initial state (not flipped)
    }, 350); // matches the transition duration
    setTimeout(() => setSwipeDirection(null), 360); // keeps smooth animation
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const leftKeys = new Set(['a', 'arrowleft']);
      const rightKeys = new Set(['d', 'arrowright']);
      const actionKeys = new Set(['w', 's', ' ', 'arrowup', 'arrowdown']);

      if (leftKeys.has(key)) handleSwipe('left');
      else if (rightKeys.has(key)) handleSwipe('right');
      else if (actionKeys.has(key)) handleCardClick();
    };
    document.addEventListener('keyup', handleKeyPress);
    return () => document.removeEventListener('keyup', handleKeyPress);
  }, []);

  return (
    <>
      <button
        onClick={handleCardClick}
        onKeyUp={(event) => event.key === ' ' && handleCardClick()}
        className="group flex-1 rounded-lg focus-visible:shadow-none"
        style={{
          transition: 'transform 0.35s, opacity 0.35s',
          opacity: swipeDirection ? 0 : 1,
          transform: swipeDirection === 'left' ? 'translateX(-100%)' : swipeDirection === 'right' ? 'translateX(100%)' : '',
          transformStyle: 'preserve-3d',
          perspective: '20000px',
        }}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            perspective: '20000px',
            transform: isFlipped ? 'rotateY(180deg)' : '',
            transition: !swipeDirection ? 'transform 0.35s' : 'border-color 0.1s',
          }}
          className={clsx(
            swipeDirection === 'left' ? 'border-rose-500' : swipeDirection === 'right' ? 'border-primary-500' : 'border-outline',
            'relative h-full',
            'bg-surface text-onSurface',
            'rounded-lg border border-solid',
            'group-focus-visible:shadow-[0_0_0_2px] group-focus-visible:shadow-primary-400',
          )}
        >
          <div style={{ backfaceVisibility: 'hidden' }} className="absolute flex h-full w-full items-center justify-center">
            <span className="absolute left-[10px] top-[10px] select-none text-xs text-onBackground">FRONT SIDE</span>
            <span className="max-h-[92%] overflow-y-auto px-2 text-xl leading-relaxed">{front}</span>
            <span className="absolute bottom-[10px] select-none text-xs text-onBackground">TAP TO FLIP</span>
          </div>
          <div
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            className="absolute flex h-full w-full items-center justify-center"
          >
            <span className="absolute left-[10px] top-[10px] select-none text-xs text-onBackground">BACK SIDE</span>
            <span className="max-h-[92%] overflow-y-auto px-2 text-xl leading-relaxed">{back}</span>
            <span className="absolute bottom-[10px] select-none text-xs text-onBackground">TAP TO FLIP</span>
          </div>
        </div>
      </button>

      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <Button onClick={() => handleSwipe('left')} className="w-full justify-start gap-2 py-4 sm:justify-center">
          <Icons.TaskIncomplete />
          <span className="font-medium">Didn&#39;t Know that</span>
        </Button>
        <Button onClick={() => handleSwipe('right')} className="w-full justify-start gap-2 py-4 sm:justify-center">
          <Icons.TaskComplete />
          <span className="font-medium">Already Know that</span>
        </Button>
      </div>
    </>
  );
};

export default CardView;
