import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ setShowProfile }) => {
  return (
    <aside className="sidebar-premium">
      <nav className="sidebar-nav">
        <a href="#" className="sidebar-link" style={{ '--sidebar-index': 0 }} onClick={e => { e.preventDefault(); setShowProfile(false); }}>
          <span className="sidebar-icon">{/* Appointments SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="4"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M2 11h20"/></svg>
          </span>
          Today's Appointments
        </a>
        <a href="#" className="sidebar-link" style={{ '--sidebar-index': 1 }}>
          <span className="sidebar-icon">{/* Calendar SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="4"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </span>
          Calendar
        </a>
        <a href="#" className="sidebar-link" style={{ '--sidebar-index': 2 }} onClick={e => { e.preventDefault(); setShowProfile(true); }}>
          <span className="sidebar-icon">{/* Profile SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4"/></svg>
          </span>
          Profile
        </a>
        <a href="#" className="sidebar-link" style={{ '--sidebar-index': 3 }}>
          <span className="sidebar-icon">{/* Help SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12" y2="17"/></svg>
          </span>
          Help
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar; 