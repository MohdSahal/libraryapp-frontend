import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { X, Upload, Download, AlertCircle } from 'lucide-react';
import api from '../lib/axios';

interface ImportModalProps {
    type: 'books' | 'users';
    onClose: () => void;
    onSave: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ type, onClose, onSave }) => {
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [fileName, setFileName] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const templates: { [key: string]: string[][] } = {
        books: [
            ['name', 'category', 'language', 'description', 'isAvailable'],
            ['The Great Gatsby', 'Fiction', 'English', 'A classic novel', 'TRUE'],
            ['A Brief History of Time', 'Science', 'English', 'Cosmology book', 'TRUE']
        ],
        users: [
            ['name', 'email', 'phone'],
            ['John Doe', 'john@example.com', '+1234567890'],
            ['Jane Smith', 'jane.s@example.com', '+0987654321']
        ]
    };

    const handleDownloadTemplate = () => {
        const ws = XLSX.utils.aoa_to_sheet(templates[type]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, `${type}_template.xlsx`);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setError(null);

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                setPreviewData(data);
            } catch (err) {
                setError('Failed to parse file. Please use the template.');
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleImport = async () => {
        if (previewData.length === 0) return;
        setLoading(true);
        setError(null);

        try {
            const endpoint = type === 'books' ? '/books/bulk' : '/users/bulk';
            const payload = type === 'books' ? { books: previewData } : { users: previewData };

            await api.post(endpoint, payload);
            onSave();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Import failed. Check your data format.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-container" style={{ maxWidth: '800px', width: '90%' }}>
                <div className="modal-header">
                    <h2 className="modal-title">Import {type === 'books' ? 'Books' : 'Users'}</h2>
                    <button onClick={onClose} className="close-btn-premium"><X size={20} /></button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={handleDownloadTemplate} className="btn-premium-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                <Download size={16} /> Download Template
                            </button>
                            <label className="btn-premium-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                                <Upload size={16} /> {fileName ? 'Change File' : 'Upload File'}
                                <input type="file" hidden onChange={handleFileUpload} accept=".xlsx, .xls, .csv" />
                            </label>
                        </div>
                        {fileName && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Selected: {fileName}</span>}
                    </div>

                    {error && (
                        <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {previewData.length > 0 ? (
                        <>
                            <div style={{ overflowX: 'auto', maxHeight: '300px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                    <thead style={{ background: 'var(--bg-primary)', position: 'sticky', top: 0 }}>
                                        <tr>
                                            {Object.keys(previewData[0]).map(key => (
                                                <th key={key} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.map((row: any, idx: number) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                {Object.values(row).map((val: any, i: number) => (
                                                    <td key={i} style={{ padding: '0.75rem', color: 'var(--text-primary)' }}>{String(val)}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <span style={{ alignSelf: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{previewData.length} records ready to import</span>
                                <button onClick={handleImport} disabled={loading} className="btn-premium-primary">
                                    {loading ? 'Importing...' : 'Confirm Import'}
                                </button>
                            </div>
                        </>
                    ) : !error && (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-primary)', borderRadius: '12px', border: '2px dashed var(--border-color)' }}>
                            <Upload size={48} style={{ margin: '0 auto', marginBottom: '1rem', opacity: 0.3 }} />
                            <p>Upload an Excel or CSV file to see a preview</p>
                            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Supported formats: .xlsx, .xls, .csv</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImportModal;
