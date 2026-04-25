import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Plus, Edit, Trash2, Search, FileDown, FileText, Download, Share2, FileSpreadsheet, User } from 'lucide-react';
import UserForm from '../components/UserForm';
import ImportModal from '../components/ImportModal';
import Loader from '../components/Loader';
import { exportToExcel, exportToPDF } from '../lib/exportUtils';
import '../styles/Pages.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showExportMenu, setShowExportMenu] = useState(false);

    const fetchUsers = async () => {
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;

            const response = await api.get('/users', { params });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [searchTerm]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleExportExcel = () => {
        const data = users.map(u => ({
            Name: u.name,
            Email: u.email,
            Phone: u.phone || 'N/A'
        }));
        exportToExcel(data, `Users_List_${new Date().getTime()}`);
    };

    const handleExportPDF = () => {
        const headers = ['Name', 'Email', 'Phone'];
        const data = users.map(u => [
            u.name,
            u.email,
            u.phone || 'N/A'
        ]);
        exportToPDF(headers, data, 'Users', `Users_List_${new Date().getTime()}`);
    };

    return (
        <div className="page-container">
            <div className="responsive-toolbar">
                <h1 className="page-title">Users</h1>
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
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="btn-premium-ghost"
                        title="Import Data"
                        style={{ padding: '8px' }}
                    >
                        <FileDown size={20} />
                    </button>
                    <button onClick={handleAdd} className="primary-btn" style={{ marginLeft: '0.25rem' }}>
                        <Plus size={20} /> <span className="hide-mobile">Add User</span>
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <div className="responsive-table-wrapper">
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                        <thead style={{ background: 'var(--bg-primary)' }}>
                            <tr>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Name</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Email</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Phone</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                background: 'var(--bg-primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                border: '1px solid var(--border-color)',
                                                flexShrink: 0
                                            }}>
                                                {user.imageUrl ? (
                                                    <img src={user.imageUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <User size={16} color="var(--text-secondary)" />
                                                )}
                                            </div>
                                            <span style={{ fontWeight: '500' }}>{user.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{user.phone}</td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button onClick={() => handleEdit(user)} style={{ color: '#4f46e5', border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(user.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <UserForm
                    user={selectedUser}
                    onClose={() => setIsModalOpen(false)}
                    onSave={fetchUsers}
                />
            )}

            {isImportModalOpen && (
                <ImportModal
                    type="users"
                    onClose={() => setIsImportModalOpen(false)}
                    onSave={fetchUsers}
                />
            )}
        </div>
    );
};

export default Users;
