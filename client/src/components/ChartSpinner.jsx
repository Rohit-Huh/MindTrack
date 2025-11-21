import React from 'react';
import './chart-loading.css';

export default function ChartSpinner({ size = 48 }) {
    return (
        <div className="ctn-spinner" style={{ height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner" style={{ width: size, height: size }} />
        </div>
    );
}
