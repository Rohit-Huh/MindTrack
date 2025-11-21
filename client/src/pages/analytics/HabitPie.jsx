import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import API from '../../services/api';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartSpinner from '../../components/ChartSpinner';
import ChartSkeleton from '../../components/ChartSkeleton';
ChartJS.register(Tooltip, Legend, ArcElement);

export default function HabitPie() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                setLoading(true);
                setData(null);
                const res = await API.get('/analytics/habit-frequency');
                if (!mounted) return;
                const items = res.data?.data || [];
                const labels = items.map(i => i.frequency);
                const values = items.map(i => i.count);
                setData({
                    labels,
                    datasets: [{ data: values, backgroundColor: ['#36a2eb', '#ff6384', '#ffce56'] }]
                });
            } catch (err) {
                console.error('Load habit frequency failed', err);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false };
    }, []);

    if (loading) return <ChartSkeleton height={220} />
    if (!data) return <div style={{ padding: 12 }}><ChartSpinner /></div>;
    return <div style={{ height: 220 }}><Pie data={data} /></div>;
}
