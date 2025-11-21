import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function Habits() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHabits = async () => {
        try {
            setLoading(true);
            const res = await API.get('/habits');
            setHabits(res.data.habits || []);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.msg || 'Failed to load habits');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this habit?')) return;
        try {
            const res = await API.delete(`/habits/${id}`);
            if (res.data?.success) setHabits(prev => prev.filter(h => h._id !== id));
            else alert(res.data?.msg || 'Delete failed');
        } catch (err) {
            console.error('Delete habit error:', err);
            alert(err?.response?.data?.msg || 'Delete failed');
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <h2>Habits</h2>
            <div style={{ marginBottom: 12 }}>
                <Link to="/habits/add">+ Add Habit</Link> | <Link to="/dashboard">Back</Link>
            </div>

            {loading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {!loading && habits.length === 0 && <div>No habits yet. Add one.</div>}

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {habits.map(h => (
                    <li key={h._id} style={{ background: '#111', color: '#fff', padding: 12, marginBottom: 8, borderRadius: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div><strong>{h.title}</strong> <span style={{ opacity: 0.8 }}>({h.frequency})</span></div>
                                <div style={{ opacity: 0.8 }}>{h.description}</div>
                                <div style={{ fontSize: 12, opacity: 0.7 }}>Target: {h.target} — Progress: {h.progress}</div>
                            </div>
                            <div>
                                <Link to={`/habits/edit/${h._id}`} style={{ marginRight: 8 }}><button>Edit</button></Link>
                                <button onClick={() => handleDelete(h._id)}>Delete</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
