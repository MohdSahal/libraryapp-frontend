import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Download, FileText } from 'lucide-react';
import Loader from '../components/Loader';
import { formatDateLocal } from '../lib/dateUtils';
import '../styles/Pages.css';

const Reports = () => {
    const getLocalDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [activeTab, setActiveTab] = useState('issued');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [dateRange, setDateRange] = useState({
        from: getLocalDateString(new Date(new Date().setDate(new Date().getDate() - 30))),
        to: getLocalDateString(new Date())
    });

    const fetchData = async () => {
        try {
            const [booksRes, usersRes] = await Promise.all([
                api.get('/books'),
                api.get('/users')
            ]);
            setBooks(booksRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error('Error fetching filter data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchReport();
    }, [activeTab, dateRange, selectedBookId, selectedUserId]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const endpoint = `/reports/${activeTab}`;
            const params: any = {};
            if (activeTab !== 'top-books' && activeTab !== 'overdue') {
                params.from = dateRange.from;
                params.to = dateRange.to;
            }
            if (selectedBookId) params.bookId = selectedBookId;
            if (selectedUserId) params.userId = selectedUserId;

            const response = await api.get(endpoint, { params });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching report:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [activeTab, dateRange]);

    const downloadCSV = () => {
        if (!data.length) return;

        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(','));
        const csvContent = [headers, ...rows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeTab}-report.csv`;
        a.click();
    };



    const tabs = [
        { id: 'issued', label: 'Issued Books' },
        { id: 'returned', label: 'Returned Books' },
        { id: 'overdue', label: 'Overdue Books' },
        { id: 'top-books', label: 'Top Borrowed Books' },
    ];

    return (
        <div className="page-container">
            <div className="responsive-toolbar">
                <h1 className="page-title">Reports</h1>
                <button onClick={downloadCSV} disabled={!data.length} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#10b981', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '12px', cursor: 'pointer', opacity: !data.length ? 0.5 : 1, fontWeight: 600 }}>
                    <Download size={20} /> Export CSV
                </button>
            </div>

            <div className="responsive-filter-bar" style={{ borderBottom: '1px solid var(--border-color)', overflowX: 'auto', marginBottom: '1.5rem' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            background: 'none',
                            borderBottom: activeTab === tab.id ? '3px solid var(--primary-color)' : '3px solid transparent',
                            color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                            fontWeight: activeTab === tab.id ? '700' : '500',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab !== 'top-books' && (
                <div className="responsive-filter-bar glass-effect" style={{ marginTop: '1rem', padding: '1.25rem', borderRadius: '1rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    {(activeTab === 'issued' || activeTab === 'returned') && (
                        <>
                            <div className="form-group-premium" style={{ marginBottom: 0 }}>
                                <label className="form-label-premium">From</label>
                                <input
                                    type="date"
                                    className="form-input-premium"
                                    value={dateRange.from}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                />
                            </div>
                            <div className="form-group-premium" style={{ marginBottom: 0 }}>
                                <label className="form-label-premium">To</label>
                                <input
                                    type="date"
                                    className="form-input-premium"
                                    value={dateRange.to}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group-premium" style={{ marginBottom: 0, minWidth: '200px' }}>
                        <label className="form-label-premium">Filter by Book</label>
                        <select
                            className="form-input-premium"
                            value={selectedBookId}
                            onChange={(e) => setSelectedBookId(e.target.value)}
                        >
                            <option value="">All Books</option>
                            {books.map((book: any) => (
                                <option key={book.id} value={book.id}>{book.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group-premium" style={{ marginBottom: 0, minWidth: '200px' }}>
                        <label className="form-label-premium">Filter by User</label>
                        <select
                            className="form-input-premium"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                        >
                            <option value="">All Users</option>
                            {users.map((user: any) => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>

                    <button onClick={fetchReport} className="btn-premium-primary" style={{ height: '42px', padding: '0 1.5rem' }}>Apply Filters</button>
                </div>
            )}

            {loading ? (
                <Loader />
            ) : (
                <div className="responsive-table-wrapper glass-effect" style={{ marginTop: '2rem', borderRadius: '1.25rem', padding: '1.5rem' }}>
                    {data.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                            <thead>
                                <tr>
                                    {Object.keys(data[0]).filter(k => !k.toLowerCase().includes('id')).map(key => (
                                        <th key={key} style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row: any, i) => (
                                    <tr key={i} style={{ borderTop: '1px solid var(--border-color)' }} className="hover:bg-primary transition-colors">
                                        {Object.entries(row).filter(([k]) => !k.toLowerCase().includes('id')).map(([key, val]: [string, any], j) => (
                                            <td key={j} style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: key.toLowerCase().includes('name') ? '600' : '400' }}>
                                                {key.toLowerCase().includes('date') ? formatDateLocal(String(val)) : (typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val))}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <FileText size={64} style={{ margin: '0 auto', marginBottom: '1.5rem', opacity: 0.2 }} />
                            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No reports found for this period.</p>
                            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.7 }}>Try adjusting your filters or selecting a different tab.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Reports;
