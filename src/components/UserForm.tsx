import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import api from '../lib/axios';
import { X, Camera } from 'lucide-react';

interface FormData {
    name: string;
    email: string;
    phone: string;
}

const UserForm = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: ''
    });
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [removeExistingImage, setRemoveExistingImage] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone
            });
            if (user.imageUrl) {
                setPreviewUrl(user.imageUrl);
            }
        }
    }, [user]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
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
        if (user && user.imageUrl) {
            setRemoveExistingImage(true);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                const value = formData[key as keyof FormData];
                data.append(key, value);
            });
            if (image) {
                data.append('image', image);
            } else if (removeExistingImage) {
                data.append('removeImage', 'true');
            }

            if (user) {
                await api.put(`/users/${user.id}`, data);
            } else {
                await api.post('/users', data);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Failed to save user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-container" style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {user ? 'Edit User' : 'Add New User'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="close-btn-premium"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div
                            onClick={() => document.getElementById('user-image-upload').click()}
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '2px solid var(--border-color)',
                                background: 'var(--bg-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                position: 'relative'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = 'var(--text-secondary)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            title="Click to change photo"
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Camera size={40} color="var(--text-secondary)" opacity={0.4} />
                            )}
                        </div>
                        {previewUrl && (
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                style={{
                                    marginTop: '0.75rem',
                                    fontSize: '0.8rem',
                                    color: '#ef4444',
                                    background: 'rgba(239, 68, 68, 0.05)',
                                    border: 'none',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                    e.currentTarget.style.color = '#dc2626';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
                                    e.currentTarget.style.color = '#ef4444';
                                }}
                            >
                                Remove Photo
                            </button>
                        )}
                        <input
                            id="user-image-upload"
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div className="form-group-premium">
                        <label className="form-label-premium">Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. John Doe"
                            className="form-input-premium"
                        />
                    </div>

                    <div className="form-group-premium">
                        <label className="form-label-premium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                            className="form-input-premium"
                        />
                    </div>

                    <div className="form-group-premium">
                        <label className="form-label-premium">Phone</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+1 (555) 000-0000"
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
                            {loading ? '...' : (user ? 'Update' : 'Save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
