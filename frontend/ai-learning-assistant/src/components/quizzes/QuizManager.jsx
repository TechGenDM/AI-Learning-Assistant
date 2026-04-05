import React, { useState, useEffect } from 'react';
import { Target, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import quizService from '../../services/quizService';
import aiService from '../../services/aiService';
import QuizCard from './QuizCard';
import Spinner from '../common/Spinner';
import QuizViewer from './QuizViewer';

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, [documentId]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizService.getQuizzesForDocument(documentId);
      const data = response.data;
      if (Array.isArray(data)) {
        setQuizzes(data);
      } else if (data) {
        setQuizzes([data]);
      } else {
        setQuizzes([]);
      }
    } catch (error) {
      if (error.message !== 'Quiz not found' && error.statusCode !== 404) {
        toast.error('Failed to load quizzes');
      }
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await aiService.generateQuiz(documentId);
      toast.success('Quiz generated successfully!');
      fetchQuizzes();
    } catch (error) {
      toast.error(error.message || 'Failed to generate quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await quizService.deleteQuiz(quizId);
      toast.success('Quiz deleted successfully');
      fetchQuizzes();
    } catch (error) {
      toast.error('Failed to delete quiz');
    }
  };

  const handleOpenQuiz = (quiz) => {
     setActiveQuiz(quiz);
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
      
      {/* Quiz Viewer */}
      {activeQuiz ? (
         <QuizViewer 
            quizId={activeQuiz._id} 
            onBack={() => setActiveQuiz(null)} 
            onComplete={() => fetchQuizzes()} 
         />
      ) : quizzes.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white rounded-[24px] shadow-sm border border-[#f0f2f5]">
          <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-[#0cd09f]">
            <Target size={32} />
          </div>
          <h3 className="text-[22px] font-bold text-gray-800 mb-2">No Quizzes Yet</h3>
          <p className="text-[15px] text-gray-500 max-w-md mx-auto mb-8">
            Generate specific quizzes from your document to test your knowledge!
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
                <Plus size={20} />
                Generate Quiz
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] shadow-sm border border-[#f0f2f5] p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-[20px] font-bold text-gray-800 mb-1">Your Quizzes</h2>
              <p className="text-gray-500 text-sm font-medium">{quizzes.length} quiz{quizzes.length > 1 ? 'zes' : 'ze'} available</p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0cd09f] hover:bg-[#0bc193] text-white font-semibold rounded-full transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : (
                <>
                  <Plus size={18} /> Generate Quiz
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {quizzes.map((quiz) => (
              <QuizCard 
                key={quiz._id} 
                quiz={quiz} 
                onDelete={handleDeleteQuiz}
                onOpen={handleOpenQuiz}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManager;