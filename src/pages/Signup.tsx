import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [orgName, setOrgName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const auth: any = useAuth();
    const { register, user } = auth;
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let token;
            if (user) {
                // User is already logged in, just get their token
                token = await user.getIdToken();
            } else {
                // 1. Create User in Firebase Auth
                const userCredential = await register(email, password);
                token = await userCredential.user.getIdToken();
            }

            // 2. Create Organization in Backend
            await api.post('/org/signup', { orgName }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // 3. Redirect to dashboard and force reload to fetch new org context
            window.location.href = '/';
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || err.message || 'Failed to create account');
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
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Start a Library</h1>
                {!user && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Or <Link to="/login" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '500' }}>login to existing account</Link>
                    </p>
                )}
            </div>

            <form onSubmit={handleSignup} style={{
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
                
                {user && (
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', borderRadius: '0.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
                        Creating a new organization as <strong>{user.email}</strong>
                    </div>
                )}

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Organization Name</label>
                    <input
                        type="text"
                        required
                        placeholder="Library / Organization Name"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    />
                </div>
                
                {!user && (
                    <>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Email address</label>
                            <input
                                type="email"
                                required
                                placeholder="Email address"
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
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                            />
                        </div>
                    </>
                )}

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
                        opacity: loading ? 0.7 : 1,
                        marginTop: user ? '1rem' : '0'
                    }}
                >
                    {loading ? 'Creating...' : (user ? 'Create Organization' : 'Create Account')}
                </button>
            </form>
        </div>
    );
};

export default Signup;
