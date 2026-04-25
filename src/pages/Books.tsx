import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Plus, Edit, Trash2, Search, FileDown, FileText, Share2, FileSpreadsheet, Image as ImageIcon } from 'lucide-react';
import BookForm from '../components/BookForm';
import ImportModal from '../components/ImportModal';
import Loader from '../components/Loader';
import { exportToExcel, exportToPDF } from '../lib/exportUtils';
import '../styles/Pages.css';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [showExportMenu, setShowExportMenu] = useState(false);

    const fetchBooks = async () => {
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (filterCategory) params.category = filterCategory;

            const response = await api.get('/books', { params });
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [searchTerm, filterCategory]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await api.delete(`/books/${id}`);
                fetchBooks();
            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Failed to delete book');
            }
        }
    };

    const handleEdit = (book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedBook(null);
        setIsModalOpen(true);
    };

    const handleExportExcel = () => {
        const data = books.map(b => ({
            Name: b.name,
            Category: b.category,
            Language: b.language,
            Description: b.description || '',
            Status: b.isAvailable ? 'Available' : 'Issued'
        }));
        exportToExcel(data, `Books_List_${new Date().getTime()}`);
    };

    const handleExportPDF = () => {
        const headers = ['Name', 'Category', 'Language', 'Status'];
        const data = books.map(b => [
            b.name,
            b.category,
            b.language,
            b.isAvailable ? 'Available' : 'Issued'
        ]);
        exportToPDF(headers, data, 'Books', `Books_List_${new Date().getTime()}`);
    };

    return (
        <div className="page-container">
            <div className="responsive-toolbar">
                <h1 className="page-title">Books</h1>
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
                        <Plus size={20} /> <span className="hide-mobile">Add Book</span>
                    </button>
                </div>
            </div>

            <div className="responsive-filter-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                        type="text"
                        placeholder="Search books..."
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
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{
                        padding: '0.5rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)'
                    }}
                >
                    <option value="">All Categories</option>
                    <option>Fiction</option>
                    <option>Non-Fiction</option>
                    <option>Science</option>
                    <option>History</option>
                    <option>Technology</option>
                    <option>Kids</option>
                </select>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {books.map((book) => (
                        <div key={book.id} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '150px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {book.imageUrl ? (
                                    <img src={book.imageUrl} alt={book.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                                        color: 'var(--text-secondary)',
                                        opacity: 0.8
                                    }}>
                                        <div style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '16px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid var(--border-color)',
                                            marginBottom: '8px'
                                        }}>
                                            <ImageIcon size={28} strokeWidth={1.5} color="var(--text-secondary)" opacity={0.6} />
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '500', letterSpacing: '0.025em' }}>NO COVER</span>
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{book.name}</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{book.category} • {book.language}</p>
                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 8px',
                                        borderRadius: '10px',
                                        background: book.isAvailable ? '#d1fae5' : '#fee2e2',
                                        color: book.isAvailable ? '#065f46' : '#991b1b'
                                    }}>
                                        {book.isAvailable ? 'Available' : 'Issued'}
                                    </span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleEdit(book)} style={{ color: '#4f46e5', border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(book.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <BookForm
                    book={selectedBook}
                    onClose={() => setIsModalOpen(false)}
                    onSave={fetchBooks}
                />
            )}

            {isImportModalOpen && (
                <ImportModal
                    type="books"
                    onClose={() => setIsImportModalOpen(false)}
                    onSave={fetchBooks}
                />
            )}
        </div>
    );
};

export default Books;
