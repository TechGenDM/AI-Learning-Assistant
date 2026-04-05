import Flashcard from "../models/Flashcard.js";

// @desc Get all flashcards for a document
// @route GET /api/flashcards/:documentId
// @access Private
export const getFlashcards = async (req, res, next) => {
    try{
        const flashcards = await Flashcard.find({
            userId: req.user.id,
            documentId: req.params.documentId
        }).populate('documentId', 'title')
          .sort({ createdAt: -1});

        res.status(200).json({
            success: true,
            count: flashcards.length,
            data: flashcards
        });
    } catch (error){
        next(error);
    }
};

// @desc Get all flashcard sets for a user
// @route GET /api/flashcards
// @access Private
export const getAllFlashcardSets = async (req, res) => {
    try {
        const flashcardSets = await Flashcard.find({
            userId: req.user.id
        }).populate('documentId', 'title')
          .sort({ createdAt: -1});

        res.status(200).json({
            success: true,
            count: flashcardSets.length,
            data: flashcardSets
        });
    } catch (error) {
        next(error);
    }
};

// @desc Mark flashcard as reviewed
// @route POST /api/flashcards/:cardId/review
// @access Private
export const reviewFlashcard = async (req, res, next) => {
    try {
        const flashCardSet = await Flashcard.findOne({
            userId: req.user.id,
        });

        if(!flashcardSet){
            return res.status(400).json({
                success: false,
                error: 'Flashcard set not found',
                statusCode: 400
            });
        }

        const cardIndex = flashCardSet.cards.findIndex(
            (card) => card._id.toString() === req.params.cardId
        );

        if(cardIndex === -1){
            return res.status(400).json({
                success: false,
                error: 'Card not found in set',
                statusCode: 404
            });
        }

        // Update review info
        flashCardSet.cards[cardIndex].lastReviewed = new Date();
        flashCardSet.cards[cardIndex].reviewCount += 1;

        await flashCardSet.save();

        res.status(200).json({
            success: true,
            data: flashCardSet,
            message: 'Flashcard reviewed successfully'
        });
    } catch (error) {
        next(error);
    }
}

// @desc Toggle star/favorite on flashcard
// @route PUT /api/flashcards/:cardId/star
// @access Private
export const toggleStarFlashcard = async (req, res, next) => {
    try {
        const flashCardSet = await Flashcard.findOne({
            'cards._id': req.params.cardId,
            userId: req.user.id
        });

        if(!flashCardSet){
            return res.status(400).json({
                success: false,
                error: 'Flashcard set or card not found',
                statusCode: 404
            });
        }

        const cardIndex = flashCardSet.cards.findIndex(
            (card) => card._id.toString() === req.params.cardId
        );

        if(cardIndex === -1){
            return res.status(400).json({
                success: false,
                error: 'Card not found in set',
                statusCode: 404
            });
        }

        // Toggle star
        flashCardSet.cards[cardIndex].isStarred = !flashCardSet.cards[cardIndex].isStarred;

        await flashCardSet.save();

        res.status(200).json({
            success: true,
            data: flashCardSet,
            message: `Flashcard ${flashCardSet.cards[cardIndex].isStarred ? 'starred' : 'unstarred'} successfully`
        });
    } catch (error) {
        next(error);
    }
};

// @desc Delete  flashcard set
// @route DELETE /api/flashcards/:id
// @access Private
export const deleteFlashcardSet = async (req, res, next) => {
    try {
        const flashCardSet = await Flashcard.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if(!flashCardSet){
            return res.status(400).json({
                success: false,
                error: 'Flashcard set not found',
                statusCode: 404
            });
        }

        await flashCardSet.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Flashcard set deleted successfully'
        }); 
    } catch (error) {
        next(error);
    }
};