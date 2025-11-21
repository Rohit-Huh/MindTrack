import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function AddHabit() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        description: '',
        frequency: 'daily',
        target: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await API.post('/habits', {
                title: form.title,
                description: form.description,
                frequency: form.frequency,
                target: Number(form.target)
            });
            if (res.data?.success) navigate('/habits');
            else setError(res.data?.msg || 'Failed to add');
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.msg || 'Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 24, maxWidth: 560 }}>
            <h2>Add Habit</h2>
            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
            <form onSubmit={submit}>
                <div style={{ marginBottom: 8 }}>
                    <label>Title</label><br />
                    <input name="title" value={form.title} onChange={handle} required style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Description</label><br />
                    <textarea name="description" value={form.description} onChange={handle} rows="3" style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Frequency</label><br />
                    <select name="frequency" value={form.frequency} onChange={handle}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="one-time">One-time</option>
                    </select>
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Target (times per period)</label><br />
                    <input name="target" type="number" min="1" value={form.target} onChange={handle} />
                </div>

                <div>
                    <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Habit'}</button>
                    <Link to="/habits"><button type="button" style={{ marginLeft: 8 }}>Cancel</button></Link>
                </div>
            </form>
        </div>
    );
}
