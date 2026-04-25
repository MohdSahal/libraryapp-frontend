import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Plus, CheckCircle, FileText, Download, Share2, FileSpreadsheet } from 'lucide-react';
import IssueBookForm from '../components/IssueBookForm';
import { formatDateLocal } from '../lib/dateUtils';
import { exportToExcel, exportToPDF } from '../lib/exportUtils';
import Loader from '../components/Loader';
import '../styles/Pages.css';

const Transactions = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('All');
    const [showExportMenu, setShowExportMenu] = useState(false);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            let endpoint = '/transactions';
            if (filter === 'Overdue') {
                endpoint = '/transactions/overdue';
            }

            const response = await api.get(endpoint, {
                params: filter !== 'All' && filter !== 'Overdue' ? { status: filter } : {}
            });
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filter]);

    const handleReturn = async (id: string) => {
        if (window.confirm('Mark this book as returned?')) {
            try {
                await api.post(`/transactions/return/${id}`);
                fetchTransactions();
            } catch (error) {
                console.error('Error returning book:', error);
                alert('Failed to return book');
            }
        }
    };

    const handleExportExcel = () => {
        const data = transactions.map(t => ({
            Book: t.bookName,
            User: t.userName,
            'Issue Date': formatDateLocal(t.issueDate),
            'Due Date': formatDateLocal(t.expectedReturnDate),
            Status: t.status
        }));
        exportToExcel(data, `Transactions_List_${new Date().getTime()}`);
    };

    const handleExportPDF = () => {
        const headers = ['Book', 'User', 'Issue Date', 'Due Date', 'Status'];
        const data = transactions.map(t => [
            t.bookName,
            t.userName,
            formatDateLocal(t.issueDate),
            formatDateLocal(t.expectedReturnDate),
            t.status
        ]);
        exportToPDF(headers, data, 'Transactions', `Transactions_List_${new Date().getTime()}`);
    };

    return (
        <div className="page-container">
            <div className="responsive-toolbar">
                <h1 className="page-title">Transactions</h1>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="btn-premium-ghost"
                            title="Export Data"
                            style={{ padding: '8px' }}
                        >
                            <Share2 size={20} />
                        </button>
                        {showExportMenu && (
                            <div className="premium-dropdown" style={{
                                position: 'absolute',
                                top: '110%',
                                right: 0,
                                minWidth: '150px',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                zIndex: 100,
                                overflow: 'hidden'
                            }}>
                                <button onClick={() => { handleExportExcel(); setShowExportMenu(false); }} style={{ width: '100%', padding: '0.75rem 1rem', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                                    <FileSpreadsheet size={16} color="#1D6F42" /> Excel
                                </button>
                                <button onClick={() => { handleExportPDF(); setShowExportMenu(false); }} style={{ width: '100%', padding: '0.75rem 1rem', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' }}>
                                    <FileText size={16} color="#E44044" /> PDF
                                </button>
                            </div>
                        )}
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="primary-btn">
                        <Plus size={20} /> <span className="hide-mobile">Issue Book</span>
                    </button>
                </div>
            </div>

            <div className="responsive-filter-bar">
                {['All', 'Issued', 'Returned', 'Overdue'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: '1px solid var(--border-color)',
                            background: filter === status ? 'var(--primary-color)' : 'var(--bg-secondary)',
                            color: filter === status ? 'white' : 'var(--text-primary)',
                            cursor: 'pointer'
                        }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <Loader />
            ) : (
                <div className="responsive-table-wrapper">
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                        <thead style={{ background: 'var(--bg-primary)' }}>
                            <tr>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Book</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>User</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Issue Date</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Due Date</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => {
                                const isOverdue = t.status === 'Issued' && new Date(t.expectedReturnDate) < new Date();
                                return (
                                    <tr key={t.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: '600' }}>{t.bookName}</td>
                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t.userName}</td>
                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{formatDateLocal(t.issueDate)}</td>
                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: isOverdue ? '#ef4444' : 'var(--text-secondary)', fontWeight: isOverdue ? 'bold' : 'normal' }}>
                                            {formatDateLocal(t.expectedReturnDate)}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '2px 8px',
                                                borderRadius: '10px',
                                                background: t.status === 'Returned' ? '#d1fae5' : isOverdue ? '#fee2e2' : '#fef3c7',
                                                color: t.status === 'Returned' ? '#065f46' : isOverdue ? '#991b1b' : '#92400e'
                                            }}>
                                                {t.status === 'Returned' ? 'Returned' : isOverdue ? 'Overdue' : 'Issued'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                            {t.status === 'Issued' && (
                                                <button onClick={() => handleReturn(t.id)} style={{ color: '#4f46e5', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', width: '100%' }}>
                                                    <CheckCircle size={16} /> Return
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <IssueBookForm
                    onClose={() => setIsModalOpen(false)}
                    onSave={fetchTransactions}
                />
            )}
        </div>
    );
};

export default Transactions;
