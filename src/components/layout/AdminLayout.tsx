// src/components/layout/AdminLayout.tsx

import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const auth = useContext(AuthContext);

  const navItems = [
    { label: 'Dashboard', path: '/admin', end: true },
    { label: 'Word Manager', path: '/admin/words', end: false },
    { label: 'Categories', path: '/admin/categories', end: false },
    { label: 'Content Overrides', path: '/admin/overrides', end: false },
  ];

  if (auth?.user?.role === 'superadmin') {
    navItems.push(
      { label: 'System Overview', path: '/superadmin', end: true },
      { label: 'User Access Control', path: '/superadmin/users', end: false }
    );
  }

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <header className="md:hidden h-14 w-full bg-card border-b border-border flex items-center justify-between px-4 z-50 sticky top-0">
        <span className="font-bold text-primary">Lexicon {auth?.user?.role === 'superadmin' ? 'System' : 'Control'}</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2 text-foreground">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={closeMenu} />
      )}

      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border z-40 transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="h-14 md:h-16 flex flex-col justify-center px-6 border-b border-border shrink-0">
          <span className="font-bold text-lg text-primary tracking-tight">Lexicon Config</span>
          <span className="text-[10px] uppercase text-muted-foreground font-semibold">{auth?.user?.role}</span>
        </div>
        
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={closeMenu}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border shrink-0">
          <button 
            onClick={() => auth?.logout()}
            className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 w-full min-w-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};
