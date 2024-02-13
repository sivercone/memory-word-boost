import React from 'react';
import { ButtonSquare } from '@src/ui';
import { TaskCompleteIcon, TaskIncompleteIcon } from '@src/ui/Icons';

type CardViewProps = {
  front: string;
  back: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
};

const CardView: React.FC<CardViewProps> = ({ front, back, onSwipeLeft, onSwipeRight }) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [swipeDirection, setSwipeDirection] = React.useState<'left' | 'right' | null>(null);

  const handleCardClick = () => {
    if (!swipeDirection) setIsFlipped((prev) => !prev);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => {
      direction === 'left' ? onSwipeLeft() : onSwipeRight();
      setIsFlipped(false); // Set card to its initial state (not flipped)
    }, 350); // matches the transition duration
    setTimeout(() => setSwipeDirection(null), 360); // keeps smooth animation
  };

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (['a', 'A', 'ArrowLeft'].includes(event.key)) handleSwipe('left');
      if (['d', 'D', 'ArrowRight'].includes(event.key)) handleSwipe('right');
      if (['w', 'W', 's', 'S', ' ', 'ArrowUp', 'ArrowDown'].includes(event.key)) handleCardClick();
    };
    document.addEventListener('keyup', handleKeyPress);
    return () => {
      document.removeEventListener('keyup', handleKeyPress);
    };
  }, []);

  return (
    <>
      <button
        onClick={handleCardClick}
        onKeyUp={(event) => event.key === ' ' && handleCardClick()}
        className="flex-1 rounded-lg focus-visible:shadow-none group"
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
          className={`${
            swipeDirection === 'left' ? 'border-rose-500' : swipeDirection === 'right' ? 'border-violet-500' : 'border-gray-200'
          } bg-white h-full relative border border-solid rounded-lg group-focus-visible:shadow-[0_0_0_2px] group-focus-visible:shadow-violet-400`}
        >
          <div style={{ backfaceVisibility: 'hidden' }} className="absolute w-full h-full flex items-center justify-center">
            <span className="absolute top-[10px] left-[10px] text-gray-600 text-xs select-none">FRONT SIDE</span>
            <span className="leading-relaxed text-xl max-h-[92%] overflow-y-auto px-2">{front}</span>
            <span className="absolute bottom-[10px] text-gray-600 text-xs select-none">TAP TO FLIP</span>
          </div>
          <div
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            className="absolute w-full h-full flex items-center justify-center"
          >
            <span className="absolute top-[10px] left-[10px] text-gray-600 text-xs select-none">BACK SIDE</span>
            <span className="leading-relaxed text-xl max-h-[92%] overflow-y-auto px-2">{back}</span>
            <span className="absolute bottom-[10px] text-gray-600 text-xs select-none">TAP TO FLIP</span>
          </div>
        </div>
      </button>

      <div className="flex gap-4 w-full flex-col sm:flex-row">
        <ButtonSquare onClick={() => handleSwipe('left')} className="w-full gap-2 justify-start sm:justify-center py-4">
          <TaskIncompleteIcon />
          <span className="font-medium">Didn&#39;t Know that</span>
        </ButtonSquare>
        <ButtonSquare onClick={() => handleSwipe('right')} className="w-full gap-2 justify-start sm:justify-center py-4">
          <TaskCompleteIcon />
          <span className="font-medium">Already Know that</span>
        </ButtonSquare>
      </div>
    </>
  );
};

export default CardView;
