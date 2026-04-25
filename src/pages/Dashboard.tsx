import React, { useEffect, useState } from 'react';
import { Book, Users, ArrowRightLeft, AlertCircle } from 'lucide-react';
import api from '../lib/axios';
import Loader from '../components/Loader';
import '../styles/Pages.css';

const Dashboard = () => {
    const [stats, setStats] = useState<{
        totalBooks: number;
        availableBooks: number;
        totalUsers: number;
        issuedBooks: number;
        overdueBooks: number;
        topBooks: { name: string; count: number }[];
        topUsers: { name: string; count: number }[];
    }>({
        totalBooks: 0,
        availableBooks: 0,
        totalUsers: 0,
        issuedBooks: 0,
        overdueBooks: 0,
        topBooks: [],
        topUsers: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/dashboard/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setError('Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
        <div className="stat-card glass-effect">
            <div className="stat-icon-wrapper" style={{ background: color }}>
                {icon}
            </div>
            <div>
                <p className="stat-label">{title}</p>
                <p className="stat-value">{value}</p>
            </div>
        </div>
    );

    if (loading) return <Loader />;

    return (
        <div className="page-container" style={{ position: 'relative' }}>
            {/* Decorative Background Element */}
            <div style={{
                position: 'fixed',
                top: '10%',
                right: '10%',
                width: '300px',
                height: '300px',
                background: 'var(--primary-color)',
                filter: 'blur(100px)',
                opacity: '0.1',
                zIndex: -1,
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />
            <div className="responsive-toolbar">
                <h1 className="page-title">Dashboard Overview</h1>
            </div>

            {error && (
                <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className="stats-grid">
                <StatCard
                    title="Total Books"
                    value={stats.totalBooks}
                    icon={<Book size={24} />}
                    color="#4f46e5"
                />
                <StatCard
                    title="Available"
                    value={stats.availableBooks}
                    icon={<Book size={24} />}
                    color="#10b981"
                />
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<Users size={24} />}
                    color="#6366f1"
                />
                <StatCard
                    title="Currently Issued"
                    value={stats.issuedBooks}
                    icon={<ArrowRightLeft size={24} />}
                    color="#f59e0b"
                />
                <StatCard
                    title="Overdue Books"
                    value={stats.overdueBooks}
                    icon={<AlertCircle size={24} />}
                    color="#ef4444"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
                {/* Most Read Books */}
                <div className="glass-effect p-6 rounded-2xl border-color">
                    <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
                        <Book size={20} className="text-primary-color" />
                        Most Readable Books
                    </h3>
                    <div className="space-y-3">
                        {stats.topBooks.length > 0 ? stats.topBooks.map((book, bIdx) => (
                            <div key={bIdx} className="flex justify-between items-center p-3 rounded-xl bg-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <span className="text-primary font-medium">{book.name}</span>
                                <span className="text-secondary text-sm font-semibold px-2 py-1 rounded-lg bg-white dark:bg-gray-700 shadow-sm">{book.count} times</span>
                            </div>
                        )) : (
                            <p className="text-secondary text-sm italic">No transaction data yet</p>
                        )}
                    </div>
                </div>

                {/* Most Active Users */}
                <div className="glass-effect p-6 rounded-2xl border-color">
                    <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
                        <Users size={20} className="text-primary-color" />
                        Most Active Users
                    </h3>
                    <div className="space-y-3">
                        {stats.topUsers.length > 0 ? stats.topUsers.map((user, uIdx) => (
                            <div key={uIdx} className="flex justify-between items-center p-3 rounded-xl bg-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <span className="text-primary font-medium">{user.name}</span>
                                <span className="text-secondary text-sm font-semibold px-2 py-1 rounded-lg bg-white dark:bg-gray-700 shadow-sm">{user.count} issues</span>
                            </div>
                        )) : (
                            <p className="text-secondary text-sm italic">No user activity yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
