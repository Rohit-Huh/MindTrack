import Mood from '../models/Mood.js';
import { validationResult } from 'express-validator';

export async function createMood(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

        const { mood, intensity, note, date } = req.body;
        const newMood = await Mood.create({
            user: req.user._id, mood, intensity, note, date: date ? new Date(date) : undefined,
        });
        res.status(201).json({ success: true, mood: newMood });
    } catch (err) {
        console.error('createMood errors:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}

export async function getMoods(req, res) {
    try {
        const { from, to, limit = 100 } = req.query;
        const q = { user: req.user._id };
        if (from || to) q.date = {};
        if (from) q.date.$gte = new Date(from);
        if (to) q.date.$lte = new Date(to);

        const moods = await Mood.find(q).sort({ date: -1 }).limit(Number(limit));
        res.json({ success: true, moods });
    } catch (err) {
        console.error('getMoods error:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}

export async function getMood(req, res) {
    try {
        const { id } = req.params;
        const mood = await Mood.findOne({ _id: id, user: req.user._id });
        if (!mood) return res.status(404).json({ success: false, msg: 'Mood not found' });
        res.json({ success: true, mood });
    } catch (err) {
        console.error('getMood error:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}

export async function updateMood(req, res) {
    try {
        const { id } = req.params;
        const mood = await Mood.findOne({ _id: id, user: req.user._id });
        if (!mood) return res.status(404).json({ success: false, msg: 'Mood not found' });

        const allowed = ['mood', 'intensity', 'note', 'date'];
        allowed.forEach(k => { if (k in req.body) mood[k] = req.body[k]; });
        await mood.save();
        res.json({ success: true, mood });
    } catch (err) {
        console.error('UpdateMood error:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}
export async function deleteMood(req, res) {
    try {
        const { id } = req.params;
        const result = await Mood.deleteOne({ _id: id, user: req.user._id });
        if (result.deletedCount === 0) return res.status(404).json({ success: false, msg: 'Mood not found' });
        res.json({ success: true, deletedCount: result.deletedCount });
    } catch (err) {
        console.error('deleteMood error:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}