import React, { useEffect, useState } from "react";
import API from '../services/api';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function EditMood() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        mood: '',
        intensity: '',
        note: '',
        date: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const res = await API.get(`/moods/${id}`);
                if (!res.data?.success) {
                    setError(res.data?.msg || 'Failed to load mood');
                    return;
                }
                const m = res.data.mood;
                setForm({
                    mood: m.mood || '',
                    intensity: m.intensity || '',
                    note: m.note || '',
                    date: m.date ? new Date(m.date).toISOString().slice(0, 16) : ''
                });
            } catch (err) {
                console.error(err);
                setError(err?.response?.data?.msg || 'Server error');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        setSaving(true);
        try {
            const payload = {
                mood: form.mood,
                intensity: form.intensity ? Number(form.intensity) : undefined,
                note: form.note,
                date: form.date ? new Date(form.date).toISOString() : undefined,
            };
            const res = await API.put(`/moods/${id}`, payload);
            if (res.data?.success) {
                navigate('/moods');
            } else {
                setError(res.data?.msg || 'Update failed');
            }
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.msg || 'Server error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: 24 }}>Loading mood...</div>;

    return (
        <div style={{ padding: 24, maxWidth: 640 }}>
            <h2>Edit Mood</h2>
            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
            <form onSubmit={submit}>
                <div style={{ marginBottom: 8 }}>
                    <label>Mood</label><br />
                    <input name="mood" value={form.mood} onChange={handle} required style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Intensity (1-10)</label><br />
                    <input name="intensity" value={form.intensity} onChange={handle} type="number" min="1" max="10" style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Note</label><br />
                    <input name="note" value={form.note} onChange={handle} rows="3" style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Date</label><br />
                    <input name="date" value={form.date} onChange={handle} type="datetime-local" style={{ width: '100%' }} />
                </div>
                <div>
                    <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update Mood'}</button>
                    <Link to="/moods"><button type="button" style={{ marginLeft: 8 }}>Cancel</button></Link>
                </div>
            </form>
        </div>
    );
}