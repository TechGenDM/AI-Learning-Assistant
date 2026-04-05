import React from 'react';
import { Trash2, Award, ChevronRight, FileQuestion, BarChart2 } from 'lucide-react';

const QuizCard = ({ quiz, onDelete, onOpen }) => {
  const isCompleted = !!quiz.completedAt;
  const scorePercentage = quiz.totalQuestions > 0 ? Math.round((quiz.score / quiz.totalQuestions) * 100) : 0;

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-emerald-400 p-6 relative hover:shadow-md transition-shadow flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#0cd09f] text-xs font-bold rounded-full">
          {isCompleted ? <Award size={14} /> : <FileQuestion size={14} />}
          <span>
            {isCompleted ? `Score: ${scorePercentage}%` : 'Not Started'}
          </span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(quiz._id);
          }}
          className="w-8 h-8 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <h3 className="font-bold text-gray-800 text-[18px] mb-1 leading-tight line-clamp-2">
        {quiz.title}
      </h3>
      <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-6 flex-1">
        Created {new Date(quiz.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
      </p>

      <div className="inline-block px-4 py-2 bg-gray-50 border border-gray-100 rounded-[12px] text-gray-600 text-sm font-semibold mb-6 w-max">
        {quiz.totalQuestions} Questions
      </div>

      <button 
        onClick={() => onOpen(quiz)}
        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold rounded-xl transition-colors"
      >
        {isCompleted ? (
          <>
            <BarChart2 size={18} /> View Results
          </>
        ) : (
          <>
            Take Quiz <ChevronRight size={18} />
          </>
        )}
      </button>
    </div>
  );
};

export default QuizCard;