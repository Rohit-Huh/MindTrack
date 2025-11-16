import { Router } from "express";
import { body } from "express-validator";
import { register, login } from '../controllers/authController.js';

const router = Router();

router.post(
    '/register',
    [
        body('name').isLength({ min: 2 }).withMessage('Name musy be at least 2 characters'),
        body('email').isEmail().withMessage('Valid email required'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    ],
    register
);
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid Email Required'),
        body('password').exists().withMessage('Password is required'),
    ],
    login
);

export default router;