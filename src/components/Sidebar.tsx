import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Book, Users, ArrowRightLeft, FileText, LogOut, Library } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();

    const navItems = [
        { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/books', icon: <Book size={20} />, label: 'Books' },
        { path: '/users', icon: <Users size={20} />, label: 'Users' },
        { path: '/transactions', icon: <ArrowRightLeft size={20} />, label: 'Transactions' },
        { path: '/reports', icon: <FileText size={20} />, label: 'Reports' },
    ];

    return (
        <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
            <div className="logo-container">
                <Library size={28} className="logo-icon" />
                <span className="logo-text">LibManager</span>
            </div>

            <nav className="nav-menu">
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
