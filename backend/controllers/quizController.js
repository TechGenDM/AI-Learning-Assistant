import Quiz from "../models/Quiz.js";

// @desc Get all quizzes for the logged-in user
// @route GET /api/quizzes
// @access Private
export const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ 
            userId: req.user.id,
            documentId: req.params.documentId
        })
            .populate('documentId', 'title')
            .select('-questions.correctAnswer -questions.explanation')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } catch (error) {
        console.error('Get all quizzes error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch quizzes',
            statusCode: 500
        });
    }
};

// @desc Get a single quiz by ID
// @route GET /api/quizzes/:id
// @access Private
export const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user.id
        }).populate('documentId', 'title');

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        console.error('Get quiz error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch quiz',
            statusCode: 500
        });
    }
};

// @desc Get quiz results
// @route GET /api/quizzes/:id/results
// @access Private
export const getQuizResults = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user.id
        }).populate('documentId', 'title');

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404
            });
        }

        // Build per-question results
        const questionResults = quiz.questions.map((question, index) => {
            const userAnswer = quiz.userAnswers.find(a => a.questionIndex === index);

            return {
                questionIndex: index,
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
                difficulty: question.difficulty,
                selectedAnswer: userAnswer ? userAnswer.selectedAnswer : null,
                isCorrect: userAnswer ? userAnswer.isCorrect : null,
                isAnswered: !!userAnswer
            };
        });

        const totalAnswered = quiz.userAnswers.length;
        const percentage = quiz.totalQuestions > 0
            ? Math.round((quiz.score / quiz.totalQuestions) * 100)
            : 0;

        res.status(200).json({
            success: true,
            data: {
                quizId: quiz._id,
                title: quiz.title,
                documentTitle: quiz.documentId?.title || null,
                score: quiz.score,
                totalQuestions: quiz.totalQuestions,
                totalAnswered,
                percentage,
                isCompleted: !!quiz.completedAt,
                completedAt: quiz.completedAt,
                questions: questionResults
            },
            message: 'Quiz results fetched successfully'
        });
    } catch (error) {
        console.error('Get quiz results error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch quiz results',
            statusCode: 500
        });
    }
};
    

// @desc Submit an answer for a quiz question
// @route POST /api/quizzes/:id/answer
// @access Private
export const submitQuiz = async (req, res) => {
    try {
        const { questionIndex, selectedAnswer } = req.body;

        if (questionIndex === undefined || questionIndex === null || !selectedAnswer) {
            return res.status(400).json({
                success: false,
                error: 'Please provide questionIndex and selectedAnswer',
                statusCode: 400
            });
        }

        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404
            });
        }

        // Check if quiz is already completed
        if (quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: 'Quiz has already been completed',
                statusCode: 400
            });
        }

        // Validate questionIndex is within range
        if (questionIndex < 0 || questionIndex >= quiz.questions.length) {
            return res.status(400).json({
                success: false,
                error: `Invalid questionIndex. Must be between 0 and ${quiz.questions.length - 1}`,
                statusCode: 400
            });
        }

        // Check if this question has already been answered
        const alreadyAnswered = quiz.userAnswers.find(
            a => a.questionIndex === questionIndex
        );

        if (alreadyAnswered) {
            return res.status(400).json({
                success: false,
                error: 'This question has already been answered',
                statusCode: 400
            });
        }

        // Check if the answer is correct
        const question = quiz.questions[questionIndex];
        const isCorrect = selectedAnswer === question.correctAnswer;

        // Add the answer
        quiz.userAnswers.push({
            questionIndex,
            selectedAnswer,
            isCorrect,
            answeredAt: new Date()
        });

        // Update score
        if (isCorrect) {
            quiz.score += 1;
        }

        // Auto-complete if all questions have been answered
        if (quiz.userAnswers.length === quiz.totalQuestions) {
            quiz.completedAt = new Date();
        }

        await quiz.save();

        res.status(200).json({
            success: true,
            data: {
                isCorrect,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
                currentScore: quiz.score,
                totalAnswered: quiz.userAnswers.length,
                totalQuestions: quiz.totalQuestions,
                isCompleted: !!quiz.completedAt
            },
            message: isCorrect ? 'Correct answer!' : 'Incorrect answer'
        });
    } catch (error) {
        console.error('Submit answer error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to submit answer',
            statusCode: 500
        });
    }
};

// @desc Delete a quiz
// @route DELETE /api/quizzes/:id
// @access Private
export const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404
            });
        }

        await quiz.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully'
        });
    } catch (error) {
        console.error('Delete quiz error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to delete quiz',
            statusCode: 500
        });
    }
};
