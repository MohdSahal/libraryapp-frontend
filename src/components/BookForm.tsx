import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { X, ImagePlus, Trash2, Pencil } from 'lucide-react';

const BookForm = ({ book, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Fiction',
        language: 'English',
        description: '',
        isAvailable: true
    });
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [removeExistingImage, setRemoveExistingImage] = useState(false);

    useEffect(() => {
        if (book) {
            setFormData({
                name: book.name,
                category: book.category,
                language: book.language,
                description: book.description,
                isAvailable: book.isAvailable
            });
            if (book.imageUrl) {
                setPreviewUrl(book.imageUrl);
            }
        }
    }, [book]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setRemoveExistingImage(false);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
        if (book && book.imageUrl) {
            setRemoveExistingImage(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (image) {
                data.append('image', image);
            } else if (removeExistingImage) {
                data.append('removeImage', 'true');
            }

            if (book) {
                await api.put(`/books/${book.id}`, data);
            } else {
                await api.post('/books', data);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving book:', error);
            alert('Failed to save book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-container" style={{ maxWidth: '650px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {book ? 'Edit Book' : 'Add New Book'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="close-btn-premium"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid-2">
                        <div className="left-column">
                            <div className="form-group-premium">
                                <label className="form-label-premium">Book Title</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. The Midnight Library"
                                    className="form-input-premium"
                                />
                            </div>

                            <div className="form-grid-2">
                                <div className="form-group-premium">
                                    <label className="form-label-premium">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="form-input-premium"
                                    >
                                        <option>Fiction</option>
                                        <option>Non-Fiction</option>
                                        <option>Science</option>
                                        <option>History</option>
                                        <option>Technology</option>
                                        <option>Kids</option>
                                    </select>
                                </div>
                                <div className="form-group-premium">
                                    <label className="form-label-premium">Language</label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        className="form-input-premium"
                                    >
                                        <option>English</option>
                                        <option>Malayalam</option>
                                        <option>Hindi</option>
                                        <option>Arabic</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group-premium">
                                <label className="form-label-premium">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Brief summary..."
                                    className="form-input-premium"
                                    style={{ minHeight: '100px', resize: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    name="isAvailable"
                                    checked={formData.isAvailable}
                                    onChange={handleChange}
                                    style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                                    Available for Issue
                                </span>
                            </div>
                        </div>

                        <div className="right-column" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group-premium" style={{ height: '100%' }}>
                                <label className="form-label-premium">Cover Image</label>
                                <div style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    background: 'var(--bg-primary)',
                                    borderRadius: '12px',
                                    border: '2px dashed var(--border-color)',
                                    overflow: 'hidden',
                                    minHeight: '260px'
                                }}>
                                    {previewUrl ? (
                                        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '12px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                display: 'flex',
                                                gap: '0.75rem',
                                                background: 'rgba(15, 23, 42, 0.8)',
                                                padding: '8px 12px',
                                                borderRadius: '14px',
                                                backdropFilter: 'blur(8px)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                            }}>
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('image-upload').click()}
                                                    title="Change Image"
                                                    style={{
                                                        padding: '6px',
                                                        color: '#fff',
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    title="Remove Image"
                                                    style={{
                                                        padding: '6px',
                                                        color: '#ff4d4d',
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => document.getElementById('image-upload').click()}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                color: 'var(--text-secondary)',
                                                gap: '0.75rem',
                                                transition: 'all 0.3s ease'
                                            }}
                                            className="image-upload-trigger"
                                        >
                                            <div style={{
                                                width: '64px',
                                                height: '64px',
                                                borderRadius: '20px',
                                                background: 'var(--bg-secondary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                border: '1px solid var(--border-color)'
                                            }}>
                                                <ImagePlus size={32} color="var(--text-secondary)" opacity={0.6} />
                                            </div>
                                            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Add Cover Image</span>
                                        </div>
                                    )}
                                    <input
                                        id="image-upload"
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
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
                            {loading ? '...' : (book ? 'Update' : 'Save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookForm;
