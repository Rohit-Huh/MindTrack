import React, { useState } from "react";
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function AddMood() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        mood: '',
        intensity: '',
        note: '',
        date: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!form.mood) return setError('Please enter mood name');
        setLoading(true);
        try {
            const payload = {
                mood: form.mood,
                intensity: form.intensity ? Number(form.intensity) : undefined,
                note: form.note,
                date: form.date || undefined
            };
            const res = await API.post('/moods', payload);
            if (res.data?.success) {
                navigate('/moods');
            } else {
                setError(res.data?.msg || 'Failed to add');
            }
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.msg || 'Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 24, maxWidth: 560 }}>
            <h2>Add Mood</h2>
            <form onSubmit={submit}>
                <div style={{ marginBottom: 8 }}>
                    <label>Mood</label><br />
                    <input name="mood" value={form.mood} onChange={handle} required style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Intensity (1-10)</label><br />
                    <input name="intensity" value={form.intensity} onChange={handle} type="number" min='1' max="10" style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Note</label><br />
                    <textarea name="note" value={form.note} onChange={handle} rows="3" style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Date (optional)</label><br />
                    <input name="date" value={form.date} onChange={handle} type="datetime-local" style={{ width: '100%' }} />
                </div>

                {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                <div>
                    <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Mood'}</button>
                    <button type="button" onClick={() => navigate('/moods')} style={{ marginLeft: 8 }}>Cancel</button>
                </div>
            </form>
        </div>
    );
}