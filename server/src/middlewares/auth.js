import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

export async function protect(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return res.status(401).json({ success: false, msg: 'No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ success: false, msg: 'Invalid token user' });
        req.user = user;
        next();
    } catch (err) {
        console.error('Auth middleware error: ', err);
        return res.status(401).json({ success: false, msg: 'Token invalid or expired' });
    }
}