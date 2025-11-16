import { Router } from "express";
import authRouter from './auth.js';
import moodRouter from './moods.js';
import habitRouter from './habits.js';

const router = Router();

router.get('/ping', (req, res) => {
    res.json({ success: true, msg: "ping" });
});

router.use('/auth', authRouter);
router.use('/moods', moodRouter);
router.use('/habits', habitRouter);

export default router;