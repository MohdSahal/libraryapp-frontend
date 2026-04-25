import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

const Join = () => {
    const { token } = useParams<{ token: string }>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const auth: any = useAuth();
    const register = auth.register;
    const navigate = useNavigate();

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Create User in Firebase Auth
            const userCredential = await register(email, password);
            const authToken = await userCredential.user.getIdToken();

            // 2. Accept Invite in Backend
            await api.post('/org/accept-invite', { token }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            // 3. Redirect to dashboard
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || err.message || 'Failed to join organization');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'var(--bg-primary)',
            padding: '1rem'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Accept Invitation</h1>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Create an account to join the organization
                </p>
            </div>

            <form onSubmit={handleJoin} style={{
                background: 'var(--bg-secondary)',
                padding: '2.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px',
                border: '1px solid var(--border-color)'
            }}>
                {error && (
                    <div style={{
                        background: '#fee2e2',
                        color: '#991b1b',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                        fontSize: '0.875rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Email address</label>
                    <input
                        type="email"
                        required
                        placeholder="Email address (must match invite)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Password</label>
                    <input
                        type="password"
                        required
                        placeholder="Create Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#4f46e5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        transition: 'background 0.2s',
                        marginBottom: '1rem',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Joining...' : 'Join Organization'}
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <Link to="/login" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold' }}>
                        Already have an account? Login instead
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Join;
