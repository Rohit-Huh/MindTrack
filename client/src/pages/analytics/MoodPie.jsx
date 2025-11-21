import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import API from '../../services/api';
import ChartSpinner from '../../components/ChartSpinner';
import ChartSkeleton from '../../components/ChartSkeleton';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js';
ChartJS.register(Tooltip, Legend, ArcElement);

export default function MoodPie({ limit = 1000 }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                setLoading(true);
                setData(null);
                const res = await API.get(`/analytics/mood-distribution?limit=${Number(limit)}`);
                if (!mounted) return;
                const items = res.data?.data || [];
                const labels = items.map(i => i.mood);
                const values = items.map(i => i.count);
                const bg = ['#4caf50', '#ff6384', '#36a2eb', '#ffce56', '#9b59b6', '#e67e22', '#95a5a6'];
                setData({
                    labels,
                    datasets: [{ data: values, backgroundColor: bg.slice(0, labels.length) }]
                });
            } catch (err) {
                console.error('Load mood distribution failed', err);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, [limit]);

    if (loading) return <ChartSkeleton height={260} />;
    if (!data) return <div style={{ padding: 12 }}><ChartSpinner /></div>;

    return <div style={{ height: 240 }}><Pie data={data} /></div>;
}
