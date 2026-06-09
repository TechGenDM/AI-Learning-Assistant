import React from "react";
import FlashcardManager from "../../components/flashcards/FlashcardManager";

const FlashcardsPage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827] tracking-tight">Flashcards</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Review and manage all your flashcard decks.
        </p>
      </div>
      <FlashcardManager />
    </div>
  );
};

export default FlashcardsPage;
