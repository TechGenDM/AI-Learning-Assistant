import express from 'express';
import {
    getDashboard,
} from '../controllers/progressController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', getDashboard);

export default router;