import Habit from '../models/Habit.js';
import { validationResult } from 'express-validator';

export async function createHabit(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

        const { title, description, frequency, target, startDate } = req.body;
        const habit = await Habit.create({
            user: req.user._id, title, description, frequency,
            target: target || 1,
            startDate: startDate ? new Date(startDate) : undefined,
        });
        res.status(201).json({ success: true, habit });
    } catch (err) {
        console.error('createHabit error:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}

export async function getHabits(req, res) {
    try {
        const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, habits });
    } catch (err) {
        console.error('getHabits error:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}

export async function updateHabit(req, res) {
    try {
        const { id } = req.params;
        const habit = await Habit.findOne({ _id: id, user: req.user._id });
        if (!habit) return res.status(404).json({ succes: false, msg: 'Habit not found' });

        const updatable = ['title', 'description', 'frequency', 'target', 'progress', 'active'];
        updatable.forEach(k => { if (k in req.body) habit[k] = req.body[k]; });
        await habit.save();
        res.json({ success: true, habit });
    } catch (err) {
        console.error('updateHabit error:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}

export async function deleteHabit(req, res) {
    try {
        const { id } = req.params;
        const result = await Habit.deleteOne({ _id: id, user: req.user._id });
        if (result.deletedCount === 0) return res.status(404).json({ success: false, msg: 'Habit not found' });
        res.json({ success: true, deletedCount: result.deletedCount });
    } catch (err) {
        console.error('deleteHabit error:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}