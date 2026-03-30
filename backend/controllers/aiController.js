import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from "../models/ChatHistory.js";
import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from "../utils/textChunker.js";

// @desc Generate flashcards from document content
// @route POST /api/ai/flashcards
// @access Private
export const generateFlashcards = async (req, res) => {
    try {
        const { documentId, count = 10 } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a documentId',
                statusCode: 400
            });
        }

        // Fetch document and verify ownership
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user.id,
            status: 'ready'
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404
            });
        }

        if (document.status !== 'ready') {
            return res.status(400).json({
                success: false,
                error: `Document is not ready yet. Current status: ${document.status}`,
                statusCode: 400
            });
        }

        // Generate flashcards using Gemini
        const generatedCards = await geminiService.generateFlashcards(document.extractedText, parseInt(count));

        // Save flashcard set to database
        const flashcardSet = await Flashcard.create({
            userId: req.user.id,
            documentId: document._id,
            cards: generatedCards.map(card => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
                reviewCount: 0,
                isStarred: false,
            }))
        });

        res.status(201).json({
            success: true,
            data: flashcardSet,
            message: `${flashcardSet.cards.length} flashcards generated successfully`
        });
    } catch (error) {
        console.error('Generate flashcards error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate flashcards',
            statusCode: 500
        });
    }
};

// @desc Generate quiz from document
// @route POST /api/ai/quiz
// @access Private
export const generateQuiz = async (req, res) => {
    try {
        const { documentId, numQuestions = 5, title } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a documentId',
                statusCode: 400
            });
        }

        // Fetch document and verify ownership
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user.id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404
            });
        }

        if (document.status !== 'ready') {
            return res.status(400).json({
                success: false,
                error: `Document is not ready yet. Current status: ${document.status}`,
                statusCode: 400
            });
        }

        // Generate quiz using Gemini
        const generatedQuestions = await geminiService.generateQuiz(document.extractedText, parseInt(numQuestions));

        // Save quiz to database
        const quiz = await Quiz.create({
            userId: req.user.id,
            documentId: document._id,
            title: title || `Quiz - ${document.title}`,
            questions: generatedQuestions.map(q => ({
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                difficulty: q.difficulty
            })),
            totalQuestions: generatedQuestions.length
        });

        res.status(201).json({
            success: true,
            data: quiz,
            message: `Quiz with ${quiz.questions.length} questions generated successfully`
        });
    } catch (error) {
        console.error('Generate quiz error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate quiz',
            statusCode: 500
        });
    }
};

// @desc Generate summary from document
// @route POST /api/ai/summary
// @access Private
export const generateSummary = async (req, res) => {
    try {
        const { documentId } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a documentId',
                statusCode: 400
            });
        }

        // Fetch document and verify ownership
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user.id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404
            });
        }

        if (document.status !== 'ready') {
            return res.status(400).json({
                success: false,
                error: `Document is not ready yet. Current status: ${document.status}`,
                statusCode: 400
            });
        }

        // Generate summary using Gemini
        const summary = await geminiService.generateSummary(document.extractedText);

        res.status(200).json({
            success: true,
            data: { summary, documentTitle: document.title },
            message: 'Summary generated successfully'
        });
    } catch (error) {
        console.error('Generate summary error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate summary',
            statusCode: 500
        });
    }
};

// @desc Chat with AI about document content
// @route POST /api/ai/chat
// @access Private
export const chat = async (req, res) => {
    try {
        const { documentId, message } = req.body;

        if (!documentId || !message) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a documentId and message',
                statusCode: 400
            });
        }

        // Fetch document and verify ownership
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user.id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404
            });
        }

        if (document.status !== 'ready') {
            return res.status(400).json({
                success: false,
                error: `Document is not ready yet. Current status: ${document.status}`,
                statusCode: 400
            });
        }

        // Find relevant chunks for the user's message
        const relevantChunks = findRelevantChunks(document.chunks, message, 5);

        // Get AI response using relevant context
        const aiResponse = await geminiService.chatWithContext(message, relevantChunks);

        // Save chat history (upsert — create or append)
        const relevantChunkIndices = relevantChunks.map(c => c.chunkIndex);

        await ChatHistory.findOneAndUpdate(
            { userId: req.user.id, documentId: document._id },
            {
                $push: {
                    messages: {
                        $each: [
                            {
                                role: 'user',
                                content: message,
                                timestamp: new Date()
                            },
                            {
                                role: 'ai',
                                content: aiResponse,
                                releventChunks: relevantChunkIndices,
                                timestamp: new Date()
                            }
                        ]
                    }
                }
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            data: {
                response: aiResponse,
                relevantChunks: relevantChunkIndices
            },
            message: 'Chat response generated successfully'
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to process chat request',
            statusCode: 500
        });
    }
};

// @desc Explain concept from document
// @route POST /api/ai/explain
// @access Private
export const explainConcept = async (req, res) => {
    try {
        const { documentId, concept } = req.body;

        if (!documentId || !concept) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a documentId and concept',
                statusCode: 400
            });
        }

        // Fetch document and verify ownership
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user.id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404
            });
        }

        if (document.status !== 'ready') {
            return res.status(400).json({
                success: false,
                error: `Document is not ready yet. Current status: ${document.status}`,
                statusCode: 400
            });
        }

        // Find relevant chunks for the concept
        const relevantChunks = findRelevantChunks(document.chunks, concept, 3);

        // Build context from relevant chunks
        const context = relevantChunks.length > 0
            ? relevantChunks.map(c => c.content).join('\n\n')
            : document.extractedText.substring(0, 10000);

        // Get explanation from Gemini
        const explanation = await geminiService.explainConcept(concept, context);

        res.status(200).json({
            success: true,
            data: {
                concept,
                explanation,
                documentTitle: document.title
            },
            message: 'Concept explained successfully'
        });
    } catch (error) {
        console.error('Explain concept error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to explain concept',
            statusCode: 500
        });
    }
};

// @desc Get chat history for a document
// @route GET /api/ai/chat-history/:documentId
// @access Private
export const getChatHistory = async (req, res) => {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a documentId',
                statusCode: 400
            });
        }

        const chatHistory = await ChatHistory.findOne({
            userId: req.user.id,
            documentId
        }).populate('documentId', 'title');

        res.status(200).json({
            success: true,
            data: chatHistory ? chatHistory.messages : [],
            message: 'Chat history fetched successfully'
        });
    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch chat history',
            statusCode: 500
        });
    }
};