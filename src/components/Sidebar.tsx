import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Book, Users, ArrowRightLeft, FileText, LogOut, Library, Shield, Building2, ChevronDown, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

const OrgSwitcher = () => {
    const [orgs, setOrgs] = useState([]);
    const [activeOrgId, setActiveOrgId] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const res = await api.get('/org/my-orgs');
                setOrgs(res.data.organizations || []);
                setActiveOrgId(res.data.activeOrganizationId || '');
            } catch (err) {
                console.error("Failed to fetch orgs", err);
            }
        };
        fetchOrgs();
    }, []);

    const handleSwitch = async (targetOrgId) => {
        try {
            await api.post('/org/switch', { targetOrgId });
            window.location.href = '/'; // Reload to apply new context
        } catch (err) {
            console.error("Failed to switch org", err);
        }
    };

    const activeOrg = orgs.find(o => o.id === activeOrgId);

    return (
        <div style={{ position: 'relative' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', 
                    padding: '0.75rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', color: 'var(--text-primary)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                    <Building2 size={18} color="#4f46e5" />
                    <span style={{ fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {activeOrg ? activeOrg.name : 'Loading...'}
                    </span>
                </div>
                <ChevronDown size={16} />
            </button>

            {isOpen && (
                <div style={{ 
                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', 
                    borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10
                }}>
                    {orgs.map(org => (
                        <div 
                            key={org.id} 
                            onClick={() => { setIsOpen(false); handleSwitch(org.id); }}
                            style={{ 
                                padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', 
                                justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)',
                                background: org.id === activeOrgId ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                                color: 'var(--text-primary)'
                            }}
                        >
                            <span style={{ fontWeight: org.id === activeOrgId ? 'bold' : 'normal', color: org.id === activeOrgId ? '#4f46e5' : 'inherit' }}>
                                {org.name}
                            </span>
                            {org.role === 'owner' && <Shield size={14} color="#9333ea" />}
                        </div>
                    ))}
                    <div 
                        onClick={() => { setIsOpen(false); navigate('/signup'); }}
                        style={{ padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4f46e5', fontWeight: '500' }}
                    >
                        <Plus size={16} /> Create New Library
                    </div>
                </div>
            )}
        </div>
    );
};

const Sidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();

    const navItems = [
        { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/books', icon: <Book size={20} />, label: 'Books' },
        { path: '/users', icon: <Users size={20} />, label: 'Users' },
        { path: '/transactions', icon: <ArrowRightLeft size={20} />, label: 'Transactions' },
        { path: '/reports', icon: <FileText size={20} />, label: 'Reports' },
        { path: '/team', icon: <Shield size={20} />, label: 'Team' },
    ];

    return (
        <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
            <div className="logo-container">
                <Library size={28} className="logo-icon" />
                <span className="logo-text">LibManager</span>
            </div>

            <nav className="nav-menu">
                <div style={{ marginBottom: '1rem' }}>
                    <OrgSwitcher />
                </div>
                
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={logout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
