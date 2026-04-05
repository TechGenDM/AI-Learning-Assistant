import React, { useState } from 'react';
import { Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';
import aiService from '../../services/aiService';
import Modal from '../common/Modal';
import MarkdownRenderer from '../common/MarkdownRenderer';

const AIActions = ({ documentId }) => {
  const [concept, setConcept] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [modalData, setModalData] = useState({ isOpen: false, title: '', content: '' });

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const response = await aiService.generateSummary(documentId);
      // The summary might be under data.summary based on backend structure
      const summaryText = response.data?.summary || response.data || response;
      setModalData({
        isOpen: true,
        title: 'Document Summary',
        content: summaryText
      });
    } catch (error) {
      toast.error(error.message || 'Failed to generate summary');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleExplain = async () => {
    if (!concept.trim()) {
      toast.error('Please enter a concept to explain');
      return;
    }
    
    setIsExplaining(true);
    try {
      const response = await aiService.explainConcept(documentId, concept);
      // The explanation might be under data.explanation
      const explanationText = response.data?.explanation || response.data || response;
      setModalData({
        isOpen: true,
        title: `Concept: ${concept}`,
        content: explanationText
      });
      setConcept('');
    } catch (error) {
      toast.error(error.message || 'Failed to explain concept');
    } finally {
      setIsExplaining(false);
    }
  };

  const closeModal = () => {
    setModalData({ ...modalData, isOpen: false });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="bg-white rounded-[24px] shadow-sm border border-[#f0f2f5] p-6 space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 bg-[#0cd09f] rounded-[14px] flex items-center justify-center text-white shadow-sm">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">AI Assistant</h2>
            <p className="text-[14px] text-gray-500 font-medium">Powered by advanced AI</p>
          </div>
        </div>

        {/* Generate Summary Card */}
        <div className="border border-gray-100 rounded-[20px] p-6 flex items-center justify-between hover:shadow-md transition-shadow bg-gray-50/50">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-[16px] mb-1">Generate Summary</h3>
              <p className="text-gray-500 text-[14px]">Get a concise summary of the entire document.</p>
            </div>
          </div>
          <button 
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="px-6 py-2.5 bg-[#0cd09f] hover:bg-[#0bc193] text-white font-medium rounded-full transition-colors disabled:opacity-50 min-w-[120px] flex justify-center shadow-sm"
          >
            {isSummarizing ? 'Generating...' : 'Summarize'}
          </button>
        </div>

        {/* Explain Concept Card */}
        <div className="border border-gray-100 rounded-[20px] p-6 hover:shadow-md transition-shadow bg-gray-50/50">
          <div className="flex gap-4 mb-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
              <Lightbulb size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-[16px] mb-1">Explain a Concept</h3>
              <p className="text-gray-500 text-[14px]">Enter a topic or concept from the document to get a detailed explanation.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full">
            <input 
              type="text" 
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
              placeholder="e.g. 'React Hooks'"
              disabled={isExplaining}
              className="flex-1 bg-white border border-gray-200 rounded-[20px] px-5 py-3.5 text-[15px] focus:outline-none focus:border-[#0cd09f] focus:ring-2 focus:ring-[#0cd09f]/20 transition-all placeholder:text-gray-400"
            />
            <button 
              onClick={handleExplain}
              disabled={isExplaining || !concept.trim()}
              className="px-6 py-3.5 bg-[#a7f3d0] hover:bg-[#86efac] text-emerald-800 font-medium rounded-full transition-colors disabled:opacity-50 min-w-[100px] flex justify-center shadow-sm"
            >
              {isExplaining ? 'Explaining...' : 'Explain'}
            </button>
          </div>
        </div>

      </div>

      <Modal 
        isOpen={modalData.isOpen} 
        onClose={closeModal} 
        title={modalData.title}
      >
        <MarkdownRenderer content={modalData.content} />
      </Modal>
    </div>
  );
};

export default AIActions;