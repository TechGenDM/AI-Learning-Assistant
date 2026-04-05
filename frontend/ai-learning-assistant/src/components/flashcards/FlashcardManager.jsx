import React, { useState, useEffect } from 'react';
import { Brain, Plus, LayoutGrid, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import flashcardService from '../../services/flashcardService';
import aiService from '../../services/aiService';
import Flashcard from './Flashcard';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      // Backend returns a single set or null if finding one, or array?
      // Let's handle both in case controller returns {data: obj} or {data: [obj]}
      const data = response.data;
      if (Array.isArray(data)) {
        setFlashcardSets(data);
      } else if (data) {
        setFlashcardSets([data]);
      } else {
        setFlashcardSets([]);
      }
    } catch (error) {
      // 404 is commonly returned if no flashcards exist, so treat it silently
      if (error.message !== 'Flashcards not found') {
        toast.error('Failed to load flashcards');
      }
      setFlashcardSets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await aiService.generateFlashcards(documentId, 10);
      toast.success('Flashcards generated successfully!');
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || 'Failed to generate flashcards');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      // Fetch fresh data to reflect star status
      fetchFlashcards();
      
      // Also strictly update the selected set in modal if open
      if (selectedSet) {
        const updatedCards = selectedSet.cards.map(c => 
          c._id === cardId ? { ...c, isStarred: !c.isStarred } : c
        );
        setSelectedSet({ ...selectedSet, cards: updatedCards });
      }
    } catch (error) {
      toast.error('Failed to update star');
    }
  };

  const handleDeleteSet = async (setId) => {
    if (!window.confirm('Are you sure you want to delete this flashcard set?')) return;
    try {
      await flashcardService.deleteFlashcardSet(setId);
      toast.success('Flashcard set deleted successfully');
      fetchFlashcards();
    } catch (err) {
      toast.error(err.message || 'Failed to delete set');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      {flashcardSets.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white rounded-[24px] shadow-sm border border-[#f0f2f5]">
          <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-[#0cd09f]">
            <Brain size={32} />
          </div>
          <h3 className="text-[22px] font-bold text-gray-800 mb-2">No Flashcards Yet</h3>
          <p className="text-[15px] text-gray-500 max-w-md mx-auto mb-8">
            Generate flashcards from your document to start learning and reinforce your knowledge.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0cd09f] hover:bg-[#0bc193] text-white font-semibold rounded-full transition-colors disabled:opacity-50 shadow-sm"
          >
            {isGenerating ? (
              <>
                <Spinner size="sm" color="white" />
                Generating...
              </>
            ) : (
              <>
                <Brain size={20} />
                Generate Flashcards
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] shadow-sm border border-[#f0f2f5] p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-[20px] font-bold text-gray-800 mb-1">Your Flashcard Sets</h2>
              <p className="text-gray-500 text-sm font-medium">{flashcardSets.length} set{flashcardSets.length > 1 ? 's' : ''} available</p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#0cd09f] font-semibold rounded-full transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : (
                <>
                  <Plus size={18} /> Generate More
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {flashcardSets.map((set) => (
              <div 
                key={set._id}
                onClick={() => setSelectedSet(set)}
                className="group relative border border-gray-100 rounded-[20px] p-6 cursor-pointer hover:shadow-md hover:border-[#0cd09f]/30 transition-all bg-gray-50/50 hover:bg-white"
              >
                <div className="w-12 h-12 bg-emerald-50 text-[#0cd09f] rounded-[14px] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Brain size={24} />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSet(set._id);
                  }}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
                <h3 className="font-bold text-gray-800 text-[17px] mb-1">Flashcard Set</h3>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-6">
                  Created {new Date(set.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                </p>
                <div className="flex items-center justify-between">
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                    {set.cards.length} cards
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <LayoutGrid size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Study Modal */}
      <Modal
        isOpen={!!selectedSet}
        onClose={() => setSelectedSet(null)}
        title="Study Flashcards"
      >
        <div className="bg-gray-50/50 -m-6 p-6 min-h-[400px]">
          {selectedSet && (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6">
               {selectedSet.cards.map(card => (
                 <Flashcard 
                   key={card._id} 
                   flashcard={card} 
                   onToggleStar={handleToggleStar} 
                 />
               ))}
             </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardManager;