import { Router } from "express";
import { body } from "express-validator";
import { createHabit, getHabits, updateHabit, deleteHabit } from '../controllers/habitController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post(
    '/',
    protect,
    [
        body('title').isLength({ min: 2 }).withMessage('Title required'),
        body('description').optional().isString().isLength({ max: 1000 }),
        body('frequency').optional().isIn(['daily', 'weekly', 'monthly', 'one-time']),
        body('target').optional().isInt({ min: 1 }),
    ],
    createHabit
);

router.get('/', protect, getHabits);
router.put('/:id', protect, updateHabit);
router.delete('/:id', protect, deleteHabit);

export default router;