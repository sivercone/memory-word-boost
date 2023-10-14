import React from 'react';

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
    }, 500); // matches the transition duration
    setTimeout(() => setSwipeDirection(null), 600); // keeps smooth animation
  };

  return (
    <>
      <button
        onClick={handleCardClick}
        className="flex-1"
        style={{
          transition: 'transform 0.5s, opacity 0.5s',
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
            transition: !swipeDirection ? 'transform 0.5s' : '',
          }}
          className="h-full relative bg-white border border-gray-200 border-solid rounded-lg"
        >
          <div style={{ backfaceVisibility: 'hidden' }} className="absolute w-full h-full flex items-center justify-center">
            <span className="leading-relaxed text-xl">{front}</span>
          </div>
          <div
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            className="absolute w-full h-full flex items-center justify-center"
          >
            <span className="leading-relaxed text-xl">{back}</span>
          </div>
        </div>
      </button>

      <div className="flex gap-4 w-full">
        <button onClick={() => handleSwipe('left')} className="bg-white border border-gray-200 border-solid p-2 rounded-lg w-full">
          <span className="font-medium">Missed</span>
        </button>
        <button onClick={() => handleSwipe('right')} className="bg-white border border-gray-200 border-solid p-2 rounded-lg w-full">
          <span className="font-medium">Correct</span>
        </button>
      </div>
    </>
  );
};

export default CardView;
