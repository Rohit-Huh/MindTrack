import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

export async function register(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, msg: 'Email Already Registered' });

        const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
        const hashed = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashed });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email }, token });
    } catch (err) {
        console.error('Registeration error:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}

export async function login(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array() });

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, msg: 'Invalid Credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ success: false, msg: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({ success: true, user: { id: user._id, name: user.name, email: user.email }, token });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, msg: 'Server Error!!' });
    }
}