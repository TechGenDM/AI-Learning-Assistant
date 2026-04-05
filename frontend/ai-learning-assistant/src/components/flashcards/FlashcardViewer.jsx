import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Flashcard from './Flashcard';

const FlashcardViewer = ({ set, onBack, onToggleStar }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!set || !set.cards || set.cards.length === 0) return null;

  const handleNext = () => {
    if (currentIndex < set.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentCard = set.cards[currentIndex];

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        Back to Sets
      </button>

      {/* Viewer Container */}
      <div className="bg-white rounded-[32px] shadow-sm border border-[#f0f2f5] p-6 sm:p-10 lg:p-14 mb-6">
        <div className="max-w-3xl mx-auto">
          {/* We use a key based on the card ID so the flip state resets between cards */}
          <Flashcard 
            key={currentCard._id} 
            flashcard={currentCard} 
            onToggleStar={onToggleStar} 
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:hover:bg-white"
        >
          <ChevronLeft size={18} /> Previous
        </button>
        
        <div className="px-5 py-2.5 rounded-full font-bold text-gray-700 bg-white border border-gray-200 min-w-[80px] text-center">
          {currentIndex + 1} / {set.cards.length}
        </div>

        <button 
          onClick={handleNext}
          disabled={currentIndex === set.cards.length - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:hover:bg-white"
        >
          Next <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardViewer;
