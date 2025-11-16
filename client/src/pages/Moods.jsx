import React, { useEffect, useState } from "react";
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function Moods() {
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMoods = async () => {
        try {
            setLoading(true);
            const res = await API.get('/moods');
            setMoods(res.data.moods || []);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.msg || 'Failed to load moods');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMoods();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this mood?')) return;
        try {
            const res = await API.delete(`/moods/${id}`);
            if (res.data?.success) {
                setMoods(prev => prev.filter(m => m._id !== id));
            } else {
                alert(res.data?.msg || 'Delete failed');
            }
        } catch (err) {
            console.error('Delete error:', err);
            const msg = err?.response?.data?.msg || err?.response?.data || 'Delete failed';
            alert(msg);
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <h2>Moods</h2>
            <div style={{ marginBottom: 12 }}>
                <Link to='/moods/add'>+Add Mood</Link> | <Link to="/dashboard">Back</Link>
            </div>

            {loading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {!loading && moods.length === 0 && <div>No moods yet. Add one.</div>}

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {moods.map(m => (
                    <li key={m._id} style={{ background: '#111', color: '#fff', padding: 12, marginBottom: 8, baorderRadius: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div><strong>{m.mood}</strong> {m.intensity ? `-${m.intensity}/10` : ''}</div>
                                <div style={{ opacity: 0.8 }}>{m.note}</div>
                                <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(m.date).toLocaleString()}</div>
                            </div>
                            <div>
                                <button onClick={() => handleDelete(m._id)} style={{ marginLeft: 8 }}>Delete</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}