import { Router } from "express";
import { body } from "express-validator";
import { createMood, getMoods, updateMood, deleteMood, getMood } from '../controllers/moodController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post(
    '/',
    protect,
    [
        body('mood').isString().isLength({ min: 1 }).withMessage('Mood required'),
        body('intensity').optional().isInt({ min: 1, max: 10 }),
        body('note').optional().isString().isLength({ max: 700 }),
        body('date').optional().isISO8601().toDate(),
    ],
    createMood
);

router.get('/', protect, getMoods);
router.get('/:id', protect, getMood);
router.put('/:id', protect, updateMood);
router.delete('/:id', protect, deleteMood);

export default router;