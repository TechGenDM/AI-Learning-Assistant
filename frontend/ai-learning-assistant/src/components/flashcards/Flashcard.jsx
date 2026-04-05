import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleStarClick = (e) => {
    e.stopPropagation(); // prevent flipping when clicking the star
    if(onToggleStar) onToggleStar(flashcard._id);
  };

  return (
    <div 
      className="relative w-full h-[300px] perspective-1000 cursor-pointer"
      onClick={handleFlip}
    >
      <div 
        className={`w-full h-full duration-500 preserve-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.5s' }}
      >
        {/* Front (Question) */}
        <div 
          className="absolute inset-0 backface-hidden w-full h-full bg-white rounded-[24px] shadow-sm border border-[#f0f2f5] p-8 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-[#0cd09f] uppercase tracking-wide">
            Question
          </div>
          <button 
            className="absolute top-4 left-4 p-2 text-gray-300 hover:text-amber-400 transition-colors"
            onClick={handleStarClick}
          >
            <Star 
              size={22} 
              className={flashcard.isStarred ? "fill-amber-400 text-amber-400" : ""} 
            />
          </button>
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 wrap-break-word w-full">
            {flashcard.question}
          </h3>
          <p className="absolute bottom-6 text-gray-400 text-sm font-medium">Click to reveal answer</p>
        </div>

        {/* Back (Answer) */}
        <div 
          className="absolute inset-0 backface-hidden w-full h-full bg-emerald-50 rounded-[24px] shadow-sm border border-emerald-100 p-8 flex flex-col items-center justify-center text-center rotate-y-180"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wide">
            Answer
          </div>
          <p className="text-lg md:text-xl font-medium text-emerald-900 wrap-break-word w-full">
            {flashcard.answer}
          </p>
          <div className="absolute bottom-6 flex gap-2 items-center text-sm">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium bg-white border ${
              flashcard.difficulty === 'hard' ? 'text-red-600 border-red-200' : 
              flashcard.difficulty === 'easy' ? 'text-green-600 border-green-200' : 
              'text-amber-600 border-amber-200'
            }`}>
              {flashcard.difficulty || 'medium'}
            </span>
            <span className="text-emerald-700 font-medium">Click to hide</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;