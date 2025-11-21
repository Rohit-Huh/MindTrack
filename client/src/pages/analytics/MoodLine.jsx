import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import API from '../../services/api';
import ChartSkeleton from '../../components/ChartSkeleton';
import ChartSpinner from '../../components/ChartSpinner';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function MoodLine({ from, to, groupBy = 'day' }) {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                setLoading(true);
                setChartData(null);
                const q = [];
                if (from) q.push(`from=${encodeURIComponent(from)}`);
                if (to) q.push(`to=${encodeURIComponent(to)}`);
                if (groupBy) q.push(`groupBy=${encodeURIComponent(groupBy)}`);
                const qs = q.length ? `?${q.join('&')}` : '';
                const res = await API.get(`/analytics/moods${qs}`);
                if (!mounted) return;
                const data = res.data?.data || [];
                const labels = data.map(item => item.period);
                const values = data.map(item => (item.avgIntensity != null ? item.avgIntensity : null));

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Avg intensity',
                            data: values,
                            fill: false,
                            tension: 0.2,
                            borderColor: 'rgba(75,192,192,1)',
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            pointRadius: 3
                        }
                    ]
                });
            } catch (err) {
                console.error('Load analytics moods failed', err);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, [from, to, groupBy]);

    if (loading) return <ChartSkeleton height={320} />;
    if (!chartData) return <div style={{ paddingL: 12 }}><ChartSpinner /></div>;

    return (
        <div style={{ height: 320 }}>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: true } },
                    scales: {
                        y: { min: 0, max: 10, title: { display: true, text: 'Intensity (1-10)' } },
                        x: { title: { display: true, text: groupBy === 'week' ? 'Week' : 'Date' } }
                    }
                }}
            />
        </div>
    );
}
