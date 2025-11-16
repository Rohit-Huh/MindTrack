import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, trim: true, maxlength: 1000 },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'one-time'], default: 'daily' },
    target: { type: Number, default: 1 },
    progress: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const Habit = mongoose.models.Habit || mongoose.model('Habit', habitSchema);
export default Habit;