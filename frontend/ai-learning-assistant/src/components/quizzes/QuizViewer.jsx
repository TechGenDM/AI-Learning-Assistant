import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import quizService from '../../services/quizService';
import Spinner from '../common/Spinner';

const QuizViewer = ({ quizId, onBack, onComplete }) => {
  const [quizDetails, setQuizDetails] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Test Taker State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState(null); // { isCorrect, correctAnswer, explanation }

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  const fetchQuizData = async () => {
    setLoading(true);
    try {
      // First get basic metadata
      const response = await quizService.getQuizById(quizId);
      const data = response.data || response;
      setQuizDetails(data);
      
      // If the quiz is completed, eagerly load the full results
      if (data.completedAt) {
        const resResponse = await quizService.getQuizResults(quizId);
        setResults(resResponse.data || resResponse);
      } else {
        // Compute where we left off
        const totalAnswered = data.userAnswers ? data.userAnswers.length : 0;
        setCurrentIndex(totalAnswered < data.questions.length ? totalAnswered : 0);
      }
    } catch (error) {
      toast.error('Failed to load quiz metadata');
      onBack();
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    if (!submissionFeedback) {
      setSelectedOption(option);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption) {
      toast.error('Please select an answer first');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await quizService.submitQuiz(quizId, {
        questionIndex: currentIndex,
        selectedAnswer: selectedOption
      });
      const data = response.data || response;
      
      setSubmissionFeedback({
        isCorrect: data.isCorrect,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        isCompleted: data.isCompleted
      });
      
      if (data.isCompleted) {
        onComplete && onComplete();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    if (submissionFeedback?.isCompleted) {
      // Transition to results screen
      setLoading(true);
      const resResponse = await quizService.getQuizResults(quizId);
      setResults(resResponse.data || resResponse);
      setQuizDetails(prev => ({ ...prev, completedAt: new Date() }));
      setLoading(false);
    } else {
      // Move to next question and reset states
      setCurrentIndex(currentIndex + 1);
      setSelectedOption('');
      setSubmissionFeedback(null);
    }
  };

  if (loading || !quizDetails) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner />
      </div>
    );
  }

  // --- RESULTS VIEW ---
  if (quizDetails.completedAt && results) {
    return (
      <div className="animate-in fade-in duration-300">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          Back to Quizzes
        </button>

        <div className="bg-white rounded-[24px] shadow-sm border border-[#f0f2f5] p-6 lg:p-10 text-center mb-6">
          <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-[#0cd09f] mb-4">
            <Award size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
          <p className="text-gray-500 mb-6 font-medium">You scored {results.score} out of {results.totalQuestions} ({results.percentage}%)</p>
          
          <div className="h-2 w-full max-w-md mx-auto bg-gray-100 rounded-full overflow-hidden mb-8">
            <div 
              className={`h-full ${results.percentage >= 80 ? 'bg-[#0cd09f]' : results.percentage >= 50 ? 'bg-amber-400' : 'bg-red-500'}`}
              style={{ width: `${results.percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800 px-2">Detailed Results</h3>
          {results.questions.map((q, idx) => (
            <div key={idx} className="bg-white rounded-[20px] shadow-sm border border-[#f0f2f5] p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {q.isCorrect ? <CheckCircle className="text-[#0cd09f]" size={24}/> : <XCircle className="text-red-500" size={24}/>}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-[16px] mb-4">Question {idx + 1}: {q.question}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {q.options.map((opt, i) => {
                      const isSelected = q.selectedAnswer === opt;
                      const isActuallyCorrect = q.correctAnswer === opt;
                      
                      let baseClasses = "px-4 py-3 rounded-xl border text-sm font-medium ";
                      if (isActuallyCorrect) {
                        baseClasses += "bg-emerald-50 border-emerald-200 text-emerald-800";
                      } else if (isSelected && !isActuallyCorrect) {
                        baseClasses += "bg-red-50 border-red-200 text-red-800";
                      } else {
                        baseClasses += "bg-gray-50 border-gray-100 text-gray-500";
                      }
                      
                      return (
                        <div key={i} className={baseClasses}>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-3 text-blue-800 text-sm">
                      <AlertCircle className="shrink-0 text-blue-400 mt-0.5" size={18}/>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- TAKER VIEW ---
  const questionData = quizDetails.questions[currentIndex];
  
  if (!questionData) {
     return <div className="text-center py-10">Waiting for question data...</div>;
  }

  return (
    <div className="animate-in fade-in duration-300">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        Exit Quiz
      </button>

      <div className="bg-white rounded-[24px] shadow-sm border border-[#f0f2f5] p-6 lg:p-10 mb-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-gray-800">{quizDetails.title}</h2>
          <div className="px-3 py-1 bg-gray-100 text-gray-600 font-bold rounded-full text-sm">
            Question {currentIndex + 1} of {quizDetails.totalQuestions}
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
          {questionData.question}
        </h3>

        <div className="space-y-3 mb-8">
          {questionData.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isFeedbackCorrect = submissionFeedback && submissionFeedback.correctAnswer === option;
            const isFeedbackWrong = submissionFeedback && isSelected && !submissionFeedback.isCorrect;

            let buttonClass = "w-full text-left px-5 py-4 rounded-[16px] border-2 transition-all font-medium text-[15px] ";
            
            if (submissionFeedback) {
              if (isFeedbackCorrect) {
                buttonClass += "bg-emerald-50 border-emerald-400 text-emerald-800";
              } else if (isFeedbackWrong) {
                buttonClass += "bg-red-50 border-red-400 text-red-800";
              } else {
                buttonClass += "bg-gray-50 border-gray-100 text-gray-400 opacity-60";
              }
            } else {
              if (isSelected) {
                buttonClass += "bg-blue-50 border-blue-400 text-blue-800";
              } else {
                buttonClass += "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50";
              }
            }

            return (
              <button 
                key={idx}
                onClick={() => handleOptionSelect(option)}
                disabled={!!submissionFeedback}
                className={buttonClass}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 
                    ${isSelected && !submissionFeedback ? 'border-blue-500 bg-blue-500 text-white' : 
                      isFeedbackCorrect ? 'border-emerald-500 bg-emerald-500 text-white' : 
                      isFeedbackWrong ? 'border-red-500 bg-red-500 text-white' : 'border-gray-300'}
                  `}>
                    {isFeedbackCorrect && <CheckCircle size={14} />}
                    {isFeedbackWrong && <XCircle size={14} />}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
        
        {submissionFeedback && submissionFeedback.explanation && (
          <div className="mb-8 p-5 bg-blue-50 border border-blue-100 rounded-[16px] flex gap-3 text-blue-800 text-sm animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="shrink-0 text-blue-500 mt-0.5" size={20}/>
            <p className="leading-relaxed font-medium">{submissionFeedback.explanation}</p>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-100">
          {!submissionFeedback ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedOption || isSubmitting}
              className="px-8 py-3 bg-[#0cd09f] hover:bg-[#0bc193] text-white font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Checking...' : 'Submit Answer'}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
            >
              {submissionFeedback.isCompleted ? 'View Results' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizViewer;
