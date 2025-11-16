import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String, required: true },
    intensity: { type: Number, min: 1, max: 10 },
    note: { type: String, trim: true, maxlength: 700 },
    date: { type: Date, default: () => new Date() },
    createdAt: { type: Date, default: Date.now },
});

const Mood = mongoose.models.Mood || mongoose.model('Mood', moodSchema);
export default Mood;