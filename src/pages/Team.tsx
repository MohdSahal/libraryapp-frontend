import React, { useState, useEffect } from 'react';
import { Mail, UserPlus, Shield, User } from 'lucide-react';
import api from '../lib/axios';

const Team = () => {
    const [team, setTeam] = useState<any[]>([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [inviteLoading, setInviteLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fetchTeam = async () => {
        setLoading(true);
        try {
            const res = await api.get('/org/team');
            setTeam(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviteLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await api.post('/org/invite', { email: inviteEmail });
            setMessage(res.data.message + (res.data.previewUrl ? ` (Preview: ${res.data.previewUrl})` : ''));
            setInviteEmail('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send invite');
        } finally {
            setInviteLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Team Management</h1>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                
                {/* Invite Form */}
                <div style={{
                    flex: '1 1 300px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid var(--border-color)',
                    padding: '1.5rem',
                    height: 'fit-content'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserPlus size={20} color="#4f46e5" />
                        Invite Member
                    </h2>
                    
                    <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {message && <div style={{ padding: '0.75rem', background: '#dcfce7', color: '#166534', fontSize: '0.875rem', borderRadius: '0.5rem', wordBreak: 'break-all' }}>{message}</div>}
                        {error && <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#991b1b', fontSize: '0.875rem', borderRadius: '0.5rem' }}>{error}</div>}
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', color: 'var(--text-primary)', outline: 'none' }}
                                placeholder="colleague@example.com"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={inviteLoading}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                background: '#4f46e5', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: inviteLoading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', opacity: inviteLoading ? 0.7 : 1
                            }}
                        >
                            <Mail size={18} />
                            {inviteLoading ? 'Sending...' : 'Send Invite'}
                        </button>
                    </form>
                </div>

                {/* Team List */}
                <div style={{
                    flex: '2 1 500px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Active Members</h2>
                    </div>
                    
                    {loading ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {team.map((member) => (
                                <li key={member.uid} style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {member.role === 'owner' ? <Shield size={20} /> : <User size={20} />}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>{member.email}</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Joined: {new Date(member.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500',
                                        background: member.role === 'owner' ? 'rgba(147, 51, 234, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                        color: member.role === 'owner' ? '#9333ea' : '#3b82f6'
                                    }}>
                                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                    </span>
                                </li>
                            ))}
                            {team.length === 0 && (
                                <li style={{ padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No team members found.</li>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Team;
