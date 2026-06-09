import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';

// @desc Get user learning statistics
// @route GET /api/progress/dashboard
// @access Private
export const getDashboard = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Get counts 
        const totalDocuments = await Document.countDocuments({userId});
        const totalFlashcardSets = await Flashcard.countDocuments({userId});
        const totalQuizzes = await Quiz.countDocuments({userId});
        const completedQuizzes = await Quiz.countDocuments({userId, completedAt: {$ne: null}});

        // Get flashcard statistics 
        const flashcardSets = await Flashcard.find({userId});
        let totalFlashcards = 0;
        let reviewedFlashcards = 0;
        let starredFlashcards = 0;

        flashcardSets.forEach(set => {
            totalFlashcards += set.cards.length;
            reviewedFlashcards += set.cards.filter(card => card.reviewCount > 0).length;
            starredFlashcards += set.cards.filter(card => card.isStarred).length;
        });

        // Get quiz statistics 
        const quizzes = await Quiz.find({userId, completedAt: {$ne: null}}).sort({completedAt: -1}).limit(5).select('title score totalQuestions lastAccessed status');

        const recentQuizzes = await Quiz.find({userId}).sort({createdAt: -1}).limit(5).populate('documentId', 'title').select('title score totalQuestions lastAccessed status createdAt');

        const recentDocuments = await Document.find({userId}).sort({createdAt: -1}).limit(5).select('title filename lastAccessed status createdAt');

        const allCompletedQuizzes = await Quiz.find({userId, completedAt: {$ne: null}});
        let totalScorePercentage = 0;
        allCompletedQuizzes.forEach(q => {
            const percentage = (q.totalQuestions && q.totalQuestions > 0) ? (q.score / q.totalQuestions) * 100 : 0;
            totalScorePercentage += percentage;
        });
        const averageScore = completedQuizzes > 0 ? Math.round(totalScorePercentage / completedQuizzes) : 0;

        // Calculate Weekly Progress and Study Streak
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const docsThisWeek = await Document.find({ userId, createdAt: { $gte: sevenDaysAgo } }).select('createdAt');
        const quizzesThisWeek = await Quiz.find({ userId, createdAt: { $gte: sevenDaysAgo } }).select('createdAt completedAt');
        const flashcardsThisWeek = await Flashcard.find({ userId, updatedAt: { $gte: sevenDaysAgo } }).select('updatedAt');

        const weeklyData = Array(7).fill(0);
        const streakDays = Array(7).fill(false);
        const dayLabels = [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            dayLabels.push(d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0));
        }

        const processActivity = (dateStr) => {
            if (!dateStr) return;
            const date = new Date(dateStr);
            date.setHours(0, 0, 0, 0);
            const diffTime = today.getTime() - date.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 0 && diffDays <= 6) {
                const index = 6 - diffDays;
                weeklyData[index] += 1;
                streakDays[index] = true;
            }
        };

        docsThisWeek.forEach(doc => processActivity(doc.createdAt));
        quizzesThisWeek.forEach(q => {
            processActivity(q.createdAt);
            if (q.completedAt) processActivity(q.completedAt);
        });
        flashcardsThisWeek.forEach(f => processActivity(f.updatedAt));

        let studyStreak = 0;
        let streakAlive = streakDays[6] || streakDays[5]; 
        if (streakAlive) {
             for (let i = 6; i >= 0; i--) {
                 if (streakDays[i]) studyStreak++;
                 else if (i !== 6) break; 
             }
        }

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalDocuments,
                    totalFlashcardSets,
                    totalFlashcards,
                    reviewedFlashcards,
                    starredFlashcards,
                    totalQuizzes,
                    completedQuizzes,
                    averageScore,
                    studyStreak
                },
                weeklyProgress: {
                    labels: dayLabels,
                    data: weeklyData,
                    streakDays: streakDays
                },
                recentActivity: {
                    document: recentDocuments,
                    quizzes: recentQuizzes
                }
            }
        });
    } catch (error) {
        next(error);
    }
};