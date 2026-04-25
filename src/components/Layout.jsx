import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Layout.css';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { logout } = useAuth();

    return (
        <div className="app-container">
            {/* Backdrop for mobile */}
            <div
                className={`sidebar-backdrop ${sidebarOpen ? 'backdrop-visible' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="main-content">
                <header className="topbar">
                    <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <h2 className="page-title">Library Management</h2>
                    <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle-btn"
                            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem', display: 'flex' }}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </div>
                </header>
                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
