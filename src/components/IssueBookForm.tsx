import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { X } from 'lucide-react';
import { getTodayDateString } from '../lib/dateUtils';

const IssueBookForm = ({ onClose, onSave }) => {
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [formData, setFormData] = useState({
        userId: '',
        bookId: '',
        issueDate: getTodayDateString(),
        expectedReturnDate: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, booksRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/books') // We should probably filter for available books only on backend later
                ]);
                setUsers(usersRes.data);
                // Filter books client side for now
                setBooks(booksRes.data.filter(b => b.isAvailable));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/transactions/issue', formData);
            onSave();
            onClose();
        } catch (error) {
            console.error('Error issuing book:', error);
            alert(error.response?.data?.error || 'Failed to issue book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">Issue Book</h2>
                    <button
                        onClick={onClose}
                        className="close-btn-premium"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group-premium">
                        <label className="form-label-premium">User</label>
                        <select
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            required
                            className="form-input-premium"
                        >
                            <option value="">Select a user...</option>
                            {users.map((user: any) => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group-premium">
                        <label className="form-label-premium">Book</label>
                        <select
                            name="bookId"
                            value={formData.bookId}
                            onChange={handleChange}
                            required
                            className="form-input-premium"
                        >
                            <option value="">Select a book...</option>
                            {books.map((book: any) => (
                                <option key={book.id} value={book.id}>{book.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group-premium">
                        <label className="form-label-premium">Issue Date</label>
                        <input
                            type="date"
                            name="issueDate"
                            value={formData.issueDate}
                            onChange={handleChange}
                            required
                            className="form-input-premium"
                        />
                    </div>

                    <div className="form-group-premium">
                        <label className="form-label-premium">Return Date</label>
                        <input
                            type="date"
                            name="expectedReturnDate"
                            value={formData.expectedReturnDate}
                            onChange={handleChange}
                            required
                            className="form-input-premium"
                        />
                    </div>

                    <div className="form-actions-premium">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-premium-ghost"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-premium-primary"
                        >
                            {loading ? '...' : 'Issue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IssueBookForm;
