import React from "react";
import QuizManager from "../../components/quizzes/QuizManager";

const QuizzesPage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827] tracking-tight">Quizzes</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Test your knowledge with AI-generated quizzes.
        </p>
      </div>
      <QuizManager />
    </div>
  );
};

export default QuizzesPage;
