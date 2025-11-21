import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function EditHabit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: '', description: '', frequency: 'daily', target: 1 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const res = await API.get(`/habits/${id}`);
                if (!res.data?.success) return setError(res.data?.msg || 'Failed to load');
                const h = res.data.habit;
                setForm({
                    title: h.title || '',
                    description: h.description || '',
                    frequency: h.frequency || 'daily',
                    target: h.target || 1
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
        setSaving(true);
        setError(null);
        try {
            const res = await API.put(`/habits/${id}`, {
                title: form.title,
                description: form.description,
                frequency: form.frequency,
                target: Number(form.target)
            });
            if (res.data?.success) navigate('/habits');
            else setError(res.data?.msg || 'Update failed');
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.msg || 'Server error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

    return (
        <div style={{ padding: 24, maxWidth: 640 }}>
            <h2>Edit Habit</h2>
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
                    <label>Target</label><br />
                    <input name="target" type="number" min="1" value={form.target} onChange={handle} />
                </div>

                <div>
                    <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update Habit'}</button>
                    <Link to="/habits"><button type="button" style={{ marginLeft: 8 }}>Cancel</button></Link>
                </div>
            </form>
        </div>
    );
}
