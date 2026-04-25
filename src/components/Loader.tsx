import React from 'react';

const Loader = ({ size = 40, color = 'var(--primary-color)' }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <div style={{
                width: size,
                height: size,
                border: `4px solid ${color}22`,
                borderTop: `4px solid ${color}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loader;
