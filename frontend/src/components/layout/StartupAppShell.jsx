import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Target, Rocket, FileText, CheckSquare, 
  PlaySquare, BarChart, ShieldCheck, Briefcase, History,
  Settings, Bell, Search, Menu, X, User, Shield
} from 'lucide-react';
import './AppShell.css';

const navItems = [
  { path: '/startup', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/startup/challenges', label: 'Challenges', icon: Target },
  { path: '/startup/applications', label: 'My Applications', icon: FileText },
  { path: '/startup/pilots', label: 'My Pilots', icon: PlaySquare },
  { path: '/startup/passport', label: 'Innovation Passport', icon: Shield },
  { path: '/startup/notifications', label: 'Notifications', icon: Bell },
];

export const StartupAppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <div className="app-shell startup-shell">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div>
            <div className="sidebar-brand">UPSTARTY</div>
            <div className="sidebar-role">Startup Portal</div>
          </div>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              end={item.exact}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <NavLink to="/startup/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <User size={20} />
            Profile
          </NavLink>
          <NavLink to="/startup/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <Settings size={20} />
            Settings
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <form className="topbar-search" onSubmit={handleSearch}>
              <Search size={18} color="var(--color-text-muted)" />
              <input 
                type="text" 
                placeholder="Search challenges, pilots, passport documents..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          
          <div className="topbar-actions">
            <div className="dropdown-container">
              <button className="icon-btn" onClick={() => setNotificationsOpen(!notificationsOpen)}>
                <Bell size={20} />
                <span className="notification-badge"></span>
              </button>
              {notificationsOpen && (
                <div className="dropdown-menu notifications-dropdown">
                  <div className="dropdown-header">Notifications</div>
                  <div className="dropdown-body">
                    <div className="dropdown-item">No new notifications</div>
                  </div>
                  <div className="dropdown-footer" onClick={() => { setNotificationsOpen(false); navigate('/startup/notifications'); }}>
                    View all
                  </div>
                </div>
              )}
            </div>
            
            <div className="dropdown-container">
              <div className="user-profile" onClick={() => setProfileOpen(!profileOpen)}>
                <div className="user-info">
                  <span className="user-name">EcoRoute AI</span>
                  <span className="user-dept">Innovation Startup</span>
                </div>
                <div className="avatar">ER</div>
              </div>
              {profileOpen && (
                <div className="dropdown-menu profile-dropdown">
                  <div className="dropdown-item" onClick={() => { setProfileOpen(false); navigate('/startup/profile'); }}>Profile</div>
                  <div className="dropdown-item" onClick={() => { setProfileOpen(false); navigate('/startup/settings'); }}>Settings</div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item">Sign out</div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
