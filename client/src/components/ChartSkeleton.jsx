import React from 'react';
import './chart-loading.css';

export default function ChartSkeleton({ height = 220 }) {
    return (
        <div className="skeleton-card" style={{ height }}>
            <div className="skeleton-header" />
            <div className="skeleton-body" />
        </div>
    );
}
